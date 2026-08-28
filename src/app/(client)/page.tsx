import { prisma } from "@/utils/db";
import { mapDbProductToClientProduct } from "@/utils/mapping";
import HomePageClient from "@/components/HomePageClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  // Récupérer les catégories actives ordonnées
  const dbCategories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { displayOrder: "asc" },
  });

  // Récupérer les 8 produits les plus vendus / actifs pour la page d'accueil
  const dbProducts = await prisma.product.findMany({
    where: { active: true },
    take: 8,
    orderBy: [
      { orderItems: { _count: "desc" } },
      { createdAt: "desc" },
    ],
    include: {
      category: {
        select: {
          slug: true,
          name: true,
        },
      },
    },
  });

  // Mapper les catégories
  const emojis: Record<string, string> = {
    anniversaire: "🎂",
    mariage: "💍",
    naissance: "👶",
    entreprise: "🏢",
    "saint-valentin": "❤️",
    fete: "🎉",
  };
  const categories = dbCategories.map((cat) => ({
    id: cat.id.toString(),
    name: cat.name,
    emoji: emojis[cat.slug.toLowerCase()] || "🎁",
    slug: cat.slug,
    description: "",
  }));

  // Mapper les produits
  const products = dbProducts.map((p) => mapDbProductToClientProduct(p));

  return <HomePageClient categories={categories} products={products} />;
}
