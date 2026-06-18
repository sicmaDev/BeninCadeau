interface ProductCardProps {
  imageSrc: string;
  title: string;
  price: string;
}

export function ProductCard({ imageSrc, title, price }: ProductCardProps) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-card hover:shadow-premium hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
      <div className="relative overflow-hidden aspect-[4/3] bg-gray-50">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Luxury Gold Pill Tag */}
        <div className="absolute top-4 left-4 bg-gold-gradient text-bc-purpleDark font-montserrat font-bold text-[10px] tracking-wider uppercase px-3.5 py-1 rounded-full shadow-md z-10">
          Nouveau
        </div>
      </div>
      <div className="p-6 relative flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-montserrat font-bold text-base text-bc-navy mb-2 line-clamp-1 leading-snug group-hover:text-bc-purple transition-colors">
            {title}
          </h3>
          <p className="font-instrument text-sm text-gray-500 leading-relaxed line-clamp-2">
            Un cadeau d&apos;exception pour marquer les mémoires.
          </p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="font-montserrat font-black text-bc-purple text-base">
            {price}
          </span>
          <span className="text-xs font-bold text-bc-yellow group-hover:text-bc-purple transition-colors flex items-center gap-1">
            Découvrir &rarr;
          </span>
        </div>
      </div>
    </div>
  );
}

