"use client";

import React, { useState } from 'react';
import { ShoppingCart, MessageCircle, Plus, Minus, Check, ChevronRight, Sparkles, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  estimatedDelivery: string;
  images: unknown; 
  isCustomizable: boolean;
  customFieldPlaceholder: string | null;
}

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

interface ProductDetailClientProps {
  product: Product;
}

const WHATSAPP_NUMBER = "22955250000"; 

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  let imagesList: string[] = [];
  try {
    imagesList = typeof product.images === 'string'
      ? JSON.parse(product.images)
      : (product.images as string[]);
  } catch {
    imagesList = ['/1-19.png'];
  }

  const [activeImage, setActiveImage] = useState(imagesList[0] || '/1-19.png');
  const [quantity, setQuantity] = useState(1);
  const [customText, setCustomText] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);

  const incrementQty = () => setQuantity(prev => prev + 1);
  const decrementQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: imagesList[0] || '/1-19.png',
      quantity: quantity,
      customizationMessage: product.isCustomizable ? customText : null,
      estimatedDelivery: product.estimatedDelivery,
    };

    try {
      const existingCart = localStorage.getItem('bc_cart');
      const cart: CartItem[] = existingCart ? JSON.parse(existingCart) : [];

      const existingIndex = cart.findIndex((item: CartItem) => 
        item.productId === cartItem.productId && 
        item.customizationMessage === cartItem.customizationMessage
      );

      if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
      } else {
        cart.push(cartItem);
      }

      localStorage.setItem('bc_cart', JSON.stringify(cart));
      setAddedToCart(true);
      
      window.dispatchEvent(new Event('cart-updated'));

      setTimeout(() => {
        setAddedToCart(false);
      }, 5000);
    } catch {
      console.error('Failed to add to cart');
    }
  };

  const getWhatsAppLink = () => {
    const pageUrl = typeof window !== 'undefined' ? window.location.href : `https://benincadeau.com/produit/${product.slug}`;
    let message = `Bonjour Bénin Cadeau, je souhaite commander le produit suivant :\n`;
    message += `- *Nom* : ${product.name}\n`;
    message += `- *Quantité* : ${quantity}\n`;
    message += `- *Prix* : ${(product.price * quantity).toLocaleString('fr-FR')} FCFA\n`;
    
    if (product.isCustomizable && customText.trim()) {
      message += `- *Personnalisation* : "${customText.trim()}"\n`;
    }
    
    message += `- *Lien* : ${pageUrl}\n`;
    message += `\nMerci de me guider pour la livraison.`;
    
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 font-instrument">
      
      {/* Galerie d'images */}
      <div className="space-y-5">
        <div className="w-full aspect-square rounded-[32px] bg-zinc-50 overflow-hidden shadow-sm border border-zinc-200/50 relative group">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImage}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          {product.isCustomizable && (
            <div className="absolute top-5 left-5 bg-purple-gradient text-white text-[9px] font-bold tracking-wider uppercase px-4 py-1.5 rounded-full shadow-md z-10">
              Personnalisable
            </div>
          )}
        </div>
        {imagesList.length > 1 && (
          <div className="flex gap-3 overflow-x-auto py-1 no-scrollbar">
            {imagesList.map((img, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveImage(img)}
                className={`w-16 h-16 rounded-2xl overflow-hidden border-2 bg-white flex-shrink-0 transition-all ${
                  activeImage === img ? 'border-bc-purple shadow-sm' : 'border-zinc-200/60 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`${product.name} - ${idx}`} className="w-full h-full object-cover" />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Informations Produit */}
      <div className="flex flex-col justify-between space-y-6">
        <div className="space-y-5">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight leading-snug">
            {product.name}
          </h1>
          
          <div className="flex items-center">
            <span className="text-2xl font-black text-bc-purple">
              {product.price.toLocaleString('fr-FR')} <span className="text-sm font-bold">FCFA</span>
            </span>
          </div>

          <div className="bg-zinc-50 border border-zinc-200/50 rounded-2xl p-5 space-y-2.5">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">Délai d&apos;expédition :</span>
              <span className="font-bold text-zinc-800 flex items-center gap-1">
                <Sparkles size={13} className="text-bc-yellow" /> {product.estimatedDelivery}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">Disponibilité :</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> En Stock ({product.stock} pièces)
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-1.5 inline-block">
              Description de la création
            </h3>
            <p className="text-zinc-600 leading-relaxed text-xs sm:text-sm text-justify font-instrument">
              {product.description}
            </p>
          </div>

          {/* Formulaire de personnalisation si disponible */}
          {product.isCustomizable && (
            <div className="bg-bc-purpleLight/40 rounded-2xl p-5 border border-bc-purple/10 space-y-2.5">
              <label htmlFor="custom-text" className="block text-[11px] font-bold text-bc-purple uppercase tracking-widest">
                Votre Message de Personnalisation
              </label>
              <textarea
                id="custom-text"
                rows={3}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder={product.customFieldPlaceholder || "Ex: Nom, Prénom, Date, ou texte particulier à inscrire..."}
                className="w-full bg-white rounded-xl border border-zinc-200 py-3 px-4 text-zinc-800 focus:outline-none focus:border-bc-purple focus:ring-1 focus:ring-bc-purple text-xs font-medium transition-all placeholder:text-zinc-400"
              />
              <p className="text-[10px] text-zinc-500 font-medium leading-relaxed font-instrument">
                Ce texte sera soigneusement brodé, gravé ou imprimé selon la nature de l&apos;article.
              </p>
            </div>
          )}
        </div>

        {/* Quantité & Actions */}
        <div className="space-y-5 pt-6 border-t border-zinc-100">
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Quantité</span>
            <div className="flex items-center bg-zinc-100 rounded-full border border-zinc-200/50 p-1">
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={decrementQty}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-zinc-600 shadow-sm transition-all font-bold cursor-pointer"
              >
                <Minus size={12} />
              </motion.button>
              <span className="w-10 text-center font-bold text-zinc-800 text-sm">{quantity}</span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={incrementQty}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-zinc-600 shadow-sm transition-all font-bold cursor-pointer"
              >
                <Plus size={12} />
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {addedToCart && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="bg-emerald-50 border border-emerald-200/50 text-emerald-800 rounded-xl p-3.5 flex items-center justify-between text-xs font-semibold"
              >
                <div className="flex items-center">
                  <Check size={14} className="mr-2 text-white bg-emerald-500 rounded-full p-0.5" />
                  Produit ajouté au panier !
                </div>
                <Link href="/panier" className="text-bc-purple hover:underline font-bold flex items-center gap-0.5">
                  Voir mon panier <ChevronRight size={12} />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Ajouter au panier */}
            <motion.button
              whileHover={{ y: -1 }}
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center py-3.5 px-6 rounded-full font-semibold text-xs uppercase tracking-wider bg-bc-purple hover:bg-bc-purpleDark text-white transition-all shadow-sm cursor-pointer"
            >
              <ShoppingCart size={14} className="mr-2" /> Ajouter au panier
            </motion.button>

            {/* Commander via WhatsApp */}
            <motion.a
              whileHover={{ y: -1 }}
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center py-3.5 px-6 rounded-full font-semibold text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm cursor-pointer"
            >
              <MessageCircle size={14} className="mr-2" /> Commander via WhatsApp
            </motion.a>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-400 font-medium font-instrument">
            <ShieldCheck size={13} className="text-bc-yellow" /> Transaction sécurisée & service client disponible 7j/7
          </div>
        </div>

      </div>

    </div>
  );
}
