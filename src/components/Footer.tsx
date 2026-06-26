"use client";

import Link from 'next/link';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-zinc-200/60 bg-zinc-50/80">
      <div className="font-instrument pt-16 pb-12 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
            
            {/* Column 1: Brand & Description */}
            <div className="space-y-5">
              <img
                src="/1-19.png"
                alt="Bénin Cadeau"
                className="w-[90px] h-auto object-contain"
              />
              <p className="text-sm text-zinc-500 leading-relaxed max-w-[270px]">
                Offrez de l&apos;émotion, célébrez chaque instant et faites plaisir à vos proches avec nos créations uniques.
              </p>
              <div className="flex space-x-3 pt-1">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8.5 h-8.5 rounded-full bg-white hover:bg-bc-yellow/10 border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-bc-purple transition-all shadow-sm">
                  <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8.5 h-8.5 rounded-full bg-white hover:bg-bc-yellow/10 border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-bc-purple transition-all shadow-sm">
                  <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Contact & Access */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[13px] tracking-wider uppercase text-zinc-900">
                Contact & Accès
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-2.5 text-zinc-500">
                  <MapPin size={16} className="text-zinc-400 mt-1.5 flex-shrink-0" />
                  <span className="text-xs leading-relaxed">
                    Abomey-Calavi, carrefour Kpota, 2ème étage, immeuble Tankaya - Banque Atlantique
                  </span>
                </li>
                <li className="flex items-center space-x-2.5 text-zinc-500">
                  <Phone size={16} className="text-zinc-400 flex-shrink-0" />
                  <span className="text-xs font-semibold text-zinc-800">+229 55 25 00 00</span>
                </li>
                <li className="flex items-center space-x-2.5 text-zinc-500">
                  <Mail size={16} className="text-zinc-400 flex-shrink-0" />
                  <span className="text-xs">contact@benincadeau.bj</span>
                </li>
              </ul>
            </div>

            {/* Column 3: Shop Quicklinks */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[13px] tracking-wider uppercase text-zinc-900">
                Boutique
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-zinc-500 hover:text-bc-purple text-xs font-medium transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 group-hover:bg-bc-purple mr-2 transition-all" />
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link href="/catalogue" className="text-zinc-500 hover:text-bc-purple text-xs font-medium transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 group-hover:bg-bc-purple mr-2 transition-all" />
                    Notre Catalogue
                  </Link>
                </li>
                <li>
                  <Link href="/nos-propositions" className="text-zinc-500 hover:text-bc-purple text-xs font-medium transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 group-hover:bg-bc-purple mr-2 transition-all" />
                    Nos Propositions
                  </Link>
                </li>
                <li>
                  <Link href="/a-propos" className="text-zinc-500 hover:text-bc-purple text-xs font-medium transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 group-hover:bg-bc-purple mr-2 transition-all" />
                    À propos de nous
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Discover */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[13px] tracking-wider uppercase text-zinc-900">
                Découvrir
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className="text-zinc-500 hover:text-bc-purple text-xs font-medium transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 group-hover:bg-bc-purple mr-2 transition-all" />
                    Le Blog Cadeaux
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-zinc-500 hover:text-bc-purple text-xs font-medium transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 group-hover:bg-bc-purple mr-2 transition-all" />
                    Nous Contacter
                  </Link>
                </li>
                <li>
                  <Link href="/compte" className="text-zinc-500 hover:text-bc-purple text-xs font-medium transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 group-hover:bg-bc-purple mr-2 transition-all" />
                    Mon Compte Client
                  </Link>
                </li>
              </ul>
            </div>

          </div>

          {/* Interactive Newsletter Box */}
          <div className="bg-white rounded-2xl border border-zinc-200/60 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto shadow-sm">
            <div className="text-center md:text-left space-y-1.5 md:max-w-md">
              <h4 className="font-bold text-sm md:text-base text-zinc-900">
                Inscrivez-vous à notre newsletter
              </h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Recevez nos idées de cadeaux originales, offres exclusives et inspirations directement dans votre boîte mail.
              </p>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="flex w-full md:w-auto md:min-w-[360px] gap-2">
              <input
                type="email"
                placeholder="Votre adresse e-mail"
                required
                className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-800 focus:outline-none focus:border-bc-purple focus:ring-1 focus:ring-bc-purple flex-grow placeholder:text-zinc-400 font-medium"
              />
              <button
                type="submit"
                className="bg-bc-yellow hover:bg-yellow-400 text-bc-purple font-bold text-xs rounded-xl px-5 py-2.5 flex items-center transition-all duration-300 cursor-pointer shadow-sm"
              >
                S&apos;abonner <ArrowRight size={13} className="ml-1.5" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </footer>
  );
}
