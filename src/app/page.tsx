import { prisma } from '@/utils/db';
import { HomeClient } from '@/components/HomeClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Récupérer toutes les catégories actives ordonnées par displayOrder
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { displayOrder: 'asc' },
  });

  // Récupérer les 8 derniers produits actifs pour la section "Packs Vedettes"
  const products = await prisma.product.findMany({
    where: { active: true },
    take: 8,
    orderBy: { createdAt: 'desc' },
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  return <HomeClient categories={categories} products={products} />;
}
