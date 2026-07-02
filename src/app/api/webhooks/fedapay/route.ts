import { NextResponse } from 'next/server';
import { prisma } from '../../../../utils/db';
import { sendPaymentConfirmationEmail } from '../../../../utils/emails';
import { OrderStatus } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log('FedaPay webhook received:', payload);

    // Extraction de l'ID de transaction
    const transactionId = payload.data?.id?.toString() || payload.entity_id?.toString();

    if (!transactionId) {
      return NextResponse.json({ error: 'ID de transaction manquant' }, { status: 400 });
    }

    const fedapaySecret = process.env.FEDAPAY_SECRET_KEY;
    if (!fedapaySecret || fedapaySecret.includes('remplacez_par')) {
      console.error('FEDAPAY_SECRET_KEY not configured in webhook.');
      return NextResponse.json({ error: 'FedaPay non configuré sur le serveur' }, { status: 500 });
    }

    // 1. Interroger le serveur officiel FedaPay pour vérifier le statut réel (Protection anti-fraude)
    const isSandbox = fedapaySecret.includes('sandbox') || fedapaySecret.startsWith('sk_sandbox_');
    const FEDAPAY_API_URL = isSandbox 
      ? 'https://sandbox-api.fedapay.com/v1' 
      : 'https://api.fedapay.com/v1';

    const verifyRes = await fetch(`${FEDAPAY_API_URL}/transactions/${transactionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${fedapaySecret}`,
        'Content-Type': 'application/json',
      },
    });

    if (!verifyRes.ok) {
      console.error(`Failed to verify transaction ${transactionId} with FedaPay`);
      return NextResponse.json({ error: 'Verification de transaction échouée' }, { status: 400 });
    }

    const verifyData = await verifyRes.json();
    const transactionObj = verifyData['v1/transaction'] || verifyData.transaction;
    const status = transactionObj?.status;

    // 2. Si le statut de FedaPay est validé comme "approved" (ou "payé")
    if (status === 'approved') {
      // Rechercher la commande associée en base de données
      const order = await prisma.order.findUnique({
        where: { transactionId: transactionId },
      });

      if (!order) {
        console.warn(`Order with transaction ID ${transactionId} not found in DB`);
        return NextResponse.json({ message: 'Commande non trouvée' }, { status: 200 }); // On renvoie 200 pour acquitter auprès de FedaPay
      }

      // Si la commande est en attente, on la marque comme PAYEE
      if (order.status === OrderStatus.EN_ATTENTE) {
        const updatedOrder = await prisma.order.update({
          where: { id: order.id },
          data: { status: OrderStatus.PAYEE },
        });

        console.log(`Order ${order.orderNumber} successfully marked as PAID`);

        // Envoi de l'e-mail de confirmation de paiement
        await sendPaymentConfirmationEmail(updatedOrder);
      }
    } else {
      console.log(`Transaction ${transactionId} status is "${status}". No actions taken.`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('FedaPay Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
