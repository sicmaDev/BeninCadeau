"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star, Truck, Shield, Gift, Phone, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import type { Product, PageName } from "@/lib/context";
import { useRouter } from "@/lib/context";
import ProductCard, { formatPrice } from "@/components/ProductCard";

interface Category {
  id: string;
  name: string;
  emoji: string;
  slug: string;
  description: string;
}

interface Props {
  categories: Category[];
  products: Product[];
}

// ── Hero Carousel ──────────────────────────────────────────────────────────

const HERO_SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1608825154649-2e9bb4cd4211?w=1600&h=900&fit=crop&auto=format",
    tag: "Livraison rapide à Cotonou",
    title: "Offrez ce qui vient",
    accent: "du cœur",
    sub: "Bénin Cadeau vous propose une sélection unique de cadeaux pour toutes vos occasions — anniversaires, mariages, naissances et bien plus.",
    cta: "Découvrir les cadeaux",
    ctaPage: "catalogue" as const,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1681183183825-cf959ebdc3c2?w=1600&h=900&fit=crop&auto=format",
    tag: "Saint-Valentin & Romance",
    title: "Exprimez votre amour",
    accent: "avec élégance",
    sub: "Bouquets premium, coffrets parfum, peluches géantes… Faites de chaque geste une déclaration mémorable.",
    cta: "Voir les cadeaux romantiques",
    ctaPage: "catalogue" as const,
    ctaParams: { category: "saint-valentin" },
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1770989064308-78baffbaa47e?w=1600&h=900&fit=crop&auto=format",
    tag: "Solutions corporate disponibles",
    title: "Cadeaux d'entreprise",
    accent: "sur mesure",
    sub: "Goodies personnalisés, récompenses collaborateurs et coffrets prestige pour vos clients et partenaires.",
    cta: "Voir les offres entreprise",
    ctaPage: "catalogue" as const,
    ctaParams: { category: "entreprise" },
  },
];

function HeroCarousel() {
  const { navigate } = useRouter();
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const goTo = (idx: number) => setCurrent(idx);
  const prev = () => goTo((current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const next = () => goTo((current + 1) % HERO_SLIDES.length);

  useEffect(() => {
    intervalRef.current = setInterval(next, 5500);
    return () => clearInterval(intervalRef.current);
  }, [current]);

  const slide = HERO_SLIDES[current];

  return (
    <section className="relative w-full overflow-hidden" style={{ height: "clamp(520px, 80vh, 780px)" }}>
      {HERO_SLIDES.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <img src={s.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, rgba(26,43,109,0.92) 0%, rgba(26,43,109,0.70) 45%, rgba(26,43,109,0.20) 100%)" }} />
        </div>
      ))}

      <div className="relative z-10 h-full max-w-7xl mx-auto px-12 sm:px-20 md:px-24 flex flex-col justify-center">
        <div className="max-w-2xl">
          <motion.span
            key={`tag-${current}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-widest mb-5"
          >
            <span className="w-5 h-px bg-accent inline-block" />
            {slide.tag}
          </motion.span>

          <motion.h1
            key={`h-${current}`}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] text-white font-semibold leading-[1.15] mb-5"
          >
            {slide.title}{" "}
            <em className="text-accent not-italic">{slide.accent}</em>
          </motion.h1>

          <motion.p
            key={`p-${current}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/75 text-base sm:text-lg leading-relaxed mb-9 max-w-lg"
          >
            {slide.sub}
          </motion.p>

          <motion.div
            key={`cta-${current}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.35 }}
            className="flex flex-wrap gap-3"
          >
            <button
              onClick={() => navigate(slide.ctaPage, (slide as any).ctaParams)}
              className="group inline-flex items-center gap-2 bg-accent text-primary font-bold px-7 py-3.5 rounded-xl hover:bg-white transition-colors text-sm shadow-lg cursor-pointer"
            >
              {slide.cta}
              <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="https://wa.me/22955250000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-sm backdrop-blur-sm"
            >
              <Phone size={15} /> Nous écrire
            </a>
          </motion.div>
        </div>
      </div>

      {/* Arrow controls */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/25 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/40 transition-colors cursor-pointer" aria-label="Précédent">
        <ChevronLeft size={20} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/25 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/40 transition-colors cursor-pointer" aria-label="Suivant">
        <ChevronRight size={20} />
      </button>

      {/* Slide dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 items-center">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} className={`rounded-full transition-all duration-300 cursor-pointer ${i === current ? "w-7 h-1.5 bg-accent" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"}`} aria-label={`Diapositive ${i + 1}`} />
        ))}
      </div>
    </section>
  );
}

export default function HomePageClient({ categories, products }: Props) {
  const { navigate } = useRouter();
  const popular = products.slice(0, 8);

  return (
    <div className="font-body">
      {/* ── Hero Carousel ── */}
      <HeroCarousel />

      {/* ── Stats Bar Redesign ── */}
      <section className="relative z-20 -mt-10 max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="bg-card rounded-3xl border border-border shadow-premium p-8 md:p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-border">
            {[
              { 
                value: "500+", 
                label: "Commandes livrées", 
                desc: "Partout au Bénin avec soin",
                icon: <Truck size={28} className="text-accent" /> 
              },
              { 
                value: `${categories.length}`, 
                label: "Catégories de cadeaux", 
                desc: "Pour toutes vos occasions",
                icon: <Gift size={28} className="text-accent" /> 
              },
              { 
                value: "24h", 
                label: "Délai de livraison", 
                desc: "Rapide et suivi en direct",
                icon: <Clock size={28} className="text-accent" /> 
              },
              { 
                value: "4.9★", 
                label: "Note de satisfaction", 
                desc: "Basée sur les avis clients",
                icon: <Star size={28} className="text-accent" /> 
              },
            ].map(({ value, label, desc, icon }, idx) => (
              <div 
                key={label} 
                className={`flex items-start gap-4 transition-transform hover:-translate-y-1 duration-300 ${
                  idx > 0 ? "pt-6 lg:pt-0 lg:pl-8" : ""
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center flex-shrink-0">
                  {icon}
                </div>
                <div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-primary leading-none mb-1">
                    {value}
                  </h3>
                  <p className="text-foreground font-semibold text-sm mb-0.5">{label}</p>
                  <p className="text-muted-foreground text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
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
