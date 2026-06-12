import { NextResponse } from 'next/server';
import { prisma } from '../../../../utils/db';
import { getCurrentUser } from '../../../../utils/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Vérification de sécurité Admin
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès interdit.' }, { status: 403 });
    }

    // 1. Total commandes
    const ordersCount = await prisma.order.count();

    // 2. Total clients (exclure les admins)
    const customersCount = await prisma.user.count({
      where: { role: 'CUSTOMER' },
    });

    // 3. Chiffre d'affaires (somme des commandes sauf ANNULEE)
    const revenueAggregate = await prisma.order.aggregate({
      where: {
        status: { not: 'ANNULEE' },
      },
      _sum: {
        totalAmount: true,
      },
    });
    const totalRevenue = revenueAggregate._sum.totalAmount || 0;

    // 4. Commandes en attente de paiement ou traitement
    const pendingOrdersCount = await prisma.order.count({
      where: {
        status: { in: ['EN_ATTENTE', 'PAYEE', 'EN_PREPARATION'] },
      },
    });

    // 5. 5 dernières commandes
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        shippingZone: {
          select: { name: true },
        },
      },
    });

    // 6. Produits populaires (classement basé sur les quantités vendues)
    const orderItemsGrouped = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });

    // Récupérer les détails des produits populaires
    const popularProducts = [];
    for (const item of orderItemsGrouped) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { id: true, name: true, price: true, images: true },
      });
      if (product) {
        popularProducts.push({
          ...product,
          totalQty: item._sum.quantity,
        });
      }
    }

    return NextResponse.json({
      stats: {
        ordersCount,
        customersCount,
        totalRevenue,
        pendingOrdersCount,
      },
      recentOrders,
      popularProducts,
    });
  } catch (error) {
    console.error('Fetch admin stats error:', error);
    return NextResponse.json(
      { error: 'Une erreur interne est survenue lors de la récupération des données.' },
      { status: 500 }
    );
  }
}
