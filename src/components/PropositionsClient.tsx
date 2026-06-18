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
    icon: <Sparkles size={22} />,
    color: 'from-amber-500/10 to-yellow-500/10'
  },
  'occasions-speciales': {
    desc: 'Célébrez les grands jours de la vie. Des coffrets de mariage royaux, des boîtes de roses éternelles élégantes, des packs naissance et des surprises romantiques.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
    icon: <Heart size={22} />,
    color: 'from-pink-500/10 to-rose-500/10'
  },
  'paniers-ravitaillement': {
    desc: 'Des paniers alimentaires utiles et attentionnés remplis de produits de première nécessité (riz de luxe, huile, lait, café, pâtes) pour soutenir vos proches au Bénin.',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800',
    icon: <ShoppingBag size={22} />,
    color: 'from-emerald-500/10 to-teal-500/10'
  },
};

export function PropositionsClient({ categories }: PropositionsClientProps) {
  const fadeInUp = {
    hidden: { opacity: 0, y: 35 },
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

  return (
    <div className="font-instrument bg-bc-bg overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[400px] w-full flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1500"
            alt="Nos propositions de cadeaux"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bc-purpleDark/95 to-bc-navyDark/90"></div>
        </div>

        {/* Floating gradient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-bc-purple/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-white/20 text-white font-montserrat text-[10px] font-bold tracking-widest uppercase"
          >
            <Gift size={12} className="text-bc-yellow" />
            <span>Nos Offres</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-montserrat font-extrabold text-4xl sm:text-5xl text-white tracking-tight"
          >
            NOS <span className="text-gold-gradient">PROPOSITIONS</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-200 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Découvrez nos univers thématiques exclusifs pour exprimer vos sentiments avec pertinence et raffinement, quel que soit l&apos;événement.
          </motion.p>
        </div>
      </section>

      {/* Propositions Grid */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-24 relative">
        <div className="absolute top-1/3 left-10 w-96 h-96 bg-bc-purple/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-bc-yellow/5 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {categories.map((cat) => {
            const meta = CATEGORY_META[cat.slug] || {
              desc: 'Découvrez notre sélection exclusive d\'articles de cadeaux de haute qualité pour toutes les occasions.',
              image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800',
              icon: <Gift size={22} />,
              color: 'from-bc-purple/5 to-white/90'
            };

            return (
              <motion.div
                key={cat.id}
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.01 }}
                className="flex flex-col bg-white rounded-[32px] overflow-hidden shadow-card border border-gray-100/80 hover:shadow-premium transition-all duration-300 h-full group"
              >
                {/* Category Image Cover */}
                <div className="h-64 w-full overflow-hidden bg-gray-50 relative">
                  <img
                    src={meta.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Glass Icon Badge */}
                  <div className="absolute top-5 left-5 bg-bc-purple/90 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-lg border border-white/20">
                    <span className="text-bc-yellow">{meta.icon}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex-grow flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <h2 className="font-montserrat font-bold text-2xl text-bc-navy leading-snug group-hover:text-bc-purple transition-colors">
                      {cat.name}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed text-justify font-medium">
                      {meta.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100/80">
                    <Link href={`/catalogue?category=${cat.slug}`} className="block w-full">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full inline-flex items-center justify-center px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-wider text-bc-purple bg-gold-gradient hover:bg-yellow-400 transition-all shadow-yellow-glow cursor-pointer"
                      >
                        Explorer la Collection <ArrowRight size={14} className="ml-2" />
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
