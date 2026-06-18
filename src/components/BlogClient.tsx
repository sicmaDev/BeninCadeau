"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Sparkles, BookOpen, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

export function BlogClient() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const dummyArticles = [
    {
      id: 1,
      title: "Les nouvelles tendances déco pour emballer vos cadeaux",
      excerpt: "Découvrez l'art du Furoshiki, les papiers textures haut de gamme et les accessoires dorés pour donner un aspect majestueux à vos surprises dès le premier coup d'œil.",
      tag: "Tendances",
      date: "12/04/2026",
      image: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 2,
      title: "Comment choisir le cadeau parfait en 3 étapes simples",
      excerpt: "Entre personnalisation d'objets d'exception et choix de paniers utiles, découvrez notre guide complet pour viser juste à tous les coups, pour elle ou pour lui.",
      tag: "Conseils",
      date: "05/03/2026",
      image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 3,
      title: "Les coffrets de mariage : le prestige de l'or et des roses",
      excerpt: "Symbole d'amour éternel, nos nouvelles boîtes acryliques ornées de roses dorées et d'accessoires raffinés s'imposent comme le cadeau nuptial par excellence au Bénin.",
      tag: "Collections",
      date: "20/02/2026",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 4,
      title: "Soutenir ses proches au Bénin : l'impact des paniers de ravitaillement",
      excerpt: "Envoyer de la joie et de l'aide concrète. Analyse de l'engouement croissant de la diaspora pour les packs alimentaires premium livrés directement à domicile.",
      tag: "Diaspora",
      date: "10/01/2026",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=600"
    }
  ];

  return (
    <div className="font-instrument bg-bc-bg overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[440px] md:h-[500px] w-full flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=2000"
            alt="Boîtes de cadeaux élégantes sur le Blog"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bc-purpleDark/95 to-bc-navyDark/90"></div>
        </div>

        {/* Decorative glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-bc-purple/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel border border-white/20 text-white font-montserrat text-[10px] font-bold tracking-widest uppercase"
          >
            <BookOpen size={12} className="text-bc-yellow" />
            <span>Magazine</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-montserrat font-black text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tight"
          >
            LE BLOG <span className="text-gold-gradient">CADEAUX</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-200 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Inspirations de design, secrets de personnalisation et guides pratiques pour vous aider à exprimer votre générosité de la plus belle des manières.
          </motion.p>
        </div>
      </section>

      {/* Grid List Section */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-24 relative">
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-bc-yellow/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-bc-purple/5 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
        >
          {dummyArticles.map((article) => (
            <motion.article
              key={article.id}
              variants={fadeInUp}
              whileHover={{ y: -8, scale: 1.01 }}
              className="flex flex-col bg-white rounded-[32px] overflow-hidden shadow-card border border-gray-100 hover:shadow-premium transition-all duration-300 h-full group"
            >
              {/* Cover image & tag */}
              <div className="h-72 w-full overflow-hidden bg-gray-50 relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Float Category Tag */}
                <div className="absolute top-5 left-5 bg-bc-purple/90 backdrop-blur-md text-white px-4 py-1.5 rounded-xl text-xs font-bold font-montserrat uppercase tracking-wider shadow-md border border-white/10">
                  <span className="flex items-center gap-1.5">
                    <Tag size={12} className="text-bc-yellow" />
                    {article.tag}
                  </span>
                </div>
              </div>

              {/* Text info */}
              <div className="p-8 flex-grow flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  {/* Date */}
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold uppercase tracking-wider">
                    <Calendar size={13} className="text-bc-yellow" />
                    <span>{article.date}</span>
                  </div>

                  <h2 className="font-montserrat font-bold text-xl md:text-2xl text-bc-navy group-hover:text-bc-purple transition-colors leading-snug">
                    {article.title}
                  </h2>

                  <p className="text-gray-500 text-sm leading-relaxed text-justify line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-5 border-t border-gray-50">
                  <Link href="/blog/article" className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-bc-purple hover:text-bc-yellow transition-colors group/link cursor-pointer">
                    Lire l&apos;article complet
                    <ArrowRight size={14} className="ml-2 group-hover/link:translate-x-1.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
