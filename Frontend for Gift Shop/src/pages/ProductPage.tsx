import { useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight, Minus, Plus, Truck, Package, ArrowLeft, Phone, CheckCircle } from "lucide-react";
import { products, formatPrice } from "../data/mockData";
import { useRouter, useCart } from "../lib/context";
import ProductCard from "../components/ProductCard";
import { toast } from "sonner";

export default function ProductPage() {
  const { params, navigate } = useRouter();
  const { addToCart } = useCart();

  const product = products.find((p) => p.slug === params.slug) || products[0];
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, quantity, message);
    setAdded(true);
    toast.success(`${product.name} ajouté au panier !`, {
      description: `Quantité : ${quantity}`,
      action: { label: "Voir le panier", onClick: () => navigate("cart") },
    });
    setTimeout(() => setAdded(false), 2000);
  };

  const whatsappMsg = encodeURIComponent(
    `Bonjour Bénin Cadeau, je souhaite commander : ${product.name} (x${quantity})${message ? `. Message : ${message}` : "."}`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-body">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate("catalogue")}
        className="flex items-center gap-1.5 text-muted-foreground hover:text-primary text-sm mb-8 transition-colors"
      >
        <ArrowLeft size={16} />
        Retour au catalogue
      </button>

      <div className="grid lg:grid-cols-2 gap-10 mb-16">
        {/* Image gallery */}
        <div>
          <div className="relative rounded-2xl overflow-hidden aspect-square bg-muted mb-4">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage((i) => (i - 1 + product.images.length) % product.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setSelectedImage((i) => (i + 1) % product.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
            {product.originalPrice && (
              <div className="absolute top-4 left-4 bg-destructive text-white text-sm font-bold px-3 py-1.5 rounded-full">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    i === selectedImage ? "border-primary shadow-md" : "border-transparent opacity-60 hover:opacity-80"
                  }`}
                >
                  <img src={img} alt={`Vue ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div>
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">{product.category}</p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-primary leading-tight mb-4">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-display text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-muted-foreground text-lg line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
              product.stock > 5 ? "bg-green-100 text-green-700" :
              product.stock > 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 5 ? "bg-green-500" : product.stock > 0 ? "bg-amber-500" : "bg-red-500"}`} />
              {product.stock > 5 ? "En stock" : product.stock > 0 ? `Dernières pièces (${product.stock})` : "Rupture de stock"}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
              <Truck size={12} />
              Livraison {product.deliveryDays}
            </span>
            {product.isPersonalizable && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-secondary text-primary">
                ✏️ Personnalisable
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed mb-8 text-sm">{product.description}</p>

          {/* Personalization field */}
          {product.isPersonalizable && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-foreground mb-2">
                Votre message ou demande de personnalisation <span className="text-muted-foreground font-normal">(facultatif)</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ex : Prénom à graver : Marie, couleur souhaitée : rose"
                rows={3}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm text-foreground outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
              />
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-semibold text-foreground">Quantité :</span>
            <div className="flex items-center border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2.5 hover:bg-muted transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="px-4 py-2.5 font-semibold text-sm min-w-[3rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="px-3 py-2.5 hover:bg-muted transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="bg-secondary rounded-xl px-4 py-3 flex items-center justify-between mb-6">
            <span className="text-sm text-foreground font-medium">Total</span>
            <span className="font-display text-xl font-bold text-primary">
              {formatPrice(product.price * quantity)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all ${
                added
                  ? "bg-green-600 text-white"
                  : "bg-primary text-white hover:bg-primary/90 active:scale-95"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {added ? <CheckCircle size={18} /> : <ShoppingCart size={18} />}
              {added ? "Ajouté !" : "Ajouter au panier"}
            </button>
            <a
              href={`https://wa.me/22997000000?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm bg-[#25D366] text-white hover:bg-[#22c55e] transition-colors"
            >
              <Phone size={18} />
              Commander via WhatsApp
            </a>
          </div>

          {/* Info pills */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {[
              { icon: <Truck size={16} />, text: `Livraison ${product.deliveryDays}` },
              { icon: <Package size={16} />, text: "Emballage cadeau inclus" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-muted-foreground text-xs">
                <span className="text-accent">{icon}</span>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-semibold text-primary mb-6">Vous aimerez aussi</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
