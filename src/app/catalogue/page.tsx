import Link from 'next/link';
import { prisma } from '../../utils/db';
import { Search, ChevronRight, PackageOpen, Sparkles } from 'lucide-react';
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
  const itemsPerPage = 16; // 16 items per page fits grid layout perfectly

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
      
      <main className="flex-grow font-instrument pb-24">
        
        {/* Banner Hero Section */}
        <section className="relative h-[380px] w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1500"
              alt="Catalogue de cadeaux prestigieux"
              className="w-full h-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-bc-purpleDark/90 via-bc-purple/80 to-bc-bg" />
          </div>
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-bc-yellow font-montserrat font-bold text-xs uppercase tracking-widest mx-auto">
              <Sparkles size={12} /> Collection Privée
            </div>
            <h1 className="font-montserrat font-black text-4xl sm:text-5xl text-white tracking-tight">
              NOTRE CATALOGUE CADEAUX
            </h1>
            <p className="text-gray-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-medium">
              Découvrez des coffrets d&apos;exception, des paniers gourmands de prestige et des créations entièrement personnalisables.
            </p>
          </div>
        </section>

        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 -mt-[60px] relative z-20">
          
          {/* Search and Category Filters Panel */}
          <div className="glass-panel rounded-[32px] p-6 sm:p-8 shadow-premium mb-16">
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
                  placeholder="Rechercher un cadeau de rêve..."
                  className="pl-11 block w-full rounded-2xl border border-gray-200 bg-white/80 py-3.5 px-4 text-bc-heading focus:ring-2 focus:ring-bc-purple focus:border-bc-purple outline-none text-sm font-medium transition-all"
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
                  className={`px-5 py-3 rounded-xl text-xs font-montserrat font-bold border transition-all whitespace-nowrap cursor-pointer ${
                    !categorySlug
                      ? 'bg-purple-gradient text-white border-transparent shadow-sm'
                      : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
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
                    className={`px-5 py-3 rounded-xl text-xs font-montserrat font-bold border transition-all whitespace-nowrap cursor-pointer ${
                      categorySlug === cat.slug
                        ? 'bg-purple-gradient text-white border-transparent shadow-sm'
                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
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
            <div className="text-center py-20 bg-white rounded-[32px] border border-gray-100 shadow-card max-w-lg mx-auto p-10 space-y-6">
              <div className="w-20 h-20 bg-bc-yellow/10 rounded-full flex items-center justify-center mx-auto text-bc-yellow">
                <PackageOpen size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-bc-navy font-montserrat">Aucun coffret trouvé</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
                  Nous n&apos;avons trouvé d&apos;articles correspondant à votre recherche. Ajustez vos filtres pour découvrir d&apos;autres inspirations.
                </p>
              </div>
              <Link
                href="/catalogue"
                className="inline-flex items-center px-6 py-3.5 rounded-2xl text-xs font-bold text-bc-purple bg-bc-yellow hover:bg-yellow-400 transition-colors shadow-yellow-glow cursor-pointer"
              >
                Réinitialiser les filtres
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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
                      className="bg-white rounded-[32px] overflow-hidden shadow-card hover:shadow-premium hover:-translate-y-1.5 transition-all duration-300 border border-gray-100/60 flex flex-col justify-between group"
                    >
                      <div>
                        {/* Product Cover Image */}
                        <div className="h-56 w-full overflow-hidden bg-gray-50 relative group">
                          <img
                            src={images[0] || '/1-19.png'}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {product.isCustomizable && (
                            <div className="absolute top-4 left-4 bg-purple-gradient text-white text-[9px] font-montserrat font-bold tracking-wider uppercase px-3.5 py-1 rounded-full shadow-md">
                              Personnalisable
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="p-6 space-y-3">
                          <span className="text-[10px] font-montserrat font-extrabold text-bc-gold tracking-widest uppercase block">
                            {product.category.name}
                          </span>
                          <h3 className="font-montserrat font-extrabold text-base text-bc-navy line-clamp-1 leading-snug group-hover:text-bc-purple transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-gray-400 text-[10px] font-semibold flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                            Expédié sous : {product.estimatedDelivery}
                          </p>
                          <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed font-instrument">
                            {product.description}
                          </p>
                        </div>
                      </div>

                      {/* Footer card */}
                      <div className="p-6 pt-0 border-t border-gray-50 flex items-center justify-between mt-auto">
                        <div className="text-bc-purple font-montserrat font-black text-lg">
                          {product.price.toLocaleString('fr-FR')} <span className="text-[11px] font-bold">FCFA</span>
                        </div>
                        <Link
                          href={`/produit/${product.slug}`}
                          className="inline-flex items-center px-4.5 py-2.5 rounded-2xl text-xs font-montserrat font-bold text-bc-purple bg-bc-yellow hover:bg-yellow-400 transition-colors shadow-sm cursor-pointer"
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
                <div className="flex justify-center items-center space-x-2.5 mt-20">
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
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xs font-montserrat font-bold border transition-all cursor-pointer ${
                          isActive
                            ? 'bg-purple-gradient text-white border-transparent shadow-md font-extrabold'
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
      </main>

      <CopyrightRow />
      <Footer />
    </div>
  );
}

