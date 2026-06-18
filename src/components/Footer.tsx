"use client";

import Link from 'next/link';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative mt-auto">
      {/* Curved top using SVG that fills full width */}
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="w-full block h-[40px] md:h-[70px] -mb-px"
        aria-hidden="true">
        <path
          d="M0,0 C480,80 960,80 1440,0 L1440,100 L0,100 Z"
          fill="#011E2D" />
      </svg>

      <div className="bg-bc-navyDark text-white font-instrument pt-12 pb-16 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-bc-purple/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-bc-yellow/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            {/* Column 1: Brand & Socials */}
            <div className="space-y-6">
              <img
                src="/96-73.png"
                alt="Bénin Cadeau"
                className="w-[130px] h-auto object-contain brightness-110"
              />
              <p className="font-instrument font-medium text-base text-gray-300 leading-relaxed max-w-[270px]">
                Offrez de l&apos;émotion, célébrez chaque instant et faites plaisir à vos proches avec nos créations uniques.
              </p>
              <div className="flex space-x-4 pt-2">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-bc-yellow/20 border border-white/10 hover:border-bc-yellow flex items-center justify-center text-gray-300 hover:text-bc-yellow transition-all duration-300">
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-bc-yellow/20 border border-white/10 hover:border-bc-yellow flex items-center justify-center text-gray-300 hover:text-bc-yellow transition-all duration-300">
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Localisation / Contacts */}
            <div className="space-y-6">
              <h3 className="font-montserrat font-bold text-lg tracking-wider uppercase text-bc-yellow border-b border-white/10 pb-2 inline-block">
                Contact & Accès
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3 text-gray-300">
                  <MapPin size={18} className="text-bc-yellow mt-1 flex-shrink-0" />
                  <span className="text-sm leading-relaxed">
                    Abomey-Calavi, carrefour Kpota, 2ème étage, immeuble Tankaya - Banque Atlantique
                  </span>
                </li>
                <li className="flex items-center space-x-3 text-gray-300">
                  <Phone size={18} className="text-bc-yellow flex-shrink-0" />
                  <span className="text-sm font-semibold">+229 55 25 00 00</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-300">
                  <Mail size={18} className="text-bc-yellow flex-shrink-0" />
                  <span className="text-sm">contact@benincadeau.bj</span>
                </li>
              </ul>
            </div>

            {/* Column 3: Navigation Rapide */}
            <div className="space-y-6">
              <h3 className="font-montserrat font-bold text-lg tracking-wider uppercase text-bc-yellow border-b border-white/10 pb-2 inline-block">
                Boutique
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-bc-yellow text-sm font-medium transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-bc-yellow/40 group-hover:bg-bc-yellow mr-2 transition-all" />
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link href="/catalogue" className="text-gray-300 hover:text-bc-yellow text-sm font-medium transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-bc-yellow/40 group-hover:bg-bc-yellow mr-2 transition-all" />
                    Notre Catalogue
                  </Link>
                </li>
                <li>
                  <Link href="/nos-propositions" className="text-gray-300 hover:text-bc-yellow text-sm font-medium transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-bc-yellow/40 group-hover:bg-bc-yellow mr-2 transition-all" />
                    Nos Propositions
                  </Link>
                </li>
                <li>
                  <Link href="/a-propos" className="text-gray-300 hover:text-bc-yellow text-sm font-medium transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-bc-yellow/40 group-hover:bg-bc-yellow mr-2 transition-all" />
                    À propos de nous
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Informations */}
            <div className="space-y-6">
              <h3 className="font-montserrat font-bold text-lg tracking-wider uppercase text-bc-yellow border-b border-white/10 pb-2 inline-block">
                Découvrir
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/blog" className="text-gray-300 hover:text-bc-yellow text-sm font-medium transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-bc-yellow/40 group-hover:bg-bc-yellow mr-2 transition-all" />
                    Le Blog Cadeaux
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-bc-yellow text-sm font-medium transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-bc-yellow/40 group-hover:bg-bc-yellow mr-2 transition-all" />
                    Nous Contacter
                  </Link>
                </li>
                <li>
                  <Link href="/compte" className="text-gray-300 hover:text-bc-yellow text-sm font-medium transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-bc-yellow/40 group-hover:bg-bc-yellow mr-2 transition-all" />
                    Mon Compte Client
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Interactive Newsletter Box */}
          <div className="glass-panel-dark rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto shadow-premium">
            <div className="text-center md:text-left space-y-2 md:max-w-md">
              <h4 className="font-montserrat font-extrabold text-base md:text-lg text-white">
                Inscrivez-vous à notre newsletter
              </h4>
              <p className="text-xs text-gray-300">
                Recevez nos idées de cadeaux originales, offres exclusives et inspirations directement dans votre boîte mail.
              </p>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="flex w-full md:w-auto md:min-w-[380px] gap-2.5">
              <input
                type="email"
                placeholder="Votre adresse e-mail"
                required
                className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-bc-yellow focus:ring-1 focus:ring-bc-yellow flex-grow placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="bg-bc-yellow hover:bg-yellow-500 text-bc-purple font-bold text-sm rounded-2xl px-5 py-3 flex items-center transition-all duration-300 cursor-pointer shadow-yellow-glow"
              >
                S&apos;abonner <ArrowRight size={14} className="ml-1.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}

