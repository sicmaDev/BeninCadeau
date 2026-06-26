import { MetadataRoute } from 'next';
import { prisma } from '../utils/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://benincadeau.com';

  // Récupérer les slugs de tous les produits actifs
  const products = await prisma.product.findMany({
    where: { active: true },
    select: { slug: true, updatedAt: true },
  });

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/produit/${product.slug}`,
    lastModified: product.updatedAt,
  }));

  // Catégories actives
  const categories = await prisma.category.findMany({
    where: { active: true },
    select: { slug: true, updatedAt: true },
  });

  const categoryUrls = categories.map((cat) => ({
    url: `${baseUrl}/catalogue?category=${cat.slug}`,
    lastModified: cat.updatedAt,
  }));

  // Pages statiques
  const staticPages = [
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

  return [...staticPages, ...categoryUrls, ...productUrls];
}
