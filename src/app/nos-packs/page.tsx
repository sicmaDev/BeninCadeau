import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CopyrightRow } from '@/components/CopyrightRow';
import { FloatingCTA } from '@/components/FloatingCTA';
import { ProductCard } from '@/components/ProductCard';

export default function PacksPage() {
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
            {/* Section 1 */}
            <section>
              <h2 className="font-inter font-black text-4xl text-bc-heading uppercase mb-12 inline-block border-b-4 border-white pb-2">
                Cadeaux personnalisés
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ProductCard
                  imageSrc="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=600"
                  title="Mug avec prénom"
                  price="30 000 FCFA"
                />
                <ProductCard
                  imageSrc="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600"
                  title="T-shirt personnalisé"
                  price="30 000 FCFA"
                />
                <ProductCard
                  imageSrc="https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=600"
                  title="Coussin déco"
                  price="30 000 FCFA"
                />
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="font-inter font-black text-4xl text-bc-heading uppercase mb-12 inline-block border-b-4 border-white pb-2">
                Occasions spéciales
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ProductCard
                  imageSrc="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600"
                  title="Coffret mariage emballé avec ruban"
                  price="30 000 FCFA"
                />
                <ProductCard
                  imageSrc="https://images.unsplash.com/photo-1530103862676-de8892b07439?auto=format&fit=crop&q=80&w=600"
                  title="Kit anniversaire (ballons + objet cadeau)"
                  price="30 000 FCFA"
                />
                <ProductCard
                  imageSrc="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=600"
                  title="Pack naissance (bavoir, pagne, mini-cadeau)"
                  price="30 000 FCFA"
                />
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="font-inter font-black text-4xl text-bc-heading uppercase mb-12 inline-block border-b-4 border-white pb-2">
                Petits paniers de ravitaillement
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ProductCard
                  imageSrc="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=600"
                  title="Panier petit-déjeuner"
                  price="30 000 FCFA"
                />
                <ProductCard
                  imageSrc="https://images.unsplash.com/photo-1592861956120-e524fc739696?auto=format&fit=crop&q=80&w=600"
                  title="Panier gourmand"
                  price="30 000 FCFA"
                />
                <ProductCard
                  imageSrc="https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&q=80&w=600"
                  title="Panier familial"
                  price="30 000 FCFA"
                />
              </div>
            </section>
          </div>
        </div>
      </main>
      <CopyrightRow />
      <Footer />
    </div>
  );
}
