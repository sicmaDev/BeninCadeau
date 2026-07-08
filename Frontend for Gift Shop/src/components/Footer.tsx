import { MapPin, Phone, Mail, Facebook, Instagram } from "lucide-react";
import { useRouter } from "../lib/context";

export default function Footer() {
  const { navigate } = useRouter();

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-primary font-bold text-sm">BC</span>
              </div>
              <div>
                <p className="font-display text-lg font-semibold leading-tight">Bénin Cadeau</p>
                <p className="text-white/60 text-xs">Offrir avec élégance</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              La référence des cadeaux au Bénin. Livraison rapide à Cotonou et dans tout le pays.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-accent mb-4 text-sm uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2">
              {[
                { label: "Accueil", page: "home" as const },
                { label: "Catalogue", page: "catalogue" as const },
                { label: "Mon panier", page: "cart" as const },
                { label: "Mon compte", page: "account" as const },
                { label: "À propos", page: "about" as const },
              ].map(({ label, page }) => (
                <li key={page}>
                  <button
                    onClick={() => navigate(page)}
                    className="text-white/70 hover:text-accent text-sm transition-colors"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-accent mb-4 text-sm uppercase tracking-wider">Occasions</h4>
            <ul className="space-y-2">
              {["Anniversaire", "Mariage", "Naissance", "Saint-Valentin", "Entreprise", "Fête"].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => navigate("catalogue", { category: cat.toLowerCase() })}
                    className="text-white/70 hover:text-accent text-sm transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-accent mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-accent mt-0.5 flex-shrink-0" />
                <span className="text-white/70 text-sm">Cotonou, Bénin<br />Akpakpa, Carrefour</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-accent flex-shrink-0" />
                <a href="tel:+22997000000" className="text-white/70 hover:text-accent text-sm transition-colors">
                  +229 97 00 00 00
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-accent flex-shrink-0" />
                <a href="mailto:contact@benincadeau.bj" className="text-white/70 hover:text-accent text-sm transition-colors">
                  contact@benincadeau.bj
                </a>
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-8 h-8 bg-white/10 hover:bg-accent hover:text-primary rounded-lg flex items-center justify-center transition-colors" aria-label="Facebook">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 hover:bg-accent hover:text-primary rounded-lg flex items-center justify-center transition-colors" aria-label="Instagram">
                <Instagram size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/50 text-xs">
            © 2025 Bénin Cadeau. Tous droits réservés.
          </p>
          <p className="text-white/50 text-xs">
            Paiement sécurisé via <span className="text-accent font-medium">FedaPay</span> · MTN MoMo · Moov Money
          </p>
        </div>
      </div>
    </footer>
  );
}
