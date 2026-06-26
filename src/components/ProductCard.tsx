"use client";

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Category {
  name: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  description: string;
  estimatedDelivery?: string;
  images: unknown;
  isCustomizable: boolean;
  category: Category;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  let imagesList: string[] = [];
  try {
    imagesList = typeof product.images === 'string'
      ? JSON.parse(product.images)
      : (product.images as string[]);
  } catch {
    imagesList = ['/1-19.png'];
  }

  const primaryImage = imagesList[0] || '/1-19.png';

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-zinc-200/50 shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="relative overflow-hidden aspect-[4/3] bg-zinc-50">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.isCustomizable && (
            <div className="absolute top-3.5 left-3.5 bg-purple-gradient text-white text-[9px] font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-sm z-10">
              Personnalisable
            </div>
          )}
        </div>
        <div className="p-5 space-y-2.5">
          <span className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase block">
            {product.category.name}
          </span>
          <h3 className="font-bold text-sm text-zinc-800 line-clamp-1 leading-snug group-hover:text-bc-purple transition-colors">
            {product.name}
          </h3>
          {product.estimatedDelivery && (
            <p className="text-[10px] text-zinc-400 font-medium flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
              Fabrication : {product.estimatedDelivery}
            </p>
          )}
          <p className="text-zinc-500 text-xs line-clamp-2 leading-relaxed font-instrument">
            {product.description}
          </p>
        </div>
      </div>
      
      <div className="p-5 pt-0 border-t border-zinc-100/60 flex items-center justify-between mt-auto">
        <div className="text-bc-purple font-black text-sm">
          {product.price.toLocaleString('fr-FR')} <span className="text-[10px] font-bold">FCFA</span>
        </div>
        <Link
          href={`/produit/${product.slug}`}
          className="inline-flex items-center px-4 py-2 rounded-xl text-[11px] font-bold text-bc-purple bg-bc-yellow hover:bg-yellow-400 transition-colors shadow-sm cursor-pointer"
        >
          Détails <ChevronRight size={11} className="ml-1" />
        </Link>
      </div>
    </div>
  );
}
