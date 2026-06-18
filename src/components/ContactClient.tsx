"use client";

import React from 'react';
import { MapPin, Clock, Phone, Mail, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { ContactForm } from './ContactForm';

export function ContactClient() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
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
      <section className="relative h-[440px] md:h-[500px] w-full flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=2000"
            alt="Vue de la ville de Cotonou - Bénin Cadeau"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bc-purpleDark/95 to-bc-navyDark/90"></div>
        </div>

        {/* Decorative glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-bc-purple/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel border border-white/20 text-white font-montserrat text-[10px] font-bold tracking-widest uppercase"
          >
            <Sparkles size={12} className="text-bc-yellow" />
            <span>À votre écoute</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-montserrat font-black text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tight"
          >
            Contactez-nous
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-instrument font-medium text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed"
          >
            Une question sur un produit ? Une demande de personnalisation sur-mesure ou besoin d&apos;assistance pour finaliser une commande ? Notre équipe dévouée vous accompagne avec plaisir.
          </motion.p>
        </div>
      </section>

      {/* Contact Content Grid */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-24 relative">
        {/* Glow */}
        <div className="absolute top-[40%] right-10 w-80 h-80 bg-bc-yellow/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Info Columns (Glassmorphic list) */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="lg:col-span-4 space-y-6"
          >
            {/* Adresse */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -4, scale: 1.01 }}
              className="glass-panel rounded-3xl p-8 border border-white/40 shadow-card flex items-start gap-5"
            >
              <div className="w-12 h-12 bg-bc-purple/10 border border-bc-purple/10 rounded-2xl flex items-center justify-center text-bc-purple flex-shrink-0">
                <MapPin size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="font-montserrat font-extrabold text-sm text-bc-navy uppercase tracking-wider">
                  Adresse de l&apos;Atelier
                </h3>
                <p className="text-gray-600 text-sm font-semibold leading-relaxed">
                  Bénin, Calavi-Kpota<br />
                  2ème étage, Immeuble Tankaya<br />
                  (Face Carrefour Kpota)
                </p>
              </div>
            </motion.div>

            {/* Horaire */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -4, scale: 1.01 }}
              className="glass-panel rounded-3xl p-8 border border-white/40 shadow-card flex items-start gap-5"
            >
              <div className="w-12 h-12 bg-bc-purple/10 border border-bc-purple/10 rounded-2xl flex items-center justify-center text-bc-purple flex-shrink-0">
                <Clock size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="font-montserrat font-extrabold text-sm text-bc-navy uppercase tracking-wider">
                  Horaires d&apos;Ouverture
                </h3>
                <p className="text-gray-600 text-sm font-semibold">
                  Lundi - Vendredi :<br />
                  08h00 - 12h30 & 14h00 - 17h30<br />
                  Samedi : Service Client en ligne
                </p>
              </div>
            </motion.div>

            {/* Contact */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -4, scale: 1.01 }}
              className="glass-panel rounded-3xl p-8 border border-white/40 shadow-card flex items-start gap-5"
            >
              <div className="w-12 h-12 bg-bc-purple/10 border border-bc-purple/10 rounded-2xl flex items-center justify-center text-bc-purple flex-shrink-0">
                <Phone size={22} />
              </div>
              <div className="space-y-2 flex-grow">
                <h3 className="font-montserrat font-extrabold text-sm text-bc-navy uppercase tracking-wider">
                  Assistance Directe
                </h3>
                <div className="text-gray-600 text-sm font-semibold space-y-1">
                  <p className="flex items-center gap-1.5 hover:text-bc-purple transition-colors">
                    Téléphone: <a href="tel:+22963904000" className="underline font-bold">(+229) 63 90 40 00</a>
                  </p>
                  <p className="flex items-center gap-1.5 hover:text-bc-purple transition-colors">
                    Email: <a href="mailto:info@sicmagroup.com" className="underline">info@sicmagroup.com</a>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-8 bg-white rounded-[32px] p-8 md:p-12 border border-gray-100 shadow-premium"
          >
            <div className="space-y-2 mb-10">
              <h2 className="font-montserrat font-black text-2xl md:text-3xl text-bc-navy uppercase tracking-tight leading-none">
                Écrivez-nous un message
              </h2>
              <p className="text-gray-500 font-medium text-sm md:text-base">
                Remplissez ce formulaire et notre service client vous contactera par email ou par téléphone sous 24 heures ouvrées.
              </p>
            </div>

            <ContactForm />
          </motion.div>
        </div>
      </section>

      {/* Decorative Full Width Banner Map */}
      <section className="relative w-full h-[400px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000"
          alt="Planisphère de localisation"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bc-bg via-transparent to-bc-bg pointer-events-none" />
      </section>
    </div>
  );
}
