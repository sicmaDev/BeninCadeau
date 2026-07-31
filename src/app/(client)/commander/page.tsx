"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, CreditCard, Smartphone, CheckCircle, Loader2 } from "lucide-react";
import { formatPrice } from "@/components/ProductCard";
import { useRouter, useCart, useAuth } from "@/lib/context";
import { toast } from "sonner";

type PaymentMethod = "mtn" | "moov" | "card";

interface ShippingZone {
  id: number;
  name: string;
  deliveryFee: number;
}

export default function CheckoutPage() {
  const { navigate } = useRouter();
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    zoneId: "",
    paymentMethod: "mtn" as PaymentMethod,
  });

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: f.name || user.name || "",
        email: f.email || user.email || "",
        phone: f.phone || user.phone || "",
        address: f.address || user.address || "",
      }));
    }
  }, [user]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);

  // Charger les zones de livraison de la base de données
  useEffect(() => {
    fetch("/api/shipping-zones")
      .then((res) => res.json())
      .then((data) => {
        if (data.zones) {
          setShippingZones(data.zones);
        }
      })
      .catch((err) => console.error("Error loading shipping zones", err));
  }, []);

  // Rediriger vers le panier si le panier est vide
  useEffect(() => {
    if (cart.items.length === 0 && !loading) {
      navigate("cart");
    }
  }, [cart.items.length, loading, navigate]);

  const selectedZone = shippingZones.find((z) => z.id.toString() === form.zoneId);
  const deliveryFee = selectedZone?.deliveryFee || 0;
  const discount = cart.promoDiscount ? subtotal * cart.promoDiscount : 0;
  const total = subtotal - discount + deliveryFee;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Le nom est requis";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Email invalide";
    if (!form.phone.trim()) e.phone = "Le téléphone est requis";
    if (!form.address.trim()) e.address = "L'adresse est requise";
    if (!form.zoneId) e.zoneId = "Veuillez sélectionner une zone";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    const payload = {
      clientName: form.name,
      clientEmail: form.email,
      clientPhone: form.phone,
      shippingAddress: form.address,
      shippingZoneId: parseInt(form.zoneId, 10),
      promoCode: cart.promoCode || undefined,
      items: cart.items.map((item) => ({
        productId: parseInt(item.product.id, 10),
        quantity: item.quantity,
        customizationMessage: item.personalMessage || null,
      })),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        // Rediriger vers l'URL de paiement FedaPay ou la page de confirmation locale
        window.location.href = data.checkoutUrl;
      } else {
        toast.error(data.error || "Une erreur est survenue lors de la création de la commande.");
      }
    } catch (err) {
      toast.error("Erreur de connexion lors de la commande.");
    } finally {
      setLoading(false);
    }
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => { const n = { ...err }; delete n[field]; return n; });
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 bg-input-background border rounded-xl text-sm text-foreground outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all ${
      errors[field] ? "border-destructive bg-red-50" : "border-border"
    }`;

  const paymentOptions: { id: PaymentMethod; label: string; logo: string; color: string }[] = [
    { id: "mtn", label: "MTN Mobile Money", logo: "📱", color: "bg-yellow-50 border-yellow-300" },
    { id: "moov", label: "Moov Money", logo: "📲", color: "bg-blue-50 border-blue-300" },
    { id: "card", label: "Carte Bancaire", logo: "💳", color: "bg-gray-50 border-gray-300" },
  ];

  if (cart.items.length === 0 && !loading) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-body">
      <button
        onClick={() => navigate("cart")}
        className="flex items-center gap-1.5 text-muted-foreground hover:text-primary text-sm mb-8 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        Retour au panier
      </button>

      <h1 className="font-display text-3xl font-semibold text-primary mb-8">Finaliser la commande</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery info */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-display text-xl font-semibold text-primary mb-6 flex items-center gap-2">
                <span className="w-7 h-7 bg-primary text-white rounded-full text-sm flex items-center justify-center font-bold">1</span>
                Informations de livraison
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Nom complet *</label>
                  <input value={form.name} onChange={set("name")} type="text" placeholder="Kossi Adjovi" className={inputClass("name")} />
                  {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Email *</label>
                  <input value={form.email} onChange={set("email")} type="email" placeholder="kossi@exemple.bj" className={inputClass("email")} />
                  {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Téléphone *</label>
                  <input value={form.phone} onChange={set("phone")} type="tel" placeholder="+229 97 00 00 00" className={inputClass("phone")} />
                  {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Zone de livraison *</label>
                  <select value={form.zoneId} onChange={set("zoneId")} className={inputClass("zoneId")}>
                    <option value="">Sélectionner une zone...</option>
                    {shippingZones.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name} — {formatPrice(z.deliveryFee)}
                      </option>
                    ))}
                  </select>
                  {errors.zoneId && <p className="text-destructive text-xs mt-1">{errors.zoneId}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Adresse précise *</label>
                  <input value={form.address} onChange={set("address")} type="text" placeholder="Rue, quartier, point de repère..." className={inputClass("address")} />
                  {errors.address && <p className="text-destructive text-xs mt-1">{errors.address}</p>}
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-display text-xl font-semibold text-primary mb-6 flex items-center gap-2">
                <span className="w-7 h-7 bg-primary text-white rounded-full text-sm flex items-center justify-center font-bold">2</span>
                Mode de paiement
              </h2>

              <div className="space-y-3">
                {paymentOptions.map(({ id, label, logo, color }) => (
                  <label
                    key={id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      form.paymentMethod === id
                        ? "border-primary bg-secondary"
                        : `${color} hover:border-primary/40`
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={id}
                      checked={form.paymentMethod === id}
                      onChange={set("paymentMethod")}
                      className="sr-only"
                    />
                    <span className="text-2xl">{logo}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground">
                        {id === "mtn" && "Paiement via MTN Mobile Money"}
                        {id === "moov" && "Paiement via Moov Money"}
                        {id === "card" && "Visa, Mastercard acceptés"}
                      </p>
                    </div>
                    {form.paymentMethod === id && (
                      <CheckCircle size={18} className="text-primary flex-shrink-0" />
                    )}
                  </label>
                ))}
              </div>

              <div className="mt-4 bg-blue-50 rounded-xl px-4 py-3 text-xs text-blue-700 flex items-start gap-2">
                <CreditCard size={14} className="flex-shrink-0 mt-0.5" />
                <span>
                  Vous serez redirigé vers <strong>FedaPay</strong> pour finaliser votre paiement en toute sécurité.
                </span>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div>
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
              <h2 className="font-display text-xl font-semibold text-primary mb-4">Votre commande</h2>

              <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto pr-1">
                {cart.items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-3 pt-2 first:pt-0">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img src={product.images[0] || "/1-19.png"} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground line-clamp-2 leading-snug">{product.name}</p>
                      <p className="text-xs text-muted-foreground">x{quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-primary flex-shrink-0">{formatPrice(product.price * quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Sous-total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-accent font-semibold">
                    <span>Réduction</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Livraison</span>
                  <span>{form.zoneId ? formatPrice(deliveryFee) : "—"}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-primary font-display text-lg">{form.zoneId ? formatPrice(total) : "—"}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Redirection vers FedaPay...
                  </>
                ) : (
                  <>
                    <Smartphone size={18} />
                    Confirmer et payer
                  </>
                )}
              </button>

              <p className="text-xs text-muted-foreground text-center mt-3">
                🔒 Paiement sécurisé SSL via FedaPay
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
