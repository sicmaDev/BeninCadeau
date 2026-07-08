import { useState } from "react";
import { ShoppingCart, User, Menu, X, Search } from "lucide-react";
import { useRouter } from "../lib/context";
import { useCart } from "../lib/context";
import { useAuth } from "../lib/context";

export default function Navbar() {
  const { navigate } = useRouter();
  const { cartCount } = useCart();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

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
            className="flex items-center gap-2 flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow">
              <span className="text-primary font-bold text-xs leading-tight text-center">BC</span>
            </div>
            <span className="text-white font-display text-lg font-semibold hidden sm:block">
              Bénin Cadeau
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => navigate("home")} className="text-white/80 hover:text-accent text-sm font-medium transition-colors">
              Accueil
            </button>
            <button onClick={() => navigate("catalogue")} className="text-white/80 hover:text-accent text-sm font-medium transition-colors">
              Catalogue
            </button>
            <button onClick={() => navigate("about")} className="text-white/80 hover:text-accent text-sm font-medium transition-colors">
              À propos
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-white/80 hover:text-accent transition-colors rounded-lg hover:bg-white/10"
              aria-label="Rechercher"
            >
              <Search size={20} />
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate("cart")}
              className="relative p-2 text-white/80 hover:text-accent transition-colors rounded-lg hover:bg-white/10"
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
              onClick={() => navigate("account")}
              className="p-2 text-white/80 hover:text-accent transition-colors rounded-lg hover:bg-white/10"
              aria-label="Mon compte"
            >
              <User size={20} />
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-white/80 hover:text-accent transition-colors rounded-lg hover:bg-white/10"
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
              { label: "Mon panier", page: "cart" as const },
              { label: user ? "Mon compte" : "Connexion", page: "account" as const },
              { label: "À propos", page: "about" as const },
            ].map(({ label, page }) => (
              <button
                key={page}
                onClick={() => { navigate(page); setMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg text-sm transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
