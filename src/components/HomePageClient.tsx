"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, animate, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, Truck, Shield, Gift, Phone, ChevronLeft, ChevronRight, Clock, Cake, Heart, Baby, Briefcase, PartyPopper, Sparkles, ShoppingBag } from "lucide-react";
import type { Product, PageName } from "@/lib/context";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "../app/components/ui/carousel";
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
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

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
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <motion.img
            initial={{ scale: 1.08 }}
            animate={{ scale: i === current ? 1 : 1.08 }}
            transition={{ duration: 5.5, ease: "linear" }}
            src={s.image}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, rgba(26,43,109,0.92) 0%, rgba(26,43,109,0.70) 45%, rgba(26,43,109,0.20) 100%)" }} />
        </div>
      ))}

      <div className="relative z-10 h-full max-w-7xl mx-auto px-12 sm:px-20 md:px-24 flex flex-col justify-center">
        <div className="max-w-2xl">
          <motion.span
            key={`tag-${current}`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className="inline-flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-widest mb-5"
          >
            <span className="w-5 h-px bg-accent inline-block" />
            {slide.tag}
          </motion.span>

          <motion.h1
            key={`h-${current}`}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.15 }}
            className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] text-white font-semibold leading-[1.15] mb-5"
          >
            {slide.title}{" "}
            <em className="text-accent not-italic">{slide.accent}</em>
          </motion.h1>

          <motion.p
            key={`p-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-white/75 text-base sm:text-lg leading-relaxed mb-9 max-w-lg"
          >
            {slide.sub}
          </motion.p>

          <motion.div
            key={`cta-${current}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 150, damping: 10, delay: 0.45 }}
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

function StatCounter({
  value,
  suffix = "",
  decimals = 0,
  duration = 2,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    const node = ref.current;
    if (!node) return;

    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate(current) {
        node.textContent = current.toFixed(decimals) + suffix;
      },
    });

    return () => controls.stop();
  }, [inView, value, suffix, decimals, duration]);

  return <span ref={ref}>0{suffix}</span>;
}

const statsContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const statCardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const categoriesContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const categoryCardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const CATEGORY_RESOURCES: Record<string, string> = {
  anniversaire: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&auto=format&fit=crop&q=80",
  mariage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80",
  naissance: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&auto=format&fit=crop&q=80",
  entreprise: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80",
  "saint-valentin": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80",
  fete: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80",
  "cadeaux-personnalises": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80",
  "occasions-speciales": "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80",
  "paniers-ravitaillement": "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=600&auto=format&fit=crop&q=80",
};

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

