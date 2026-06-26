import Link from 'next/link';
import { prisma } from '../../utils/db';
import { Search, PackageOpen, Sparkles } from 'lucide-react';
import { Prisma } from '@prisma/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CopyrightRow } from '@/components/CopyrightRow';
import { ProductCard } from '@/components/ProductCard';

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
  const itemsPerPage = 16; 

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
    <div className="min-h-screen flex flex-col bg-zinc-50/30">
      <Header />
      
      <main className="flex-grow font-instrument pb-24">
        
        {/* Elegant Minimalist Header */}
        <section className="bg-zinc-50 border-b border-zinc-200/50 py-12 lg:py-16">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bc-purpleLight text-bc-purple font-semibold text-[10px] uppercase tracking-wider mx-auto">
              <Sparkles size={11} className="text-bc-yellow fill-current" /> Collection Privée
            </div>
            <h1 className="font-bold text-3xl sm:text-4xl text-zinc-900 tracking-tight">
              NOTRE CATALOGUE CADEAUX
            </h1>
            <p className="text-zinc-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-medium">
              Découvrez des coffrets d&apos;exception, des paniers gourmands de prestige et des créations entièrement personnalisables.
            </p>
          </div>
        </section>

        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 mt-10">
          
          {/* Filters & Search Row */}
          <div className="bg-white border border-zinc-200/50 rounded-3xl p-5 shadow-sm mb-12">
            <form method="GET" action="/catalogue" className="flex flex-col lg:flex-row gap-5 items-center justify-between">
              
              {/* Search input field */}
              <div className="relative w-full lg:max-w-md">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-400">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  name="q"
                  defaultValue={q}
                  placeholder="Rechercher un cadeau de rêve..."
                  className="pl-11 pr-4 block w-full rounded-full border border-zinc-200 bg-zinc-50/50 py-2.5 px-4 text-zinc-800 focus:bg-white focus:ring-1 focus:ring-bc-purple focus:border-bc-purple outline-none text-xs font-semibold transition-all placeholder:text-zinc-400"
                />
                {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
              </div>

              {/* Horizontal Category pills */}
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
                <Link
                  href={{
                    pathname: '/catalogue',
                    query: q ? { q } : {},
                  }}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap cursor-pointer ${
                    !categorySlug
                      ? 'bg-bc-purple text-white border-transparent shadow-sm'
                      : 'bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50'
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
                    className={`px-5 py-2.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap cursor-pointer ${
                      categorySlug === cat.slug
                        ? 'bg-bc-purple text-white border-transparent shadow-sm'
                        : 'bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50'
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
            <div className="text-center py-16 bg-white rounded-3xl border border-zinc-200/50 shadow-sm max-w-md mx-auto p-8 space-y-5">
              <div className="w-16 h-16 bg-bc-yellow/10 rounded-full flex items-center justify-center mx-auto text-bc-yellow">
                <PackageOpen size={32} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-zinc-800">Aucun coffret trouvé</h3>
                <p className="text-zinc-500 text-xs leading-relaxed max-w-sm mx-auto font-instrument">
                  Nous n&apos;avons trouvé d&apos;articles correspondant à votre recherche. Ajustez vos filtres pour découvrir d&apos;autres inspirations.
                </p>
              </div>
              <Link
                href="/catalogue"
                className="inline-flex items-center px-5 py-3 rounded-full text-xs font-bold text-bc-purple bg-bc-yellow hover:bg-yellow-400 transition-colors shadow-sm cursor-pointer"
              >
                Réinitialiser les filtres
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2.5 mt-16">
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
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border transition-all cursor-pointer ${
                          isActive
                            ? 'bg-bc-purple text-white border-transparent shadow-sm'
                            : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
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
