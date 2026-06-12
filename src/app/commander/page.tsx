"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, Check, ArrowLeft, Loader2, MapPin, Phone, Mail, User, CreditCard } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CopyrightRow } from '@/components/CopyrightRow';

interface CartItem {
  productId: number;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  customizationMessage: string | null;
  estimatedDelivery: string;
}

interface ShippingZone {
  id: number;
  name: string;
  deliveryFee: number;
}

export default function CommanderPage() {
  const router = useRouter();
  
  // Cart & Promo states
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    type: 'FIXED' | 'PERCENTAGE';
    value: number;
  } | null>(null);

  // Form inputs
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingZoneId, setShippingZoneId] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  // Load states
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // 1. Get Cart
    try {
      const savedCart = localStorage.getItem('bc_cart');
      const items = savedCart ? JSON.parse(savedCart) : [];
      setCartItems(items);

      // 2. Get Promo
      const savedPromo = localStorage.getItem('bc_applied_promo');
      if (savedPromo) {
        setAppliedPromo(JSON.parse(savedPromo));
      }
    } catch (e) {
      console.error('Failed to load storage', e);
    }

    // 3. Fetch Shipping Zones
    fetchShippingZones();
    // 4. Fetch User Session (to prefill if logged in)
    fetchUserSession();
  }, []);

  const fetchShippingZones = async () => {
    try {
      const res = await fetch('/api/shipping-zones');
      if (res.ok) {
        const data = await res.json();
        setShippingZones(data.zones || []);
      }
    } catch (err) {
      console.error('Failed to fetch shipping zones', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setClientName(data.user.name || '');
          setClientEmail(data.user.email || '');
          setClientPhone(data.user.phone || '');
          setShippingAddress(data.user.address || '');
        }
      }
    } catch (err) {
      console.error('Failed to fetch user session', err);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!cartItems.length) {
      setError('Votre panier est vide.');
      return;
    }

    if (!clientName || !clientEmail || !clientPhone || !shippingAddress || !shippingZoneId) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (!isChecked) {
      setError('Veuillez confirmer que vous avez vérifié vos informations.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          clientEmail,
          clientPhone,
          shippingAddress,
          shippingZoneId,
          promoCode: appliedPromo?.code || null,
          items: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            customizationMessage: item.customizationMessage,
          })),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Clear cart and promo
        localStorage.removeItem('bc_cart');
        localStorage.removeItem('bc_applied_promo');
        window.dispatchEvent(new Event('cart-updated'));

        // Redirect to confirmation page
        router.push(`/confirmation/${data.orderNumber}`);
      } else {
        setError(data.error || 'Une erreur est survenue lors de l\'enregistrement de votre commande.');
      }
    } catch (err) {
      setError('Une erreur réseau est survenue. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'PERCENTAGE') {
      discountAmount = Math.round((subtotal * appliedPromo.value) / 100);
    } else {
      discountAmount = appliedPromo.value;
    }
  }

  const selectedZone = shippingZones.find(z => z.id === parseInt(shippingZoneId, 10));
  const shippingFee = selectedZone ? selectedZone.deliveryFee : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  if (loading) {
    return (
      <div className="min-h-screen bg-bc-bg flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-bc-yellow border-t-bc-purple rounded-full animate-spin"></div>
          <p className="mt-4 text-bc-heading font-medium">Chargement de la commande...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bc-bg">
      <Header />
      <main className="flex-grow font-instrument">
        <div className="bg-white">
          {/* Hero Section */}
          <section className="relative h-[300px] w-full">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&q=80&w=2000"
                alt="Bénin Cadeau Commande"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/55"></div>
            </div>

            {/* Floating Title Card */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4">
              <div className="bg-white rounded-[36px] shadow-card py-6 px-8 text-center border border-gray-100">
                <h1 className="font-montserrat font-extrabold text-3xl md:text-4xl text-bc-purple">
                  Validation de Commande
                </h1>
              </div>
            </div>
          </section>

          {/* Checkout Area */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
            <Link
              href="/panier"
              className="inline-flex items-center text-sm font-semibold text-bc-purple mb-8 hover:underline"
            >
              <ArrowLeft size={16} className="mr-2" /> Retour au panier
            </Link>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-sm font-semibold mb-8">
                {error}
              </div>
            )}

            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 font-bold text-lg mb-6">Votre panier est actuellement vide.</p>
                <Link
                  href="/catalogue"
                  className="px-6 py-3 rounded-2xl bg-bc-yellow hover:bg-yellow-400 text-bc-purple font-bold"
                >
                  Voir les articles du catalogue
                </Link>
              </div>
            ) : (
              <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Form Details (Left) */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-gray-100 space-y-6">
                    <h2 className="text-xl font-bold font-montserrat text-bc-navy pb-3 border-b border-gray-100 flex items-center">
                      <User className="mr-2 text-bc-yellow" size={20} /> Informations de livraison
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="relative border border-gray-300 rounded-xl p-3 flex items-center">
                        <span className="text-gray-400 mr-2 flex-shrink-0">
                          <User size={18} />
                        </span>
                        <input
                          type="text"
                          required
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="Nom & Prénoms *"
                          className="w-full focus:outline-none text-bc-heading placeholder-gray-400 text-sm font-medium"
                        />
                      </div>

                      <div className="relative border border-gray-300 rounded-xl p-3 flex items-center">
                        <span className="text-gray-400 mr-2 flex-shrink-0">
                          <Phone size={18} />
                        </span>
                        <input
                          type="tel"
                          required
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="Téléphone (WhatsApp de préf.) *"
                          className="w-full focus:outline-none text-bc-heading placeholder-gray-400 text-sm font-medium"
                        />
                      </div>

                      <div className="relative border border-gray-300 rounded-xl p-3 flex items-center sm:col-span-2">
                        <span className="text-gray-400 mr-2 flex-shrink-0">
                          <Mail size={18} />
                        </span>
                        <input
                          type="email"
                          required
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="Adresse Email *"
                          className="w-full focus:outline-none text-bc-heading placeholder-gray-400 text-sm font-medium"
                        />
                      </div>

                      <div className="relative border border-gray-300 rounded-xl p-3 flex items-center sm:col-span-2">
                        <span className="text-gray-400 mr-2 flex-shrink-0">
                          <MapPin size={18} />
                        </span>
                        <select
                          required
                          value={shippingZoneId}
                          onChange={(e) => setShippingZoneId(e.target.value)}
                          className="w-full appearance-none bg-transparent focus:outline-none text-bc-heading text-sm font-medium pr-8"
                        >
                          <option value="" disabled>Selectez votre zone de livraison *</option>
                          {shippingZones.map((zone) => (
                            <option key={zone.id} value={zone.id}>
                              {zone.name} (+{zone.deliveryFee.toLocaleString('fr-FR')} FCFA)
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="text-gray-400 absolute right-3 pointer-events-none" size={18} />
                      </div>

                      <div className="border border-gray-300 rounded-xl p-3 h-32 sm:col-span-2">
                        <textarea
                          required
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          placeholder="Adresse précise (Quartier, détails de la maison, indications particulières) *"
                          className="w-full h-full focus:outline-none text-bc-heading placeholder-gray-400 text-sm font-medium resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment instructions disclaimer */}
                  <div className="bg-purple-50 rounded-3xl p-6 border border-purple-100 space-y-3">
                    <h3 className="font-bold text-bc-purple flex items-center">
                      <CreditCard className="mr-2" size={18} /> Mode de paiement
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Pour cette version MVP, le paiement en ligne direct est désactivé. 
                      Après confirmation, vous serez redirigé vers un lien WhatsApp pour finaliser le paiement 
                      par Mobile Money (MTN MoMo, Moov Money) ou transfert avec notre équipe commerciale.
                    </p>
                  </div>
                </div>

                {/* Recap and Order Items (Right) */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-gray-100 space-y-6">
                    <h2 className="text-xl font-bold font-montserrat text-bc-navy pb-3 border-b border-gray-100">
                      Votre Commande
                    </h2>

                    {/* Mini item list */}
                    <div className="max-h-[220px] overflow-y-auto space-y-4 pr-1">
                      {cartItems.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm gap-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <span className="font-semibold text-bc-navy block line-clamp-1">{item.name}</span>
                              <span className="text-xs text-gray-400">
                                Qté: {item.quantity} × {item.price.toLocaleString('fr-FR')} FCFA
                              </span>
                              {item.customizationMessage && (
                                <span className="block text-[10px] text-bc-purple italic line-clamp-1">
                                  Perso: &quot;{item.customizationMessage}&quot;
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="font-semibold text-bc-navy flex-shrink-0">
                            {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Breakdown */}
                    <div className="border-t border-gray-100 pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Sous-total</span>
                        <span className="font-semibold text-bc-navy">{subtotal.toLocaleString('fr-FR')} FCFA</span>
                      </div>

                      {appliedPromo && (
                        <div className="flex justify-between text-sm text-green-600 font-medium">
                          <span>Remise Code ({appliedPromo.code})</span>
                          <span>-{discountAmount.toLocaleString('fr-FR')} FCFA</span>
                        </div>
                      )}

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Frais de livraison</span>
                        <span className="font-semibold text-bc-navy">
                          {shippingZoneId ? `${shippingFee.toLocaleString('fr-FR')} FCFA` : 'Sélectionnez une zone'}
                        </span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="border-t border-gray-100 pt-4 flex justify-between items-baseline">
                      <span className="text-base font-bold text-bc-navy">Montant Total</span>
                      <span className="text-2xl font-black text-bc-purple font-montserrat">
                        {finalTotal.toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>

                    {/* Verification checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer group pt-2 select-none">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => setIsChecked(e.target.checked)}
                        className="mt-1 accent-bc-purple w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-xs font-semibold text-bc-heading leading-tight">
                        Je confirme l&apos;exactitude des informations saisies (nom, numéro WhatsApp et adresse de livraison).
                      </span>
                    </label>

                    {/* Confirm Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center py-4 px-6 rounded-2xl font-bold bg-bc-yellow hover:bg-yellow-400 text-bc-purple transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 animate-spin" size={18} /> Traitement...
                        </>
                      ) : (
                        <>
                          Confirmer et commander <Check size={18} className="ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </form>
            )}
          </section>
        </div>
      </main>
      <CopyrightRow />
      <Footer />
    </div>
  );
}
