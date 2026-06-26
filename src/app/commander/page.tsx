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
        
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          router.push(`/confirmation/${data.orderNumber}`);
        }
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
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-2 border-bc-purple border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-650 font-semibold text-xs tracking-wider uppercase">Chargement du formulaire...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50/30">
      <Header />
      <main className="flex-grow font-instrument pb-24">
        
        {/* Elegant Minimalist Header */}
        <section className="bg-zinc-50 border-b border-zinc-200/50 py-10 sm:py-12">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
            <h1 className="font-bold text-2xl sm:text-3xl text-zinc-900 tracking-tight">
              VALIDATION DE COMMANDE
            </h1>
            <p className="text-zinc-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              Remplissez vos informations de livraison pour finaliser votre achat de coffrets de prestige.
            </p>
          </div>
        </section>

        {/* Checkout Area */}
        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 mt-8">
          
          <Link
            href="/panier"
            className="inline-flex items-center text-xs font-bold text-bc-purple mb-6 hover:underline"
          >
            <ArrowLeft size={14} className="mr-1.5" /> Retour au panier
          </Link>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-xs font-semibold mb-6 shadow-sm"
            >
              {error}
            </motion.div>
          )}

          {cartItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-zinc-200/50 p-8 max-w-md mx-auto shadow-sm">
              <p className="text-zinc-500 font-bold text-sm mb-4">Votre panier est actuellement vide.</p>
              <Link
                href="/catalogue"
                className="inline-flex px-5 py-3 rounded-full bg-bc-yellow hover:bg-yellow-400 text-bc-purple font-bold text-xs uppercase tracking-wider"
              >
                Voir les articles
              </Link>
            </div>
          ) : (
            <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form Details (Left) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white rounded-3xl p-5 sm:p-7 border border-zinc-200/50 shadow-sm space-y-5">
                  <h2 className="text-sm font-bold text-zinc-900 pb-3 border-b border-zinc-100 flex items-center">
                    <User className="mr-2 text-zinc-400" size={16} /> Informations de livraison
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Nom */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Nom & Prénoms *</label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Votre nom et prénom"
                        className="w-full rounded-full border border-zinc-200 bg-zinc-50/50 py-2.5 px-4 text-xs font-medium focus:bg-white focus:outline-none focus:border-bc-purple focus:ring-1 focus:ring-bc-purple transition-all"
                      />
                    </div>

                    {/* Téléphone */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Téléphone (WhatsApp) *</label>
                      <input
                        type="tel"
                        required
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="Ex: +229 90000000"
                        className="w-full rounded-full border border-zinc-200 bg-zinc-50/50 py-2.5 px-4 text-xs font-medium focus:bg-white focus:outline-none focus:border-bc-purple focus:ring-1 focus:ring-bc-purple transition-all"
                      />
                    </div>

                    {/* E-mail */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Adresse e-mail *</label>
                      <input
                        type="email"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="Votre adresse e-mail"
                        className="w-full rounded-full border border-zinc-200 bg-zinc-50/50 py-2.5 px-4 text-xs font-medium focus:bg-white focus:outline-none focus:border-bc-purple focus:ring-1 focus:ring-bc-purple transition-all"
                      />
                    </div>

                    {/* Zone de livraison */}
                    <div className="space-y-1 sm:col-span-2 relative">
                      <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Zone géographique *</label>
                      <div className="relative">
                        <select
                          required
                          value={shippingZoneId}
                          onChange={(e) => setShippingZoneId(e.target.value)}
                          className="w-full appearance-none rounded-full border border-zinc-200 bg-zinc-50/50 py-2.5 pl-4 pr-10 text-xs font-medium focus:bg-white focus:outline-none focus:border-bc-purple focus:ring-1 focus:ring-bc-purple transition-all cursor-pointer"
                        >
                          <option value="" disabled>Sélectionnez votre zone de livraison *</option>
                          {shippingZones.map((zone) => (
                            <option key={zone.id} value={zone.id}>
                              {zone.name} (+{zone.deliveryFee.toLocaleString('fr-FR')} FCFA)
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="text-zinc-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" size={14} />
                      </div>
                    </div>

                    {/* Adresse précise */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Adresse précise de livraison *</label>
                      <textarea
                        required
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="Quartier, détails de la rue, indications ou immeuble pour faciliter la livraison..."
                        className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 py-2.5 px-4 text-xs font-medium focus:bg-white focus:outline-none focus:border-bc-purple focus:ring-1 focus:ring-bc-purple transition-all h-28 resize-none"
                      />
                    </div>

                  </div>
                </div>

                {/* Payment warning */}
                <div className="bg-bc-purpleLight/40 rounded-3xl p-5 border border-bc-purple/10 space-y-2">
                  <h3 className="font-bold text-xs text-bc-purple flex items-center">
                    <CreditCard className="mr-2" size={15} /> Mode de règlement
                  </h3>
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-medium font-instrument">
                    Pour garantir un service client personnalisé, le paiement final s&apos;effectue après validation avec nos équipes. 
                    Dès confirmation de la commande, vous obtiendrez un reçu et serez redirigé(e) vers WhatsApp pour finaliser le paiement 
                    via Mobile Money (MTN MoMo, Moov) ou virement bancaire.
                  </p>
                </div>
              </div>

              {/* Recap and Order Items (Right) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-3xl p-6 shadow-sm space-y-5 border border-zinc-200/50">
                  <h2 className="text-base font-bold text-zinc-800 pb-3 border-b border-zinc-100">
                    Votre Commande
                  </h2>

                  {/* Mini item list */}
                  <div className="max-h-[260px] overflow-y-auto space-y-3.5 pr-1 divide-y divide-zinc-100">
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs gap-3 pt-3.5 first:pt-0">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-zinc-50 overflow-hidden flex-shrink-0 border border-zinc-200/50 shadow-sm">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="space-y-0.5">
                            <span className="font-semibold text-zinc-800 block line-clamp-1">{item.name}</span>
                            <span className="text-[10px] text-zinc-400 font-medium">
                              Qté : {item.quantity} × {item.price.toLocaleString('fr-FR')} FCFA
                            </span>
                            {item.customizationMessage && (
                              <span className="block text-[9px] text-bc-purple font-medium italic line-clamp-1">
                                Perso : &quot;{item.customizationMessage}&quot;
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="font-bold text-zinc-700 flex-shrink-0">
                          {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Breakdown */}
                  <div className="border-t border-zinc-100 pt-4 space-y-2.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-400 font-medium">Sous-total</span>
                      <span className="font-bold text-zinc-800">{subtotal.toLocaleString('fr-FR')} FCFA</span>
                    </div>

                    {appliedPromo && (
                      <div className="flex justify-between text-xs text-green-700 font-bold bg-green-50 border border-green-200/60 rounded-xl p-2.5">
                        <span>Code : {appliedPromo.code}</span>
                        <span>-{discountAmount.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                    )}

                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-400 font-medium">Livraison</span>
                      <span className="font-bold text-zinc-800">
                        {shippingZoneId ? `${shippingFee.toLocaleString('fr-FR')} FCFA` : 'Sélectionnez une zone'}
                      </span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t border-zinc-100 pt-4 flex justify-between items-baseline">
                    <span className="text-xs font-bold text-zinc-700">Montant Total</span>
                    <span className="text-xl font-black text-bc-purple px-3 py-1 bg-bc-yellow/10 rounded-xl">
                      {finalTotal.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>

                  {/* Verification checkbox */}
                  <label className="flex items-start gap-2.5 cursor-pointer group pt-2 select-none">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)}
                      className="mt-0.5 accent-bc-purple w-4 h-4 rounded border-zinc-350 cursor-pointer"
                    />
                    <span className="text-[10px] font-semibold text-zinc-650 leading-relaxed font-instrument">
                      Je confirme l&apos;exactitude de mes coordonnées et de l&apos;adresse de livraison saisies ci-dessus.
                    </span>
                  </label>

                  {/* Confirm Button */}
                  <div className="space-y-3 pt-1">
                    <motion.button
                      whileHover={{ y: -1 }}
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center py-3.5 px-6 rounded-full font-bold text-xs uppercase tracking-wider bg-bc-purple hover:bg-bc-purpleDark text-white transition-all shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-1.5 animate-spin" size={13} /> Enregistrement...
                        </>
                      ) : (
                        <>
                          Confirmer ma commande <Check size={14} className="ml-1.5" />
                        </>
                      )}
                    </motion.button>
                    
                    <div className="flex items-center justify-center gap-1.5 text-[9px] text-zinc-400 font-bold uppercase tracking-wider font-instrument">
                      <ShieldCheck size={13} className="text-bc-yellow" /> Sécurité & authenticité garanties
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
