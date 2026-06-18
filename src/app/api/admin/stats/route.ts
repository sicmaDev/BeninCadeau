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

    // 7. Low Stock Products (5 produits avec le stock le plus bas)
    const lowStockProducts = await prisma.product.findMany({
      orderBy: { stock: 'asc' },
      take: 5,
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        images: true,
      },
    });

    // 8. Répartition des commandes par statut pour le graphique
    const statusBreakdown = await prisma.order.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
      _sum: {
        totalAmount: true,
      },
    });

    // 9. Chiffre d'affaires mensuel (Année en cours vs Année précédente)
    const currentYear = new Date().getFullYear();
    const ordersHistorical = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(`${currentYear - 1}-01-01T00:00:00.000Z`),
        },
        status: { not: 'ANNULEE' },
      },
      select: {
        totalAmount: true,
        createdAt: true,
      },
    });

    const monthlyRevenueThisYear = Array(12).fill(0);
    const monthlyRevenueLastYear = Array(12).fill(0);

    ordersHistorical.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const year = orderDate.getFullYear();
      const month = orderDate.getMonth(); // 0-11
      if (year === currentYear) {
        monthlyRevenueThisYear[month] += order.totalAmount;
      } else if (year === currentYear - 1) {
        monthlyRevenueLastYear[month] += order.totalAmount;
      }
    });

    // 10. Trois indicateurs détaillés (Profit, Livraison, Code Promos) pour le mois en cours
    const startOfCurrentMonth = new Date();
    startOfCurrentMonth.setDate(1);
    startOfCurrentMonth.setHours(0, 0, 0, 0);

    const currentMonthOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startOfCurrentMonth },
        status: { not: 'ANNULEE' },
      },
      include: {
        promoCode: true,
      },
    });

    let profitThisMonth = 0;
    let shippingFeesThisMonth = 0;
    let discountsThisMonth = 0;

    currentMonthOrders.forEach((order) => {
      profitThisMonth += order.totalAmount;
      shippingFeesThisMonth += order.shippingFee;
      if (order.promoCode) {
        if (order.promoCode.discountType === 'FIXED') {
          discountsThisMonth += order.promoCode.discountValue;
        } else if (order.promoCode.discountType === 'PERCENTAGE') {
          const val = order.promoCode.discountValue;
          if (val < 100) {
            discountsThisMonth += Math.round((order.totalAmount / (100 - val)) * val);
          }
        }
      }
    });

    // 11. Customer Overview Segment (First-time vs Returning customers)
    const orderGroupedByClient = await prisma.order.groupBy({
      by: ['clientEmail'],
      _count: {
        id: true,
      },
    });

    let firstTimeCount = 0;
    let returningCount = 0;

    orderGroupedByClient.forEach((group) => {
      if (group._count.id === 1) {
        firstTimeCount++;
      } else if (group._count.id > 1) {
        returningCount++;
      }
    });

    const suppliersCount = await prisma.product.count(); // total products

    return NextResponse.json({
      stats: {
        ordersCount,
        customersCount,
        totalRevenue,
        pendingOrdersCount,
      },
      recentOrders,
      popularProducts,
      lowStockProducts,
      statusBreakdown: statusBreakdown.map((item) => ({
        status: item.status,
        count: item._count.id,
        revenue: item._sum.totalAmount || 0,
      })),
      monthlyRevenue: {
        thisYear: monthlyRevenueThisYear,
        lastYear: monthlyRevenueLastYear,
      },
      threeColumnDetails: {
        profitThisMonth,
        shippingFeesThisMonth,
        discountsThisMonth,
      },
      customerOverview: {
        firstTimeCount,
        returningCount,
        suppliersCount,
      },
    });
  } catch (error) {
    console.error('Fetch admin stats error:', error);
    return NextResponse.json(
      { error: 'Une erreur interne est survenue lors de la récupération des données.' },
      { status: 500 }
    );
  }
}
