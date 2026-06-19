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

    // 9. Chiffre d'affaires historique pour comparaisons (Annuelle, Mensuelle, Hebdomadaire)
    const currentYear = new Date().getFullYear();
    const now = new Date();

    // 9.1 Comparaison Annuelle (Ventes mensuelles de l'année en cours vs année précédente)
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

    // 9.2 Comparaison Mensuelle (Ventes quotidiennes du mois en cours vs mois précédent)
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const daysInThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysInLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();

    const ordersMonthlyComparison = await prisma.order.findMany({
      where: {
        createdAt: { gte: startOfLastMonth },
        status: { not: 'ANNULEE' }
      },
      select: {
        totalAmount: true,
        createdAt: true
      }
    });

    const dailyRevenueThisMonth = Array(daysInThisMonth).fill(0);
    const dailyRevenueLastMonth = Array(daysInLastMonth).fill(0);
    const thisMonthVal = now.getMonth();
    const lastMonthVal = startOfLastMonth.getMonth();
    const thisYearVal = now.getFullYear();
    const lastMonthYearVal = startOfLastMonth.getFullYear();

    ordersMonthlyComparison.forEach((order) => {
      const d = new Date(order.createdAt);
      const m = d.getMonth();
      const y = d.getFullYear();
      const day = d.getDate(); // 1-31
      if (y === thisYearVal && m === thisMonthVal) {
        dailyRevenueThisMonth[day - 1] += order.totalAmount;
      } else if (y === lastMonthYearVal && m === lastMonthVal) {
        dailyRevenueLastMonth[day - 1] += order.totalAmount;
      }
    });

    // 9.3 Comparaison Hebdomadaire (Ventes par jour de la semaine pour la semaine en cours vs semaine précédente)
    const currentDay = now.getDay(); // 0 is Sunday, 1-6 is Mon-Sat
    const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const startOfThisWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday);
    startOfThisWeek.setHours(0, 0, 0, 0);

    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

    const ordersWeeklyComparison = await prisma.order.findMany({
      where: {
        createdAt: { gte: startOfLastWeek },
        status: { not: 'ANNULEE' }
      },
      select: {
        totalAmount: true,
        createdAt: true
      }
    });

    const weeklyRevenueThisWeek = Array(7).fill(0);
    const weeklyRevenueLastWeek = Array(7).fill(0);

    ordersWeeklyComparison.forEach((order) => {
      const d = new Date(order.createdAt);
      const time = d.getTime();
      const dayOfWeek = d.getDay(); // 0 (Sun) to 6 (Sat)
      const index = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 0 (Mon) to 6 (Sun)
      if (time >= startOfThisWeek.getTime()) {
        weeklyRevenueThisWeek[index] += order.totalAmount;
      } else if (time >= startOfLastWeek.getTime() && time < startOfThisWeek.getTime()) {
        weeklyRevenueLastWeek[index] += order.totalAmount;
      }
    });

    // 10. Trois indicateurs détaillés (Profit, Livraison, Code Promos) pour le mois en cours
    const currentMonthOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startOfThisMonth },
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
    // Helper function to segment customer loyalty
    const getCustomerSegment = (ordersList: { clientEmail: string }[]) => {
      const counts: Record<string, number> = {};
      ordersList.forEach((o) => {
        counts[o.clientEmail] = (counts[o.clientEmail] || 0) + 1;
      });
      let firstTimeCount = 0;
      let returningCount = 0;
      Object.values(counts).forEach((c) => {
        if (c === 1) firstTimeCount++;
        else returningCount++;
      });
      return { firstTimeCount, returningCount };
    };

    // 11.1 Global
    const allOrders = await prisma.order.findMany({
      where: { status: { not: 'ANNULEE' } },
      select: { clientEmail: true },
    });
    const segmentGlobal = getCustomerSegment(allOrders);

    // 11.2 Cette année
    const ordersThisYear = await prisma.order.findMany({
      where: {
        createdAt: { gte: new Date(`${currentYear}-01-01T00:00:00.000Z`) },
        status: { not: 'ANNULEE' }
      },
      select: { clientEmail: true }
    });
    const segmentThisYear = getCustomerSegment(ordersThisYear);

    // 11.3 Ce mois
    const segmentThisMonth = getCustomerSegment(currentMonthOrders);

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
        thisMonth: dailyRevenueThisMonth,
        lastMonth: dailyRevenueLastMonth,
        thisWeek: weeklyRevenueThisWeek,
        lastWeek: weeklyRevenueLastWeek,
      },
      threeColumnDetails: {
        profitThisMonth,
        shippingFeesThisMonth,
        discountsThisMonth,
      },
      customerOverview: {
        global: segmentGlobal,
        thisYear: segmentThisYear,
        thisMonth: segmentThisMonth,
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
