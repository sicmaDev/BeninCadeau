"use client";

import { MapPin, Phone, Mail } from "lucide-react";
import { useRouter } from "../lib/context";

export default function Footer() {
  const { navigate } = useRouter();

  return (
    <footer className="bg-primary text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Main Footer Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          
          {/* 1. Brand Block */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-3 mb-3">
              <img src="/1-19.png" alt="Bénin Cadeau" className="w-14 h-14 sm:w-16 sm:h-16 object-contain" />
              <div>
                <p className="font-display text-lg sm:text-xl font-bold leading-tight text-white">Bénin Cadeau</p>
                <p className="text-accent text-xs font-semibold tracking-wide">Offrir avec élégance</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-sm">
              La référence des cadeaux au Bénin. Sélection exclusive et livraison rapide à Cotonou et dans tout le pays.
            </p>
          </div>

          {/* 2 & 3. Navigation & Occasions (2-column layout on mobile) */}
          <div className="grid grid-cols-2 gap-6 sm:gap-8 md:col-span-1 lg:col-span-2 py-4 md:py-0 border-y border-white/10 md:border-y-0">
            {/* Navigation Links */}
            <div>
              <h4 className="font-semibold text-accent mb-3 text-xs sm:text-sm uppercase tracking-wider">Navigation</h4>
              <ul className="space-y-2">
                {[
                  { label: "Accueil", page: "home" as const },
                  { label: "Catalogue", page: "catalogue" as const },
                  { label: "Mon panier", page: "cart" as const },
                  { label: "Mon compte", page: "account" as const },
                  { label: "À propos", page: "about" as const },
                  { label: "Contact", page: "contact" as const },
                ].map(({ label, page }) => (
                  <li key={page}>
                    <button
                      onClick={() => navigate(page)}
                      className="text-white/70 hover:text-accent text-sm py-0.5 transition-colors text-left w-full cursor-pointer"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Occasions / Categories */}
            <div>
              <h4 className="font-semibold text-accent mb-3 text-xs sm:text-sm uppercase tracking-wider">Occasions</h4>
              <ul className="space-y-2">
                {["Anniversaire", "Mariage", "Naissance", "Saint-Valentin", "Entreprise", "Fête"].map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => navigate("catalogue", { category: cat.toLowerCase() })}
                      className="text-white/70 hover:text-accent text-sm py-0.5 transition-colors text-left w-full cursor-pointer"
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. Contact Block */}
          <div className="flex flex-col">
            <h4 className="font-semibold text-accent mb-3 text-xs sm:text-sm uppercase tracking-wider">Contact & Suivi</h4>
            <ul className="space-y-3 mb-4">
              <li className="flex items-start gap-3 text-white/70 text-sm">
                <MapPin size={17} className="text-accent mt-0.5 flex-shrink-0" />
                <span>Cotonou, Bénin<br />Akpakpa, Carrefour</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={17} className="text-accent flex-shrink-0" />
                <a href="tel:+2290163904000" className="text-white/70 hover:text-accent text-sm transition-colors">
                  +229 01 63 90 40 00
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={17} className="text-accent flex-shrink-0" />
                <a href="mailto:contact@benincadeau.bj" className="text-white/70 hover:text-accent text-sm transition-colors">
                  contact@benincadeau.bj
                </a>
              </li>
            </ul>

            {/* Social Media Links */}
            <div className="flex items-center gap-2.5 mt-auto pt-2">
              <a 
                href="#" 
                className="w-9 h-9 bg-white/10 hover:bg-accent hover:text-primary rounded-xl flex items-center justify-center transition-all duration-300 active:scale-95" 
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-9 h-9 bg-white/10 hover:bg-accent hover:text-primary rounded-xl flex items-center justify-center transition-all duration-300 active:scale-95" 
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright and Payment methods */}
        <div className="mt-10 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-white/60 text-xs">
            © {new Date().getFullYear()} Bénin Cadeau. Tous droits réservés.
          </p>
          <p className="text-white/60 text-xs flex flex-wrap items-center justify-center gap-1">
            <span>Paiement sécurisé via</span>
            <span className="text-accent font-semibold px-1 py-0.5 bg-white/10 rounded">FedaPay</span>
            <span>· MTN MoMo · Moov Money</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
