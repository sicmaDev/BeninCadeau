import { NextResponse } from 'next/server';
import { prisma } from '../../../utils/db';
import { getCurrentUser } from '../../../utils/auth';
import { OrderStatus } from '@prisma/client';
import { sendOrderConfirmationEmail } from '../../../utils/emails';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                slug: true,
                images: true,
              },
            },
          },
        },
        shippingZone: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Fetch user orders error:', error);
    return NextResponse.json(
      { error: 'Une erreur interne est survenue' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      clientName,
      clientEmail,
      clientPhone,
      shippingAddress,
      shippingZoneId,
      promoCode,
      items,
    } = body;

    // Validation de base
    if (!clientName || !clientEmail || !clientPhone || !shippingAddress || !shippingZoneId || !items || !items.length) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être renseignés.' },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur éventuellement connecté
    const user = await getCurrentUser();

    // Récupérer la zone de livraison et ses frais
    const zone = await prisma.shippingZone.findUnique({
      where: { id: parseInt(shippingZoneId, 10) },
    });
    if (!zone) {
      return NextResponse.json(
        { error: 'La zone de livraison sélectionnée est invalide.' },
        { status: 400 }
      );
    }

    // Récupérer et vérifier les produits en DB pour éviter les falsifications de prix côté client
    const productIds = items.map((item: { productId: number }) => item.productId);
    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        active: true,
      },
    });

    if (dbProducts.length !== productIds.length) {
      return NextResponse.json(
        { error: 'Certains produits de votre panier ne sont plus disponibles.' },
        { status: 400 }
      );
    }

    // Calculer le sous-total avec les prix réels de la DB
    let subtotal = 0;
    const validatedItems = items.map((item: { productId: number; quantity: number; customizationMessage: string | null }) => {
      const product = dbProducts.find((p) => p.id === item.productId)!;
      
      // Vérification du stock disponible
      if (product.stock < item.quantity) {
        throw new Error(`Stock insuffisant pour le produit : ${product.name} (${product.stock} restants).`);
      }

      subtotal += product.price * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price, // Prix fixe au moment de la commande
        customizationMessage: item.customizationMessage || null,
      };
    });

    // Appliquer le code promo s'il est présent
    let discountAmount = 0;
    let appliedPromoId = null;

    if (promoCode) {
      const dbPromo = await prisma.promoCode.findUnique({
        where: { code: promoCode.toUpperCase() },
      });

      if (dbPromo && dbPromo.active && new Date(dbPromo.expiresAt) > new Date()) {
        appliedPromoId = dbPromo.id;
        if (dbPromo.discountType === 'PERCENTAGE') {
          discountAmount = Math.round((subtotal * dbPromo.discountValue) / 100);
        } else {
          discountAmount = dbPromo.discountValue;
        }
      }
    }

    const totalAmount = Math.max(0, subtotal + zone.deliveryFee - discountAmount);

    // Transaction Prisma : Créer la commande, ses lignes et décrémenter les stocks
    const createdOrder = await prisma.$transaction(async (tx) => {
      // Générer un numéro de commande séquentiel unique (ex: BC-OR37)
      const lastOrder = await tx.order.findFirst({
        orderBy: { id: 'desc' },
        select: { id: true }
      });
      const nextId = (lastOrder?.id || 0) + 1;
      const orderNumber = `BC-OR${nextId}`;

      // 1. Créer la commande
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: user?.id || null,
          status: OrderStatus.EN_ATTENTE,
          totalAmount,
          shippingFee: zone.deliveryFee,
          shippingZoneId: zone.id,
          clientName,
          clientEmail,
          clientPhone,
          shippingAddress,
          promoCodeId: appliedPromoId,
          orderItems: {
            create: validatedItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              customizationMessage: item.customizationMessage,
            })),
          },
        },
      });

      // 2. Mettre à jour les stocks
      for (const item of validatedItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return order;
    });

    // Envoyer l'email de confirmation de commande en tâche de fond (sans bloquer la réponse)
    const emailItems = validatedItems.map(item => {
      const p = dbProducts.find(prod => prod.id === item.productId)!;
      return {
        name: p.name,
        quantity: item.quantity,
        price: item.price,
        customizationMessage: item.customizationMessage
      };
    });

    sendOrderConfirmationEmail({
      clientName,
      clientEmail,
      clientPhone,
      shippingAddress,
      orderNumber: createdOrder.orderNumber,
      shippingFee: zone.deliveryFee,
      totalAmount: createdOrder.totalAmount
    }, emailItems).catch(err => console.error('Failed to send confirmation email:', err));

    // Intégration FedaPay
    let checkoutUrl = `/confirmation/${createdOrder.orderNumber}`;
    let transactionId = null;

    const fedapaySecret = process.env.FEDAPAY_SECRET_KEY;
    const hasFedaPay = fedapaySecret && !fedapaySecret.includes('remplacez_par') && fedapaySecret.trim() !== '';

    if (hasFedaPay) {
      try {
        const isSandbox = fedapaySecret.includes('sandbox') || fedapaySecret.startsWith('sk_sandbox_');
        const FEDAPAY_API_URL = isSandbox 
          ? 'https://sandbox-api.fedapay.com/v1' 
          : 'https://api.fedapay.com/v1';

        const nameParts = clientName.trim().split(/\s+/);
        const firstname = nameParts[0] || 'Client';
        const lastname = nameParts.slice(1).join(' ') || 'Bénin Cadeau';
        const cleanPhone = clientPhone.replace(/\D/g, '');

        // 1. Créer la transaction FedaPay
        const createTxRes = await fetch(`${FEDAPAY_API_URL}/transactions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${fedapaySecret}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            description: `Commande Bénin Cadeau ${createdOrder.orderNumber}`,
            amount: createdOrder.totalAmount,
            currency: {
              iso: 'XOF',
            },
            callback_url: `${req.headers.get('origin') || 'http://localhost:3000'}/confirmation/${createdOrder.orderNumber}`,
            customer: {
              firstname,
              lastname,
              email: clientEmail,
              phone_number: {
                number: cleanPhone,
                country: 'BJ',
              },
            },
          }),
        });

        if (createTxRes.ok) {
          const txData = await createTxRes.json();
          const transactionObj = txData['v1/transaction'] || txData.transaction;
          const fedaTxId = transactionObj?.id;

          if (fedaTxId) {
            transactionId = fedaTxId.toString();

            // 2. Générer le token de paiement FedaPay
            const tokenRes = await fetch(`${FEDAPAY_API_URL}/transactions/${fedaTxId}/token`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${fedapaySecret}`,
                'Content-Type': 'application/json',
              },
            });

            if (tokenRes.ok) {
              const tokenData = await tokenRes.json();
              checkoutUrl = tokenData.url;

              // 3. Enregistrer l'ID de transaction FedaPay dans la commande
              await prisma.order.update({
                where: { id: createdOrder.id },
                data: { transactionId },
              });
            }
          }
        }
      } catch (err) {
        console.error('FedaPay integration error:', err);
      }
    }

    return NextResponse.json({
      success: true,
      orderNumber: createdOrder.orderNumber,
      totalAmount: createdOrder.totalAmount,
      checkoutUrl,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    const message = error instanceof Error ? error.message : 'Une erreur interne est survenue lors de la création de la commande.';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
