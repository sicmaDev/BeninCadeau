import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CopyrightRow } from '@/components/CopyrightRow';
import { FloatingCTA } from '@/components/FloatingCTA';
import { ProductCard } from '@/components/ProductCard';
import { prisma } from '@/utils/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function PacksPage() {
  // Récupérer toutes les catégories actives avec leurs produits actifs
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { displayOrder: 'asc' },
    include: {
      products: {
        where: { active: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-bc-bg">
      <Header />
      <main className="flex-grow">
        <div className="bg-white">
          {/* Hero Section */}
          <section className="relative h-[680px] w-full">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=2000"
                alt="Gifts background"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60"></div>
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center pt-12">
              <h1 className="font-instrument font-bold text-5xl md:text-6xl text-white mb-6">
                NOS PACKS
              </h1>
              <h2 className="font-instrument font-bold text-3xl md:text-4xl text-white text-center max-w-2xl mb-8">
                Nos plus belles créations, pour vous inspirer.
              </h2>
              <p className="font-instrument font-medium text-xl md:text-2xl text-white text-center max-w-3xl">
                Chez Bénin Cadeau, chaque commande est une histoire unique.
                Découvrez quelques-unes de nos réalisations et imaginez la vôtre !
              </p>
            </div>
          </section>

          {/* Floating CTA */}
          <div className="relative -mt-24 px-4 sm:px-6 lg:px-8 z-10 mb-32">
            <FloatingCTA
              title="Le plus beau moment, c'est leur sourire !"
              buttonText="CRÉER LE SOURIRE DE QUELQU'UN AUJOURD'HUI"
              buttonLink="/commander"
            />
          </div>

          {/* Sections */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 space-y-32">
            {categories.map((category) => {
              if (category.products.length === 0) return null;
              return (
                <section key={category.id}>
                  <h2 className="font-inter font-black text-4xl text-bc-heading uppercase mb-12 inline-block border-b-4 border-white pb-2">
                    {category.name}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {category.products.map((product) => {
                      let images: string[] = [];
                      try {
                        images = typeof product.images === 'string'
                          ? JSON.parse(product.images)
                          : (product.images as unknown as string[]);
                      } catch {
                        images = ['/1-19.png'];
                      }
                      const firstImage = images[0] || '/1-19.png';
                      const formattedPrice = `${product.price.toLocaleString('fr-FR')} FCFA`;

                      return (
                        <Link key={product.id} href={`/produit/${product.slug}`} className="block hover:no-underline group">
                          <ProductCard
                            imageSrc={firstImage}
                            title={product.name}
                            price={formattedPrice}
                          />
                        </Link>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </main>
      <CopyrightRow />
      <Footer />
    </div>
  );
}
