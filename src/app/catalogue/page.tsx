import Link from 'next/link';
import { prisma } from '../../utils/db';
import { Search, ChevronRight, PackageOpen } from 'lucide-react';
import { Prisma } from '@prisma/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CopyrightRow } from '@/components/CopyrightRow';

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
    <div className="min-h-screen flex flex-col bg-bc-bg">
      <Header />
      
      <main className="flex-grow font-instrument">
        <div className="bg-white">
          
          {/* Banner Hero Section */}
          <section className="relative h-[360px] w-full flex items-center justify-center">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1500"
                alt="Catalogue de cadeaux"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60"></div>
            </div>
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
              <h1 className="font-montserrat font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
                NOTRE CATALOGUE
              </h1>
              <p className="text-gray-200 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                Explorez notre sélection de packs exclusifs, paniers de ravitaillement utiles et cadeaux personnalisables pour gâter vos proches.
              </p>
            </div>
          </section>

          <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
            
            {/* Search and Category Filters Bar */}
            <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-100 mb-12">
              <form method="GET" action="/catalogue" className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                
                {/* Search input field */}
                <div className="relative w-full lg:max-w-md">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                    <Search size={18} />
                  </span>
                  <input
                    type="text"
                    name="q"
                    defaultValue={q}
                    placeholder="Rechercher un cadeau..."
                    className="pl-11 block w-full rounded-2xl border border-gray-300 py-3 px-4 text-bc-heading focus:ring-bc-purple focus:border-bc-purple outline-none text-sm font-medium"
                  />
                  {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
                </div>

                {/* Horizontal Category selector */}
                <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
                  <Link
                    href={{
                      pathname: '/catalogue',
                      query: q ? { q } : {},
                    }}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all whitespace-nowrap cursor-pointer ${
                      !categorySlug
                        ? 'bg-bc-purple text-white border-bc-purple shadow-sm'
                        : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
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
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all whitespace-nowrap cursor-pointer ${
                        categorySlug === cat.slug
                          ? 'bg-bc-purple text-white border-bc-purple shadow-sm'
                          : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </form>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-lg mx-auto p-8">
                <PackageOpen size={56} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-bc-purple font-montserrat">Aucun produit trouvé</h3>
                <p className="text-gray-500 text-sm mt-2">
                  Nous n&apos;avons pas trouvé d&apos;articles correspondant à vos filtres. Essayez d&apos;ajuster votre recherche.
                </p>
                <Link
                  href="/catalogue"
                  className="mt-6 inline-flex items-center px-6 py-2.5 rounded-xl text-xs font-bold text-bc-purple bg-bc-yellow hover:bg-yellow-400 transition-colors shadow-sm cursor-pointer"
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
                        className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-card hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col justify-between"
                      >
                        <div>
                          {/* Product Cover Image */}
                          <div className="h-52 w-full overflow-hidden bg-gray-50 relative group">
                            <img
                              src={images[0] || '/1-19.png'}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {product.isCustomizable && (
                              <div className="absolute top-3 left-3 bg-bc-purple text-white text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
                                Personnalisable
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="p-5 space-y-2">
                            <span className="text-[10px] font-bold text-bc-yellow tracking-wider uppercase block">
                              {product.category.name}
                            </span>
                            <h3 className="font-montserrat font-bold text-base text-bc-navy line-clamp-1 leading-snug">
                              {product.name}
                            </h3>
                            <p className="text-gray-400 text-[10px] font-semibold">
                              Livraison : {product.estimatedDelivery}
                            </p>
                            <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
                              {product.description}
                            </p>
                          </div>
                        </div>

                        {/* Footer card */}
                        <div className="p-5 pt-0 border-t border-gray-50 flex items-center justify-between mt-auto">
                          <div className="text-bc-purple font-montserrat font-black text-base">
                            {product.price.toLocaleString('fr-FR')} <span className="text-[10px]">FCFA</span>
                          </div>
                          <Link
                            href={`/produit/${product.slug}`}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl text-xs font-bold text-bc-purple bg-bc-yellow hover:bg-yellow-400 transition-colors shadow-sm cursor-pointer"
                          >
                            Détails <ChevronRight size={12} className="ml-1" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-16">
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
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold border transition-all cursor-pointer ${
                            isActive
                              ? 'bg-bc-purple text-white border-bc-purple shadow-sm font-extrabold'
                              : 'bg-white text-bc-heading border-gray-200 hover:bg-gray-50 font-medium'
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
            
          </section>
        </div>
      </main>

      <CopyrightRow />
      <Footer />
    </div>
  );
}
