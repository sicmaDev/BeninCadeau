import { NextResponse } from 'next/server';
import { prisma } from '../../../../utils/db';
import { getCurrentUser } from '../../../../utils/auth';
import { sendOrderStatusUpdateEmail } from '../../../../utils/emails';
import { Prisma, OrderStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

async function checkAdminAuth() {
  const user = await getCurrentUser();
  return user && user.role === 'ADMIN';
}

export async function GET(req: Request) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: 'Accès interdit.' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const whereClause: Prisma.OrderWhereInput = {};
    if (status) {
      whereClause.status = status as OrderStatus;
    }

    const userId = searchParams.get('userId');
    if (userId) {
      whereClause.userId = parseInt(userId, 10);
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        shippingZone: true,
        promoCode: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Fetch orders admin error:', error);
    return NextResponse.json({ error: 'Erreur interne lors de la récupération des commandes.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: 'Accès interdit.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID de la commande et statut requis.' }, { status: 400 });
    }

    const oldOrder = await prisma.order.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!oldOrder) {
      return NextResponse.json({ error: 'Commande non trouvée.' }, { status: 404 });
    }

    const order = await prisma.order.update({
      where: { id: parseInt(id, 10) },
      data: {
        status: status as OrderStatus,
      },
    });

    // Envoyer l'e-mail de mise à jour du statut
    sendOrderStatusUpdateEmail(order, oldOrder.status, status).catch(err => 
      console.error('Failed to send status update email:', err)
    );

    // Créer une notification dynamique pour l'admin
    await prisma.notification.create({
      data: {
        title: "Statut modifié",
        message: `La commande ${order.orderNumber} est passée du statut "${oldOrder.status}" à "${status}".`
      }
    }).catch(err => console.error('Failed to create admin notification:', err));

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Update order status admin error:', error);
    return NextResponse.json({ error: 'Erreur lors de la modification du statut de la commande.' }, { status: 500 });
  }
}
