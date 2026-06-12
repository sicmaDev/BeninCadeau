"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, ArrowLeft, Percent } from 'lucide-react';
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
    // Listen for storage changes
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
        // Store applied promo code in session or local storage for checkout page
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
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-bc-yellow border-t-bc-purple rounded-full animate-spin"></div>
          <p className="mt-4 text-bc-heading font-medium">Chargement de votre panier...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bc-bg">
      <Header />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 font-instrument">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-3xl font-extrabold text-bc-purple font-montserrat tracking-tight mb-8">
            Mon Panier
          </h1>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-card border border-gray-100 max-w-lg mx-auto">
              <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
              <h2 className="text-2xl font-bold text-bc-navy font-montserrat mb-3">Votre panier est vide</h2>
              <p className="text-gray-500 mb-8">
                Vous n&apos;avez encore aucun article dans votre panier. Parcourez notre catalogue pour trouver le cadeau idéal.
              </p>
              <Link
                href="/catalogue"
                className="inline-flex items-center px-6 py-3 rounded-2xl font-bold text-bc-purple bg-bc-yellow hover:bg-yellow-400 transition-colors shadow-sm cursor-pointer"
              >
                <ArrowLeft size={18} className="mr-2" /> Retour au catalogue
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Cart Items List */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-gray-100 space-y-6">
                  {cartItems.map((item, idx) => (
                    <div
                      key={`${item.productId}-${idx}`}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-100 last:border-0 last:pb-0 gap-4"
                    >
                      {/* Product details */}
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 rounded-2xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <Link href={`/produit/${item.slug}`} className="font-montserrat font-bold text-bc-navy hover:text-bc-purple text-base sm:text-lg block transition-colors">
                            {item.name}
                          </Link>
                          <span className="text-sm font-semibold text-bc-purple block mt-0.5">
                            {item.price.toLocaleString('fr-FR')} FCFA
                          </span>
                          {item.customizationMessage && (
                            <div className="mt-1 bg-purple-50 rounded-lg px-3 py-1 border border-purple-100 text-xs text-bc-purple font-medium inline-block">
                              Perso : &quot;{item.customizationMessage}&quot;
                            </div>
                          )}
                          <span className="block text-[11px] text-gray-400 mt-1">
                            Livraison estimée : {item.estimatedDelivery}
                          </span>
                        </div>
                      </div>

                      {/* Quantity & Delete actions */}
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                        <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 p-0.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.customizationMessage, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-bc-purple transition-all"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-bold text-bc-navy text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.customizationMessage, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-bc-purple transition-all"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <div className="text-right min-w-[90px]">
                          <span className="font-montserrat font-bold text-bc-navy text-sm sm:text-base block">
                            {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.productId, item.customizationMessage)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/catalogue"
                  className="inline-flex items-center text-sm font-semibold text-bc-purple hover:underline"
                >
                  <ArrowLeft size={16} className="mr-2" /> Poursuivre mes achats
                </Link>
              </div>

              {/* Order Summary sidebar */}
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-gray-100 space-y-6">
                  <h2 className="text-xl font-bold text-bc-navy font-montserrat pb-4 border-b border-gray-100">
                    Récapitulatif
                  </h2>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Sous-total</span>
                      <span className="font-semibold text-bc-navy">{subtotal.toLocaleString('fr-FR')} FCFA</span>
                    </div>

                    {appliedPromo && (
                      <div className="flex justify-between text-sm text-green-600 font-medium">
                        <span className="flex items-center">
                          <Percent size={14} className="mr-1" /> Code ({appliedPromo.code})
                          <button onClick={removePromo} className="text-red-500 hover:text-red-700 ml-1.5 text-xs font-normal">
                            (Retirer)
                          </button>
                        </span>
                        <span>-{discountAmount.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                    )}

                    <div className="text-xs text-gray-400 italic pt-1">
                      * Les frais de livraison seront calculés à l&apos;étape suivante selon votre quartier.
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 flex justify-between items-baseline">
                    <span className="text-base font-bold text-bc-navy">Total estimé</span>
                    <span className="text-2xl font-black text-bc-purple font-montserrat">
                      {finalTotal.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>

                  {/* Promo Code Form */}
                  <form onSubmit={handleApplyPromo} className="pt-4 border-t border-gray-100 space-y-3">
                    <label htmlFor="promo" className="block text-xs font-bold text-bc-navy uppercase tracking-wider">
                      Code Promo
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                          <Tag size={16} />
                        </span>
                        <input
                          type="text"
                          id="promo"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Code promo"
                          disabled={!!appliedPromo || validatingPromo}
                          className="pl-9 block w-full rounded-xl border border-gray-300 py-2.5 px-3 text-bc-heading focus:ring-bc-purple focus:border-bc-purple outline-none text-sm disabled:opacity-60"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!!appliedPromo || validatingPromo || !promoCode.trim()}
                        className="px-4 py-2.5 rounded-xl bg-bc-purple hover:bg-bc-purpleDark text-white text-sm font-bold transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {validatingPromo ? '...' : 'Appliquer'}
                      </button>
                    </div>
                    {promoError && <p className="text-xs text-red-600 font-medium">{promoError}</p>}
                    {promoSuccess && <p className="text-xs text-green-600 font-medium">{promoSuccess}</p>}
                  </form>

                  <button
                    onClick={() => router.push('/commander')}
                    className="w-full flex items-center justify-center py-4 px-6 rounded-2xl font-bold bg-bc-yellow hover:bg-yellow-400 text-bc-purple transition-colors shadow-sm cursor-pointer"
                  >
                    Passer la commande <ArrowRight size={18} className="ml-2" />
                  </button>
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
