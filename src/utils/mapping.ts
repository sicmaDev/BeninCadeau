import type { Product as ClientProduct } from '@/lib/context';

type DbProduct = {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  images: unknown;
  category?: { slug: string } | null;
  stock: number;
  estimatedDelivery: string;
  isCustomizable: boolean;
  active: boolean;
};

export function mapDbProductToClientProduct(product: DbProduct): ClientProduct {
  let images: string[] = [];
  try {
    if (typeof product.images === "string") {
      const parsed: unknown = JSON.parse(product.images);
      images = Array.isArray(parsed) ? parsed.filter((image): image is string => typeof image === "string") : [];
    } else if (Array.isArray(product.images)) {
      images = product.images.filter((image): image is string => typeof image === "string");
    }
  } catch {
    images = ["/1-19.png"];
  }

  if (!images || images.length === 0) {
    images = ["/1-19.png"];
  }

  return {
    id: product.id.toString(),
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: undefined, // Le schéma Prisma n'a pas de prix d'origine
    category: product.category?.slug || "autres",
    images,
    stock: product.stock,
    deliveryDays: product.estimatedDelivery || "2-3 jours",
    isPersonalizable: product.isCustomizable,
    isPopular: true,
    isActive: product.active,
    tags: [],
  };
}
