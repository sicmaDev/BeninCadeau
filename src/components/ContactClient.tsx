"use client";

import React from 'react';
import { MapPin, Clock, Phone, Sparkles } from 'lucide-react';
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bc-purpleLight text-bc-purple font-semibold text-[10px] tracking-wider uppercase mx-auto"
          >
            <Sparkles size={11} className="text-bc-yellow fill-current" />
            <span>À votre écoute</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-bold text-2xl sm:text-3xl text-zinc-900 tracking-tight"
          >
            CONTACTEZ-NOUS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-instrument text-zinc-500 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Une question sur un produit ? Une demande de personnalisation sur-mesure ou besoin d&apos;assistance pour finaliser une commande ? Notre équipe dévouée vous accompagne avec plaisir.
          </motion.p>
        </div>
      </section>

      {/* Contact Content Grid */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-16 relative">
        <div className="absolute top-[40%] right-10 w-80 h-80 bg-bc-yellow/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          
          {/* Left Info Columns */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="lg:col-span-4 space-y-4"
          >
            {/* Adresse */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-3xl p-6 border border-zinc-200/50 shadow-sm flex items-start gap-4"
            >
              <div className="w-10 h-10 bg-bc-purpleLight text-bc-purple rounded-xl flex items-center justify-center flex-shrink-0 border border-bc-purple/5">
                <MapPin size={18} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-xs text-zinc-950 uppercase tracking-wider">
                  Adresse de l&apos;Atelier
                </h3>
                <p className="text-zinc-500 text-xs font-semibold leading-relaxed font-instrument">
                  Bénin, Calavi-Kpota<br />
                  2ème étage, Immeuble Tankaya<br />
                  (Face Carrefour Kpota)
                </p>
              </div>
            </motion.div>

            {/* Horaire */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-3xl p-6 border border-zinc-200/50 shadow-sm flex items-start gap-4"
            >
              <div className="w-10 h-10 bg-bc-purpleLight text-bc-purple rounded-xl flex items-center justify-center flex-shrink-0 border border-bc-purple/5">
                <Clock size={18} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-xs text-zinc-950 uppercase tracking-wider">
                  Horaires d&apos;Ouverture
                </h3>
                <p className="text-zinc-500 text-xs font-semibold leading-relaxed font-instrument">
                  Lundi - Vendredi :<br />
                  08h00 - 12h30 & 14h00 - 17h30<br />
                  Samedi : Service Client en ligne
                </p>
              </div>
            </motion.div>

            {/* Contact */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-3xl p-6 border border-zinc-200/50 shadow-sm flex items-start gap-4"
            >
              <div className="w-10 h-10 bg-bc-purpleLight text-bc-purple rounded-xl flex items-center justify-center flex-shrink-0 border border-bc-purple/5">
                <Phone size={18} />
              </div>
              <div className="space-y-1.5 flex-grow">
                <h3 className="font-bold text-xs text-zinc-950 uppercase tracking-wider">
                  Assistance Directe
                </h3>
                <div className="text-zinc-500 text-xs font-semibold space-y-1 font-instrument">
                  <p className="flex items-center gap-1.5 hover:text-bc-purple transition-colors">
                    Téléphone: <a href="tel:+22963904000" className="underline font-bold text-zinc-800">(+229) 63 90 40 00</a>
                  </p>
                  <p className="flex items-center gap-1.5 hover:text-bc-purple transition-colors">
                    Email: <a href="mailto:info@sicmagroup.com" className="underline text-zinc-800">info@sicmagroup.com</a>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/50 shadow-sm"
          >
            <div className="space-y-1.5 mb-8">
              <h2 className="font-bold text-xl text-zinc-900 uppercase tracking-tight leading-none">
                Écrivez-nous un message
              </h2>
              <p className="text-zinc-500 font-medium text-xs sm:text-sm font-instrument">
                Remplissez ce formulaire et notre service client vous contactera par email ou par téléphone sous 24 heures ouvrées.
              </p>
            </div>

            <ContactForm />
          </motion.div>
        </div>
      </section>

      {/* Decorative Full Width Banner Map */}
      <section className="relative w-full h-[320px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000"
          alt="Planisphère de localisation"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 via-transparent to-zinc-50 pointer-events-none" />
      </section>
    </div>
  );
}
