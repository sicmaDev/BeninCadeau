"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, BookOpen, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

export function BlogClient() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
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
    <div className="font-instrument bg-zinc-50/30 overflow-hidden">
      
      {/* Elegant Minimalist Header */}
      <section className="bg-zinc-50 border-b border-zinc-200/50 py-12 lg:py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 z-10">
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bc-purpleLight text-bc-purple font-semibold text-[10px] tracking-wider uppercase mx-auto"
          >
            <BookOpen size={11} className="text-bc-yellow fill-current" />
            <span>Magazine</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-bold text-2xl sm:text-3xl text-zinc-900 tracking-tight"
          >
            LE BLOG CADEAUX
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-zinc-500 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed font-medium font-instrument"
          >
            Inspirations de design, secrets de personnalisation et guides pratiques pour vous aider à exprimer votre générosité de la plus belle des manières.
          </motion.p>
        </div>
      </section>

      {/* Grid List Section */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-16 relative">
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-bc-yellow/5 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          {dummyArticles.map((article) => (
            <motion.article
              key={article.id}
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              className="flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border border-zinc-200/50 transition-all duration-300 h-full group"
            >
              {/* Cover image & tag */}
              <div className="h-60 w-full overflow-hidden bg-zinc-50 relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                />
                
                {/* Float Category Tag */}
                <div className="absolute top-4 left-4 bg-bc-purple/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-sm border border-white/5">
                  <span className="flex items-center gap-1.5">
                    <Tag size={10} className="text-bc-yellow" />
                    {article.tag}
                  </span>
                </div>
              </div>

              {/* Text info */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Date */}
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                    <Calendar size={11} className="text-zinc-400" />
                    <span>{article.date}</span>
                  </div>

                  <h2 className="font-bold text-lg text-zinc-900 group-hover:text-bc-purple transition-colors leading-snug">
                    {article.title}
                  </h2>

                  <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed text-justify font-instrument line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-100">
                  <Link href="/blog/article" className="inline-flex items-center text-xs font-bold text-bc-purple hover:underline group/link cursor-pointer">
                    Lire l&apos;article complet
                    <ArrowRight size={13} className="ml-1.5 group-hover/link:translate-x-1 transition-transform" />
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
