import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative">
      {/* Curved top using SVG that fills full width */}
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="w-full block h-[60px] md:h-[100px] -mb-px"
        aria-hidden="true">
        <path
          d="M0,100 C480,0 960,0 1440,100 L1440,100 L0,100 Z"
          fill="#10213B" />
      </svg>

      <div className="bg-bc-navy text-white font-montserrat pt-8 pb-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Column 1: Brand */}
            <div className="space-y-6">
              <img
                src="/96-73.png"
                alt="Bénin Cadeau"
                className="w-[140px] h-auto object-contain" />
              <p className="font-montserrat font-semibold text-lg leading-relaxed max-w-[265px]">
                Offrez de l&apos;émotion, pas juste un objet.
              </p>
            </div>

            {/* Column 2: Localisation */}
            <div className="space-y-4">
              <h3 className="font-montserrat font-black text-xl">
                Localisation
              </h3>
              <p className="font-montserrat font-semibold text-base leading-relaxed">
                Abomey-calavi,carrefour
                <br />
                kpota, 2ème étage
                <br />
                immeuble Tankaya-Banque
                <br />
                Atlantique
              </p>
            </div>

            {/* Column 3: Nav */}
            <div className="space-y-3">
              <ul className="space-y-2 font-montserrat font-semibold text-lg">
                <li>
                  <Link href="/" className="hover:text-bc-yellow transition-colors">
                    Acceuil
                  </Link>
                </li>
                <li>
                  <Link href="/a-propos" className="hover:text-bc-yellow transition-colors">
                    A propos
                  </Link>
                </li>
                <li>
                  <Link href="/nos-propositions" className="hover:text-bc-yellow transition-colors">
                    Nos propositions
                  </Link>
                </li>
                <li>
                  <Link href="/nos-packs" className="hover:text-bc-yellow transition-colors">
                    Galerie
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-bc-yellow transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-bc-yellow transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Post récents */}
            <div className="space-y-3">
              <h3 className="font-montserrat font-black text-xl">
                Post récents
              </h3>
              <ul className="space-y-2 font-montserrat font-semibold text-lg">
                <li>
                  <Link href="/nos-propositions" className="hover:text-bc-yellow transition-colors">
                    Nos propositions
                  </Link>
                </li>
                <li>
                  <Link href="/nos-packs" className="hover:text-bc-yellow transition-colors">
                    Galerie
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-bc-yellow transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-bc-yellow transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter pill */}
          <div className="bg-white rounded-[74px] py-4 px-8 flex items-center justify-center">
            <p className="font-montserrat font-semibold text-base md:text-xl text-bc-purple text-center">
              Inscrivez-vous à notre newsletter pour recevoir nos offres et
              inspirations
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
