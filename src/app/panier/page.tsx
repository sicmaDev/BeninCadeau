"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, ArrowLeft, Percent, Sparkles, ShieldCheck } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CopyrightRow } from '@/components/CopyrightRow';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    type: 'FIXED' | 'PERCENTAGE';
    value: number;
  } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [validatingPromo, setValidatingPromo] = useState(false);

  // Load cart on mount
  useEffect(() => {
    loadCart();
    const handleCartUpdate = () => loadCart();
    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);

  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem('bc_cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      } else {
        setCartItems([]);
      }
    } catch (e) {
      console.error('Failed to load cart', e);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (productId: number, customizationMessage: string | null, newQty: number) => {
    if (newQty < 1) return;
    const updated = cartItems.map(item => {
      if (item.productId === productId && item.customizationMessage === customizationMessage) {
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem('bc_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const removeItem = (productId: number, customizationMessage: string | null) => {
    const updated = cartItems.filter(
      item => !(item.productId === productId && item.customizationMessage === customizationMessage)
    );
    setCartItems(updated);
    localStorage.setItem('bc_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    setPromoError('');
    setPromoSuccess('');
    setValidatingPromo(true);

    try {
      const res = await fetch('/api/promocodes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setAppliedPromo({
          code: data.code,
          type: data.discountType,
          value: data.discountValue,
        });
        localStorage.setItem('bc_applied_promo', JSON.stringify({
          code: data.code,
          type: data.discountType,
          value: data.discountValue,
        }));
        setPromoSuccess(`Code promo "${data.code}" appliqué avec succès !`);
      } else {
        setPromoError(data.error || 'Code promo invalide');
        setAppliedPromo(null);
        localStorage.removeItem('bc_applied_promo');
      }
    } catch (err) {
      setPromoError('Erreur de validation du code promo.');
      setAppliedPromo(null);
      localStorage.removeItem('bc_applied_promo');
    } finally {
      setValidatingPromo(false);
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoSuccess('');
    setPromoError('');
    localStorage.removeItem('bc_applied_promo');
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

  const finalTotal = Math.max(0, subtotal - discountAmount);

  if (loading) {
    return (
      <div className="min-h-screen bg-bc-bg flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-bc-yellow border-t-bc-purple rounded-full animate-spin"></div>
          <p className="text-bc-heading font-montserrat font-bold text-sm tracking-wider uppercase">Chargement de votre panier...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bc-bg">
      <Header />
      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8 font-instrument">
        <div className="max-w-[1200px] mx-auto">
          
          <div className="flex items-center gap-3 mb-10">
            <h1 className="text-3xl font-extrabold text-bc-purple font-montserrat tracking-tight">
              Mon Panier
            </h1>
            <span className="bg-bc-purple/10 text-bc-purple font-montserrat font-bold text-xs px-3 py-1 rounded-full border border-bc-purple/20">
              {cartItems.length} article{cartItems.length > 1 ? 's' : ''}
            </span>
          </div>

          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[32px] p-12 text-center shadow-card border border-gray-100 max-w-lg mx-auto space-y-6"
            >
              <div className="w-20 h-20 bg-bc-purple/10 rounded-full flex items-center justify-center mx-auto text-bc-purple">
                <ShoppingBag size={40} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-bc-navy font-montserrat">Votre panier est vide</h2>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto font-instrument">
                  Vous n&apos;avez pas encore d&apos;articles dans votre panier. Explorez notre catalogue pour trouver le cadeau de prestige idéal.
                </p>
              </div>
              <Link
                href="/catalogue"
                className="inline-flex items-center px-6 py-3.5 rounded-2xl font-montserrat font-bold text-xs uppercase tracking-wider text-bc-purple bg-bc-yellow hover:bg-yellow-400 transition-colors shadow-yellow-glow cursor-pointer"
              >
                <ArrowLeft size={16} className="mr-2" /> Retour au catalogue
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
              
              {/* Cart Items List */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-card border border-gray-100/60">
                  <div className="divide-y divide-gray-100">
                    <AnimatePresence initial={false}>
                      {cartItems.map((item, idx) => (
                        <motion.div
                          key={`${item.productId}-${idx}`}
                          initial={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-6 first:pt-0 last:pb-0 gap-6"
                        >
                          {/* Product details */}
                          <div className="flex items-center space-x-5">
                            <div className="w-24 h-24 rounded-2xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Link href={`/produit/${item.slug}`} className="font-montserrat font-bold text-bc-navy hover:text-bc-purple text-base sm:text-lg block transition-colors leading-snug">
                                {item.name}
                              </Link>
                              <span className="text-sm font-extrabold text-bc-purple block">
                                {item.price.toLocaleString('fr-FR')} FCFA
                              </span>
                              {item.customizationMessage && (
                                <div className="bg-bc-purpleLight/40 rounded-xl px-3.5 py-1.5 border border-bc-purple/10 text-xs text-bc-purple font-medium inline-block">
                                  Perso : &quot;{item.customizationMessage}&quot;
                                </div>
                              )}
                              <span className="block text-[10px] text-gray-400 font-semibold uppercase tracking-wider flex items-center">
                                <Sparkles size={11} className="mr-1 text-bc-yellow" /> Fabrication : {item.estimatedDelivery}
                              </span>
                            </div>
                          </div>

                          {/* Quantity & Delete actions */}
                          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 border-t sm:border-0 pt-4 sm:pt-0">
                            <div className="flex items-center bg-gray-50 rounded-2xl border border-gray-200 p-1 shadow-inner">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.productId, item.customizationMessage, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white hover:bg-gray-100 text-bc-purple shadow-sm transition-all"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-10 text-center font-montserrat font-bold text-bc-navy text-sm">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.productId, item.customizationMessage, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white hover:bg-gray-100 text-bc-purple shadow-sm transition-all"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            <div className="text-right min-w-[100px]">
                              <span className="font-montserrat font-black text-bc-navy text-sm sm:text-base block">
                                {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                              </span>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={() => removeItem(item.productId, item.customizationMessage)}
                              className="text-red-500 hover:text-red-700 p-2.5 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <Trash2 size={18} />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                <Link
                  href="/catalogue"
                  className="inline-flex items-center text-sm font-bold text-bc-purple hover:underline"
                >
                  <ArrowLeft size={16} className="mr-2" /> Poursuivre mes achats
                </Link>
              </div>

              {/* Order Summary sidebar */}
              <div className="space-y-6">
                <div className="glass-panel rounded-[32px] p-6 sm:p-8 shadow-premium space-y-6 border border-white/40">
                  <h2 className="text-xl font-bold text-bc-navy font-montserrat pb-4 border-b border-gray-100">
                    Récapitulatif
                  </h2>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Sous-total</span>
                      <span className="font-bold text-bc-navy">{subtotal.toLocaleString('fr-FR')} FCFA</span>
                    </div>

                    {appliedPromo && (
                      <div className="flex justify-between text-sm text-green-600 font-bold bg-green-50/70 border border-green-100 rounded-xl p-3.5">
                        <span className="flex items-center">
                          <Percent size={14} className="mr-1.5" /> Code : {appliedPromo.code}
                          <button onClick={removePromo} className="text-red-500 hover:text-red-700 ml-2.5 text-xs font-normal">
                            (Retirer)
                          </button>
                        </span>
                        <span>-{discountAmount.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                    )}

                    <div className="text-[11px] text-gray-400 leading-relaxed italic">
                      * Les frais de livraison seront calculés à l&apos;étape suivante en fonction de votre zone géographique.
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-5 flex justify-between items-baseline">
                    <span className="text-base font-bold text-bc-navy">Total estimé</span>
                    <span className="text-2xl font-black text-bc-purple font-montserrat px-4 py-1.5 bg-bc-yellow/10 rounded-2xl">
                      {finalTotal.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>

                  {/* Promo Code Form */}
                  <form onSubmit={handleApplyPromo} className="pt-5 border-t border-gray-100 space-y-3">
                    <label htmlFor="promo" className="block text-[10px] font-bold text-bc-navy uppercase tracking-widest font-montserrat">
                      Code Privilège
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                          <Tag size={15} />
                        </span>
                        <input
                          type="text"
                          id="promo"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Code promo"
                          disabled={!!appliedPromo || validatingPromo}
                          className="pl-10 block w-full rounded-xl border border-gray-200 bg-white/80 py-2.5 px-3 text-bc-heading focus:ring-bc-purple focus:border-bc-purple outline-none text-sm disabled:opacity-60 font-medium transition-all"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!!appliedPromo || validatingPromo || !promoCode.trim()}
                        className="px-4 py-2.5 rounded-xl bg-bc-purple hover:bg-bc-purpleDark text-white text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                      >
                        {validatingPromo ? '...' : 'Appliquer'}
                      </button>
                    </div>
                    {promoError && <p className="text-xs text-red-600 font-semibold">{promoError}</p>}
                    {promoSuccess && <p className="text-xs text-green-600 font-semibold">{promoSuccess}</p>}
                  </form>

                  <div className="space-y-4 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push('/commander')}
                      className="w-full flex items-center justify-center py-4 px-6 rounded-2xl font-montserrat font-bold text-sm uppercase tracking-wider bg-gold-gradient hover:bg-yellow-500 text-bc-purpleDark transition-all shadow-yellow-glow cursor-pointer"
                    >
                      Passer la commande <ArrowRight size={18} className="ml-2" />
                    </motion.button>
                    
                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                      <ShieldCheck size={14} className="text-bc-yellow" /> Commande 100% Sécurisée
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
      <CopyrightRow />
      <Footer />
    </div>
  );
}

