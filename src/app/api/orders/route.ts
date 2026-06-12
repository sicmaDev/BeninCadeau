import { NextResponse } from 'next/server';
import { prisma } from '../../../utils/db';
import { getCurrentUser } from '../../../utils/auth';
import { OrderStatus } from '@prisma/client';

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

    // Générer un numéro de commande unique (ex: BC-20260612-4829)
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `BC-${dateStr}-${randomSuffix}`;

    // Transaction Prisma : Créer la commande, ses lignes et décrémenter les stocks
    const createdOrder = await prisma.$transaction(async (tx) => {
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

    return NextResponse.json({
      success: true,
      orderNumber: createdOrder.orderNumber,
      totalAmount: createdOrder.totalAmount,
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
