import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  ArrowRight, Star, Truck, Shield, Gift, Phone,
  ChevronLeft, ChevronRight, Quote, BadgeCheck,
  HeartHandshake, Zap, Package, Clock
} from "lucide-react";
import { categories, products, formatPrice } from "../data/mockData";
import { useRouter } from "../lib/context";
import ProductCard from "../components/ProductCard";

// ── SVG Category Icons ─────────────────────────────────────────────────────

const CategoryIcons: Record<string, React.FC<{ className?: string }>> = {
  anniversaire: ({ className }) => (
    <svg className={className} viewBox="0 0 40 40" fill="none">
      <rect x="6" y="22" width="28" height="13" rx="3" fill="currentColor" opacity=".12" />
      <rect x="6" y="22" width="28" height="13" rx="3" stroke="currentColor" strokeWidth="2" />
      <rect x="10" y="18" width="20" height="4" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M15 18c0-3 1.5-5.5 1.5-5.5S18 15 18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M22 18c0-3 1.5-5.5 1.5-5.5S25 15 25 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="16.5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="23.5" cy="12" r="1.5" fill="currentColor" />
    </svg>
  ),
  mariage: ({ className }) => (
    <svg className={className} viewBox="0 0 40 40" fill="none">
      <circle cx="13.5" cy="22" r="7" stroke="currentColor" strokeWidth="2.2" fill="currentColor" opacity=".07" />
      <circle cx="26.5" cy="22" r="7" stroke="currentColor" strokeWidth="2.2" fill="currentColor" opacity=".07" />
      <path d="M21 16c0-2.5 1.8-4 3.5-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  naissance: ({ className }) => (
    <svg className={className} viewBox="0 0 40 40" fill="none">
      <ellipse cx="20" cy="26" rx="13" ry="8" fill="currentColor" opacity=".1" stroke="currentColor" strokeWidth="2" />
      <path d="M11 26c0-5 4-9 9-9s9 4 9 9" stroke="currentColor" strokeWidth="2" />
      <circle cx="20" cy="14" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M15 34h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  entreprise: ({ className }) => (
    <svg className={className} viewBox="0 0 40 40" fill="none">
      <rect x="8" y="17" width="24" height="17" rx="2" fill="currentColor" opacity=".1" stroke="currentColor" strokeWidth="2" />
      <path d="M15 17v-4a1 1 0 011-1h8a1 1 0 011 1v4" stroke="currentColor" strokeWidth="2" />
      <path d="M8 25h24" stroke="currentColor" strokeWidth="1.5" />
      <rect x="17" y="22" width="6" height="5" rx="1" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  "saint-valentin": ({ className }) => (
    <svg className={className} viewBox="0 0 40 40" fill="none">
      <path d="M20 33C20 33 7 24.5 7 16.5a7 7 0 0113-3.5 7 7 0 0113 3.5C33 24.5 20 33 20 33z" fill="currentColor" opacity=".12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  ),
  fete: ({ className }) => (
    <svg className={className} viewBox="0 0 40 40" fill="none">
      <path d="M9 31L20 9l11 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 24h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="27" cy="13" r="2" fill="currentColor" opacity=".5" />
      <circle cx="13" cy="11" r="1.5" fill="currentColor" opacity=".4" />
      <circle cx="31" cy="21" r="1.5" fill="currentColor" opacity=".4" />
    </svg>
  ),
};

// ── Animated Counter ──────────────────────────────────────────────────────

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = to / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= to) { setVal(to); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [inView, to]);

  return <span ref={ref}>{val}{suffix}</span>;
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

      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-center">
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
            transition={{ duration: 0.45, delay: 0.3 }}
            className="flex flex-wrap gap-3"
          >
            <button
              onClick={() => navigate(slide.ctaPage, (slide as any).ctaParams)}
              className="group inline-flex items-center gap-2 bg-accent text-primary font-bold px-7 py-3.5 rounded-xl hover:bg-white transition-colors text-sm shadow-lg"
            >
              {slide.cta}
              <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="https://wa.me/22997000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-sm backdrop-blur-sm"
            >
              <Phone size={15} /> Nous appeler
            </a>
          </motion.div>
        </div>
      </div>

      {/* Arrow controls */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/25 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/40 transition-colors">
        <ChevronLeft size={20} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/25 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/40 transition-colors">
        <ChevronRight size={20} />
      </button>

      {/* Slide dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 items-center">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} className={`rounded-full transition-all duration-300 ${i === current ? "w-7 h-1.5 bg-accent" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"}`} />
        ))}
      </div>
    </section>
  );
}

// ── Fade-in on scroll ───────────────────────────────────────────────────────

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────

const TESTIMONIALS = [
  { name: "Adjoua Kossou", role: "Cliente", avatar: "AK", rating: 5, text: "J'ai commandé un coffret pour l'anniversaire de ma mère. Livraison rapide, emballage magnifique — elle était aux anges ! Je recommande vivement." },
  { name: "Olivier Dossou", role: "DRH · TechBénin", avatar: "OD", rating: 5, text: "Nous faisons appel à Bénin Cadeau pour tous nos cadeaux corporate. Qualité irréprochable, ponctualité et personnalisation parfaite. Un partenaire de confiance." },
  { name: "Fatima Sossa", role: "Cliente", avatar: "FS", rating: 5, text: "Le bouquet pour la Saint-Valentin était splendide ! Service client réactif sur WhatsApp et livraison dans les délais. Parfait à chaque fois." },
  { name: "Kofi Agbayizo", role: "Entrepreneur", avatar: "KA", rating: 5, text: "Bénin Cadeau a transformé ma façon d'offrir. Sélection unique, prix raisonnables, livraison fiable. Mon go-to pour toutes les occasions." },
];

// ── Main ──────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { navigate } = useRouter();
  const popular = products.filter((p) => p.isPopular).slice(0, 8);
  const [activeT, setActiveT] = useState(0);

  return (
    <div className="font-body overflow-x-hidden">

      {/* ① Hero ──────────────────────────────────────────────────────────── */}
      <HeroCarousel />

      {/* ② Stats — floaty cards ──────────────────────────────────────────── */}
      <section className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
            {[
              { value: 500, suffix: "+", label: "Commandes livrées", icon: <Package size={18} className="text-accent" /> },
              { value: 99, suffix: "%", label: "Clients satisfaits", icon: <Star size={18} className="text-accent" /> },
              { value: 24, suffix: "h", label: "Délai moyen", icon: <Clock size={18} className="text-accent" /> },
              { value: 9, suffix: " zones", label: "De livraison", icon: <Truck size={18} className="text-accent" /> },
            ].map(({ value, suffix, label, icon }, i) => (
              <Reveal key={label} delay={i * 0.08}>
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center gap-1.5">
                  <div className="flex items-center gap-2 mb-1">{icon}</div>
                  <p className="font-display text-3xl sm:text-4xl font-bold text-primary leading-none">
                    <Counter to={value} suffix={suffix} />
                  </p>
                  <p className="text-muted-foreground text-xs font-medium">{label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ③ Categories ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-accent font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-6 h-px bg-accent inline-block" /> Occasions
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-primary leading-tight">
                Pour chaque moment<br />de vie
              </h2>
            </div>
            <button onClick={() => navigate("catalogue")} className="text-sm font-semibold text-primary hover:text-accent flex items-center gap-1.5 transition-colors self-start sm:self-auto">
              Tout le catalogue <ArrowRight size={15} />
            </button>
          </Reveal>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((cat, i) => {
              const Icon = CategoryIcons[cat.slug] ?? CategoryIcons["fete"];
              return (
                <Reveal key={cat.id} delay={i * 0.06}>
                  <button
                    onClick={() => navigate("catalogue", { category: cat.slug })}
                    className="group flex flex-col items-center gap-3 py-5 px-2 rounded-2xl border border-border bg-white hover:border-primary hover:shadow-lg transition-all duration-250 w-full"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#F5F0E8] group-hover:bg-primary flex items-center justify-center transition-colors duration-250">
                      <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-250" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-semibold text-foreground group-hover:text-primary text-center leading-tight transition-colors">
                      {cat.name}
                    </span>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ④ Featured banner ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-20">
        <Reveal>
          <div className="rounded-3xl overflow-hidden grid sm:grid-cols-2 min-h-[320px]">
            {/* Left: image */}
            <div className="relative min-h-[220px]">
              <img
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&h=500&fit=crop&auto=format"
                alt="Coffrets cadeaux premium"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/60 sm:to-primary/80" />
            </div>
            {/* Right: content */}
            <div className="bg-primary px-8 py-10 flex flex-col justify-center">
              <span className="text-accent text-xs font-bold uppercase tracking-widest mb-3">Nouveautés</span>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white leading-snug mb-4">
                Coffrets Prestige<br />
                <em className="text-accent not-italic">pour toutes les occasions</em>
              </h3>
              <p className="text-white/65 text-sm leading-relaxed mb-7 max-w-xs">
                Découvrez notre nouvelle collection de coffrets luxe : emballage soigné, produits premium et personnalisation incluse.
              </p>
              <button
                onClick={() => navigate("catalogue")}
                className="self-start inline-flex items-center gap-2 bg-accent text-primary font-bold px-5 py-3 rounded-xl hover:bg-white transition-colors text-sm"
              >
                Voir la collection <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ⑤ Popular Products ──────────────────────────────────────────────── */}
      <section className="py-20 bg-[#F8F5EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal className="flex items-end justify-between mb-12">
            <div>
              <p className="text-accent font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-6 h-px bg-accent inline-block" /> Bestsellers
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-primary">
                Produits populaires
              </h2>
            </div>
            <button onClick={() => navigate("catalogue")} className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent transition-colors">
              Tout voir <ArrowRight size={15} />
            </button>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {popular.map((product, i) => (
              <Reveal key={product.id} delay={i * 0.05}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>

          <Reveal className="text-center mt-10 sm:hidden">
            <button onClick={() => navigate("catalogue")} className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors text-sm">
              Tout le catalogue <ArrowRight size={16} />
            </button>
          </Reveal>
        </div>
      </section>

      {/* ⑥ Why choose us — split layout ─────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: image stack */}
            <Reveal className="relative hidden lg:block">
              <div className="relative">
                <div className="rounded-3xl overflow-hidden aspect-[4/5] w-4/5">
                  <img src="https://images.unsplash.com/photo-1713998525908-69c60daae07d?w=700&h=875&fit=crop&auto=format" alt="Cadeaux de qualité" className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-10 right-0 w-56 rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1681183183825-cf959ebdc3c2?w=400&h=300&fit=crop&auto=format" alt="Coffret parfum" className="w-full h-full object-cover" />
                </div>
                {/* Floating badge */}
                <div className="absolute top-8 right-4 bg-primary text-white rounded-2xl px-4 py-3 shadow-xl text-center">
                  <p className="font-display text-2xl font-bold text-accent">4.9</p>
                  <div className="flex gap-0.5 justify-center my-1">
                    {[...Array(5)].map((_, i) => <Star key={i} size={10} className="fill-accent text-accent" />)}
                  </div>
                  <p className="text-white/70 text-xs">Note moyenne</p>
                </div>
              </div>
            </Reveal>

            {/* Right: features */}
            <div>
              <Reveal>
                <p className="text-accent font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-6 h-px bg-accent inline-block" /> Notre promesse
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-primary leading-tight mb-4">
                  Pourquoi choisir<br />Bénin Cadeau ?
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-10 max-w-md">
                  Nous mettons tout en œuvre pour que chaque cadeau soit une expérience inoubliable, du choix à la livraison.
                </p>
              </Reveal>

              <div className="space-y-6">
                {[
                  { icon: <BadgeCheck size={22} />, title: "Qualité certifiée", desc: "Chaque produit est sélectionné et vérifié. Aucun article générique — que des cadeaux qui marquent." },
                  { icon: <Zap size={22} />, title: "Livraison express J+1", desc: "Livraison le lendemain à Cotonou. Parce qu'un cadeau urgent ne doit jamais être en retard." },
                  { icon: <HeartHandshake size={22} />, title: "Personnalisation incluse", desc: "Message personnel, prénom gravé, couleur choisie — disponible sur 80% de nos produits." },
                  { icon: <Shield size={22} />, title: "Paiement 100% sécurisé", desc: "MTN MoMo, Moov Money, carte bancaire via FedaPay. Vos données sont protégées." },
                ].map(({ icon, title, desc }, i) => (
                  <Reveal key={title} delay={i * 0.09}>
                    <div className="flex gap-4 group">
                      <div className="w-11 h-11 rounded-xl bg-[#F5F0E8] group-hover:bg-primary flex items-center justify-center flex-shrink-0 transition-colors duration-250 text-primary group-hover:text-white">
                        {icon}
                      </div>
                      <div className="pt-1">
                        <p className="font-semibold text-sm text-foreground mb-1">{title}</p>
                        <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={0.4}>
                <button onClick={() => navigate("about")} className="mt-10 inline-flex items-center gap-2 text-primary font-bold text-sm hover:text-accent transition-colors">
                  En savoir plus sur nous <ArrowRight size={15} />
                </button>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ⑦ How it works ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#F8F5EF]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-16">
            <p className="text-accent font-bold text-xs uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
              <span className="w-6 h-px bg-accent inline-block" /> Processus
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-primary">Comment ça marche ?</h2>
          </Reveal>

          <div className="grid sm:grid-cols-3 gap-6 relative">
            {/* connector */}
            <div className="hidden sm:block absolute top-10 left-[calc(33.33%+16px)] right-[calc(33.33%+16px)] h-px border-t-2 border-dashed border-border" />
            {[
              { n: "01", icon: <Gift size={24} />, title: "Choisissez", desc: "Parcourez le catalogue, filtrez par occasion ou budget et sélectionnez le cadeau parfait." },
              { n: "02", icon: <Shield size={24} />, title: "Payez", desc: "Remplissez vos coordonnées et payez en toute sécurité via MTN MoMo, Moov Money ou carte." },
              { n: "03", icon: <Truck size={24} />, title: "Recevez", desc: "Votre commande est préparée avec soin et livrée directement chez vous au Bénin." },
            ].map(({ n, icon, title, desc }, i) => (
              <Reveal key={n} delay={i * 0.12}>
                <div className="bg-white rounded-2xl p-7 border border-border text-center relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary text-white rounded-full text-xs font-bold font-display flex items-center justify-center shadow-lg">
                    {n}
                  </div>
                  <div className="w-14 h-14 bg-[#F5F0E8] rounded-2xl flex items-center justify-center mx-auto mt-4 mb-5 text-primary">
                    {icon}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-primary mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ⑧ Testimonials ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-14">
            <p className="text-accent font-bold text-xs uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
              <span className="w-6 h-px bg-accent inline-block" /> Avis clients
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-primary">Ils nous font confiance</h2>
          </Reveal>

          {/* Desktop grid */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.07}>
                <div className="flex flex-col border border-border rounded-2xl p-5 h-full hover:shadow-md transition-shadow bg-white">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(t.rating)].map((_, j) => <Star key={j} size={13} className="fill-accent text-accent" />)}
                  </div>
                  <Quote size={18} className="text-accent/40 mb-2" />
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">"{t.text}"</p>
                  <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border">
                    <div className="w-9 h-9 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Mobile carousel */}
          <div className="sm:hidden bg-white border border-border rounded-2xl p-6">
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} size={13} className="fill-accent text-accent" />)}
            </div>
            <Quote size={18} className="text-accent/40 mb-2" />
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">"{TESTIMONIALS[activeT].text}"</p>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                {TESTIMONIALS[activeT].avatar}
              </div>
              <div>
                <p className="text-xs font-semibold">{TESTIMONIALS[activeT].name}</p>
                <p className="text-xs text-muted-foreground">{TESTIMONIALS[activeT].role}</p>
              </div>
            </div>
            <div className="flex gap-1.5">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setActiveT(i)} className={`h-1.5 rounded-full transition-all ${i === activeT ? "w-6 bg-accent" : "w-1.5 bg-border hover:bg-muted-foreground"}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ⑨ CTA Banner ───────────────────────────────────────────────────── */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="relative rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1770989064308-78baffbaa47e?w=1400&h=420&fit=crop&auto=format"
                alt="Cadeaux d'entreprise"
                className="w-full h-64 sm:h-72 object-cover"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(90deg,rgba(26,43,109,0.95) 0%,rgba(26,43,109,0.80) 50%,rgba(26,43,109,0.40) 100%)" }} />
              <div className="absolute inset-0 flex items-center px-8 sm:px-12">
                <div className="max-w-lg">
                  <span className="text-accent text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-5 h-px bg-accent" /> Offre entreprise
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white leading-snug mt-2 mb-3">
                    Cadeaux corporate & goodies sur mesure
                  </h2>
                  <p className="text-white/65 text-sm mb-7 leading-relaxed">
                    Commandes en volume, personnalisation logo, livraison coordonnée. Contactez-nous pour un devis personnalisé.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a href="https://wa.me/22997000000" target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-5 py-3 rounded-xl hover:bg-[#22c55e] transition-colors text-sm">
                      <Phone size={15} /> WhatsApp
                    </a>
                    <button onClick={() => navigate("catalogue", { category: "entreprise" })}
                      className="inline-flex items-center gap-2 bg-accent text-primary font-bold px-5 py-3 rounded-xl hover:bg-white transition-colors text-sm">
                      Voir les offres <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="h-12 bg-white" />
    </div>
  );
}
