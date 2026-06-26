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
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-2 border-bc-purple border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-600 font-semibold text-xs tracking-wider uppercase">Chargement de votre panier...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50/30">
      <Header />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-12 font-instrument">
        <div className="max-w-[1280px] mx-auto">
          
          <div className="flex items-center gap-3 mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              Mon Panier
            </h1>
            <span className="bg-bc-purpleLight text-bc-purple font-semibold text-xs px-3 py-1 rounded-full border border-bc-purple/10">
              {cartItems.length} article{cartItems.length > 1 ? 's' : ''}
            </span>
          </div>

          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-12 text-center shadow-sm border border-zinc-200/50 max-w-md mx-auto space-y-5"
            >
              <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto text-zinc-400">
                <ShoppingBag size={28} />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-xl font-bold text-zinc-850">Votre panier est vide</h2>
                <p className="text-zinc-500 text-xs leading-relaxed max-w-xs mx-auto font-instrument">
                  Vous n&apos;avez pas encore d&apos;articles dans votre panier. Explorez notre catalogue pour trouver le cadeau de prestige idéal.
                </p>
              </div>
              <Link
                href="/catalogue"
                className="inline-flex items-center px-5 py-3 rounded-full text-xs font-bold text-bc-purple bg-bc-yellow hover:bg-yellow-400 transition-colors shadow-sm cursor-pointer"
              >
                <ArrowLeft size={14} className="mr-1.5" /> Retour au catalogue
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Cart Items List */}
              <div className="lg:col-span-2 space-y-5">
                <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-zinc-200/50">
                  <div className="divide-y divide-zinc-100">
                    <AnimatePresence initial={false}>
                      {cartItems.map((item, idx) => (
                        <motion.div
                          key={`${item.productId}-${idx}`}
                          initial={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                          transition={{ duration: 0.25 }}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-5 first:pt-0 last:pb-0 gap-5"
                        >
                          {/* Product details */}
                          <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 rounded-2xl bg-zinc-50 overflow-hidden flex-shrink-0 border border-zinc-200/50 shadow-sm">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="space-y-1">
                              <Link href={`/produit/${item.slug}`} className="font-semibold text-zinc-800 hover:text-bc-purple text-sm sm:text-base block transition-colors leading-snug">
                                {item.name}
                              </Link>
                              <span className="text-xs font-bold text-bc-purple block">
                                {item.price.toLocaleString('fr-FR')} FCFA
                              </span>
                              {item.customizationMessage && (
                                <div className="bg-bc-purpleLight/40 rounded-lg px-2.5 py-1 border border-bc-purple/10 text-[10px] text-bc-purple font-medium inline-block">
                                  Perso : &quot;{item.customizationMessage}&quot;
                                </div>
                              )}
                              <span className="block text-[9px] text-zinc-400 font-medium uppercase tracking-wider flex items-center">
                                <Sparkles size={10} className="mr-1 text-bc-yellow fill-current" /> Expédié sous : {item.estimatedDelivery}
                              </span>
                            </div>
                          </div>

                          {/* Quantity & Delete actions */}
                          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-5 border-t sm:border-0 pt-3 sm:pt-0">
                            <div className="flex items-center bg-zinc-50 rounded-full border border-zinc-200/50 p-0.5">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.productId, item.customizationMessage, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-full bg-white hover:bg-zinc-50 text-zinc-600 shadow-sm transition-all"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-8 text-center font-bold text-zinc-700 text-xs">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.productId, item.customizationMessage, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-full bg-white hover:bg-zinc-50 text-zinc-600 shadow-sm transition-all"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            <div className="text-right min-w-[90px]">
                              <span className="font-bold text-zinc-800 text-sm sm:text-base block">
                                {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                              </span>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={() => removeItem(item.productId, item.customizationMessage)}
                              className="text-zinc-400 hover:text-red-500 p-2 rounded-full hover:bg-zinc-50 transition-colors cursor-pointer"
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                <Link
                  href="/catalogue"
                  className="inline-flex items-center text-xs font-bold text-bc-purple hover:underline"
                >
                  <ArrowLeft size={14} className="mr-1.5" /> Poursuivre mes achats
                </Link>
              </div>

              {/* Order Summary sidebar */}
              <div className="space-y-5">
                <div className="bg-white rounded-3xl p-6 shadow-sm space-y-5 border border-zinc-200/50">
                  <h2 className="text-lg font-bold text-zinc-800 pb-3.5 border-b border-zinc-100">
                    Récapitulatif
                  </h2>

                  <div className="space-y-3.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-400 font-medium">Sous-total</span>
                      <span className="font-bold text-zinc-800">{subtotal.toLocaleString('fr-FR')} FCFA</span>
                    </div>

                    {appliedPromo && (
                      <div className="flex justify-between text-xs text-green-700 font-bold bg-green-50 border border-green-200/60 rounded-xl p-3">
                        <span className="flex items-center">
                          <Percent size={12} className="mr-1" /> Code : {appliedPromo.code}
                          <button onClick={removePromo} className="text-red-500 hover:text-red-700 ml-2 text-[10px] font-normal">
                            (Retirer)
                          </button>
                        </span>
                        <span>-{discountAmount.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                    )}

                    <div className="text-[10px] text-zinc-400 leading-relaxed italic font-instrument">
                      * Les frais de livraison seront calculés à l&apos;étape suivante en fonction de votre zone géographique.
                    </div>
                  </div>

                  <div className="border-t border-zinc-100 pt-4 flex justify-between items-baseline">
                    <span className="text-xs font-bold text-zinc-700">Total estimé</span>
                    <span className="text-xl font-black text-bc-purple px-3 py-1 bg-bc-yellow/10 rounded-xl">
                      {finalTotal.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>

                  {/* Promo Code Form */}
                  <form onSubmit={handleApplyPromo} className="pt-4 border-t border-zinc-100 space-y-2">
                    <label htmlFor="promo" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      Code Privilège
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                          <Tag size={13} />
                        </span>
                        <input
                          type="text"
                          id="promo"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Code promo"
                          disabled={!!appliedPromo || validatingPromo}
                          className="pl-9 pr-3 block w-full rounded-full border border-zinc-200 bg-zinc-50/50 py-2.5 px-3 text-zinc-800 focus:outline-none focus:border-bc-purple text-xs disabled:opacity-60 font-medium transition-all"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!!appliedPromo || validatingPromo || !promoCode.trim()}
                        className="px-4.5 py-2.5 rounded-full bg-bc-purple hover:bg-bc-purpleDark text-white text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                      >
                        {validatingPromo ? '...' : 'Appliquer'}
                      </button>
                    </div>
                    {promoError && <p className="text-[11px] text-red-600 font-semibold">{promoError}</p>}
                    {promoSuccess && <p className="text-[11px] text-green-600 font-semibold">{promoSuccess}</p>}
                  </form>

                  <div className="space-y-3 pt-1">
                    <motion.button
                      whileHover={{ y: -1 }}
                      onClick={() => router.push('/commander')}
                      className="w-full flex items-center justify-center py-3.5 px-6 rounded-full font-bold text-xs uppercase tracking-wider bg-bc-purple hover:bg-bc-purpleDark text-white transition-all shadow-sm cursor-pointer"
                    >
                      Passer la commande <ArrowRight size={14} className="ml-1.5" />
                    </motion.button>
                    
                    <div className="flex items-center justify-center gap-1.5 text-[9px] text-zinc-400 font-bold uppercase tracking-wider font-instrument">
                      <ShieldCheck size={13} className="text-bc-yellow" /> Commande 100% Sécurisée
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
