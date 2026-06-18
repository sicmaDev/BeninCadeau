"use client";

import React from 'react';
import Link from 'next/link';
import { Target, Heart, ShieldCheck, ArrowLeft, ArrowRight, Sparkles, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

export function AboutClient() {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="font-instrument bg-bc-bg overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative w-full h-[640px] md:h-[680px] flex items-center justify-center">
        {/* Background image & gradient overlay */}
        <div className="absolute inset-0">
          <img
            src="/47-13.png"
            alt="Histoire et équipe de Bénin Cadeau - Créateurs d'émotions"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bc-purpleDark/90 via-bc-purpleDark/70 to-transparent"></div>
        </div>

        {/* Floating elements/glows */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-bc-yellow/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-bc-purple/30 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-12 z-10">
          <div className="max-w-[750px] space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-white/20 text-white font-montserrat text-xs font-bold tracking-wider uppercase"
            >
              <Sparkles size={14} className="text-bc-yellow animate-pulse" />
              <span>Notre Histoire</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-montserrat font-extrabold text-white text-3xl md:text-5xl lg:text-[52px] leading-tight tracking-tight"
            >
              Chez Bénin Cadeau, chaque cadeau raconte une <span className="text-gold-gradient">histoire d&apos;émotion</span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-200 text-lg md:text-xl font-medium leading-relaxed"
            >
              L&apos;idée est née d&apos;une envie simple : permettre à chacun d&apos;exprimer son amour, sa gratitude ou son amitié de manière unique, précieuse et mémorable.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pt-4"
            >
              <Link href="/catalogue">
                <button
                  className="px-8 py-4 rounded-2xl font-montserrat font-bold text-bc-purpleDark bg-gold-gradient hover:bg-yellow-400 text-sm uppercase tracking-wider transition-all duration-300 shadow-yellow-glow hover:scale-[1.02] cursor-pointer"
                >
                  Découvrir le Catalogue
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* VALUES & MISSION CARDS */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-28 relative">
        {/* Glows in background */}
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-bc-purple/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-montserrat font-black text-3xl md:text-4xl text-bc-navy uppercase tracking-tight">
            Ce qui nous anime
          </h2>
          <p className="text-gray-500 font-medium text-base md:text-lg">
            Nous mettons tout notre savoir-faire au service de vos plus beaux messages d&apos;affection.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Card 1: Mission */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -10, scale: 1.01 }}
            className="flex flex-col bg-gradient-to-br from-bc-blueLight/40 to-white/90 backdrop-blur-md border border-white/50 rounded-[32px] p-8 md:p-10 shadow-card hover:shadow-premium transition-all duration-300 h-full"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-[#012C3F] mb-8 shadow-sm">
              <Target size={30} />
            </div>
            <h3 className="font-montserrat font-extrabold text-2xl text-bc-navy mb-4">
              Notre Mission
            </h3>
            <p className="text-gray-600 text-justify leading-relaxed text-sm md:text-base flex-grow">
              <strong>Transformer</strong> vos idées en <strong>émotions tangibles</strong>. Qu&apos;il s&apos;agisse d&apos;un anniversaire, d&apos;un mariage, d&apos;un baptême ou simplement d&apos;un &quot;je pense à toi&quot;, nous créons des pièces uniques qui font naître des sourires sincères.
            </p>
          </motion.div>

          {/* Card 2: Valeurs */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -10, scale: 1.01 }}
            className="flex flex-col bg-gradient-to-br from-bc-pinkLight/40 to-white/90 backdrop-blur-md border border-white/50 rounded-[32px] p-8 md:p-10 shadow-card hover:shadow-premium transition-all duration-300 h-full"
          >
            <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-600 mb-8 shadow-sm">
              <Heart size={30} />
            </div>
            <h3 className="font-montserrat font-extrabold text-2xl text-bc-navy mb-4">
              Nos Valeurs
            </h3>
            <div className="text-gray-600 text-justify leading-relaxed text-sm md:text-base flex-grow space-y-4">
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
            whileHover={{ y: -10, scale: 1.01 }}
            className="flex flex-col bg-gradient-to-br from-bc-greenLight/40 to-white/90 backdrop-blur-md border border-white/50 rounded-[32px] p-8 md:p-10 shadow-card hover:shadow-premium transition-all duration-300 h-full"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 shadow-sm">
              <ShieldCheck size={30} />
            </div>
            <h3 className="font-montserrat font-extrabold text-2xl text-bc-navy mb-4">
              Nos Engagements
            </h3>
            <div className="text-gray-600 text-justify leading-relaxed text-sm md:text-base flex-grow space-y-4">
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
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pb-28">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[40px] overflow-hidden shadow-premium h-[480px] md:h-[580px] flex items-center"
        >
          {/* Background Image */}
          <img
            src="/55-39.png"
            alt="Couple heureux partageant un moment de joie"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay to dim background */}
          <div className="absolute inset-0 bg-bc-navyDark/40 md:bg-bc-navyDark/20" />

          {/* Golden/Purple side card */}
          <div className="relative z-10 w-full md:max-w-[500px] h-full md:h-auto md:ml-auto md:mr-16 p-8 md:p-12 glass-panel-dark md:rounded-[32px] flex items-center justify-center border-0 md:border border-white/10 shadow-premium">
            <div className="space-y-6">
              <div className="w-12 h-1 bg-bc-yellow rounded-full" />
              <p className="font-montserrat font-extrabold text-2xl md:text-3xl text-white leading-snug">
                Bénin Cadeau est bien plus qu&apos;une boutique : c&apos;est votre complice pour célébrer la vie et cultiver vos plus beaux liens.
              </p>
              <p className="text-gray-300 text-sm font-medium italic">
                — L&apos;équipe Bénin Cadeau
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
