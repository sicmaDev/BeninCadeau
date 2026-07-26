"use client";

import { useState } from "react";
import { ShoppingCart, User, Menu, X, Search, Package } from "lucide-react";
import { useRouter } from "../lib/context";
import { useCart } from "../lib/context";
import { useAuth } from "../lib/context";
import { useSearchParams } from "next/navigation";

export default function Navbar() {
  const { page: activePage, navigate } = useRouter();
  const { cartCount } = useCart();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "orders";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate("catalogue", { search: searchVal.trim() });
      setSearchOpen(false);
      setSearchVal("");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate("home")}
            className="flex items-center gap-2 flex-shrink-0 cursor-pointer"
          >
            <img src="/1-19.png" alt="Bénin Cadeau" className="w-12 h-12 object-contain" />
            <span className="text-white font-display text-lg font-semibold hidden sm:block">
              Bénin Cadeau
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate("home")}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                activePage === "home" ? "text-accent font-bold" : "text-white/80 hover:text-accent"
              }`}
            >
              Accueil
            </button>
            <button
              onClick={() => navigate("catalogue")}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                activePage === "catalogue" ? "text-accent font-bold" : "text-white/80 hover:text-accent"
              }`}
            >
              Catalogue
            </button>
            <button
              onClick={() => navigate("account", { tab: "orders" })}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                activePage === "account" && tab === "orders" ? "text-accent font-bold" : "text-white/80 hover:text-accent"
              }`}
            >
              Mes commandes
            </button>
            <button
              onClick={() => navigate("about")}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                activePage === "about" ? "text-accent font-bold" : "text-white/80 hover:text-accent"
              }`}
            >
              À propos
            </button>
            <button
              onClick={() => navigate("contact")}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                activePage === "contact" ? "text-accent font-bold" : "text-white/80 hover:text-accent"
              }`}
            >
              Contact
            </button>
            <button
              onClick={() => navigate("track-order")}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer px-3 py-1.5 rounded-lg border ${
                activePage === "track-order"
                  ? "border-accent text-accent font-bold bg-white/10"
                  : "border-white/30 text-white/80 hover:text-accent hover:border-accent hover:bg-white/10"
              }`}
            >
              <Package size={14} />
              Suivre ma commande
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-white/80 hover:text-accent transition-colors rounded-lg hover:bg-white/10 cursor-pointer"
              aria-label="Rechercher"
            >
              <Search size={20} />
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate("cart")}
              className={`relative p-2 transition-colors rounded-lg hover:bg-white/10 cursor-pointer ${
                activePage === "cart" ? "text-accent" : "text-white/80 hover:text-accent"
              }`}
              aria-label="Panier"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-primary text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            {/* Account */}
            <button
              onClick={() => navigate("account", { tab: "profile" })}
              className={`p-2 transition-colors rounded-lg hover:bg-white/10 cursor-pointer ${
                activePage === "account" && tab === "profile" ? "text-accent" : "text-white/80 hover:text-accent"
              }`}
              aria-label="Mon compte"
            >
              <User size={20} />
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-white/80 hover:text-accent transition-colors rounded-lg hover:bg-white/10 cursor-pointer"
              aria-label="Menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search bar dropdown */}
        {searchOpen && (
          <div className="pb-3">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                autoFocus
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Rechercher un cadeau..."
                className="flex-1 px-4 py-2 rounded-lg bg-white text-foreground text-sm outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-accent text-primary font-semibold rounded-lg text-sm hover:bg-accent/90 transition-colors"
              >
                Rechercher
              </button>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/20 py-3 space-y-1">
            {[
              { label: "Accueil", page: "home" as const },
              { label: "Catalogue", page: "catalogue" as const },
              { label: "Mes commandes", page: "account" as const, params: { tab: "orders" }, active: activePage === "account" && tab === "orders" },
              { label: "Mon panier", page: "cart" as const },
              { label: user ? "Mon profil" : "Connexion", page: "account" as const, params: { tab: "profile" }, active: activePage === "account" && tab === "profile" },
              { label: "À propos", page: "about" as const },
              { label: "Contact", page: "contact" as const },
              { label: "Suivre ma commande", page: "track-order" as const },
            ].map(({ label, page, params, active }) => {
              const isActive = active !== undefined ? active : activePage === page;
              return (
                <button
                  key={label}
                  onClick={() => { navigate(page, params); setMenuOpen(false); }}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                    isActive
                      ? "bg-white/10 text-accent font-bold border-l-2 border-accent rounded-l-none"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
