import { ChevronDown, Upload, Check } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CopyrightRow } from '@/components/CopyrightRow';

export default function CommanderPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bc-bg">
      <Header />
      <main className="flex-grow">
        <div className="bg-white">
          {/* Hero Section */}
          <section className="relative h-[470px] w-full">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&q=80&w=2000"
                alt="Christmas gift box"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Floating Title Card */}
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4">
              <div className="bg-white rounded-[58px] shadow-card py-12 px-8 text-center">
                <h1 className="font-instrument font-bold text-4xl md:text-5xl text-bc-purple">
                  Formulaire de Commande Bénin Cadeau
                </h1>
              </div>
            </div>
          </section>

          {/* Form Section */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-32">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {/* Left Column */}
              <div className="space-y-8">
                <div className="border border-gray-300 rounded-md p-3">
                  <input
                    type="text"
                    placeholder="Nom & Prénoms"
                    className="w-full focus:outline-none font-instrument text-xl text-gray-500 placeholder-gray-400"
                  />
                </div>

                <div className="border border-gray-300 rounded-md p-3">
                  <input
                    type="tel"
                    placeholder="Téléphone"
                    className="w-full focus:outline-none font-instrument text-xl text-gray-500 placeholder-gray-400"
                  />
                </div>

                <div className="border border-gray-300 rounded-md p-3">
                  <input
                    type="email"
                    placeholder="Adresse Email"
                    className="w-full focus:outline-none font-instrument text-xl text-gray-500 placeholder-gray-400"
                  />
                </div>

                <div className="border border-gray-300 rounded-md p-3 flex justify-between items-center relative">
                  <select className="w-full appearance-none bg-transparent focus:outline-none font-instrument text-xl text-gray-400">
                    <option value="" disabled selected>
                      Catégorie de cadeau
                    </option>
                    <option value="perso">Cadeaux personnalisés</option>
                    <option value="occ">Occasions spéciales</option>
                    <option value="panier">Paniers de ravitaillement</option>
                  </select>
                  <ChevronDown
                    className="text-gray-500 absolute right-3 pointer-events-none"
                    size={24}
                  />
                </div>

                <div className="border border-gray-300 rounded-md p-3 h-40">
                  <textarea
                    placeholder={"Livraison\nVille / Quartier\nAdresse précise\nDate de livraison souhaitée"}
                    className="w-full h-full focus:outline-none font-instrument text-xl text-gray-500 placeholder-gray-400 resize-none">
                  </textarea>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                <div className="border border-gray-300 rounded-md p-3 h-[110px]">
                  <textarea
                    placeholder="Description du cadeau : Préciser ce que vous voulez offrir."
                    className="w-full h-full focus:outline-none font-instrument text-xl text-gray-500 placeholder-gray-400 resize-none">
                  </textarea>
                </div>

                <div className="border border-gray-300 rounded-md p-3 h-[110px]">
                  <textarea
                    placeholder={"Personnalisation (optionnel ) :\nTexte à imprimer / prénom / Couleur souhaitée..."}
                    className="w-full h-full focus:outline-none font-instrument text-xl text-gray-500 placeholder-gray-400 resize-none">
                  </textarea>
                </div>

                <div className="border border-gray-300 rounded-md p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-instrument text-xl text-gray-400">
                    Téléchargement d&apos;une photo
                  </span>
                  <Upload className="text-gray-500" size={24} />
                </div>

                <div className="border border-gray-300 rounded-md p-3 h-[100px]">
                  <textarea
                    placeholder={"Choix du mode de paiement :\nMobile Money (MTN / Moov)\nPaiement à la livraison (si possible)"}
                    className="w-full h-full focus:outline-none font-instrument text-xl text-gray-500 placeholder-gray-400 resize-none">
                  </textarea>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="md:col-span-2 space-y-6 mt-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-5 h-5 border-2 border-gray-400 rounded flex items-center justify-center group-hover:border-bc-purple transition-colors">
                    <Check className="text-transparent group-hover:text-gray-200 w-4 h-4" />
                  </div>
                  <span className="font-instrument font-bold text-xl text-bc-heading">
                    J&apos;ai vérifié mes informations avant validation.
                  </span>
                </label>

                <button
                  type="submit"
                  className="bg-bc-purple text-bc-yellow font-instrument font-bold text-xl px-10 py-3 rounded-md hover:bg-bc-purpleDark transition-colors">
                  Confirmer
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
      <CopyrightRow />
      <Footer />
    </div>
  );
}
