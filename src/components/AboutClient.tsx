"use client";

import React from 'react';
import Link from 'next/link';
import { Target, Heart, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function AboutClient() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
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
    <div className="font-instrument bg-zinc-50/30 overflow-hidden">
      
      {/* HERO SECTION (Split light layout) */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-10 lg:py-16">
        <div className="bg-zinc-100/50 rounded-[40px] border border-zinc-200/40 p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          
          <div className="absolute top-10 left-10 w-72 h-72 bg-bc-yellow/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-bc-purple/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Text content */}
            <div className="lg:col-span-7 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-zinc-200 text-bc-purple font-semibold text-xs tracking-wider uppercase shadow-sm w-fit"
              >
                <Sparkles size={12} className="text-bc-yellow fill-current" />
                <span>Notre Histoire</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-bold text-zinc-900 text-3xl sm:text-4xl lg:text-[46px] leading-[1.15] tracking-tight"
              >
                Chez Bénin Cadeau, chaque cadeau raconte une <span className="text-bc-purple">histoire d&apos;émotion</span>.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-zinc-500 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl font-instrument"
              >
                L&apos;idée est née d&apos;une envie simple : permettre à chacun d&apos;exprimer son amour, sa gratitude ou son amitié de manière unique, précieuse et mémorable.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="pt-2"
              >
                <Link href="/catalogue">
                  <button
                    className="px-7 py-3.5 rounded-full bg-bc-purple hover:bg-bc-purpleDark text-white font-semibold text-xs tracking-wider uppercase shadow-sm transition-all cursor-pointer"
                  >
                    Découvrir le Catalogue
                  </button>
                </Link>
              </motion.div>
            </div>

            {/* Visual Image */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="w-full max-w-[420px] aspect-[4/3] sm:aspect-square relative rounded-[32px] overflow-hidden border border-zinc-200/50 shadow-premium bg-zinc-50">
                <img
                  src="/47-13.png"
                  alt="Histoire de Bénin Cadeau"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* VALUES & MISSION CARDS */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-20 relative">
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-bc-purple/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h2 className="font-bold text-2xl sm:text-3xl text-zinc-900 uppercase tracking-tight">
            Ce qui nous anime
          </h2>
          <div className="w-12 h-1 bg-bc-purple mx-auto rounded-full" />
          <p className="text-zinc-500 text-sm sm:text-base font-instrument">
            Nous mettons tout notre savoir-faire au service de vos plus beaux messages d&apos;affection.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {/* Card 1: Mission */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col bg-white border border-zinc-200/50 rounded-3xl p-8 shadow-sm hover:shadow-premium transition-all duration-300 h-full"
          >
            <div className="w-12 h-12 bg-sky-50 text-sky-700 rounded-2xl flex items-center justify-center mb-6 border border-sky-100 shadow-sm">
              <Target size={22} />
            </div>
            <h3 className="font-bold text-xl text-zinc-900 mb-3">
              Notre Mission
            </h3>
            <p className="text-zinc-500 text-xs sm:text-sm text-justify leading-relaxed flex-grow font-instrument">
              <strong>Transformer</strong> vos idées en <strong>émotions tangibles</strong>. Qu&apos;il s&apos;agisse d&apos;un anniversaire, d&apos;un mariage, d&apos;un baptême ou simplement d&apos;un &quot;je pense à toi&quot;, nous créons des pièces uniques qui font naître des sourires sincères.
            </p>
          </motion.div>

          {/* Card 2: Valeurs */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col bg-white border border-zinc-200/50 rounded-3xl p-8 shadow-sm hover:shadow-premium transition-all duration-300 h-full"
          >
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6 border border-rose-100 shadow-sm">
              <Heart size={22} />
            </div>
            <h3 className="font-bold text-xl text-zinc-900 mb-3">
              Nos Valeurs
            </h3>
            <div className="text-zinc-500 text-xs sm:text-sm text-justify leading-relaxed flex-grow space-y-3 font-instrument">
              <p>
                <strong>Créativité :</strong> Chaque cadeau est conçu pour être aussi singulier que la personne qui le reçoit.
              </p>
              <p>
                <strong>Joie :</strong> Nous ne livrons pas seulement un colis, nous livrons un véritable moment de bonheur.
              </p>
              <p>
                <strong>Accessibilité :</strong> Offrir du bonheur doit être simple, rapide et disponible partout au Bénin.
              </p>
            </div>
          </motion.div>

          {/* Card 3: Engagements */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col bg-white border border-zinc-200/50 rounded-3xl p-8 shadow-sm hover:shadow-premium transition-all duration-300 h-full"
          >
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100 shadow-sm">
              <ShieldCheck size={22} />
            </div>
            <h3 className="font-bold text-xl text-zinc-900 mb-3">
              Nos Engagements
            </h3>
            <div className="text-zinc-500 text-xs sm:text-sm text-justify leading-relaxed flex-grow space-y-3 font-instrument">
              <p>
                Des <strong>produits d&apos;exception</strong>, choisis et inspectés individuellement avec le plus grand soin.
              </p>
              <p>
                Une <strong>personnalisation d&apos;orfèvre</strong>, pour donner corps à vos pensées les plus précieuses.
              </p>
              <p>
                Une <strong>logistique irréprochable</strong>, assurant une livraison sécurisée et ponctuelle pour préserver l&apos;effet de surprise.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* LUXURY QUOTE SECTION */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[36px] overflow-hidden shadow-premium h-[420px] md:h-[500px] flex items-center border border-zinc-200/30"
        >
          {/* Background Image */}
          <img
            src="/55-39.png"
            alt="Joie d'offrir"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay to dim background */}
          <div className="absolute inset-0 bg-zinc-900/10 md:bg-transparent" />

          {/* Light-themed side card */}
          <div className="relative z-10 w-full md:max-w-[440px] h-full md:h-auto md:ml-auto md:mr-16 p-8 md:p-10 glass-panel md:rounded-3xl flex items-center justify-center shadow-premium border-t border-zinc-150">
            <div className="space-y-5">
              <div className="w-10 h-1 bg-bc-purple rounded-full" />
              <p className="font-bold text-xl md:text-2xl text-zinc-900 leading-snug">
                Bénin Cadeau est bien plus qu&apos;une boutique : c&apos;est votre complice pour célébrer la vie et cultiver vos plus beaux liens.
              </p>
              <p className="text-zinc-500 text-xs font-semibold italic font-instrument">
                — L&apos;équipe Bénin Cadeau
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
