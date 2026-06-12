import Link from 'next/link';
import { prisma } from '../../utils/db';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CopyrightRow } from '@/components/CopyrightRow';
import { ArrowRight, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

// Mapping static descriptions and images to database categories based on slug
const CATEGORY_META: Record<string, { desc: string; image: string }> = {
  'cadeaux-personnalises': {
    desc: 'Offrez un objet unique et personnalisé avec un prénom, une date ou un message spécial. Mugs gravés, cadres photo lumineux, textiles et accessoires sur-mesure.',
    image: 'https://images.unsplash.com/photo-1577046848358-52268cd192c0?auto=format&fit=crop&q=80&w=800',
  },
  'occasions-speciales': {
    desc: 'Célébrez les grands jours de la vie. Des coffrets de mariage royaux, des boîtes de roses éternelles élégantes, des packs naissance et des surprises romantiques.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
  },
  'paniers-ravitaillement': {
    desc: 'Des paniers alimentaires utiles et attentionnés remplis de produits de première nécessité (riz de luxe, huile, lait, café, pâtes) pour soutenir vos proches au Bénin.',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800',
  },
};

export default async function NosPropositionsPage() {
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { displayOrder: 'asc' },
  });

  return (
    <div className="min-h-screen flex flex-col bg-bc-bg">
      <Header />
      <main className="flex-grow font-instrument">
        <div className="bg-white">
          
          {/* Hero Section */}
          <section className="relative h-[400px] w-full flex items-center justify-center">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1500"
                alt="Nos propositions de cadeaux"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60"></div>
            </div>
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
              <h1 className="font-montserrat font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
                NOS PROPOSITIONS
              </h1>
              <p className="text-gray-200 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
                Découvrez nos différentes catégories thématiques pour trouver à coup sûr le cadeau qui saura faire plaisir et transmettre vos émotions.
              </p>
            </div>
          </section>

          {/* Grid Section */}
          <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((cat) => {
                const meta = CATEGORY_META[cat.slug] || {
                  desc: 'Découvrez notre sélection exclusive d\'articles de cadeaux de haute qualité pour toutes les occasions.',
                  image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800',
                };

                return (
                  <div
                    key={cat.id}
                    className="flex flex-col bg-white rounded-3xl overflow-hidden shadow-card border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                  >
                    {/* Category Image Cover */}
                    <div className="h-56 w-full overflow-hidden bg-gray-50 relative">
                      <img
                        src={meta.image}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-bc-purple text-white p-2 rounded-xl shadow-sm">
                        <Sparkles size={16} className="text-bc-yellow" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                      <div>
                        <h2 className="font-montserrat font-bold text-xl text-bc-navy">
                          {cat.name}
                        </h2>
                        <p className="text-gray-500 text-sm leading-relaxed mt-2">
                          {meta.desc}
                        </p>
                      </div>

                      <Link href={`/catalogue?category=${cat.slug}`} className="block w-full pt-4 border-t border-gray-50">
                        <button className="w-full inline-flex items-center justify-center px-5 py-3 rounded-xl text-xs font-bold text-bc-purple bg-bc-yellow hover:bg-yellow-400 transition-colors shadow-sm cursor-pointer">
                          Voir la sélection <ArrowRight size={14} className="ml-1.5" />
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      </main>
      <CopyrightRow />
      <Footer />
    </div>
  );
}
