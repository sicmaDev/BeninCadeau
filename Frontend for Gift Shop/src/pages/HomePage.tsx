import { ArrowRight, Star, Truck, Shield, Gift, Phone } from "lucide-react";
import { categories, products, formatPrice } from "../data/mockData";
import { useRouter } from "../lib/context";
import ProductCard from "../components/ProductCard";

export default function HomePage() {
  const { navigate } = useRouter();
  const popular = products.filter((p) => p.isPopular).slice(0, 8);

  return (
    <div className="font-body">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-primary overflow-hidden min-h-[520px] flex items-center">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i} className="absolute text-4xl select-none" style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 40 - 20}deg)`,
              opacity: Math.random() * 0.5 + 0.2,
            }}>🎁</span>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 grid lg:grid-cols-2 gap-10 items-center w-full">
          <div>
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              🎉 Livraison rapide à Cotonou
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-tight font-semibold mb-6">
              Offrez ce qui vient{" "}
              <span className="text-accent italic">du cœur</span>
            </h1>
            <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-lg">
              Bénin Cadeau vous propose une sélection unique de cadeaux pour toutes vos occasions — anniversaires, mariages, naissances et bien plus encore.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("catalogue")}
                className="inline-flex items-center gap-2 bg-accent text-primary font-bold px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors shadow-lg text-base"
              >
                Voir le catalogue <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate("about")}
                className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors text-base"
              >
                En savoir plus
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 mt-8">
              {[
                { icon: <Truck size={16} />, text: "Livraison J+1" },
                { icon: <Shield size={16} />, text: "Paiement sécurisé" },
                { icon: <Star size={16} />, text: "Qualité garantie" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-white/70 text-sm">
                  <span className="text-accent">{icon}</span>
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Hero image collage */}
          <div className="hidden lg:grid grid-cols-2 gap-4 max-w-sm ml-auto">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden aspect-[3/4] bg-muted shadow-xl mt-8">
                <img
                  src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&h=400&fit=crop&auto=format"
                  alt="Coffret cadeau"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden aspect-square bg-muted shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1681183183825-cf959ebdc3c2?w=300&h=300&fit=crop&auto=format"
                  alt="Parfum et fleurs"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-square bg-muted shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1544639044-4f142ceb6a2b?w=300&h=300&fit=crop&auto=format"
                  alt="Cadeau emballé"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ──────────────────────────────────────────────────────── */}
      <section className="bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-center gap-8">
          {[
            { value: "500+", label: "Commandes livrées" },
            { value: "12", label: "Catégories de cadeaux" },
            { value: "24h", label: "Délai moyen livraison" },
            { value: "4.9★", label: "Note client" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="font-display text-2xl font-bold text-primary">{value}</p>
              <p className="text-primary/70 text-xs font-medium">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Parcourir par occasion</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-primary">Choisissez votre occasion</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate("catalogue", { category: cat.slug })}
              className="group flex flex-col items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-accent hover:bg-secondary transition-all duration-200 hover:shadow-md"
            >
              <span className="text-4xl group-hover:scale-110 transition-transform duration-200">
                {cat.emoji}
              </span>
              <span className="text-sm font-semibold text-foreground group-hover:text-primary text-center leading-tight">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Popular Products ────────────────────────────────────────────────── */}
      <section className="bg-muted/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Nos coups de cœur</p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-primary">Produits populaires</h2>
            </div>
            <button
              onClick={() => navigate("catalogue")}
              className="hidden sm:flex items-center gap-2 text-primary font-semibold text-sm hover:text-accent transition-colors"
            >
              Tout voir <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {popular.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <button
              onClick={() => navigate("catalogue")}
              className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
            >
              Voir tout le catalogue <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Simple & rapide</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-primary">Comment ça marche ?</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-8 relative">
          {/* Connector lines */}
          <div className="hidden sm:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-accent/30" />

          {[
            {
              step: "01",
              icon: <Gift size={28} />,
              title: "Choisissez votre cadeau",
              desc: "Parcourez notre catalogue et trouvez le cadeau parfait. Filtrez par occasion, budget ou catégorie.",
            },
            {
              step: "02",
              icon: <Shield size={28} />,
              title: "Payez en toute sécurité",
              desc: "Réglez votre commande via MTN MoMo, Moov Money ou carte bancaire. Paiement 100% sécurisé via FedaPay.",
            },
            {
              step: "03",
              icon: <Truck size={28} />,
              title: "Recevez à domicile",
              desc: "Votre commande est préparée avec soin et livrée rapidement à votre adresse partout au Bénin.",
            },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                  {icon}
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-accent text-primary font-bold text-xs rounded-full flex items-center justify-center">
                  {step}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold text-primary mb-3">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Banner CTA ─────────────────────────────────────────────────────── */}
      <section className="mx-4 sm:mx-6 max-w-7xl lg:mx-auto mb-16 rounded-3xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[#2A3F9D]" />
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #F5A623 0%, transparent 50%), radial-gradient(circle at 80% 20%, #D4352B 0%, transparent 40%)" }}
        />
        <div className="relative px-8 py-14 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl text-white font-semibold mb-2">
              Une commande entreprise ?
            </h2>
            <p className="text-white/70 text-sm">
              Goodies, récompenses, cadeaux corporate — contactez-nous pour un devis personnalisé.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <a
              href="https://wa.me/22997000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-5 py-3 rounded-xl hover:bg-[#22c55e] transition-colors text-sm"
            >
              <Phone size={16} />
              WhatsApp
            </a>
            <button
              onClick={() => navigate("catalogue", { category: "entreprise" })}
              className="inline-flex items-center gap-2 bg-accent text-primary font-bold px-5 py-3 rounded-xl hover:bg-accent/90 transition-colors text-sm"
            >
              Voir les offres <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
