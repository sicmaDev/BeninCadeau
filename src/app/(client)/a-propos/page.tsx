"use client";

import { MapPin, Heart, Star, Users, Gift, Truck, Sparkles } from "lucide-react";
import { useRouter } from "@/lib/context";
import { motion } from "framer-motion";

export default function AboutPage() {
  const { navigate } = useRouter();

  return (
    <div className="font-body">
      {/* Banner */}
      <section className="relative h-[250px] sm:h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            src="/images/about_banner.png"
            alt="À propos"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 tracking-tight"
          >
            À propos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-accent text-sm sm:text-base md:text-lg font-medium max-w-xl mx-auto opacity-90"
          >
            Qui sommes-nous ?
          </motion.p>
        </div>
      </section>

      {/* Description Intro (under banner) */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="py-12 bg-card border-b border-border"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-primary mb-4">
            L&apos;art d&apos;offrir, <span className="text-accent italic">made in Bénin</span>
          </h2>
          <p className="text-foreground/80 text-lg leading-relaxed font-light">
            Bénin Cadeau est née d&apos;une conviction simple : offrir un cadeau doit être une expérience agréable,
            accessible et mémorable. Depuis Cotonou, nous aidons des centaines de personnes à exprimer
            leur affection à travers des cadeaux soigneusement choisis.
          </p>
        </div>
      </motion.section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6"
        >
          {[
            { icon: <Users size={24} />, value: "500+", label: "Clients satisfaits" },
            { icon: <Star size={24} />, value: "4.9/5", label: "Note moyenne" },
            { icon: <Heart size={24} />, value: "1 200+", label: "Cadeaux livrés" },
            { icon: <MapPin size={24} />, value: "8+", label: "Zones de livraison" },
          ].map(({ icon, value, label }) => (
            <motion.div
              key={label}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 12 } }
              }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="text-center bg-card border border-border rounded-2xl p-6 hover:shadow-premium transition-all duration-300"
            >
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-3 text-primary">
                {icon}
              </div>
              <p className="font-display text-2xl font-bold text-primary">{value}</p>
              <p className="text-muted-foreground text-xs mt-1">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Mission */}
      <section className="bg-secondary py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">Notre mission</p>
            <h2 className="font-display text-3xl font-semibold text-primary leading-tight mb-6">
              Rendre chaque occasion inoubliable
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>
                Chez Bénin Cadeau, nous croyons que chaque cadeau est une occasion de créer un souvenir
                durable. C&apos;est pourquoi nous sélectionsons soigneusement nos produits pour garantir
                qualité, originalité et signification.
              </p>
              <p>
                Notre équipe passionnée se charge de l&apos;emballage et de la livraison de vos cadeaux
                avec le plus grand soin, pour que chaque boîte déballée soit un moment de joie pure.
              </p>
              <p>
                Nous proposons aussi des solutions sur mesure pour les entreprises — goodies personnalisés,
                cadeaux d&apos;entreprise et récompenses collaborateurs.
              </p>
            </div>
            <button
              onClick={() => navigate("catalogue")}
              className="mt-6 inline-flex items-center gap-2 bg-primary text-white font-bold px-5 py-3 rounded-xl hover:bg-primary/90 transition-colors text-sm cursor-pointer"
            >
              Découvrir nos cadeaux
            </button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="rounded-2xl overflow-hidden aspect-[3/4] bg-muted shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=500&fit=crop&auto=format"
                alt="Coffret cadeau Bénin Cadeau"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-square bg-muted shadow-lg mt-8">
              <img
                src="https://images.unsplash.com/photo-1713998525908-69c60daae07d?w=400&h=400&fit=crop&auto=format"
                alt="Bouquet et parfum"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Nos engagements</p>
          <h2 className="font-display text-3xl font-semibold text-primary">Ce qui nous différencie</h2>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } }
          }}
          className="grid sm:grid-cols-3 gap-6"
        >
          {[
            {
              icon: <Gift size={32} className="text-accent mx-auto mb-4" />,
              title: "Sélection curatée",
              desc: "Chaque produit dans notre catalogue est sélectionné pour sa qualité et son caractère unique. Pas de produits génériques — que des cadeaux qui marquent.",
            },
            {
              icon: <Truck size={32} className="text-accent mx-auto mb-4" />,
              title: "Livraison express",
              desc: "Livraison le jour-même ou le lendemain à Cotonou. Parce qu'un cadeau urgent ne doit jamais être en retard.",
            },
            {
              icon: <Sparkles size={32} className="text-accent mx-auto mb-4" />,
              title: "Personnalisation",
              desc: "Ajoutez un message personnel, un prénom à graver ou une couleur souhaitée. Chaque cadeau devient unique.",
            },
          ].map(({ icon, title, desc }) => (
            <motion.div
              key={title}
              variants={{
                hidden: { opacity: 0, y: 25 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 12 } }
              }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-premium transition-all duration-300"
            >
              {icon}
              <h3 className="font-display text-lg font-semibold text-primary mb-3">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
