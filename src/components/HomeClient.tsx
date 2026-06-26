"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown, Sparkles, Gift, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CopyrightRow } from '@/components/CopyrightRow';
import { ProductCard } from '@/components/ProductCard';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  estimatedDelivery: string;
  images: unknown;
  isCustomizable: boolean;
  category: {
    name: string;
  };
}

interface HomeClientProps {
  categories: Category[];
  products: Product[];
}

export function HomeClient({ categories, products }: HomeClientProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = [
    {
      image: "/1-12.png",
      badge: "L'art d'offrir au Bénin",
      title: "Offrez du bonheur, ",
      highlight: "célébrez chaque instant !",
      desc: "Chez Bénin Cadeau, nous transformons vos intentions en souvenirs précieux. Explorez nos collections de cadeaux raffinés et de paniers gourmands pensés pour éblouir vos proches."
    },
    {
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1500",
      badge: "Artisanat d'excellence",
      title: "Des Créations Uniques & ",
      highlight: "Personnalisées",
      desc: "Gravez des prénoms, ajoutez des messages personnels et choisissez des designs sur-mesure sur des mugs, cadres photo lumineux, textiles et accessoires d'exception."
    },
    {
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=1500",
      badge: "Proximité & Solidarité",
      title: "Soutenez vos Proches avec des ",
      highlight: "Paniers de Ravitaillement",
      desc: "Faites livrer directement des paniers alimentaires utiles et attentionnés (produits de première nécessité premium) partout au Bénin."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const faqs = [
    {
      question: 'Quels types de cadeaux proposez-vous ?',
      answer:
        "Nous proposons une large gamme de cadeaux personnalisés pour toutes les occasions : anniversaires, mariages, naissances, baptêmes, fêtes de fin d'année, remerciements, etc. Cela va des objets décoratifs aux articles textiles, en passant par des paniers de ravitaillement (packs alimentaires) soigneusement préparés.",
    },
    {
      question: 'Est-ce que je peux personnaliser entièrement mon cadeau ?',
      answer:
        'Oui, absolument ! Vous pouvez choisir les couleurs, ajouter des prénoms, des messages personnels ou même des photos sur certains de nos articles.',
    },
    {
      question: "Je ne sais pas quoi offrir. Pouvez-vous m'aider ?",
      answer:
        "Bien sûr ! Notre équipe est là pour vous conseiller en fonction de l'occasion, du destinataire et de votre budget.",
    },
    {
      question: 'Livrez-vous partout au Bénin ?',
      answer:
        'Nous livrons principalement à Cotonou, Abomey-Calavi et environs. Pour les autres villes, veuillez nous contacter.',
    },
    {
      question: 'Combien de temps faut-il pour recevoir ma commande ?',
      answer:
        'Le délai dépend de la personnalisation demandée. En général, il faut compter entre 48h et 72h après validation de la commande.',
    },
  ];

  const getCategoryMetaData = (slug: string) => {
    const meta: Record<string, { img: string; desc: string }> = {
      'cadeaux-personnalises': {
        img: '/3-28.png',
        desc: 'Mugs, t-shirts, sacs, cadres déco, pagnes... Des créations uniques à votre image.'
      },
      'occasions-speciales': {
        img: '/3-40.png',
        desc: 'Anniversaires, mariages, baptêmes, fiançailles... Des présents adaptés à chaque événement.'
      },
      'paniers-ravitaillement': {
        img: '/3-52.png',
        desc: 'Un coffret alimentaire utile et attentionné présenté avec le plus grand soin.'
      }
    };
    return meta[slug] || {
      img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800',
      desc: 'Découvrez des créations uniques conçues pour marquer les moments importants.'
    };
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50/30 overflow-x-hidden">
      <Header />
      
      <main className="flex-grow">
        
        {/* 1. HERO SECTION (Split light layout) */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-10 lg:py-16">
          <div className="bg-zinc-100/50 rounded-[40px] border border-zinc-200/40 p-8 sm:p-12 lg:p-16 relative overflow-hidden">
            
            {/* Background elements */}
            <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-bc-yellow/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-bc-purple/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
              
              {/* Text content */}
              <div className="lg:col-span-6 space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-zinc-200/60 text-bc-purple font-semibold text-xs tracking-wider uppercase shadow-sm">
                      <Sparkles size={13} className="text-bc-yellow fill-current animate-pulse" /> {heroSlides[activeSlide].badge}
                    </div>
                    <h1 className="font-bold text-zinc-900 text-4xl sm:text-5xl lg:text-[54px] leading-[1.1] tracking-tight">
                      {heroSlides[activeSlide].title}
                      <span className="text-bc-purple">{heroSlides[activeSlide].highlight}</span>
                    </h1>
                    <p className="font-instrument text-zinc-500 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl">
                      {heroSlides[activeSlide].desc}
                    </p>
                    <div className="pt-3 flex flex-wrap gap-3.5">
                      <Link href="/catalogue">
                        <motion.button
                          whileHover={{ y: -2 }}
                          whileTap={{ y: 0 }}
                          className="px-7 py-3.5 rounded-full bg-bc-purple hover:bg-bc-purpleDark text-white font-semibold text-sm tracking-wide shadow-sm cursor-pointer transition-all"
                        >
                          Découvrir le catalogue
                        </motion.button>
                      </Link>
                      <Link href="/contact">
                        <motion.button
                          whileHover={{ y: -2 }}
                          whileTap={{ y: 0 }}
                          className="px-7 py-3.5 rounded-full bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 font-semibold text-sm tracking-wide transition-all cursor-pointer shadow-sm"
                        >
                          Nous contacter
                        </motion.button>
                      </Link>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Slider indicators */}
                <div className="pt-6 flex space-x-2.5">
                  {heroSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={cn(
                        "h-2 rounded-full transition-all duration-300 cursor-pointer",
                        activeSlide === idx ? "w-7 bg-bc-purple" : "w-2 bg-zinc-300 hover:bg-zinc-400"
                      )}
                      aria-label={`Aller au slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Graphic content */}
              <div className="lg:col-span-6 relative flex justify-center">
                <div className="w-full max-w-[500px] aspect-[4/3] sm:aspect-square relative rounded-[32px] overflow-hidden border border-zinc-200/50 shadow-premium bg-zinc-50">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeSlide}
                      src={heroSlides[activeSlide].image}
                      alt="Bénin Cadeau Hero Slide"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.6 }}
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 2. FLOATING CTA (Harmonized, Clean) */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 mb-20 -mt-2.5">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white border border-zinc-200/60 rounded-[32px] shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6 p-8 lg:p-10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-bc-yellow/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-5 flex-1 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-bc-purpleLight text-bc-purple flex items-center justify-center flex-shrink-0">
                <Gift size={24} />
              </div>
              <div>
                <h2 className="font-bold text-lg lg:text-xl text-zinc-800 leading-snug">
                  Un événement ou une fête à célébrer dès aujourd&apos;hui ?
                </h2>
                <p className="text-xs text-zinc-500 mt-1 font-instrument">
                  Créez le cadeau sur-mesure idéal et faites-le livrer à domicile.
                </p>
              </div>
            </div>
            
            <Link href="/commander" className="relative z-10 w-full lg:w-auto flex-shrink-0">
              <motion.button
                whileHover={{ y: -1 }}
                className="w-full lg:w-auto px-6 py-3.5 rounded-2xl bg-bc-purple hover:bg-bc-purpleDark text-white font-semibold text-xs tracking-wider uppercase shadow-sm cursor-pointer transition-all"
              >
                Créer un cadeau
              </motion.button>
            </Link>
          </motion.div>
        </section>

        {/* 3. NOS PROPOSITIONS (CATEGORIES DYNAMIQUES) */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 uppercase tracking-tight">
              Nos propositions
            </h2>
            <div className="w-12 h-1 bg-bc-purple mx-auto rounded-full" />
            <p className="text-zinc-500 font-instrument text-sm sm:text-base">
              Parcourez nos différentes sélections de cadeaux de prestige conçus pour illuminer le quotidien.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {categories.map((cat, i) => {
              const meta = getCategoryMetaData(cat.slug);
              return (
                <Link key={cat.id} href={`/catalogue?category=${cat.slug}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm border border-zinc-200/50 group cursor-pointer"
                  >
                    <div className="relative h-[200px] overflow-hidden bg-zinc-100">
                      <img
                        src={meta.img}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-6 space-y-2 border-t border-zinc-100">
                      <h3 className="font-bold text-base text-zinc-800 flex items-center justify-between group-hover:text-bc-purple transition-colors">
                        {cat.name}
                        <ChevronRight size={16} className="text-zinc-400 group-hover:text-bc-purple transition-colors" />
                      </h3>
                      <p className="font-instrument text-xs text-zinc-500 leading-relaxed">
                        {meta.desc}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 4. COMMENT ÇA MARCHE (Light, Modern) */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 mb-24">
          <div className="bg-zinc-50 rounded-[40px] border border-zinc-200/40 p-8 sm:p-12 lg:p-16">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 uppercase tracking-tight">
                Comment ça marche ?
              </h2>
              <div className="w-12 h-1 bg-bc-purple mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                {/* Step 1 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl p-6 border border-zinc-100 shadow-sm flex flex-col items-center text-center space-y-3"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 font-bold text-base flex items-center justify-center border border-emerald-100">
                    01
                  </div>
                  <h3 className="font-bold text-sm text-zinc-800">Choisissez</h3>
                  <p className="text-[11px] text-zinc-500 leading-relaxed font-instrument">
                    Sélectionnez le thème ou le panier d&apos;articles idéal selon l&apos;occasion.
                  </p>
                </motion.div>

                {/* Step 2 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl p-6 border border-zinc-100 shadow-sm flex flex-col items-center text-center space-y-3"
                >
                  <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-700 font-bold text-base flex items-center justify-center border border-rose-100">
                    02
                  </div>
                  <h3 className="font-bold text-sm text-zinc-800">Personnalisez</h3>
                  <p className="text-[11px] text-zinc-500 leading-relaxed font-instrument">
                    Ajoutez un texte, une date de livraison et un message d&apos;accompagnement unique.
                  </p>
                </motion.div>

                {/* Step 3 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl p-6 border border-zinc-100 shadow-sm flex flex-col items-center text-center space-y-3"
                >
                  <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-700 font-bold text-base flex items-center justify-center border border-sky-100">
                    03
                  </div>
                  <h3 className="font-bold text-sm text-zinc-800">Offrez</h3>
                  <p className="text-[11px] text-zinc-500 leading-relaxed font-instrument">
                    Nous emballons et livrons le colis avec élégance directement chez votre proche.
                  </p>
                </motion.div>

              </div>

              <div className="lg:col-span-5 relative rounded-[28px] overflow-hidden h-[360px] shadow-sm border border-zinc-200/50 group">
                <img
                  src="/3-84.png"
                  alt="Sourire et joie d'offrir"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-bc-purple/95 py-5 px-6 text-center border-t border-white/5">
                  <p className="font-instrument italic text-sm text-zinc-100 leading-relaxed">
                    &ldquo;Nous ne nous contentons pas d&apos;envoyer des cadeaux. Nous donnons vie à vos émotions.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. NOS PACKS VEDETTES (PRODUITS DYNAMIQUES) */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 mb-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-5">
            <div className="space-y-3">
              <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 uppercase tracking-tight">
                Nos packs vedettes
              </h2>
              <div className="w-12 h-1 bg-bc-purple rounded-full" />
            </div>
            <Link href="/catalogue">
              <motion.button
                whileHover={{ y: -1 }}
                className="px-5 py-3 rounded-full bg-white border border-zinc-200 text-zinc-700 font-semibold text-xs tracking-wider flex items-center gap-1.5 hover:bg-zinc-50 cursor-pointer shadow-sm transition-all"
              >
                VOIR TOUT LE CATALOGUE <ChevronRight size={14} />
              </motion.button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 max-w-6xl mx-auto">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 6. TEMOIGNAGES (Clean Light Mode Card) */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 uppercase tracking-tight">
              Témoignages
            </h2>
            <div className="w-12 h-1 bg-bc-purple mx-auto rounded-full" />
          </div>

          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[32px] p-8 md:p-10 border border-zinc-200/50 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
            >
              <div className="absolute -top-4 -right-2 text-zinc-100 font-black text-9xl pointer-events-none select-none">
                &ldquo;
              </div>

              <div className="relative flex-shrink-0">
                <img
                  src="/11-157.png"
                  alt="Lara ANAGONOU"
                  className="w-[100px] h-[100px] rounded-full object-cover relative z-10 border-2 border-zinc-100 shadow-sm"
                />
              </div>
              
              <div className="flex-1 space-y-3 relative z-10">
                <div className="flex text-bc-yellow">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Sparkles key={idx} size={13} className="fill-current text-bc-yellow" />
                  ))}
                </div>
                <p className="font-instrument italic text-sm md:text-base text-zinc-600 leading-relaxed text-justify">
                  &ldquo;J&apos;ai commandé un pack anniversaire pour ma mère à distance et le service a été impeccable. L&apos;emballage était absolument somptueux et la livraison a été effectuée à l&apos;heure exacte demandée. Je recommande vivement Bénin Cadeau !&rdquo;
                </p>
                <div>
                  <p className="font-bold text-sm text-zinc-800">
                    Lara ANAGONOU
                  </p>
                  <p className="text-[11px] text-zinc-400">Client fidèle — Cotonou</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 7. FAQ (Clean Accordions) */}
        <section className="max-w-[840px] mx-auto px-4 sm:px-6 mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 uppercase tracking-tight">
              Foire aux questions
            </h2>
            <div className="w-12 h-1 bg-bc-purple mx-auto rounded-full" />
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-zinc-200/50 shadow-sm overflow-hidden"
              >
                <button
                  className="w-full flex justify-between items-center text-left py-4.5 px-5 font-bold text-sm sm:text-base text-zinc-800 hover:text-bc-purple transition-colors focus:outline-none"
                  onClick={() =>
                    setOpenFaqIndex(openFaqIndex === index ? null : index)
                  }
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      'text-zinc-400 transition-transform duration-300 flex-shrink-0',
                      openFaqIndex === index && 'rotate-180 text-bc-purple'
                    )}
                    size={16}
                  />
                </button>
                <AnimatePresence>
                  {openFaqIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0.5 border-t border-zinc-50">
                        <p className="font-instrument text-xs sm:text-sm text-zinc-500 leading-relaxed text-justify">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* 8. BIG CTA BANNER (Contrast layout) */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 mb-20">
          <div className="relative h-[400px] rounded-[36px] overflow-hidden border border-zinc-200/30 shadow-premium">
            <img
              src="/14-174.png"
              alt="Cadeaux haut de gamme"
              className="w-full h-full object-cover scale-103"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-bc-purpleDark/95 via-bc-purple/40 to-transparent" />
            
            <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-16 max-w-2xl text-white space-y-5">
              <h2 className="font-bold text-3xl md:text-4xl leading-tight">
                Prêt(e) à offrir <span className="text-bc-yellow">autrement ?</span>
              </h2>
              <p className="font-instrument text-sm sm:text-base text-zinc-200 leading-relaxed">
                Demandez un cadeau personnalisé maintenant et faites de chaque geste un moment inoubliable pour ceux que vous aimez.
              </p>
              <Link href="/commander" className="inline-block w-fit">
                <motion.button
                  whileHover={{ y: -1 }}
                  className="px-7 py-3.5 rounded-full bg-bc-yellow hover:bg-yellow-400 text-bc-purple font-bold text-xs tracking-wider uppercase shadow-sm cursor-pointer transition-all"
                >
                  Passer une commande
                </motion.button>
              </Link>
            </div>
          </div>
        </section>

      </main>
      <CopyrightRow />
      <Footer />
    </div>
  );
}
