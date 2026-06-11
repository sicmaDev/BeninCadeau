import Link from 'next/link';
import { prisma } from '../../utils/db';
import { Search, ChevronRight, PackageOpen } from 'lucide-react';
import { Prisma } from '@prisma/client';

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    page?: string;
  }>;
}

export const dynamic = 'force-dynamic';

export default async function CatalogPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || '';
  const categorySlug = resolvedParams.category || '';
  const currentPage = parseInt(resolvedParams.page || '1', 10);
  const itemsPerPage = 20;

  // Récupérer toutes les catégories actives
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { displayOrder: 'asc' },
  });

  // Construire la condition de filtre Prisma
  const whereCondition: Prisma.ProductWhereInput = {
    active: true,
  };

  if (categorySlug) {
    whereCondition.category = {
      slug: categorySlug,
    };
  }

  if (q) {
    whereCondition.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
    ];
  }

  // Compter le total d'articles pour la pagination
  const totalProducts = await prisma.product.count({
    where: whereCondition,
  });

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  // Récupérer les produits paginés
  const products = await prisma.product.findMany({
    where: whereCondition,
    skip: (currentPage - 1) * itemsPerPage,
    take: itemsPerPage,
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
    },
  });

  return (
    <div className="min-h-screen bg-bc-bg py-12 px-4 sm:px-6 lg:px-8 font-instrument">
      <div className="max-w-[1440px] mx-auto">
        
        {/* En-tête */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-bc-purple font-montserrat tracking-tight">
            Notre Catalogue de Cadeaux
          </h1>
          <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
            Explorez notre sélection de packs exclusifs, paniers de ravitaillement et cadeaux personnalisables pour gâter vos proches au Bénin.
          </p>
        </div>

        {/* Barre de recherche et filtres horizontaux */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 mb-8">
          <form method="GET" action="/catalogue" className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Champ de recherche */}
            <div className="relative w-full md:max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Search size={20} />
              </span>
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Rechercher un produit..."
                className="pl-10 block w-full rounded-xl border border-gray-300 py-3 px-4 text-bc-heading focus:ring-2 focus:ring-bc-purple focus:border-bc-purple outline-none"
              />
              {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
            </div>

            {/* Catégories de filtrage */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <Link
                href={{
                  pathname: '/catalogue',
                  query: q ? { q } : {},
                }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all whitespace-nowrap ${
                  !categorySlug
                    ? 'bg-bc-purple text-white border-bc-purple'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                Tout
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={{
                    pathname: '/catalogue',
                    query: {
                      ...(q ? { q } : {}),
                      category: cat.slug,
                    },
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all whitespace-nowrap ${
                    categorySlug === cat.slug
                      ? 'bg-bc-purple text-white border-bc-purple'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </form>
        </div>

        {/* Grille de produits */}
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <PackageOpen size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-bc-purple font-montserrat">Aucun produit trouvé</h3>
            <p className="text-gray-500 mt-2">
              Essayez de modifier vos critères de recherche ou de changer de catégorie.
            </p>
            <Link
              href="/catalogue"
              className="mt-6 inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-bold text-bc-purple bg-bc-yellow hover:bg-yellow-400 transition-colors shadow-sm"
            >
              Réinitialiser les filtres
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => {
                let images: string[] = [];
                try {
                  images = typeof product.images === 'string'
                    ? JSON.parse(product.images)
                    : (product.images as unknown as string[]);
                } catch {
                  images = ['/1-19.png'];
                }

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-card hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col justify-between"
                  >
                    <div>
                      {/* Image du produit */}
                      <div className="h-56 w-full overflow-hidden bg-gray-50 relative group">
                        <img
                          src={images[0] || '/1-19.png'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {product.isCustomizable && (
                          <div className="absolute top-3 left-3 bg-bc-purple text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
                            Personnalisable
                          </div>
                        )}
                      </div>

                      {/* Infos Produit */}
                      <div className="p-5">
                        <span className="text-xs font-semibold text-bc-yellow tracking-wide uppercase">
                          {product.category.name}
                        </span>
                        <h3 className="font-montserrat font-bold text-lg text-bc-navy mt-1 line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-gray-400 text-xs mt-1">
                          Livraison estimée : {product.estimatedDelivery}
                        </p>
                        <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer / Bouton */}
                    <div className="p-5 pt-0 border-t border-gray-50 flex items-center justify-between mt-auto">
                      <div className="text-bc-purple font-montserrat font-bold text-lg">
                        {product.price.toLocaleString('fr-FR')} <span className="text-sm">FCFA</span>
                      </div>
                      <Link
                        href={`/produit/${product.slug}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl text-xs font-bold text-bc-purple bg-bc-yellow hover:bg-yellow-400 transition-colors shadow-sm cursor-pointer"
                      >
                        Voir détails <ChevronRight size={14} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const isActive = currentPage === pageNum;
                  return (
                    <Link
                      key={pageNum}
                      href={{
                        pathname: '/catalogue',
                        query: {
                          ...(q ? { q } : {}),
                          ...(categorySlug ? { category: categorySlug } : {}),
                          page: pageNum,
                        },
                      }}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border transition-all ${
                        isActive
                          ? 'bg-bc-purple text-white border-bc-purple shadow-sm'
                          : 'bg-white text-bc-heading border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
