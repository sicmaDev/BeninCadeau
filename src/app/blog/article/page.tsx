import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CopyrightRow } from '@/components/CopyrightRow';

export default function BlogPostPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bc-bg">
      <Header />
      <main className="flex-grow">
        <div className="bg-white">
          {/* Hero Section */}
          <section className="relative h-[750px] w-full flex flex-col md:flex-row">
            {/* Left Content */}
            <div className="w-full md:w-1/2 bg-bc-yellow p-12 md:p-24 flex flex-col justify-center relative">
              <div className="absolute inset-0 bg-black/90 m-8 md:m-12 flex flex-col justify-center p-8 md:p-12">
                <h1 className="font-instrument font-bold text-4xl md:text-5xl lg:text-[48px] text-white uppercase leading-tight">
                  Les nouvelles tendances déco pour emballer vos cadeaux
                </h1>
              </div>
            </div>

            {/* Right Image */}
            <div className="w-full md:w-1/2 h-full">
              <img
                src="https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&q=80&w=1000"
                alt="Christmas gift box"
                className="w-full h-full object-cover"
              />
            </div>
          </section>

          {/* Content Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="flex flex-col lg:flex-row gap-16">
              {/* Main Content (Left) */}
              <div className="w-full lg:w-2/3">
                <div className="prose prose-lg max-w-none font-inter font-bold text-black text-justify mb-12">
                  <p className="mb-6">
                    Les nouvelles tendances déco pour emballer vos cadeaux
                  </p>
                  <p className="mb-6">
                    Lorem Ipsum is simply dummy text of the printing and typesetting
                    industry. Lorem Ipsum has been the industry&apos;s standard dummy
                    text ever since the 1500s, when an unknown printer took a galley
                    of type and scrambled it to make a type specimen book. It has
                    survived not only five centuries, but also the leap into
                    electronic typesetting, remaining essentially unchanged.
                  </p>
                  <p className="mb-6">
                    It was popularised in the 1960s with the release of Letraset
                    sheets containing Lorem Ipsum passages, and more recently with
                    desktop publishing software like Aldus PageMaker including
                    versions of Lorem Ipsum.
                  </p>
                  <img
                    src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800"
                    alt="Gift wrapping"
                    className="w-full md:w-1/2 h-auto my-8 rounded-lg"
                  />
                  <p>
                    Contrary to popular belief, Lorem Ipsum is not simply random
                    text. It has roots in a piece of classical Latin literature from
                    45 BC, making it over 2000 years old. Richard McClintock, a
                    Latin professor at Hampden-Sydney College in Virginia, looked up
                    one of the more obscure Latin words, consectetur, from a Lorem
                    Ipsum passage, and going through the cites of the word in
                    classical literature, discovered the undoubtable source.
                  </p>
                </div>

                <p className="font-inter font-medium text-xl text-black mb-24">
                  Le 12/04/2025 par Loic BAKPE
                </p>

                {/* Comments Section */}
                <div className="mb-24">
                  <h3 className="font-inter font-black text-3xl text-black mb-12">
                    COMMENTAIRES (18)
                  </h3>

                  <div className="space-y-8">
                    {/* Comment 1 */}
                    <div className="flex gap-4 border-b border-gray-300 pb-8">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                      <div>
                        <h4 className="font-inter font-bold text-lg text-black mb-2">
                          Dossa Princia
                        </h4>
                        <p className="font-inter text-black">
                          Dans cette attente, je vous prie d&apos;agréer, Madame la
                          Directrice Générale, l&apos;expression de mes salutations
                          respectueuses.Dans cette attente, je vous prie d&apos;agréer,
                          Madame la Directrice G
                        </p>
                      </div>
                    </div>

                    {/* Comment 2 */}
                    <div className="flex gap-4 border-b border-gray-300 pb-8">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                      <div>
                        <h4 className="font-inter font-bold text-lg text-black mb-2">
                          Dossa Princia
                        </h4>
                        <p className="font-inter text-black">
                          Dans cette attente, je vous prie d&apos;agréer, Madame la
                          Directrice Générale, l&apos;expression de mes salutations
                          respectueuses.Dans cette attente, je vous prie d&apos;agréer,
                          Madame la Directrice G
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comment Form */}
                <div>
                  <h3 className="font-inter font-black text-3xl text-black mb-12">
                    VOTRE AVIS
                  </h3>

                  <form className="space-y-8 max-w-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block font-inter text-xl text-bc-heading mb-2">
                          Nom
                        </label>
                        <input
                          type="text"
                          className="w-full border-b border-bc-heading bg-transparent focus:outline-none focus:border-bc-yellow py-2"
                        />
                      </div>
                      <div>
                        <label className="block font-inter text-xl text-bc-heading mb-2">
                          Prénom
                        </label>
                        <input
                          type="text"
                          className="w-full border-b border-bc-heading bg-transparent focus:outline-none focus:border-bc-yellow py-2"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-inter text-xl text-bc-heading mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full border-b border-bc-heading bg-transparent focus:outline-none focus:border-bc-yellow py-2"
                      />
                    </div>

                    <div>
                      <label className="block font-inter text-xl text-bc-heading mb-2">
                        Votre commentaire
                      </label>
                      <textarea className="w-full border-b border-bc-heading bg-transparent focus:outline-none focus:border-bc-yellow py-2 resize-none h-24"></textarea>
                    </div>

                    <button
                      type="submit"
                      className="bg-bc-yellow text-white font-inter font-bold text-xl uppercase px-12 py-3 rounded-lg hover:opacity-90 transition-opacity">
                      Envoyer
                    </button>
                  </form>
                </div>
              </div>

              {/* Sidebar (Right) */}
              <div className="w-full lg:w-1/3 space-y-8">
                {/* Sidebar Card 1 */}
                <div className="bg-bc-bg border border-bc-heading flex items-stretch shadow-md">
                  <div className="w-16 bg-white flex flex-col items-center justify-center py-4 font-inter text-sm text-white relative">
                    <div className="absolute inset-0 bg-white"></div>
                    <span className="relative z-10 text-white">06</span>
                    <div className="w-6 h-px bg-white my-1 relative z-10"></div>
                    <span className="relative z-10 text-white">12</span>
                    <div className="w-6 h-px bg-white my-1 relative z-10"></div>
                    <span className="relative z-10 text-white">24</span>
                  </div>
                  <div className="p-4 flex items-center">
                    <h4 className="font-inter font-semibold text-base text-bc-heading">
                      Comment choisir le cadeau parfait en 3 étapes
                    </h4>
                  </div>
                </div>

                {/* Sidebar Card 2 */}
                <div className="bg-bc-bg border border-bc-heading flex items-stretch shadow-md">
                  <div className="w-16 bg-white flex flex-col items-center justify-center py-4 font-inter text-sm text-white relative">
                    <div className="absolute inset-0 bg-white"></div>
                    <span className="relative z-10 text-white">06</span>
                    <div className="w-6 h-px bg-white my-1 relative z-10"></div>
                    <span className="relative z-10 text-white">12</span>
                    <div className="w-6 h-px bg-white my-1 relative z-10"></div>
                    <span className="relative z-10 text-white">24</span>
                  </div>
                  <div className="p-4 flex items-center">
                    <h4 className="font-inter font-semibold text-base text-bc-heading">
                      10 idées de cadeaux personnalisés pour un anniversaire
                    </h4>
                  </div>
                </div>

                {/* Sidebar Card 3 (Active) */}
                <div className="bg-bc-purple border-2 border-white flex items-stretch shadow-md">
                  <div className="w-16 bg-bc-purple flex flex-col items-center justify-center py-4 font-inter text-sm text-bc-heading relative">
                    <div className="absolute inset-0 bg-bc-purple"></div>
                    <span className="relative z-10 text-bc-heading">06</span>
                    <div className="w-6 h-px bg-bc-heading my-1 relative z-10"></div>
                    <span className="relative z-10 text-bc-heading">12</span>
                    <div className="w-6 h-px bg-bc-heading my-1 relative z-10"></div>
                    <span className="relative z-10 text-bc-heading">24</span>
                  </div>
                  <div className="p-4 flex items-center">
                    <h4 className="font-inter font-semibold text-base text-white">
                      Les tendances émergentes dans le domaine de la gestion des
                      plaintes et réclamations
                    </h4>
                  </div>
                </div>

                {/* Tags */}
                <div className="pt-8">
                  <h3 className="font-instrument font-bold text-2xl text-black mb-6">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <span className="border border-gray-400 rounded-md px-4 py-1 font-instrument font-medium text-black">
                      Conseils
                    </span>
                    <span className="border border-gray-400 rounded-md px-4 py-1 font-instrument font-medium text-black">
                      Tendances
                    </span>
                    <span className="border border-gray-400 rounded-md px-4 py-1 font-instrument font-medium text-black">
                      Astuces
                    </span>
                    <span className="border border-gray-400 rounded-md px-4 py-1 font-instrument font-medium text-black">
                      Idées
                    </span>
                    <span className="border border-gray-400 bg-bc-purple text-white rounded-md px-4 py-1 font-instrument font-medium">
                      Conseils
                    </span>
                    <span className="border border-gray-400 rounded-md px-4 py-1 font-instrument font-medium text-black">
                      Conseils
                    </span>
                  </div>
                </div>
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
