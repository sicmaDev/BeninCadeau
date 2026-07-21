import { NextResponse } from 'next/server';
import { prisma } from '../../../../utils/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderNumber } = body;

    if (!orderNumber) {
      return NextResponse.json(
        { error: 'Numéro de commande manquant.' },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Commande introuvable.' },
        { status: 404 }
      );
    }

    if (order.status === 'PAYEE') {
      return NextResponse.json(
        { error: 'Cette commande a déjà été payée avec succès.' },
        { status: 400 }
      );
    }

    const fedapaySecret = process.env.FEDAPAY_SECRET_KEY;
    if (!fedapaySecret || fedapaySecret.includes('remplacez_par') || fedapaySecret.trim() === '') {
      return NextResponse.json(
        { error: 'La passerelle de paiement FedaPay n\'est pas configurée.' },
        { status: 500 }
      );
    }

    const isSandbox = fedapaySecret.includes('sandbox') || fedapaySecret.startsWith('sk_sandbox_');
    const FEDAPAY_API_URL = isSandbox 
      ? 'https://sandbox-api.fedapay.com/v1' 
      : 'https://api.fedapay.com/v1';

    const nameParts = order.clientName.trim().split(/\s+/);
    const firstname = nameParts[0] || 'Client';
    const lastname = nameParts.slice(1).join(' ') || 'Bénin Cadeau';
    const cleanPhone = order.clientPhone.replace(/\D/g, '');

    const origin = req.headers.get('origin') || 'http://localhost:3000';

    // 1. Créer une nouvelle transaction FedaPay
    const createTxRes = await fetch(`${FEDAPAY_API_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${fedapaySecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: `Commande Bénin Cadeau ${order.orderNumber}`,
        amount: order.totalAmount,
        currency: {
          iso: 'XOF',
        },
        callback_url: `${origin}/confirmation/${order.orderNumber}`,
        customer: {
          firstname,
          lastname,
          email: order.clientEmail,
          phone_number: {
            number: cleanPhone,
            country: 'BJ',
          },
        },
      }),
    });

    if (!createTxRes.ok) {
      const errData = await createTxRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: errData.message || 'Échec de la création de la transaction FedaPay.' },
        { status: 400 }
      );
    }

    const txData = await createTxRes.json();
    const transactionObj = txData['v1/transaction'] || txData.transaction;
    const fedaTxId = transactionObj?.id;

    if (!fedaTxId) {
      return NextResponse.json(
        { error: 'ID de transaction introuvable dans la réponse FedaPay.' },
        { status: 500 }
      );
    }

    // 2. Générer le token de paiement
    const tokenRes = await fetch(`${FEDAPAY_API_URL}/transactions/${fedaTxId}/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${fedapaySecret}`,
        'Content-Type': 'application/json',
      },
    });

    if (!tokenRes.ok) {
      return NextResponse.json(
        { error: 'Impossible de générer le lien de paiement FedaPay.' },
        { status: 400 }
      );
    }

    const tokenData = await tokenRes.json();
    const checkoutUrl = tokenData.url;

    // 3. Mettre à jour l'ID de transaction dans la commande Prisma
    await prisma.order.update({
      where: { id: order.id },
      data: {
        transactionId: fedaTxId.toString(),
      },
    });

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error('Repay API error:', error);
    return NextResponse.json(
      { error: 'Une erreur interne est survenue lors de l\'initialisation du paiement.' },
      { status: 500 }
    );
  }
}