export default function HomePageClient({ categories, products }: Props) {
  const { navigate } = useRouter();
  const popular = products.slice(0, 8);

  const [api, setApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 2000);

    return () => clearInterval(interval);
  }, [api]);

  const stats = [
    {
      value: 500,
      suffix: "+",
      decimals: 0,
      label: "Commandes livrées",
      desc: "Partout au Bénin avec soin",
      icon: (
        <motion.div variants={{ hover: { x: [0, 8, -4, 4, 0], transition: { duration: 0.6 } } }}>
          <Truck size={28} className="text-accent" />
        </motion.div>
      ),
    },
    {
      value: categories.length,
      suffix: "",
      decimals: 0,
      label: "Catégories de cadeaux",
      desc: "Pour toutes vos occasions",
      icon: (
        <motion.div variants={{ hover: { scale: [1, 1.25, 0.9, 1.1, 1], rotate: [0, -10, 10, -5, 0], transition: { duration: 0.6 } } }}>
          <Gift size={28} className="text-accent" />
        </motion.div>
      ),
    },
    {
      value: 24,
      suffix: "h",
      decimals: 0,
      label: "Délai de livraison",
      desc: "Rapide et suivi en direct",
      icon: (
        <motion.div variants={{ hover: { rotate: 360, transition: { duration: 0.8, ease: "easeInOut" } } }}>
          <Clock size={28} className="text-accent" />
        </motion.div>
      ),
    },
    {
      value: 4.9,
      suffix: "★",
      decimals: 1,
      label: "Note de satisfaction",
      desc: "Basée sur les avis clients",
      icon: (
        <motion.div variants={{ hover: { scale: 1.25, rotate: 15, transition: { type: "spring", stiffness: 300, damping: 10 } } }}>
          <Star size={28} className="text-accent" />
        </motion.div>
      ),
    },
  ];

  return (
    <div className="font-body">
      {/* ── Hero Carousel ── */}
      <HeroCarousel />

      {/* ── Stats Bar ── */}
      <section className="relative z-20 -mt-10 max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="bg-card rounded-3xl border border-border shadow-premium p-8 md:p-10">
          <motion.div
            variants={statsContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-border"
          >
            {stats.map(({ value, suffix, decimals, label, desc, icon }, idx) => (
              <motion.div
                key={label}
                variants={statCardVariants}
                whileHover={{ 
                  y: -6, 
                  scale: 1.02, 
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)",
                  transition: { type: "spring", stiffness: 300, damping: 20 } 
                }}
                className={`flex items-start gap-4 transition-all duration-300 ${idx > 0 ? "pt-6 lg:pt-0 lg:pl-8" : ""
                  }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center flex-shrink-0">
                  {icon}
                </div>
                <div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-primary leading-none mb-1">
                    <StatCounter value={value} suffix={suffix} decimals={decimals} />
                  </h3>
                  <p className="text-foreground font-semibold text-sm mb-0.5">{label}</p>
                  <p className="text-muted-foreground text-xs">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Categories ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 overflow-hidden">
        <div className="text-center mb-12">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Parcourir par occasion</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-primary mb-3">Choisissez votre occasion</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Célébrez chaque instant de la vie avec des cadeaux pensés spécialement pour chaque moment fort.
          </p>
        </div>
        
        <Carousel
          opts={{
            loop: true,
            align: "start",
          }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent className="-ml-8 py-4">
            {categories.map((cat) => {
              const bgUrl = CATEGORY_RESOURCES[cat.slug.toLowerCase()] || "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600&auto=format&fit=crop&q=80";

              return (
                <CarouselItem key={cat.id} className="pl-8 basis-[312px] shrink-0">
                  <motion.button
                    onClick={() => navigate("catalogue", { category: cat.slug })}
                    variants={categoryCardVariants}
                    whileHover={{ 
                      y: -8, 
                      scale: 1.02,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 0 20px rgba(245, 166, 35, 0.4)",
                      borderColor: "var(--accent)"
                    }}
                    className="group flex flex-col items-center justify-center text-center p-6 rounded-3xl bg-card border border-border hover:border-accent transition-all duration-500 relative overflow-hidden cursor-pointer w-[280px] h-[170px]"
                  >
                    {/* Background Image with Zoom, subtle rotation, and light dark overlay */}
                    <div className="absolute inset-0 z-0">
                      <img
                        src={bgUrl}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-115 group-hover:rotate-1"
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors duration-500" />
                    </div>

                    {/* Content wrapper */}
                    <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
                      <h3 className="font-display text-xl font-bold text-white group-hover:text-accent transition-colors duration-300 mb-2">
                        {cat.name}
                      </h3>
                      <p className="text-white/80 text-sm leading-relaxed max-w-[240px] line-clamp-2">
                        {cat.description || "Trouvez le cadeau parfait pour cette occasion."}
                      </p>
                      
                      <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-accent opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300">
                        Découvrir <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </motion.button>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
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

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } }
            }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {popular.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 25 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

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

      {/* ── How it works ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Simple & rapide</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-primary">Comment ça marche ?</h2>
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } }
          }}
          className="grid sm:grid-cols-3 gap-8 relative"
        >
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
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
              }}
              whileHover={{ scale: 1.02 }}
              key={step} 
              className="flex flex-col items-center text-center"
            >
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
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Banner CTA ── */}
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
