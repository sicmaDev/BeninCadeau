"use client";

import React, { useState } from 'react';
import { ShoppingCart, MessageCircle, Plus, Minus, Check, ChevronRight } from 'lucide-react';
import Link from 'next/link';

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

const WHATSAPP_NUMBER = "22955250000"; // Numéro par défaut, modifiable dans le code

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

  // Ajouter au panier local (localStorage)
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

      // Vérifier si le produit existe déjà avec la même personnalisation
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
      
      // Dispatch d'un événement custom pour notifier le header s'il écoute le panier
      window.dispatchEvent(new Event('cart-updated'));

      setTimeout(() => {
        setAddedToCart(false);
      }, 5000);
    } catch {
      console.error('Failed to add to cart');
    }
  };

  // WhatsApp Message Generator
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 font-instrument">
      
      {/* Galerie d'images */}
      <div className="space-y-4">
        <div className="w-full aspect-square rounded-3xl bg-white overflow-hidden shadow-sm border border-gray-100 relative">
          <img
            src={activeImage}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-300"
          />
        </div>
        {imagesList.length > 1 && (
          <div className="flex gap-4 overflow-x-auto py-2">
            {imagesList.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-white flex-shrink-0 transition-all ${
                  activeImage === img ? 'border-bc-purple shadow-sm scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`${product.name} - ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Informations Produit */}
      <div className="flex flex-col justify-between space-y-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-bc-navy font-montserrat tracking-tight leading-tight">
            {product.name}
          </h1>
          
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-black text-bc-purple font-montserrat">
              {product.price.toLocaleString('fr-FR')} FCFA
            </span>
          </div>

          <div className="mt-6 border-t border-b border-gray-100 py-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 font-medium">Livraison estimée :</span>
              <span className="font-semibold text-bc-navy">{product.estimatedDelivery}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 font-medium">Disponibilité :</span>
              <span className="font-semibold text-green-600">En stock ({product.stock} unités)</span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-bold text-bc-navy uppercase tracking-wider mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
              {product.description}
            </p>
          </div>

          {/* Formulaire de personnalisation si disponible */}
          {product.isCustomizable && (
            <div className="mt-6 bg-purple-50 rounded-2xl p-5 border border-purple-100">
              <label htmlFor="custom-text" className="block text-sm font-bold text-bc-purple uppercase tracking-wider mb-2">
                Texte de personnalisation
              </label>
              <textarea
                id="custom-text"
                rows={3}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder={product.customFieldPlaceholder || "Entrez votre message ici..."}
                className="w-full bg-white rounded-xl border border-purple-200 py-3 px-4 text-bc-heading focus:ring-bc-purple focus:border-bc-purple outline-none text-sm"
              />
              <p className="text-[11px] text-gray-500 mt-2">
                Ce texte sera gravé, imprimé ou brodé sur votre cadeau selon le type de produit.
              </p>
            </div>
          )}
        </div>

        {/* Quantité & Actions */}
        <div className="space-y-4 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-bc-navy uppercase tracking-wider">Quantité</span>
            <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 p-1">
              <button
                type="button"
                onClick={decrementQty}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white text-bc-purple transition-all font-bold"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center font-bold text-bc-navy text-lg">{quantity}</span>
              <button
                type="button"
                onClick={incrementQty}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white text-bc-purple transition-all font-bold"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {addedToCart && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 flex items-center justify-between text-sm font-medium animate-fadeIn">
              <div className="flex items-center">
                <Check size={18} className="mr-2 text-green-600 bg-green-100 rounded-full p-0.5" />
                Produit ajouté au panier !
              </div>
              <Link href="/panier" className="text-bc-purple hover:underline font-bold flex items-center gap-0.5">
                Voir mon panier <ChevronRight size={14} />
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Ajouter au panier */}
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center py-4 px-6 rounded-2xl font-bold bg-bc-yellow hover:bg-yellow-400 text-bc-purple transition-colors shadow-sm cursor-pointer"
            >
              <ShoppingCart size={18} className="mr-2" /> Ajouter au panier
            </button>

            {/* Commander via WhatsApp */}
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center py-4 px-6 rounded-2xl font-bold bg-[#25D366] hover:bg-[#20ba5a] text-white transition-colors shadow-sm cursor-pointer"
            >
              <MessageCircle size={18} className="mr-2" /> Commander via WhatsApp
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
