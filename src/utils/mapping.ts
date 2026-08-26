import { Product as ClientProduct } from "@/lib/context";

export function mapDbProductToClientProduct(product: any): ClientProduct {
  let images: string[] = [];
  try {
    if (typeof product.images === "string") {
      images = JSON.parse(product.images);
    } else if (Array.isArray(product.images)) {
      images = product.images;
    }
  } catch (e) {
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
