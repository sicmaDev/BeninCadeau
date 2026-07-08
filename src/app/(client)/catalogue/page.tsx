import { prisma } from "@/utils/db";
import { mapDbProductToClientProduct } from "@/utils/mapping";
import CataloguePageClient from "@/components/CataloguePageClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  const dbCategories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { displayOrder: "asc" },
  });

  const dbProducts = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    include: {
      category: {
        select: {
          slug: true,
          name: true,
        },
      },
    },
  });

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

  const products = dbProducts.map((p) => mapDbProductToClientProduct(p));

  return <CataloguePageClient categories={categories} products={products} />;
}
