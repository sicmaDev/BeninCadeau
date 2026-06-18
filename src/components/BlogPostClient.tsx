"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Send, Sparkles, MessageSquare, Tag, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';

export function BlogPostClient() {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Dossa Princia",
      date: "13/04/2026",
      text: "C'est un guide fantastique ! L'idée d'associer le Furoshiki (emballage en tissu) avec une petite rose dorée en métal est incroyable. J'ai hâte de tester cela pour l'anniversaire de ma mère."
    },
    {
      id: 2,
      author: "Koffi Marc",
      date: "14/04/2026",
      text: "Superbe article. Les détails font toute la différence dans la présentation d'un cadeau de luxe. Bénin Cadeau place vraiment la barre très haut !"
    }
  ]);

  const [newComment, setNewComment] = useState({
    name: '',
    email: '',
    text: ''
  });

  const [formStatus, setFormStatus] = useState<'idle' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.name || !newComment.text) return;
    
    // Add to list
    const added = {
      id: comments.length + 1,
      author: newComment.name,
      date: new Date().toLocaleDateString('fr-FR'),
      text: newComment.text
    };

    setComments([added, ...comments]);
    setNewComment({ name: '', email: '', text: '' });
    setFormStatus('success');
    setTimeout(() => setFormStatus('idle'), 4000);
  };

  const relatedPosts = [
    {
      id: 1,
      title: "Comment choisir le cadeau parfait en 3 étapes simples",
      date: "05/03/2026",
      active: false
    },
    {
      id: 2,
      title: "Les coffrets de mariage : le prestige de l'or et des roses",
      date: "20/02/2026",
      active: false
    },
    {
      id: 3,
      title: "Les nouvelles tendances déco pour emballer vos cadeaux",
      date: "12/04/2026",
      active: true
    }
  ];

  return (
    <div className="font-instrument bg-bc-bg overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[440px] md:h-[500px] w-full flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&q=80&w=2000"
            alt="Emballer un cadeau avec soin"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bc-purpleDark/95 to-bc-navyDark/90"></div>
        </div>

        {/* Decorative glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-bc-purple/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel border border-white/20 text-white font-montserrat text-[10px] font-bold tracking-widest uppercase"
          >
            <Sparkles size={12} className="text-bc-yellow" />
            <span>Tendances Déco</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-montserrat font-black text-3xl md:text-5xl text-white uppercase tracking-tight max-w-4xl mx-auto leading-tight"
          >
            Les nouvelles tendances déco pour emballer vos <span className="text-gold-gradient">cadeaux</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center items-center gap-6 text-sm text-gray-300 font-medium pt-2"
          >
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-bc-yellow" /> 12 Avril 2026
            </span>
            <span className="flex items-center gap-1.5">
              <User size={14} className="text-bc-yellow" /> Par Loïc Bakpé
            </span>
          </motion.div>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Article Body (2/3) */}
          <div className="lg:col-span-8 space-y-12 bg-white rounded-[32px] p-6 sm:p-10 border border-gray-100 shadow-premium">
            
            {/* Return link */}
            <Link href="/blog" className="inline-flex items-center text-xs font-bold text-bc-purple hover:underline uppercase tracking-wider">
              <ArrowLeft size={14} className="mr-2" /> Retour aux articles
            </Link>

            {/* Article content */}
            <div className="prose prose-purple max-w-none text-gray-600 leading-relaxed space-y-6 text-justify text-base md:text-lg">
              <p className="font-montserrat font-bold text-bc-navy text-xl md:text-2xl leading-snug">
                L&apos;emballage n&apos;est pas seulement une enveloppe protectrice : c&apos;est la première note de musique de votre surprise. Il crée l&apos;impatience, le mystère, et témoigne du soin apporté à votre geste.
              </p>

              <p>
                Aujourd&apos;hui, la tendance n&apos;est plus aux papiers plastifiés brillants à motifs surchargés. Le minimalisme haut de gamme s&apos;impose avec force. On redécouvre des matières nobles, brutes ou texturées, sublimées par des ornements délicats et poétiques.
              </p>

              <div className="my-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <img
                  src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800"
                  alt="Rubans et papier kraft raffiné"
                  className="rounded-2xl shadow-card w-full h-[240px] object-cover"
                />
                <div className="space-y-4">
                  <h3 className="font-montserrat font-extrabold text-bc-navy text-lg uppercase tracking-tight">
                    1. Le Furoshiki Japonais
                  </h3>
                  <p className="text-sm">
                    Inspiré d&apos;une tradition séculaire, l&apos;emballage en tissu réutilisable apporte une texture fluide et voluptueuse. Privilégiez le coton brut, le lin fin ou la soie légère aux nuances dorées ou violacées.
                  </p>
                </div>
              </div>

              <p>
                Le deuxième axe fort est l&apos;intégration d&apos;éléments naturels séchés. Une branche d&apos;eucalyptus, un brin de lavande ou une fleur de coton glissés sous un nœud en ficelle de jute transforment instantanément un simple pliage kraft en une œuvre d&apos;art organique.
              </p>

              <blockquote className="border-l-4 border-bc-yellow bg-bc-yellow/5 p-6 rounded-r-2xl font-medium italic text-bc-navy">
                &quot;Prendre le temps d&apos;emballer un cadeau avec soin, c&apos;est commencer à l&apos;offrir dans sa pensée.&quot;
              </blockquote>

              <h3 className="font-montserrat font-extrabold text-bc-navy text-xl uppercase tracking-tight pt-4">
                2. Les Sceaux de Cire Métalliques
              </h3>
              <p>
                Pour les cadeaux de grand prestige, l&apos;application d&apos;un cachet de cire dorée ou champagne apporte une signature royale incomparable. Estampillé aux initiales du destinataire ou orné d&apos;une forme végétale, il évoque la noblesse des correspondances d&apos;antan.
              </p>
            </div>

            {/* Author box */}
            <div className="flex items-center gap-4 bg-bc-bg/60 rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 bg-bc-purple text-white rounded-full flex items-center justify-center font-montserrat font-black text-sm uppercase tracking-wider">
                LB
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Rédacteur en chef</p>
                <h4 className="font-montserrat font-bold text-bc-navy text-base">Loïc Bakpé</h4>
              </div>
            </div>

            {/* Comments List */}
            <div className="pt-8 border-t border-gray-100 space-y-8">
              <div className="flex items-center gap-3">
                <MessageSquare className="text-bc-purple" size={24} />
                <h3 className="font-montserrat font-black text-2xl text-bc-navy uppercase tracking-tight">
                  Commentaires ({comments.length})
                </h3>
              </div>

              <div className="space-y-6">
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel rounded-2xl p-6 border border-white/50 shadow-card space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-montserrat font-bold text-bc-navy text-sm sm:text-base">
                        {comment.author}
                      </h4>
                      <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{comment.date}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{comment.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Comments Form */}
            <div className="pt-8 border-t border-gray-100 space-y-6">
              <h3 className="font-montserrat font-black text-2xl text-bc-navy uppercase tracking-tight">
                Laissez votre avis
              </h3>

              {formStatus === 'success' && (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 text-xs font-semibold">
                  Merci ! Votre commentaire a été publié.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-bc-navy uppercase tracking-wider font-montserrat">
                      Votre Nom
                    </label>
                    <input
                      type="text"
                      required
                      value={newComment.name}
                      onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                      placeholder="Ex: Marie Soglo"
                      className="block w-full rounded-xl border border-gray-200 bg-white py-3 px-4 text-bc-heading focus:ring-bc-purple focus:border-bc-purple outline-none text-sm font-medium transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-bc-navy uppercase tracking-wider font-montserrat">
                      Email (non publié)
                    </label>
                    <input
                      type="email"
                      value={newComment.email}
                      onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
                      placeholder="Ex: marie@email.com"
                      className="block w-full rounded-xl border border-gray-200 bg-white py-3 px-4 text-bc-heading focus:ring-bc-purple focus:border-bc-purple outline-none text-sm font-medium transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-bc-navy uppercase tracking-wider font-montserrat">
                    Votre Commentaire
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newComment.text}
                    onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                    placeholder="Écrivez vos impressions..."
                    className="block w-full rounded-xl border border-gray-200 bg-white py-3 px-4 text-bc-heading focus:ring-bc-purple focus:border-bc-purple outline-none text-sm font-medium transition-all resize-none"
                  ></textarea>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="inline-flex items-center justify-center bg-bc-purple hover:bg-bc-purpleDark text-white font-montserrat font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all duration-300 shadow-sm cursor-pointer"
                >
                  Publier l&apos;avis <Send size={13} className="ml-2" />
                </motion.button>
              </form>
            </div>

          </div>

          {/* Sidebar Area (1/3) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Sidebar Box 1: Related Articles */}
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-gray-100 shadow-premium space-y-6">
              <h3 className="font-montserrat font-extrabold text-lg text-bc-navy uppercase tracking-wider flex items-center gap-2 pb-4 border-b border-gray-100">
                <Bookmark size={16} className="text-bc-yellow" />
                Articles Récents
              </h3>

              <div className="space-y-4">
                {relatedPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    whileHover={{ x: 4 }}
                    className={`p-4 rounded-2xl border transition-all ${
                      post.active
                        ? 'bg-bc-purple/5 border-bc-purple/20'
                        : 'bg-bc-bg/40 border-transparent hover:border-gray-200'
                    }`}
                  >
                    <Link href="/blog/article">
                      <span className="block text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">
                        {post.date}
                      </span>
                      <h4 className={`font-montserrat font-bold text-sm leading-snug hover:text-bc-purple transition-colors ${
                        post.active ? 'text-bc-purple' : 'text-bc-navy'
                      }`}>
                        {post.title}
                      </h4>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sidebar Box 2: Tags */}
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-gray-100 shadow-premium space-y-6">
              <h3 className="font-montserrat font-extrabold text-lg text-bc-navy uppercase tracking-wider flex items-center gap-2 pb-4 border-b border-gray-100">
                <Tag size={16} className="text-bc-yellow" />
                Thématiques
              </h3>

              <div className="flex flex-wrap gap-2.5">
                {["Tendances", "Conseils", "Astuces", "Idées Cadeaux", "Collections", "Prestige"].map((tag, idx) => (
                  <span
                    key={idx}
                    className={`text-xs font-semibold px-3.5 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                      idx === 0
                        ? 'bg-bc-purple text-white border-bc-purple'
                        : 'bg-bc-bg text-gray-600 border-gray-100 hover:bg-bc-purpleLight hover:text-bc-purple hover:border-bc-purple/20'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
