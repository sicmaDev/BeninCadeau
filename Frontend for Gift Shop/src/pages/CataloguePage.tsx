import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { products, categories } from "../data/mockData";
import { useRouter } from "../lib/context";
import ProductCard from "../components/ProductCard";

const PAGE_SIZE = 12;

export default function CataloguePage() {
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
  }, [search, activeCategory, sortBy]);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-body">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-primary mb-2">Notre Catalogue</h1>
        <p className="text-muted-foreground">
          {filtered.length} cadeau{filtered.length !== 1 ? "x" : ""} disponible{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

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

      {/* Category pills — desktop: horizontal scroll, mobile: collapsible */}
      <div className={`${filterOpen ? "block" : "hidden sm:flex"} sm:flex flex-wrap gap-2 mb-8`}>
        <button
          onClick={() => handleCategoryChange("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
            activeCategory === "all"
              ? "bg-primary text-white"
              : "bg-card border border-border text-foreground hover:border-primary hover:text-primary"
          }`}
        >
          Toutes les occasions
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.slug)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeCategory === cat.slug
                ? "bg-primary text-white"
                : "bg-card border border-border text-foreground hover:border-primary hover:text-primary"
            }`}
          >
            <span>{cat.emoji}</span> {cat.name}
          </button>
        ))}
      </div>

      {/* Products grid */}
      {paginated.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {paginated.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

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
        <div className="text-center py-20">
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
        </div>
      )}
    </div>
  );
}
