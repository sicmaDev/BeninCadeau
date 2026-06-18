"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, Check, ArrowLeft, Loader2, MapPin, Phone, Mail, User, CreditCard, Sparkles, ShieldCheck } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CopyrightRow } from '@/components/CopyrightRow';
import { motion } from 'framer-motion';

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
    try {
      const savedCart = localStorage.getItem('bc_cart');
      const items = savedCart ? JSON.parse(savedCart) : [];
      setCartItems(items);

      const savedPromo = localStorage.getItem('bc_applied_promo');
      if (savedPromo) {
        setAppliedPromo(JSON.parse(savedPromo));
      }
    } catch (e) {
      console.error('Failed to load storage', e);
    }

    fetchShippingZones();
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
      setError('Veuillez confirmer l\'exactitude de vos coordonnées.');
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
        localStorage.removeItem('bc_cart');
        localStorage.removeItem('bc_applied_promo');
        window.dispatchEvent(new Event('cart-updated'));
        router.push(`/confirmation/${data.orderNumber}`);
      } else {
        setError(data.error || 'Une erreur est survenue lors de la création de la commande.');
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
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-bc-yellow border-t-bc-purple rounded-full animate-spin"></div>
          <p className="text-bc-heading font-montserrat font-bold text-sm tracking-wider uppercase">Chargement de la commande...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bc-bg">
      <Header />
      <main className="flex-grow font-instrument pb-24">
        
        {/* Banner Section */}
        <section className="relative h-[260px] w-full flex items-center justify-center overflow-hidden mb-12">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&q=80&w=2000"
              alt="Bénin Cadeau Commande"
              className="w-full h-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-bc-purpleDark/90 via-bc-purple/80 to-bc-bg" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 text-center z-10 space-y-2">
            <h1 className="font-montserrat font-black text-3xl sm:text-4xl text-white tracking-tight">
              VALIDATION DE COMMANDE
            </h1>
            <p className="text-gray-200 text-sm font-medium max-w-md mx-auto">
              Remplissez vos informations de livraison pour finaliser votre coffret.
            </p>
          </div>
        </section>

        {/* Checkout Area */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link
            href="/panier"
            className="inline-flex items-center text-sm font-bold text-bc-purple mb-8 hover:underline"
          >
            <ArrowLeft size={16} className="mr-2" /> Retour au panier
          </Link>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-sm font-semibold mb-8 shadow-sm"
            >
              {error}
            </motion.div>
          )}

          {cartItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-[32px] border border-gray-100 p-10 max-w-md mx-auto shadow-card">
              <p className="text-gray-500 font-montserrat font-bold text-base mb-6">Votre panier est actuellement vide.</p>
              <Link
                href="/catalogue"
                className="inline-flex px-6 py-3.5 rounded-2xl bg-bc-yellow hover:bg-yellow-400 text-bc-purple font-montserrat font-bold text-xs uppercase tracking-wider shadow-yellow-glow"
              >
                Voir les articles
              </Link>
            </div>
          ) : (
            <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* Form Details (Left) */}
              <div className="lg:col-span-7 space-y-8">
                <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-card border border-gray-100/60 space-y-6">
                  <h2 className="text-lg font-bold font-montserrat text-bc-navy pb-3 border-b border-gray-100 flex items-center">
                    <User className="mr-2 text-bc-yellow" size={18} /> Vos informations de livraison
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="relative border border-gray-200 rounded-2xl p-3.5 flex items-center bg-gray-50/35 focus-within:bg-white focus-within:ring-2 focus-within:ring-bc-purple/20 focus-within:border-bc-purple transition-all">
                      <span className="text-gray-400 mr-3 flex-shrink-0">
                        <User size={16} />
                      </span>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Nom & Prénoms *"
                        className="w-full focus:outline-none text-bc-heading placeholder-gray-400 text-sm font-medium bg-transparent"
                      />
                    </div>

                    <div className="relative border border-gray-200 rounded-2xl p-3.5 flex items-center bg-gray-50/35 focus-within:bg-white focus-within:ring-2 focus-within:ring-bc-purple/20 focus-within:border-bc-purple transition-all">
                      <span className="text-gray-400 mr-3 flex-shrink-0">
                        <Phone size={16} />
                      </span>
                      <input
                        type="tel"
                        required
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="Téléphone (WhatsApp de préf.) *"
                        className="w-full focus:outline-none text-bc-heading placeholder-gray-400 text-sm font-medium bg-transparent"
                      />
                    </div>

                    <div className="relative border border-gray-200 rounded-2xl p-3.5 flex items-center sm:col-span-2 bg-gray-50/35 focus-within:bg-white focus-within:ring-2 focus-within:ring-bc-purple/20 focus-within:border-bc-purple transition-all">
                      <span className="text-gray-400 mr-3 flex-shrink-0">
                        <Mail size={16} />
                      </span>
                      <input
                        type="email"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="Adresse e-mail *"
                        className="w-full focus:outline-none text-bc-heading placeholder-gray-400 text-sm font-medium bg-transparent"
                      />
                    </div>

                    <div className="relative border border-gray-200 rounded-2xl p-3.5 flex items-center sm:col-span-2 bg-gray-50/35 focus-within:bg-white focus-within:ring-2 focus-within:ring-bc-purple/20 focus-within:border-bc-purple transition-all">
                      <span className="text-gray-400 mr-3 flex-shrink-0">
                        <MapPin size={16} />
                      </span>
                      <select
                        required
                        value={shippingZoneId}
                        onChange={(e) => setShippingZoneId(e.target.value)}
                        className="w-full appearance-none bg-transparent focus:outline-none text-bc-heading text-sm font-medium pr-8 cursor-pointer"
                      >
                        <option value="" disabled>Sélectionnez votre zone de livraison *</option>
                        {shippingZones.map((zone) => (
                          <option key={zone.id} value={zone.id}>
                            {zone.name} (+{zone.deliveryFee.toLocaleString('fr-FR')} FCFA)
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="text-gray-400 absolute right-4 pointer-events-none" size={16} />
                    </div>

                    <div className="border border-gray-200 rounded-2xl p-3.5 h-32 sm:col-span-2 bg-gray-50/35 focus-within:bg-white focus-within:ring-2 focus-within:ring-bc-purple/20 focus-within:border-bc-purple transition-all">
                      <textarea
                        required
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="Adresse précise (Quartier, détails de la rue, indications particulières pour le livreur) *"
                        className="w-full h-full focus:outline-none text-bc-heading placeholder-gray-400 text-sm font-medium resize-none bg-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Mode de paiement */}
                <div className="bg-bc-purpleLight/40 rounded-[32px] p-6 sm:p-8 border border-bc-purple/10 space-y-4">
                  <h3 className="font-montserrat font-bold text-bc-purple flex items-center">
                    <CreditCard className="mr-2.5 text-bc-purple" size={18} /> Mode de règlement
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    Pour garantir un service client personnalisé, le paiement final s&apos;effectue après validation avec nos équipes. 
                    Dès confirmation de la commande, vous obtiendrez un reçu et serez redirigé(e) vers WhatsApp pour finaliser le paiement 
                    via Mobile Money (MTN MoMo, Moov) ou virement bancaire.
                  </p>
                </div>
              </div>

              {/* Recap and Order Items (Right) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="glass-panel rounded-[32px] p-6 sm:p-8 shadow-premium space-y-6 border border-white/40">
                  <h2 className="text-lg font-bold font-montserrat text-bc-navy pb-3 border-b border-white/10">
                    Votre Commande
                  </h2>

                  {/* Mini item list */}
                  <div className="max-h-[260px] overflow-y-auto space-y-4 pr-1 divide-y divide-gray-100/40">
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm gap-3 pt-4 first:pt-0">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100 shadow-inner">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="space-y-0.5">
                            <span className="font-bold text-bc-navy block line-clamp-1">{item.name}</span>
                            <span className="text-xs text-gray-400 font-medium">
                              Qté : {item.quantity} × {item.price.toLocaleString('fr-FR')} FCFA
                            </span>
                            {item.customizationMessage && (
                              <span className="block text-[10px] text-bc-purple font-medium italic line-clamp-1">
                                Perso : &quot;{item.customizationMessage}&quot;
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="font-bold text-bc-navy flex-shrink-0">
                          {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Breakdown */}
                  <div className="border-t border-white/20 pt-5 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Sous-total</span>
                      <span className="font-bold text-bc-navy">{subtotal.toLocaleString('fr-FR')} FCFA</span>
                    </div>

                    {appliedPromo && (
                      <div className="flex justify-between text-sm text-green-600 font-bold bg-green-50/70 border border-green-100 rounded-xl p-2.5">
                        <span>Code : {appliedPromo.code}</span>
                        <span>-{discountAmount.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Livraison</span>
                      <span className="font-bold text-bc-navy">
                        {shippingZoneId ? `${shippingFee.toLocaleString('fr-FR')} FCFA` : 'Sélectionnez une zone'}
                      </span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t border-white/20 pt-5 flex justify-between items-baseline">
                    <span className="text-base font-bold text-bc-navy">Montant Total</span>
                    <span className="text-2xl font-black text-bc-purple font-montserrat px-4 py-1.5 bg-bc-yellow/10 rounded-2xl border border-bc-yellow/20">
                      {finalTotal.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>

                  {/* Verification checkbox */}
                  <label className="flex items-start gap-3 cursor-pointer group pt-3 select-none">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)}
                      className="mt-1 accent-bc-purple w-4.5 h-4.5 rounded border-gray-300 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-bc-heading leading-relaxed">
                      Je confirme l&apos;exactitude de mes coordonnées et de l&apos;adresse de livraison saisies ci-dessus.
                    </span>
                  </label>

                  {/* Confirm Button */}
                  <div className="space-y-4 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center py-4 px-6 rounded-2xl font-montserrat font-bold text-sm uppercase tracking-wider bg-gold-gradient hover:bg-yellow-500 text-bc-purpleDark transition-all shadow-yellow-glow cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 animate-spin" size={16} /> Enregistrement...
                        </>
                      ) : (
                        <>
                          Confirmer ma commande <Check size={18} className="ml-2" />
                        </>
                      )}
                    </motion.button>
                    
                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                      <ShieldCheck size={14} className="text-bc-yellow" /> Sécurité & authenticité garanties
                    </div>
                  </div>
                </div>
              </div>

            </form>
          )}
        </section>
      </main>
      <CopyrightRow />
      <Footer />
    </div>
  );
}

