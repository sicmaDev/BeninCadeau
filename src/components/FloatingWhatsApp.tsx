"use client";

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export function FloatingWhatsApp() {
  const whatsappNumber = "22963904000";
  const whatsappMessage = encodeURIComponent("Bonjour Bénin Cadeau, je souhaite obtenir des informations concernant vos offres.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 pointer-events-auto"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter Bénin Cadeau sur WhatsApp"
        className="relative group flex items-center justify-center w-16 h-16 rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95"
      >
        {/* Pulsing ring animation */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-40 animate-ping pointer-events-none"></span>

        {/* WhatsApp Icon */}
        <MessageCircle size={32} className="relative z-10 fill-white stroke-none" />

        {/* Tooltip */}
        <div className="absolute right-20 bg-bc-navy text-white text-sm font-semibold py-2 px-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-md border border-white/10">
          Discutez avec nous
        </div>
      </a>
    </motion.div>
  );
}
