import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/utils/db";
import { mapDbProductToClientProduct } from "@/utils/mapping";
import ProductPageClient from "@/components/ProductPageClient";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!product || !product.active) {
    return {
      title: "Produit non trouvé | Bénin Cadeau",
    };
  }

  return {
    title: `${product.name} | Bénin Cadeau`,
    description: product.description.substring(0, 160),
  };
}

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const dbProduct = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: {
        select: {
          slug: true,
          name: true,
        },
      },
    },
  });

  if (!dbProduct || !dbProduct.active) {
    notFound();
  }

  const product = mapDbProductToClientProduct(dbProduct);

  // Récupérer les produits similaires (même catégorie, sauf lui-même)
  const dbRelated = await prisma.product.findMany({
    where: {
      categoryId: dbProduct.categoryId,
      id: { not: dbProduct.id },
      active: true,
    },
    take: 4,
    include: {
      category: {
        select: {
          slug: true,
          name: true,
        },
      },
    },
  });

  const relatedProducts = dbRelated.map((p) => mapDbProductToClientProduct(p));

  return <ProductPageClient product={product} relatedProducts={relatedProducts} />;
}
