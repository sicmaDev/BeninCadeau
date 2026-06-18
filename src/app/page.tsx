"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown, Sparkles, Gift, Heart, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CopyrightRow } from '@/components/CopyrightRow';

export default function HomePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const heroSlides = [
    {
      image: "/1-12.png",
      badge: "L'art d'offrir au Bénin",
      title: "Bénin Cadeau : Offrez du bonheur, ",
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

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
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

  const propositions = [
    {
      img: '/3-28.png',
      title: 'Cadeaux personnalisés',
      desc: 'Mugs, t-shirts, sacs, cadres déco, pagnes... Des créations uniques à votre image.',
    },
    {
      img: '/3-40.png',
      title: 'Occasions spéciales',
      desc: 'Anniversaires, mariages, baptêmes, fiançailles... Des présents adaptés à chaque événement.',
    },
    {
      img: '/3-46.png',
      title: 'Autres moments de vie',
      desc: 'Remerciements, promotions, fêtes religieuses (Tabaski, Noël, Aïd)...',
    },
    {
      img: '/3-52.png',
      title: 'Paniers de ravitaillement',
      desc: 'Un coffret alimentaire utile et attentionné présenté avec le plus grand soin.',
    },
  ];

  const packImages = [
    '/5-104.png',
    '/6-114.png',
    '/6-118.png',
    '/6-122.png',
    '/5-104.png',
    '/6-114.png',
    '/6-118.png',
    '/6-122.png',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bc-bg overflow-x-hidden">
      <Header />
      <main className="flex-grow">
        
        {/* 1. HERO SECTION */}
        <section className="relative w-full h-[700px] flex items-center overflow-hidden">
          {/* Background image & gradient overlay */}
          <div className="absolute inset-0 select-none pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1.05 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={heroSlides[activeSlide].image}
                  alt="Bénin Cadeau Hero Slide"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-bc-purpleDark/95 via-bc-purple/70 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-bc-bg via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Floating animated blobs */}
          <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-bc-yellow/15 rounded-full blur-[100px] animate-pulse pointer-events-none" />

          <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 w-full z-10">
            <div className="max-w-[800px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -25 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-bc-yellow font-montserrat font-bold text-xs uppercase tracking-widest">
                    <Sparkles size={14} className="animate-pulse" /> {heroSlides[activeSlide].badge}
                  </div>
                  <h1 className="font-montserrat font-extrabold text-white text-4xl md:text-5xl lg:text-[62px] leading-[1.15] tracking-tight">
                    {heroSlides[activeSlide].title}
                    <span className="text-gold-gradient">{heroSlides[activeSlide].highlight}</span>
                  </h1>
                  <p className="font-instrument font-medium text-gray-200 text-base md:text-lg lg:text-xl leading-relaxed text-justify max-w-2xl">
                    {heroSlides[activeSlide].desc}
                  </p>
                  <div className="pt-4 flex flex-wrap gap-4">
                    <Link href="/catalogue">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-8 py-4 rounded-2xl bg-gold-gradient text-bc-purpleDark font-montserrat font-bold text-base uppercase tracking-wider shadow-yellow-glow cursor-pointer"
                      >
                        Découvrir le catalogue
                      </motion.button>
                    </Link>
                    <Link href="/contact">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-montserrat font-bold text-base uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Nous contacter
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="absolute bottom-8 left-4 sm:left-6 lg:left-16 flex space-x-3 z-20">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300 cursor-pointer",
                  activeSlide === idx ? "w-8 bg-bc-yellow" : "w-2.5 bg-white/40 hover:bg-white/70"
                )}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </section>

        {/* 2. FLOATING CTA */}
        <div className="relative z-20 max-w-[1150px] mx-auto px-4 -mt-[80px] mb-28">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-panel rounded-[40px] shadow-premium flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-12 relative overflow-hidden"
          >
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-bc-yellow/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-6 flex-1 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-bc-yellow/10 flex items-center justify-center text-bc-yellow flex-shrink-0">
                <Gift size={32} />
              </div>
              <div>
                <h2 className="font-montserrat font-extrabold text-xl md:text-2xl text-bc-navy leading-snug">
                  Un événement ou une fête à célébrer dès aujourd&apos;hui ?
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Créez le cadeau sur-mesure idéal et faites-le livrer à domicile.
                </p>
              </div>
            </div>
            
            <Link href="/commander" className="relative z-10 w-full md:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full md:w-auto px-8 py-4.5 rounded-2xl bg-purple-gradient hover:bg-bc-purpleDark text-white font-montserrat font-bold text-sm uppercase tracking-wider shadow-purple-glow cursor-pointer transition-all"
              >
                Créer un cadeau
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* 3. NOS PROPOSITIONS */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 mb-28 relative">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-montserrat font-black text-3xl md:text-[40px] text-bc-navy uppercase tracking-tight">
              Nos propositions
            </h2>
            <div className="w-20 h-1 bg-bc-yellow mx-auto rounded-full" />
            <p className="text-gray-500 font-instrument text-base md:text-lg">
              Parcourez nos différentes sélections de cadeaux de prestige conçus pour illuminer le quotidien.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {propositions.map((prop, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="relative h-[280px] rounded-3xl overflow-hidden shadow-card border border-gray-100/50 group cursor-pointer"
              >
                <img
                  src={prop.img}
                  alt={prop.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bc-purple/95 via-bc-purple/50 to-black/20" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white space-y-2">
                  <h3 className="font-montserrat font-extrabold text-lg text-white">
                    {prop.title}
                  </h3>
                  <p className="font-instrument text-xs text-gray-200 leading-relaxed opacity-90">
                    {prop.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. COMMENT ÇA MARCHE */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 mb-28">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-montserrat font-black text-3xl md:text-[40px] text-bc-navy uppercase tracking-tight">
              Comment ça marche ?
            </h2>
            <div className="w-20 h-1 bg-bc-yellow mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Steps (left) */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card flex flex-col items-center text-center space-y-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-bc-greenLight text-emerald-700 font-montserrat font-black text-2xl flex items-center justify-center shadow-inner">
                  01
                </div>
                <h3 className="font-montserrat font-bold text-base text-bc-navy">Choisissez</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-instrument">
                  Sélectionnez le thème ou le panier d&apos;articles idéal selon l&apos;occasion.
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card flex flex-col items-center text-center space-y-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-bc-pinkLight text-rose-700 font-montserrat font-black text-2xl flex items-center justify-center shadow-inner">
                  02
                </div>
                <h3 className="font-montserrat font-bold text-base text-bc-navy">Personnalisez</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-instrument">
                  Ajoutez un texte, une date de livraison et un message d&apos;accompagnement unique.
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card flex flex-col items-center text-center space-y-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-bc-blueLight text-blue-700 font-montserrat font-black text-2xl flex items-center justify-center shadow-inner">
                  03
                </div>
                <h3 className="font-montserrat font-bold text-base text-bc-navy">Offrez</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-instrument">
                  Nous emballons et livrons le colis avec élégance directement chez votre proche.
                </p>
              </motion.div>

            </div>

            {/* Right Image with purple banner (right) */}
            <div className="lg:col-span-5 relative rounded-[32px] overflow-hidden h-[450px] shadow-premium group">
              <img
                src="/3-84.png"
                alt="Sourire et joie d'offrir"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-purple-gradient py-6 px-8 text-center border-t border-white/10">
                <p className="font-instrument font-medium text-lg md:text-xl text-white leading-relaxed">
                  &ldquo;Nous ne nous contentons pas d&apos;envoyer des cadeaux. Nous donnons vie à vos émotions.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. NOS PACKS */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 mb-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <h2 className="font-montserrat font-black text-3xl md:text-[40px] text-bc-navy uppercase tracking-tight">
                Nos packs vedettes
              </h2>
              <div className="w-20 h-1 bg-bc-yellow rounded-full" />
            </div>
            <Link href="/catalogue?category=paniers-ravitaillement">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3.5 rounded-2xl bg-white border border-gray-200 text-bc-purple font-montserrat font-bold text-sm tracking-wide shadow-sm flex items-center gap-2 hover:bg-gray-50 cursor-pointer"
              >
                VOIR TOUT LE CATALOGUE <ChevronRight size={16} />
              </motion.button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {packImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-card border border-gray-100/60 hover:shadow-premium hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
              >
                <div className="relative overflow-hidden aspect-[4/3] bg-gray-50">
                  <img
                    src={img}
                    alt="Boîte surprise mariage"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-gold-gradient text-bc-purpleDark font-montserrat font-extrabold text-[10px] px-3.5 py-1 rounded-full shadow-md">
                    Premium
                  </div>
                </div>
                <div className="p-6 flex flex-col items-center text-center flex-grow justify-between">
                  <h3 className="font-montserrat font-bold text-base text-bc-navy leading-snug line-clamp-2 uppercase">
                    Boîte surprise pour mariage
                  </h3>
                  <div className="mt-4 w-full pt-4 border-t border-gray-100 flex items-center justify-center">
                    <span className="font-montserrat font-black text-bc-purple text-base px-5 py-1.5 bg-bc-yellow/10 rounded-xl">
                      30 000 FCFA
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>


        {/* 7. TEMOIGNAGES */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 mb-28">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-montserrat font-black text-3xl md:text-[40px] text-bc-navy uppercase tracking-tight">
              Témoignages
            </h2>
            <div className="w-20 h-1 bg-bc-yellow mx-auto rounded-full" />
          </div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-card flex flex-col md:flex-row items-center gap-8 relative"
            >
              {/* Luxury Quote Icon decoration */}
              <div className="absolute top-6 right-8 text-bc-yellow/15 font-black font-montserrat text-8xl pointer-events-none">
                &ldquo;
              </div>

              <div className="relative flex-shrink-0">
                <div className="w-[124px] h-[124px] bg-gold-gradient rounded-full absolute -top-1 -left-1 blur-sm opacity-60" />
                <img
                  src="/11-157.png"
                  alt="Lara ANAGONOU"
                  className="w-[120px] h-[120px] rounded-full object-cover relative z-10 border-4 border-white"
                />
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="flex text-bc-yellow">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Sparkles key={idx} size={14} className="fill-current" />
                  ))}
                </div>
                <p className="font-instrument italic text-base text-bc-heading leading-relaxed text-justify">
                  &ldquo;J&apos;ai commandé un pack anniversaire pour ma mère à distance et le service a été impeccable. L&apos;emballage était absolument somptueux et la livraison a été effectuée à l&apos;heure exacte demandée. Je recommande vivement Bénin Cadeau !&rdquo;
                </p>
                <div>
                  <p className="font-montserrat font-bold text-base text-bc-navy">
                    Lara ANAGONOU
                  </p>
                  <p className="text-xs text-gray-400">Client fidèle — Cotonou</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 8. FAQ */}
        <section className="max-w-[1000px] mx-auto px-4 sm:px-6 mb-28">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-montserrat font-black text-3xl md:text-[40px] text-bc-navy uppercase tracking-tight">
              Foire aux questions
            </h2>
            <div className="w-20 h-1 bg-bc-yellow mx-auto rounded-full" />
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <button
                  className="w-full flex justify-between items-center text-left py-5 px-6 font-montserrat font-bold text-base md:text-lg text-bc-navy hover:text-bc-purple transition-colors focus:outline-none"
                  onClick={() =>
                    setOpenFaqIndex(openFaqIndex === index ? null : index)
                  }
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      'text-gray-400 transition-transform duration-300 flex-shrink-0',
                      openFaqIndex === index && 'rotate-180 text-bc-purple'
                    )}
                    size={20}
                  />
                </button>
                <AnimatePresence>
                  {openFaqIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1 border-t border-gray-50">
                        <p className="font-instrument text-sm md:text-base text-gray-500 leading-relaxed text-justify">
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

        {/* 9. BIG CTA BANNER */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 mb-24">
          <div className="relative h-[480px] rounded-[36px] overflow-hidden shadow-premium">
            <img
              src="/14-174.png"
              alt="Cadeaux haut de gamme"
              className="w-full h-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-bc-purpleDark/95 via-bc-purple/50 to-transparent" />
            
            <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16 max-w-2xl text-white space-y-6">
              <h2 className="font-montserrat font-extrabold text-3xl md:text-4xl lg:text-[44px] leading-tight">
                Prêt(e) à offrir <span className="text-gold-gradient">autrement ?</span>
              </h2>
              <p className="font-instrument text-base md:text-lg text-gray-200 leading-relaxed">
                Demandez un cadeau personnalisé maintenant et faites de chaque geste un moment inoubliable pour ceux que vous aimez.
              </p>
              <Link href="/commander" className="inline-block w-fit">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="px-8 py-4.5 rounded-2xl bg-gold-gradient text-bc-purpleDark font-montserrat font-bold text-base uppercase tracking-wider shadow-yellow-glow cursor-pointer"
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

