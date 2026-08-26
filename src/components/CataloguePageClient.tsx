"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, Gift, Cake, Sparkles, Baby, Briefcase, Heart, PartyPopper } from "lucide-react";
import type { Product } from "@/lib/context";
import { useRouter } from "@/lib/context";
import ProductCard, { formatPrice } from "@/components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";

const PAGE_SIZE = 12;

interface Category {
  id: string;
  name: string;
  emoji: string;
  slug: string;
  description: string;
}

export function getCategoryIcon(slug: string, name: string) {
  const text = `${slug} ${name}`.toLowerCase();
  if (text.includes("anniv")) return Cake;
  if (text.includes("mariag") || text.includes("wedding")) return Sparkles;
  if (text.includes("naiss") || text.includes("bébé") || text.includes("baby")) return Baby;
  if (text.includes("entreprise") || text.includes("pro") || text.includes("corporate") || text.includes("business")) return Briefcase;
  if (text.includes("valentin") || text.includes("amour") || text.includes("love")) return Heart;
  if (text.includes("fêt") || text.includes("celebration") || text.includes("noel") || text.includes("party")) return PartyPopper;
  return Gift;
}

interface Props {
  categories: Category[];
  products: Product[];
}

export default function CataloguePageClient({ categories, products }: Props) {
  const { params } = useRouter();
  const [search, setSearch] = useState(params.search || "");
  const [activeCategory, setActiveCategory] = useState(params.category || "all");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    if (params.search) setSearch(params.search);
    if (params.category) setActiveCategory(params.category);
  }, [params]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.isActive);

    if (activeCategory !== "all") {
      list = list.filter((p) => p.category === activeCategory || p.tags.includes(activeCategory));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }

    switch (sortBy) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "popular":
        list = [...list].sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
        break;
    }

    return list;
  }, [products, search, activeCategory, sortBy]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug);
    setCurrentPage(1);
    setFilterOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <div className="font-body min-h-screen">
      {/* Banner */}
      <section className="relative h-[250px] sm:h-[300px] flex items-center justify-center overflow-hidden mb-8">
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            src="/images/catalogue_banner.png"
            alt="Catalogue"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 tracking-tight"
          >
            Catalogue
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-accent text-sm sm:text-base md:text-lg font-medium max-w-xl mx-auto opacity-90"
          >
            Boutique en ligne
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-muted-foreground text-sm mb-6 animate-pulse"
        >
          {filtered.length} cadeau{filtered.length !== 1 ? "x" : ""} disponible{filtered.length !== 1 ? "s" : ""}
        </motion.p>

        {/* Search + Sort bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Rechercher un cadeau..."
              className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-border rounded-xl text-sm text-foreground outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            {search && (
              <button type="button" onClick={() => { setSearch(""); setCurrentPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            )}
          </form>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2.5 bg-input-background border border-border rounded-xl text-sm text-foreground outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="default">Trier par défaut</option>
              <option value="popular">Les plus populaires</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>

            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="sm:hidden flex items-center gap-2 px-3 py-2.5 bg-input-background border border-border rounded-xl text-sm text-foreground"
            >
              <SlidersHorizontal size={16} />
              Filtrer
            </button>
          </div>
        </div>

        {/* Category pills */}
        <div className={`${filterOpen ? "block" : "hidden sm:flex"} sm:flex flex-wrap gap-2 mb-8`}>
          <button
            onClick={() => handleCategoryChange("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              activeCategory === "all"
                ? "bg-primary text-white"
                : "bg-card border border-border text-foreground hover:border-primary hover:text-primary"
            }`}
          >
            Toutes les occasions
          </button>
          {categories.map((cat) => {
            const IconComponent = getCategoryIcon(cat.slug, cat.name);
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 ${
                  activeCategory === cat.slug
                    ? "bg-primary text-white"
                    : "bg-card border border-border text-foreground hover:border-primary hover:text-primary"
                }`}
              >
                <IconComponent size={15} className={activeCategory === cat.slug ? "text-white" : "text-accent"} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Products grid */}
        {paginated.length > 0 ? (
          <>
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              <AnimatePresence mode="popLayout">
                {paginated.map((product) => (
                  <motion.div
                    layout
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-border text-foreground disabled:opacity-40 hover:bg-muted transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-colors ${
                      page === currentPage
                        ? "bg-primary text-white"
                        : "border border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-border text-foreground disabled:opacity-40 hover:bg-muted transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-6xl mb-4">🔍</p>
            <h3 className="font-display text-xl font-semibold text-primary mb-2">Aucun résultat</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Aucun cadeau ne correspond à votre recherche.
            </p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("all"); }}
              className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
