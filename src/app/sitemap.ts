import type { MetadataRoute } from 'next';
import { prisma } from '../utils/db';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://benincadeau.com';

  const staticPages: MetadataRoute.Sitemap = [
    '',
    '/catalogue',
    '/a-propos',
    '/contact',
    '/panier',
    '/compte',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { active: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.category.findMany({
        where: { active: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${baseUrl}/produit/${product.slug}`,
      lastModified: product.updatedAt,
    }));

    const categoryUrls: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${baseUrl}/catalogue?category=${category.slug}`,
      lastModified: category.updatedAt,
    }));

    return [...staticPages, ...categoryUrls, ...productUrls];
  } catch (error) {
    console.error('Impossible de charger les URLs dynamiques du sitemap:', error);
    return staticPages;
  }
}
