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
    <div className="font-instrument bg-zinc-50/30 overflow-hidden">
      
      {/* Elegant Minimalist Header */}
      <section className="bg-zinc-50 border-b border-zinc-200/50 py-12 lg:py-16">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bc-purpleLight text-bc-purple font-semibold text-[10px] tracking-wider uppercase mx-auto">
            <Sparkles size={11} className="text-bc-yellow fill-current" />
            <span>Tendances Déco</span>
          </div>

          <h1 className="font-bold text-2xl sm:text-4xl text-zinc-900 leading-snug max-w-3xl mx-auto tracking-tight">
            Les nouvelles tendances déco pour emballer vos cadeaux
          </h1>

          <div className="flex justify-center items-center gap-5 text-xs text-zinc-400 font-medium mt-3 font-instrument">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-zinc-450" /> 12 Avril 2026
            </span>
            <span className="flex items-center gap-1.5">
              <User size={13} className="text-zinc-450" /> Par Loïc Bakpé
            </span>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 py-16">
        
        {/* Large Cover Image */}
        <div className="w-full aspect-[21/9] rounded-3xl overflow-hidden shadow-sm border border-zinc-250/60 mb-10 bg-zinc-100">
          <img
            src="https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&q=80&w=2000"
            alt="Emballer un cadeau avec soin"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Article Body (2/3) */}
          <div className="lg:col-span-8 space-y-8 bg-white rounded-3xl p-5 sm:p-8 border border-zinc-200/50 shadow-sm">
            
            {/* Return link */}
            <Link href="/blog" className="inline-flex items-center text-xs font-bold text-bc-purple hover:underline uppercase tracking-wider">
              <ArrowLeft size={13} className="mr-1.5" /> Retour aux articles
            </Link>

            {/* Article content */}
            <div className="prose prose-zinc max-w-none text-zinc-655 leading-relaxed space-y-5 text-justify text-xs sm:text-sm md:text-base font-instrument">
              <p className="font-bold text-zinc-900 text-base sm:text-lg md:text-xl leading-snug">
                L&apos;emballage n&apos;est pas seulement une enveloppe protectrice : c&apos;est la première note de musique de votre surprise. Il crée l&apos;impatience, le mystère, et témoigne du soin apporté à votre geste.
              </p>

              <p>
                Aujourd&apos;hui, la tendance n&apos;est plus aux papiers plastifiés brillants à motifs surchargés. Le minimalisme haut de gamme s&apos;impose avec force. On redécouvre des matières nobles, brutes ou texturées, sublimées par des ornements délicats et poétiques.
              </p>

              <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                <img
                  src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800"
                  alt="Rubans et papier kraft raffiné"
                  className="rounded-2xl border border-zinc-200/50 shadow-sm w-full h-[200px] object-cover"
                />
                <div className="space-y-3">
                  <h3 className="font-bold text-zinc-900 text-base uppercase tracking-wider">
                    1. Le Furoshiki Japonais
                  </h3>
                  <p className="text-[11px] leading-relaxed">
                    Inspiré d&apos;une tradition séculaire, l&apos;emballage en tissu réutilisable apporte une texture fluide et voluptueuse. Privilégiez le coton brut, le lin fin ou la soie légère aux nuances dorées ou violacées.
                  </p>
                </div>
              </div>

              <p>
                Le deuxième axe fort est l&apos;intégration d&apos;éléments naturels séchés. Une branche d&apos;eucalyptus, un brin de lavande ou une fleur de coton glissés sous un nœud en ficelle de jute transforment instantanément un simple pliage kraft en une œuvre d&apos;art organique.
              </p>

              <blockquote className="border-l-4 border-bc-purple bg-bc-purpleLight/40 p-5 rounded-r-2xl font-instrument italic text-zinc-800 leading-relaxed">
                &quot;Prendre le temps d&apos;emballer un cadeau avec soin, c&apos;est commencer à l&apos;offrir dans sa pensée.&quot;
              </blockquote>

              <h3 className="font-bold text-zinc-900 text-base sm:text-lg uppercase tracking-wider pt-2">
                2. Les Sceaux de Cire Métalliques
              </h3>
              <p>
                Pour les cadeaux de grand prestige, l&apos;application d&apos;un cachet de cire dorée ou champagne apporte une signature royale incomparable. Estampillé aux initiales du destinataire ou orné d&apos;une forme végétale, il évoque la noblesse des correspondances d&apos;antan.
              </p>
            </div>

            {/* Author box */}
            <div className="flex items-center gap-3.5 bg-zinc-50 rounded-2xl p-5 border border-zinc-200/50">
              <div className="w-10 h-10 bg-bc-purple text-white rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                LB
              </div>
              <div className="space-y-0.5">
                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Rédacteur en chef</p>
                <h4 className="font-bold text-zinc-800 text-sm">Loïc Bakpé</h4>
              </div>
            </div>

            {/* Comments List */}
            <div className="pt-6 border-t border-zinc-100 space-y-6">
              <div className="flex items-center gap-2">
                <MessageSquare className="text-bc-purple animate-pulse" size={20} />
                <h3 className="font-bold text-lg text-zinc-900 uppercase tracking-wide">
                  Commentaires ({comments.length})
                </h3>
              </div>

              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-zinc-50 border border-zinc-200/50 rounded-2xl p-5 space-y-2.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-zinc-800 text-xs sm:text-sm">
                        {comment.author}
                      </h4>
                      <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider font-instrument">{comment.date}</span>
                    </div>
                    <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed font-instrument">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments Form */}
            <div className="pt-6 border-t border-zinc-100 space-y-5">
              <h3 className="font-bold text-lg text-zinc-900 uppercase tracking-wide">
                Laissez votre avis
              </h3>

              {formStatus === 'success' && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-150 text-xs font-semibold">
                  Merci ! Votre commentaire a été publié.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">
                      Votre Nom
                    </label>
                    <input
                      type="text"
                      required
                      value={newComment.name}
                      onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                      placeholder="Ex: Marie Soglo"
                      className="block w-full rounded-full border border-zinc-200 bg-zinc-50/50 py-2.5 px-4 text-xs font-medium focus:bg-white focus:outline-none focus:border-bc-purple transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">
                      Email (non publié)
                    </label>
                    <input
                      type="email"
                      value={newComment.email}
                      onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
                      placeholder="Ex: marie@email.com"
                      className="block w-full rounded-full border border-zinc-200 bg-zinc-50/50 py-2.5 px-4 text-xs font-medium focus:bg-white focus:outline-none focus:border-bc-purple transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Votre Commentaire
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newComment.text}
                    onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                    placeholder="Écrivez vos impressions..."
                    className="block w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 py-2.5 px-4 text-xs font-medium focus:bg-white focus:outline-none focus:border-bc-purple transition-all resize-none"
                  ></textarea>
                </div>

                <motion.button
                  whileHover={{ y: -0.5 }}
                  type="submit"
                  className="inline-flex items-center justify-center bg-bc-purple hover:bg-bc-purpleDark text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all shadow-sm cursor-pointer"
                >
                  Publier l&apos;avis <Send size={13} className="ml-1.5" />
                </motion.button>
              </form>
            </div>

          </div>

          {/* Sidebar Area (1/3) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Sidebar Box 1: Related Articles */}
            <div className="bg-white rounded-3xl p-6 border border-zinc-200/50 shadow-sm space-y-5">
              <h3 className="font-bold text-sm text-zinc-900 uppercase tracking-wider flex items-center gap-1.5 pb-3.5 border-b border-zinc-100">
                <Bookmark size={14} className="text-zinc-450" />
                Articles Récents
              </h3>

              <div className="space-y-3">
                {relatedPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    whileHover={{ x: 2 }}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      post.active
                        ? 'bg-bc-purpleLight/40 border-bc-purple/20'
                        : 'bg-zinc-50 border-zinc-200/60 hover:border-zinc-350'
                    }`}
                  >
                    <Link href="/blog/article">
                      <span className="block text-[9px] text-zinc-400 font-bold uppercase tracking-wider mb-1">
                        {post.date}
                      </span>
                      <h4 className={`font-bold text-xs leading-snug hover:text-bc-purple transition-colors ${
                        post.active ? 'text-bc-purple' : 'text-zinc-800'
                      }`}>
                        {post.title}
                      </h4>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sidebar Box 2: Tags */}
            <div className="bg-white rounded-3xl p-6 border border-zinc-200/50 shadow-sm space-y-5">
              <h3 className="font-bold text-sm text-zinc-900 uppercase tracking-wider flex items-center gap-1.5 pb-3.5 border-b border-zinc-100">
                <Tag size={14} className="text-zinc-450" />
                Thématiques
              </h3>

              <div className="flex flex-wrap gap-2">
                {["Tendances", "Conseils", "Astuces", "Idées Cadeaux", "Collections", "Prestige"].map((tag, idx) => (
                  <span
                    key={idx}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                      idx === 0
                        ? 'bg-bc-purple text-white border-bc-purple'
                        : 'bg-white text-zinc-500 border-zinc-200 hover:bg-bc-purpleLight hover:text-bc-purple hover:border-bc-purple/10'
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
