"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Send, CheckCircle, Heart, Star, Users, Loader2 } from "lucide-react";
import { useRouter } from "@/lib/context";

export default function AboutPage() {
  const { navigate } = useRouter();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          subject: "Contact - À propos",
        }),
      });

      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json();
        setError(data.error || "Impossible d'envoyer le message.");
      }
    } catch (err) {
      setError("Erreur réseau lors de l'envoi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-body">
      {/* Hero */}
      <section className="bg-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 text-8xl flex flex-wrap gap-8 overflow-hidden select-none pointer-events-none p-8">
          {Array.from({ length: 12 }).map((_, i) => <span key={i}>🎁</span>)}
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">Qui sommes-nous ?</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-white leading-tight mb-6">
            L'art d'offrir,{" "}
            <span className="text-accent italic">made in Bénin</span>
          </h1>
          <p className="text-white/80 text-lg leading-relaxed">
            Bénin Cadeau est née d'une conviction simple : offrir un cadeau doit être une expérience agréable,
            accessible et mémorable. Depuis Cotonou, nous aidons des centaines de personnes à exprimer
            leur affection à travers des cadeaux soigneusement choisis.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { icon: <Users size={24} />, value: "500+", label: "Clients satisfaits" },
            { icon: <Star size={24} />, value: "4.9/5", label: "Note moyenne" },
            { icon: <Heart size={24} />, value: "1 200+", label: "Cadeaux livrés" },
            { icon: <MapPin size={24} />, value: "8+", label: "Zones de livraison" },
          ].map(({ icon, value, label }) => (
            <div key={label} className="text-center bg-card border border-border rounded-2xl p-6">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-3 text-primary">
                {icon}
              </div>
              <p className="font-display text-2xl font-bold text-primary">{value}</p>
              <p className="text-muted-foreground text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="bg-secondary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">Notre mission</p>
            <h2 className="font-display text-3xl font-semibold text-primary leading-tight mb-6">
              Rendre chaque occasion inoubliable
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>
                Chez Bénin Cadeau, nous croyons que chaque cadeau est une occasion de créer un souvenir
                durable. C'est pourquoi nous sélectionnons soigneusement nos produits pour garantir
                qualité, originalité et signification.
              </p>
              <p>
                Notre équipe passionnée se charge de l'emballage et de la livraison de vos cadeaux
                avec le plus grand soin, pour que chaque boîte déballée soit un moment de joie pure.
              </p>
              <p>
                Nous proposons aussi des solutions sur mesure pour les entreprises — goodies personnalisés,
                cadeaux d'entreprise et récompenses collaborateurs.
              </p>
            </div>
            <button
              onClick={() => navigate("catalogue")}
              className="mt-6 inline-flex items-center gap-2 bg-primary text-white font-bold px-5 py-3 rounded-xl hover:bg-primary/90 transition-colors text-sm cursor-pointer"
            >
              Découvrir nos cadeaux
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden aspect-[3/4] bg-muted shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=500&fit=crop&auto=format"
                alt="Coffret cadeau Bénin Cadeau"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-square bg-muted shadow-lg mt-8">
              <img
                src="https://images.unsplash.com/photo-1713998525908-69c60daae07d?w=400&h=400&fit=crop&auto=format"
                alt="Bouquet et parfum"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Nos engagements</p>
          <h2 className="font-display text-3xl font-semibold text-primary">Ce qui nous différencie</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              emoji: "🎁",
              title: "Sélection curatée",
              desc: "Chaque produit dans notre catalogue est sélectionné pour sa qualité et son caractère unique. Pas de produits génériques — que des cadeaux qui marquent.",
            },
            {
              emoji: "⚡",
              title: "Livraison express",
              desc: "Livraison le jour-même ou le lendemain à Cotonou. Parce qu'un cadeau urgent ne doit jamais être en retard.",
            },
            {
              emoji: "✏️",
              title: "Personnalisation",
              desc: "Ajoutez un message personnel, un prénom à graver ou une couleur souhaitée. Chaque cadeau devient unique.",
            },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="bg-card border border-border rounded-2xl p-6 text-center">
              <span className="text-4xl block mb-4">{emoji}</span>
              <h3 className="font-display text-lg font-semibold text-primary mb-3">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="bg-muted/50 py-16" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">Nous contacter</p>
            <h2 className="font-display text-3xl font-semibold text-primary mb-6">Parlons-nous</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              Une question, une commande spéciale, un devis pour votre entreprise ?
              Notre équipe est disponible du lundi au samedi de 8h à 20h.
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: <MapPin size={20} className="text-accent" />,
                  title: "Adresse",
                  content: "Akpakpa, Carrefour Houéyiho\nCotonou, Bénin",
                },
                {
                  icon: <Phone size={20} className="text-accent" />,
                  title: "Téléphone / WhatsApp",
                  content: "+229 97 00 00 00",
                  href: "tel:+22997000000",
                },
                {
                  icon: <Mail size={20} className="text-accent" />,
                  title: "Email",
                  content: "contact@benincadeau.bj",
                  href: "mailto:contact@benincadeau.bj",
                },
              ].map(({ icon, title, content, href }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-10 h-10 bg-card border border-border rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wider">{title}</p>
                    {href ? (
                      <a href={href} className="text-sm text-muted-foreground hover:text-primary transition-colors mt-0.5 block">
                        {content}
                      </a>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-0.5 whitespace-pre-line">{content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <a
              href="https://wa.me/22997000000"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-5 py-3 rounded-xl hover:bg-[#22c55e] transition-colors text-sm cursor-pointer"
            >
              💬 Écrire sur WhatsApp
            </a>
          </div>

          {/* Form */}
          <div className="bg-card border border-border rounded-2xl p-6">
            {sent ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h3 className="font-display text-xl font-semibold text-primary mb-2">Message envoyé !</h3>
                <p className="text-muted-foreground text-sm">
                  Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais.
                </p>
              </div>
            ) : (
              <>
                <h3 className="font-display text-xl font-semibold text-primary mb-6">Envoyer un message</h3>
                {error && (
                  <div className="bg-red-50 text-destructive text-sm rounded-xl px-4 py-3 border border-red-200 mb-4">{error}</div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">Nom *</label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Votre nom"
                        className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">Email *</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="votre@email.com"
                        className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      placeholder="Votre message, demande de devis..."
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent resize-none focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-70 cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                    Envoyer le message
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
