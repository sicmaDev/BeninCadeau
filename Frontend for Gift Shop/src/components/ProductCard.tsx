import { ShoppingCart, Eye } from "lucide-react";
import type { Product } from "../data/mockData";
import { formatPrice } from "../data/mockData";
import { useRouter } from "../lib/context";
import { useCart } from "../lib/context";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { navigate } = useRouter();
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, "");
  };

  return (
    <div
      className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col"
      onClick={() => navigate("product", { slug: product.slug })}
    >
      {/* Image */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.originalPrice && (
          <span className="absolute top-3 left-3 bg-destructive text-white text-xs font-bold px-2 py-1 rounded-full">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-3 right-3 bg-accent text-primary text-xs font-bold px-2 py-1 rounded-full">
            Dernières pièces
          </span>
        )}
        {product.isPersonalizable && (
          <span className="absolute bottom-3 left-3 bg-primary/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            ✏️ Personnalisable
          </span>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); navigate("product", { slug: product.slug }); }}
            className="bg-white text-primary rounded-full p-2.5 shadow-lg hover:bg-accent transition-colors"
            aria-label="Voir le produit"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={handleAddToCart}
            className="bg-primary text-white rounded-full p-2.5 shadow-lg hover:bg-accent hover:text-primary transition-colors"
            aria-label="Ajouter au panier"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-accent font-medium uppercase tracking-wider mb-1">{product.category}</p>
        <h3 className="font-semibold text-foreground text-sm leading-snug mb-2 line-clamp-2 flex-1">{product.name}</h3>
        <div className="flex items-center justify-between mt-auto">
          <div>
            <p className="text-primary font-bold text-base">{formatPrice(product.price)}</p>
            {product.originalPrice && (
              <p className="text-muted-foreground text-xs line-through">{formatPrice(product.originalPrice)}</p>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-primary text-white rounded-xl px-3 py-2 text-xs font-semibold hover:bg-accent hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <ShoppingCart size={14} />
            Ajouter
          </button>
        </div>
        <p className="text-muted-foreground text-xs mt-2">🚚 Livraison en {product.deliveryDays}</p>
      </div>
    </div>
  );
}
