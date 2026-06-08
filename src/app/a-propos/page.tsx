import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CopyrightRow } from '@/components/CopyrightRow';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bc-bg">
      <Header />
      <main className="flex-grow">
        <div className="bg-white">
          {/* HERO */}
          <section className="relative w-full h-[679px] overflow-hidden">
            <img
              src="/47-13.png"
              alt="Chez Bénin Cadeau"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-full">
              <div className="pt-[189px] max-w-[700px]">
                <h1 className="font-instrument font-bold text-white text-3xl md:text-4xl lg:text-[48px] leading-[1.22] mb-8">
                  Chez Bénin Cadeau, nous croyons que chaque cadeau raconte une
                  histoire.
                </h1>
                <p className="font-instrument font-medium text-white text-lg md:text-xl lg:text-2xl text-justify leading-[1.22] max-w-[751px] mb-10">
                  L&apos;idée est née d&apos;une envie simple : permettre à chacun d&apos;exprimer
                  son amour, sa gratitude ou son amitié de manière unique et
                  mémorable.
                </p>
                <Link href="/commander">
                  <button
                    className="px-8 py-4 rounded-[23px] font-instrument font-bold text-white text-base md:text-xl uppercase shadow-yellow-glow"
                    style={{
                      background:
                        'linear-gradient(180deg, #F7BD0D 72%, #DEDADA 100%)',
                    }}>
                    COMMANDER MAINTENANT
                  </button>
                </Link>
              </div>
            </div>
          </section>

          {/* 3 VALUE CARDS */}
          <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[120px] py-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24">
              {/* Notre mission */}
              <div className="bg-[#CBEDFF] rounded-3xl shadow-card p-6 pt-10 flex flex-col items-center text-center h-[514px]">
                <img
                  src="/61-50.png"
                  alt="Notre mission"
                  className="w-[120px] h-[120px] object-contain mb-6"
                />
                <h2 className="font-instrument font-bold text-2xl text-[#012C3F] mb-4">
                  Notre mission
                </h2>
                <p className="font-instrument text-base text-[#012C3F] text-justify leading-relaxed">
                  <strong>Transformer</strong> vos idées en{' '}
                  <strong>émotions tangibles</strong>. Qu&apos;il s&apos;agisse d&apos;un
                  anniversaire, d&apos;un mariage, d&apos;un baptême ou juste d&apos;un &quot;je pense à
                  toi&quot;, nous vous aidons à créer des cadeaux personnalisés qui font
                  sourire, rire ou même verser une petite larme de joie.
                </p>
              </div>

              {/* Nos valeurs */}
              <div className="bg-[#FFCBFF] rounded-3xl shadow-card p-6 pt-10 flex flex-col items-center text-center h-[514px]">
                <img
                  src="/61-51.png"
                  alt="Nos valeurs"
                  className="w-[120px] h-[120px] object-contain mb-6"
                />
                <h2 className="font-instrument font-bold text-2xl text-[#012C3F] mb-4">
                  Nos valeurs
                </h2>
                <div className="font-instrument text-sm md:text-base text-[#012C3F] text-justify leading-relaxed space-y-3">
                  <p>
                    <strong>Créativité :</strong> chaque cadeau est pensé pour être
                    aussi unique que la personne qui le reçoit.
                  </p>
                  <p>
                    <strong>Joie :</strong> nous ne vendons pas seulement des
                    produits, nous créons des moments heureux.
                  </p>
                  <p>
                    <strong>Accessibilité :</strong> offrir du bonheur doit être
                    simple, rapide et possible partout au Bénin.
                  </p>
                </div>
              </div>

              {/* Nos engagements */}
              <div className="bg-[#CDFFCB] rounded-3xl shadow-card p-6 pt-10 flex flex-col items-center text-center h-[514px]">
                <img
                  src="/61-51.png"
                  alt="Nos engagements"
                  className="w-[120px] h-[120px] object-contain mb-6"
                />
                <h2 className="font-instrument font-bold text-2xl text-[#012C3F] mb-4">
                  Nos engagements
                </h2>
                <div className="font-instrument text-base text-[#012C3F] text-justify leading-relaxed space-y-3">
                  <p>
                    Des <strong>produits de qualité,</strong> soigneusement
                    sélectionnés.
                  </p>
                  <p>
                    Une <strong>personnalisation sur-mesure</strong>, fidèle à vos
                    envies.
                  </p>
                  <p>
                    Une <strong>livraison fiable</strong>, pour que votre surprise
                    arrive dans les temps.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* QUOTE SECTION */}
          <section className="relative w-full mb-16">
            <div className="relative h-[527px] md:h-[634px]">
              {/* Background image */}
              <img
                src="/55-39.png"
                alt="Couple recevant un cadeau"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Yellow box on right */}
              <div className="absolute top-0 right-0 lg:right-[112px] bottom-0 w-full md:w-[436px] bg-bc-yellow rounded-3xl shadow-card flex items-center px-8 md:px-10">
                <p className="font-instrument font-bold text-2xl md:text-3xl text-white text-justify leading-tight">
                  <strong>Bénin Cadeau,</strong> c&apos;est bien plus qu&apos;une boutique en
                  ligne : c&apos;est un partenaire pour vos plus beaux moments de
                  partage.
                </p>
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
