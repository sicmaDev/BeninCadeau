"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Gift, Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

interface Category {
  id: number;
  name: string;
  slug: string;
  active: boolean;
  displayOrder: number;
}

interface PropositionsClientProps {
  categories: Category[];
}

const CATEGORY_META: Record<string, { desc: string; image: string; icon: React.ReactNode; color: string }> = {
  'cadeaux-personnalises': {
    desc: 'Offrez un objet unique et personnalisé avec un prénom, une date ou un message spécial. Mugs gravés, cadres photo lumineux, textiles et accessoires sur-mesure.',
    image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800',
    icon: <Sparkles size={16} />,
    color: 'from-amber-500/10 to-yellow-500/10'
  },
  'occasions-speciales': {
    desc: 'Célébrez les grands jours de la vie. Des coffrets de mariage royaux, des boîtes de roses éternelles élégantes, des packs naissance et des surprises romantiques.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
    icon: <Heart size={16} />,
    color: 'from-pink-500/10 to-rose-500/10'
  },
  'paniers-ravitaillement': {
    desc: 'Des paniers alimentaires utiles et attentionnés remplis de produits de première nécessité (riz de luxe, huile, lait, café, pâtes) pour soutenir vos proches au Bénin.',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800',
    icon: <ShoppingBag size={16} />,
    color: 'from-emerald-500/10 to-teal-500/10'
  },
};

export function PropositionsClient({ categories }: PropositionsClientProps) {
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

  return (
    <div className="font-instrument bg-zinc-50/30 overflow-hidden">
      
      {/* Elegant Minimalist Header */}
      <section className="bg-zinc-50 border-b border-zinc-200/50 py-12 lg:py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 z-10">
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bc-purpleLight text-bc-purple font-semibold text-[10px] tracking-wider uppercase mx-auto"
          >
            <Gift size={11} className="text-bc-yellow fill-current" />
            <span>Nos Offres</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-bold text-2xl sm:text-3xl text-zinc-900 tracking-tight"
          >
            NOS PROPOSITIONS
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-zinc-500 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed font-medium font-instrument"
          >
            Découvrez nos univers thématiques exclusifs pour exprimer vos sentiments avec pertinence et raffinement, quel que soit l&apos;événement.
          </motion.p>
        </div>
      </section>

      {/* Propositions Grid */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-16 relative">
        <div className="absolute top-1/3 left-10 w-96 h-96 bg-bc-purple/5 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {categories.map((cat) => {
            const meta = CATEGORY_META[cat.slug] || {
              desc: 'Découvrez notre sélection exclusive d\'articles de cadeaux de haute qualité pour toutes les occasions.',
              image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800',
              icon: <Gift size={16} />,
              color: 'from-bc-purple/5 to-white/90'
            };

            return (
              <motion.div
                key={cat.id}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border border-zinc-200/50 transition-all duration-300 h-full group"
              >
                {/* Category Image Cover */}
                <div className="h-56 w-full overflow-hidden bg-zinc-50 relative">
                  <img
                    src={meta.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                  />
                  {/* Clean Icon Badge */}
                  <div className="absolute top-4 left-4 bg-bc-purple text-white p-2.5 rounded-full shadow-md">
                    <span className="text-bc-yellow">{meta.icon}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-5">
                  <div className="space-y-2">
                    <h2 className="font-bold text-lg text-zinc-900 leading-snug group-hover:text-bc-purple transition-colors">
                      {cat.name}
                    </h2>
                    <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed text-justify font-instrument">
                      {meta.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-100">
                    <Link href={`/catalogue?category=${cat.slug}`} className="block w-full">
                      <motion.button
                        whileHover={{ y: -0.5 }}
                        className="w-full inline-flex items-center justify-center px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-bc-purple hover:bg-bc-purpleDark transition-all shadow-sm cursor-pointer"
                      >
                        Explorer la Collection <ArrowRight size={13} className="ml-1.5" />
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
}
