import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CopyrightRow } from '@/components/CopyrightRow';

export default function PropositionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bc-bg">
      <Header />
      <main className="flex-grow">
        <div className="bg-white">
          {/* Hero Section */}
          <section className="relative h-[680px] w-full flex flex-col md:flex-row">
            {/* Left Content */}
            <div className="w-full md:w-1/2 bg-bc-bg p-12 md:p-24 flex flex-col justify-center">
              <h1 className="font-instrument font-bold text-4xl md:text-5xl lg:text-[48px] text-bc-purpleDark mb-8">
                NOS PROPOSITIONS
              </h1>
              <h2 className="font-instrument font-bold text-3xl md:text-4xl text-bc-heading mb-8 leading-tight">
                Nous avons pensé à tout pour que vos cadeaux soient aussi uniques
                que vos émotions.
              </h2>
              <p className="font-instrument font-medium text-xl md:text-2xl text-bc-heading text-justify">
                Découvrez nos différentes catégories et choisissez ce qui fera
                briller les yeux de vos proches.
              </p>
            </div>

            {/* Right Image */}
            <div className="w-full md:w-1/2 h-full">
              <img
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1000"
                alt="Gifts"
                className="w-full h-full object-cover"
              />
            </div>
          </section>

          {/* Grid Section */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card 1 */}
              <div className="flex flex-col gap-6">
                <div className="bg-white rounded-xl shadow-card overflow-hidden h-64">
                  <img
                    src="https://images.unsplash.com/photo-1577046848358-52268cd192c0?auto=format&fit=crop&q=80&w=800"
                    alt="Cadeaux Personnalisés"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="font-instrument text-lg text-black text-justify space-y-4">
                  <h3 className="font-bold text-2xl">Cadeaux Personnalisés</h3>
                  <p>
                    Parce que chaque personne est unique, chaque cadeau devrait
                    l&apos;être aussi !
                  </p>
                  <p>
                    Exemples : mugs avec prénom, t-shirts imprimés, coussins,
                    carnets, tableaux déco, etc.
                  </p>
                  <p>
                    Idéal pour : marquer les esprits avec un objet du quotidien.
                  </p>
                </div>
                <Link href="/commander" className="inline-block mt-auto">
                  <button className="bg-bc-yellow text-white font-instrument font-bold text-lg px-8 py-2 rounded-md hover:opacity-90 transition-opacity">
                    Passer une commande
                  </button>
                </Link>
              </div>

              {/* Card 2 */}
              <div className="flex flex-col gap-6">
                <div className="bg-white rounded-xl shadow-card overflow-hidden h-64">
                  <img
                    src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800"
                    alt="Occasions Spéciales"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="font-instrument text-lg text-black text-justify space-y-4">
                  <h3 className="font-bold text-2xl">Occasions Spéciales</h3>
                  <p>
                    Mariage, anniversaire, baptême, Saint-Valentin... Nous avons le
                    cadeau qu&apos;il faut pour chaque moment de vie.
                  </p>
                  <p>
                    Exemples : coffrets de mariage, pack naissance, cadeaux
                    d&apos;anniversaire, surprises romantiques.
                  </p>
                  <p>
                    Idéal pour : marquer les grands jours avec éclat et émotion.
                  </p>
                </div>
                <Link href="/commander" className="inline-block mt-auto">
                  <button className="bg-bc-yellow text-white font-instrument font-bold text-lg px-8 py-2 rounded-md hover:opacity-90 transition-opacity">
                    Passer une commande
                  </button>
                </Link>
              </div>

              {/* Card 3 */}
              <div className="flex flex-col gap-6 mt-12">
                <div className="bg-white rounded-xl shadow-card overflow-hidden h-64">
                  <img
                    src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800"
                    alt="Petits Paniers de Ravitaillement"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="font-instrument text-lg text-black text-justify space-y-4">
                  <h3 className="font-bold text-2xl">
                    Petits Paniers de Ravitaillement
                  </h3>
                  <p>Offrez de quoi réchauffer le cœur et remplir les assiettes.</p>
                  <p>
                    Nos paniers contiennent une sélection d&apos;aliments et produits du
                    quotidien pour gâter vos proches de manière utile et généreuse.
                  </p>
                  <p>
                    Exemples : panier petit-déjeuner, panier familial, panier
                    gourmand...
                  </p>
                  <p>
                    Idéal pour : soutenir, remercier, dire merci ou célébrer un
                    moment en douceur.
                  </p>
                </div>
                <Link href="/commander" className="inline-block mt-auto">
                  <button className="bg-bc-yellow text-white font-instrument font-bold text-lg px-8 py-2 rounded-md hover:opacity-90 transition-opacity">
                    Passer une commande
                  </button>
                </Link>
              </div>

              {/* Card 4 */}
              <div className="flex flex-col gap-6 mt-12">
                <div className="bg-white rounded-xl shadow-card overflow-hidden h-64">
                  <img
                    src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800"
                    alt="Autres Occasions"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="font-instrument text-lg text-black text-justify space-y-4">
                  <h3 className="font-bold text-2xl">Autres Occasions</h3>
                  <p>Vous avez une idée spéciale ? Une demande particulière ?</p>
                  <p>Chez nous, la créativité n&apos;a pas de limite !</p>
                  <p>
                    Idéal pour : créer un cadeau sur-mesure qui sort complètement de
                    l&apos;ordinaire.
                  </p>
                </div>
                <Link href="/commander" className="inline-block mt-auto">
                  <button className="bg-bc-yellow text-white font-instrument font-bold text-lg px-8 py-2 rounded-md hover:opacity-90 transition-opacity">
                    Passer une commande
                  </button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
      <CopyrightRow />
      <Footer />
    </div>
  );
}
