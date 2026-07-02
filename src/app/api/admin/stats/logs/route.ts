import { NextResponse } from 'next/server';
import { prisma } from '../../../../../utils/db';
import { getCurrentUser } from '../../../../../utils/auth';

export const dynamic = 'force-dynamic';

async function checkAdminAuth() {
  const user = await getCurrentUser();
  return user && user.role === 'ADMIN';
}

export async function GET() {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: 'Accès interdit.' }, { status: 403 });
  }

  try {
    // 1. Récupérer les 15 derniers utilisateurs
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 15,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // 2. Récupérer les 15 dernières commandes
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 15,
      select: {
        id: true,
        orderNumber: true,
        clientName: true,
        totalAmount: true,
        status: true,
        createdAt: true,
      },
    });

    // 3. Récupérer les 15 derniers produits
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: 15,
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
      },
    });

    // Formatage unifié
    const logs: any[] = [];

    users.forEach((u) => {
      logs.push({
        id: `user-${u.id}-${u.createdAt.getTime()}`,
        timestamp: u.createdAt.toISOString(),
        type: 'USER',
        description: `Inscription de l'utilisateur ${u.name} (${u.email}) en tant que ${u.role}.`,
        icon: 'user-plus',
        color: 'text-primary bg-primary-light',
      });
    });

    orders.forEach((o) => {
      let statusLabel = 'en attente';
      if (o.status === 'PAYEE') statusLabel = 'payée';
      if (o.status === 'LIVREE') statusLabel = 'livrée';
      if (o.status === 'ANNULEE') statusLabel = 'annulée';

      logs.push({
        id: `order-${o.id}-${o.createdAt.getTime()}`,
        timestamp: o.createdAt.toISOString(),
        type: 'ORDER',
        description: `Nouvelle commande ${o.orderNumber} enregistrée pour ${o.clientName} d'un montant de ${o.totalAmount.toLocaleString('fr-FR')} FCFA (Statut: ${statusLabel}).`,
        icon: 'shopping-cart',
        color: 'text-success bg-success-light',
      });
    });

    products.forEach((p) => {
      logs.push({
        id: `product-${p.id}-${p.createdAt.getTime()}`,
        timestamp: p.createdAt.toISOString(),
        type: 'PRODUCT',
        description: `Nouveau produit "${p.name}" ajouté au catalogue au prix de ${p.price.toLocaleString('fr-FR')} FCFA.`,
        icon: 'package',
        color: 'text-warning bg-warning-light',
      });
    });

    // Trier par ordre chronologique décroissant
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Prendre les 30 derniers événements
    const slicedLogs = logs.slice(0, 30);

    return NextResponse.json({ logs: slicedLogs });
  } catch (error) {
    console.error('Fetch logs error:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des journaux d\'activités.' }, { status: 500 });
  }
}
