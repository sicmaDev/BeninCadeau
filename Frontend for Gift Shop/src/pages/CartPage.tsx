import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { formatPrice } from "../data/mockData";
import { useRouter, useCart } from "../lib/context";
import { useState } from "react";

export default function CartPage() {
  const { navigate } = useRouter();
  const { cart, removeFromCart, updateQty, applyPromo, subtotal } = useCart();
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");

  const handlePromo = () => {
    if (promoInput.toUpperCase() === "BIENVENUE10") {
      applyPromo("BIENVENUE10", 0.1);
      setPromoError("");
    } else {
      setPromoError("Code promo invalide ou expiré.");
    }
  };

  const discount = cart.promoDiscount ? subtotal * cart.promoDiscount : 0;
  const total = subtotal - discount;

  if (cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center font-body">
        <p className="text-7xl mb-6">🛒</p>
        <h2 className="font-display text-2xl font-semibold text-primary mb-3">Votre panier est vide</h2>
        <p className="text-muted-foreground mb-8">
          Ajoutez des produits à votre panier pour commencer votre commande.
        </p>
        <button
          onClick={() => navigate("catalogue")}
          className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
        >
          <ShoppingBag size={18} />
          Voir le catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-body">
      <h1 className="font-display text-3xl font-semibold text-primary mb-8">Mon Panier</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map(({ product, quantity, personalMessage }) => (
            <div key={product.id} className="bg-card border border-border rounded-2xl p-4 flex gap-4">
              <div
                className="w-24 h-24 rounded-xl overflow-hidden bg-muted flex-shrink-0 cursor-pointer"
                onClick={() => navigate("product", { slug: product.slug })}
              >
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <button
                    onClick={() => navigate("product", { slug: product.slug })}
                    className="font-semibold text-foreground text-sm leading-snug hover:text-primary transition-colors line-clamp-2 text-left"
                  >
                    {product.name}
                  </button>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0 p-1"
                    aria-label="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <p className="text-accent text-xs font-medium capitalize mb-2">{product.category}</p>

                {personalMessage && (
                  <div className="bg-secondary rounded-lg px-3 py-2 text-xs text-foreground mb-2 italic">
                    ✏️ "{personalMessage}"
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQty(product.id, quantity - 1)}
                      className="px-2.5 py-1.5 hover:bg-muted transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 py-1.5 font-semibold text-sm">{quantity}</span>
                    <button
                      onClick={() => updateQty(product.id, quantity + 1)}
                      className="px-2.5 py-1.5 hover:bg-muted transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="font-bold text-primary font-display">{formatPrice(product.price * quantity)}</p>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => navigate("catalogue")}
            className="text-primary text-sm font-medium hover:underline mt-2"
          >
            + Continuer mes achats
          </button>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
            <h2 className="font-display text-xl font-semibold text-primary mb-6">Récapitulatif</h2>

            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total ({cart.items.reduce((s, i) => s + i.quantity, 0)} article{cart.items.reduce((s, i) => s + i.quantity, 0) > 1 ? "s" : ""})</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Réduction ({cart.promoCode})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Livraison</span>
                <span>Calculée à l'étape suivante</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                <span className="text-foreground">Total estimé</span>
                <span className="text-primary font-display">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Promo code */}
            {!cart.promoCode && (
              <div className="mb-6">
                <label className="text-xs font-semibold text-foreground mb-2 block flex items-center gap-1.5">
                  <Tag size={12} /> Code promo
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => { setPromoInput(e.target.value); setPromoError(""); }}
                    placeholder="BIENVENUE10"
                    className="flex-1 px-3 py-2 bg-input-background border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button
                    onClick={handlePromo}
                    className="px-3 py-2 bg-secondary text-primary font-semibold text-sm rounded-lg hover:bg-accent hover:text-primary transition-colors"
                  >
                    Appliquer
                  </button>
                </div>
                {promoError && <p className="text-destructive text-xs mt-1">{promoError}</p>}
              </div>
            )}
            {cart.promoCode && (
              <div className="mb-6 flex items-center gap-2 bg-green-50 text-green-700 rounded-lg px-3 py-2 text-sm">
                <Tag size={14} />
                Code <strong>{cart.promoCode}</strong> appliqué (-10%)
              </div>
            )}

            <button
              onClick={() => navigate("checkout")}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition-colors text-base"
            >
              Passer commande <ArrowRight size={18} />
            </button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Paiement sécurisé · MTN MoMo · Moov Money · Carte bancaire
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
