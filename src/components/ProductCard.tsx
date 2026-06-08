interface ProductCardProps {
  imageSrc: string;
  title: string;
  price: string;
}

export function ProductCard({ imageSrc, title, price }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="h-48 w-full overflow-hidden">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6 relative">
        <h3 className="font-instrument font-bold text-xl text-black mb-2">
          {title}
        </h3>
        <p className="font-instrument text-lg text-gray-600">{price}</p>

        {/* Yellow Pill Tag */}
        <div className="absolute -top-4 left-6 bg-bc-yellow text-white font-instrument font-bold text-sm px-4 py-1 rounded-full">
          NOUVEAU
        </div>
      </div>
    </div>
  );
}
