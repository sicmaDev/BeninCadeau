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
  images: unknown; // JSON string or string array
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

const WHATSAPP_NUMBER = "22955250000"; // Numéro par défaut

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  // Parser les images
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
    let message = `Bonjour Bénin Cadeau, je souhaite commander le produit suivant :\n`;
    message += `- *Nom* : ${product.name}\n`;
    message += `- *Quantité* : ${quantity}\n`;
    message += `- *Prix* : ${(product.price * quantity).toLocaleString('fr-FR')} FCFA\n`;
    
    if (product.isCustomizable && customText.trim()) {
      message += `- *Personnalisation* : "${customText.trim()}"\n`;
    }
    
    message += `\nMerci de me guider pour la livraison.`;
    
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 font-instrument">
      
      {/* Galerie d'images */}
      <div className="space-y-6">
        <div className="w-full aspect-square rounded-[32px] bg-gray-50 overflow-hidden shadow-card border border-gray-100 relative group">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImage}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          {product.isCustomizable && (
            <div className="absolute top-5 left-5 bg-purple-gradient text-white text-[10px] font-montserrat font-bold tracking-widest uppercase px-4 py-1.5 rounded-full shadow-lg z-10">
              Unique & Personnalisable
            </div>
          )}
        </div>
        {imagesList.length > 1 && (
          <div className="flex gap-4 overflow-x-auto py-2 no-scrollbar">
            {imagesList.map((img, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveImage(img)}
                className={`w-20 h-20 rounded-2xl overflow-hidden border-2 bg-white flex-shrink-0 transition-all ${
                  activeImage === img ? 'border-bc-purple shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`${product.name} - ${idx}`} className="w-full h-full object-cover" />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Informations Produit */}
      <div className="flex flex-col justify-between space-y-8">
        <div className="space-y-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-bc-navy font-montserrat tracking-tight leading-tight">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4">
            <span className="text-3xl font-black text-bc-purple font-montserrat px-5 py-2 bg-bc-yellow/10 rounded-2xl border border-bc-yellow/20">
              {product.price.toLocaleString('fr-FR')} FCFA
            </span>
          </div>

          <div className="bg-gray-50/70 border border-gray-100 rounded-3xl p-6 space-y-3 shadow-inner">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 font-semibold uppercase tracking-wider text-[11px]">Délai de fabrication :</span>
              <span className="font-bold text-bc-navy flex items-center gap-1.5">
                <Sparkles size={14} className="text-bc-yellow" /> {product.estimatedDelivery}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 font-semibold uppercase tracking-wider text-[11px]">Statut :</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Disponible ({product.stock} pièces)
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-bc-navy uppercase tracking-widest font-montserrat border-b border-gray-100 pb-2 inline-block">
              Description de la création
            </h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm md:text-base text-justify font-instrument">
              {product.description}
            </p>
          </div>

          {/* Formulaire de personnalisation si disponible */}
          {product.isCustomizable && (
            <div className="bg-bc-purpleLight/40 rounded-3xl p-6 border border-bc-purple/10 space-y-3">
              <label htmlFor="custom-text" className="block text-xs font-bold text-bc-purple uppercase tracking-widest font-montserrat">
                Votre Message de Personnalisation
              </label>
              <textarea
                id="custom-text"
                rows={3}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder={product.customFieldPlaceholder || "Entrez le prénom, la date ou le message court à inscrire..."}
                className="w-full bg-white rounded-2xl border border-bc-purple/10 py-3.5 px-4 text-bc-heading focus:ring-2 focus:ring-bc-purple focus:border-bc-purple outline-none text-sm font-medium transition-all placeholder:text-gray-400"
              />
              <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                Ce texte sera soigneusement brodé, gravé ou imprimé selon la nature de l&apos;article.
              </p>
            </div>
          )}
        </div>

        {/* Quantité & Actions */}
        <div className="space-y-6 pt-8 border-t border-gray-100">
          <div className="flex items-center gap-5">
            <span className="text-xs font-bold text-bc-navy uppercase tracking-widest font-montserrat">Quantité</span>
            <div className="flex items-center bg-gray-50 rounded-2xl border border-gray-200 p-1.5 shadow-inner">
              <motion.button
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={decrementQty}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white hover:bg-gray-100 text-bc-purple shadow-sm transition-all font-bold cursor-pointer"
              >
                <Minus size={14} />
              </motion.button>
              <span className="w-12 text-center font-montserrat font-bold text-bc-navy text-base">{quantity}</span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={incrementQty}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white hover:bg-gray-100 text-bc-purple shadow-sm transition-all font-bold cursor-pointer"
              >
                <Plus size={14} />
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {addedToCart && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="glass-panel border-emerald-200 bg-emerald-50/70 text-emerald-800 rounded-2xl p-4 flex items-center justify-between text-sm font-medium"
              >
                <div className="flex items-center">
                  <Check size={18} className="mr-2.5 text-white bg-emerald-500 rounded-full p-0.5" />
                  Produit ajouté au panier !
                </div>
                <Link href="/panier" className="text-bc-purple hover:underline font-bold flex items-center gap-0.5 text-xs uppercase tracking-wider font-montserrat">
                  Voir mon panier <ChevronRight size={14} />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Ajouter au panier */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center py-4 px-6 rounded-2xl font-montserrat font-bold text-sm uppercase tracking-wider bg-gold-gradient hover:bg-yellow-500 text-bc-purpleDark transition-all shadow-yellow-glow cursor-pointer"
            >
              <ShoppingCart size={16} className="mr-2" /> Ajouter au panier
            </motion.button>

            {/* Commander via WhatsApp */}
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center py-4 px-6 rounded-2xl font-montserrat font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20ba5a] hover:to-[#0e6f63] text-white transition-all shadow-md cursor-pointer"
            >
              <MessageCircle size={16} className="mr-2" /> Commander via WhatsApp
            </motion.a>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 font-medium">
            <ShieldCheck size={14} className="text-bc-yellow" /> Transaction sécurisée & service client disponible 7j/7
          </div>
        </div>

      </div>

    </div>
  );
}

