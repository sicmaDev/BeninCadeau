"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Send, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

const WHATSAPP_NUMBER = "22997000000";

export default function ContactPage() {
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
          subject: "Message du formulaire de Contact Client",
        }),
      });

      if (res.ok) {
        setSent(true);
        toast.success("Votre message a été envoyé avec succès !");
      } else {
        const data = await res.json();
        setError(data.error || "Impossible d'envoyer le message.");
        toast.error(data.error || "Impossible d'envoyer le message.");
      }
    } catch (err) {
      setError("Erreur réseau lors de l'envoi.");
      toast.error("Erreur réseau lors de l'envoi.");
    } finally {
      setLoading(false);
    }
  };

  const whatsappMsg = encodeURIComponent(
    "Bonjour Bénin Cadeau, j'aimerais avoir des informations sur vos offres et services."
  );

  return (
    <div className="font-body min-h-screen bg-background">
      {/* Header Section */}
      <section className="bg-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 text-8xl flex flex-wrap gap-8 overflow-hidden select-none pointer-events-none p-8">
          {Array.from({ length: 8 }).map((_, i) => <span key={i}>✉️</span>)}
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">Contactez-nous</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-white leading-tight mb-4">
            Parlons de vos <span className="text-accent italic">projets</span>
          </h1>
          <p className="text-white/80 text-lg leading-relaxed">
            Une question sur un produit, une commande sur-mesure ou un partenariat ?
            Notre équipe est à votre écoute pour vous conseiller et vous accompagner.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Info Section */}
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-3xl font-semibold text-primary mb-4">Nos coordonnées</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                N'hésitez pas à nous joindre par téléphone, e-mail, ou à passer directement nous voir en agence.
                Nous sommes disponibles du lundi au samedi de 8h à 20h.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: <MapPin size={22} className="text-accent" />,
                  title: "Adresse de l'agence",
                  content: "Abomey-Calavi, carrefour Kpota, 2ème étage, immeuble Tankaya - Banque Atlantique",
                },
                {
                  icon: <Phone size={22} className="text-accent" />,
                  title: "Téléphone & WhatsApp",
                  content: "+229 55 25 00 00",
                  href: "tel:+22955250000",
                },
                {
                  icon: <Mail size={22} className="text-accent" />,
                  title: "Adresse E-mail",
                  content: "contact@benincadeau.bj",
                  href: "mailto:contact@benincadeau.bj",
                },
              ].map(({ icon, title, content, href }) => (
                <div key={title} className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-card border border-border rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary uppercase tracking-wider">{title}</p>
                    {href ? (
                      <a href={href} className="text-base text-muted-foreground hover:text-primary font-medium transition-colors mt-1 block">
                        {content}
                      </a>
                    ) : (
                      <p className="text-base text-muted-foreground font-medium mt-1 whitespace-pre-line leading-relaxed">{content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl p-6 space-y-4 max-w-md">
              <div className="flex gap-3 items-center">
                <span className="text-3xl">💬</span>
                <div>
                  <p className="font-bold text-foreground text-sm">Discutons en direct</p>
                  <p className="text-muted-foreground text-xs">Temps de réponse habituel : moins de 5 minutes</p>
                </div>
              </div>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-5 py-3 rounded-xl hover:bg-[#22c55e] transition-colors text-sm w-full cursor-pointer"
              >
                Écrire sur WhatsApp
              </a>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
            {sent ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto shadow-md border border-accent/20">
                  <CheckCircle size={40} className="text-accent" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-primary">Message envoyé !</h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
                  Merci pour votre message. Un membre de l'équipe Bénin Cadeau reviendra vers vous très rapidement.
                </p>
              </div>
            ) : (
              <>
                <h3 className="font-display text-2xl font-semibold text-primary mb-6">Envoyer un message</h3>
                {error && (
                  <div className="bg-red-50 text-destructive text-sm rounded-xl px-4 py-3 border border-red-200 mb-6">{error}</div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">Votre Nom Complet *</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Kossi Adjovi"
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">Adresse E-mail *</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="kossi@exemple.bj"
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">Votre Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      placeholder="Décrivez votre besoin (commande personnalisée, livraison spéciale, devis d'entreprise...)"
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent resize-none focus:border-transparent transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-70 cursor-pointer text-sm"
                  >
                    {loading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} />
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
