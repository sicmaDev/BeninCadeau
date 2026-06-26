"use client";

import { useState } from 'react';
import { Send, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    phone: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      setErrorMessage('Veuillez remplir tous les champs obligatoires (Nom, Email et Message).');
      return;
    }

    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setFormData({
          name: '',
          subject: '',
          phone: '',
          email: '',
          message: ''
        });
      } else {
        setStatus('error');
        setErrorMessage(data.error || "Une erreur est survenue lors de l'envoi du message.");
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      setErrorMessage("Impossible de contacter le serveur de messagerie. Veuillez réessayer plus tard.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 font-instrument">
      {status === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-150 text-xs font-semibold flex items-start gap-2.5 shadow-sm"
        >
          <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-0.5" size={16} />
          <div>
            <span className="font-bold block mb-0.5">Message envoyé avec succès !</span>
            Notre équipe a bien reçu votre demande et vous répondra dans les plus brefs délais.
          </div>
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 text-red-800 rounded-2xl border border-red-150 text-xs font-semibold flex items-start gap-2.5 shadow-sm"
        >
          <AlertTriangle className="text-red-650 flex-shrink-0 mt-0.5" size={16} />
          <div>
            <span className="font-bold block mb-0.5">Une erreur est survenue</span>
            {errorMessage}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nom */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
            Votre Nom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Ex: Jean Dupont"
            className="block w-full rounded-full border border-zinc-200 bg-zinc-50/50 py-2.5 px-4 text-xs font-medium focus:bg-white focus:outline-none focus:border-bc-purple focus:ring-1 focus:ring-bc-purple transition-all"
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
            Votre Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Ex: jean.dupont@email.com"
            className="block w-full rounded-full border border-zinc-200 bg-zinc-50/50 py-2.5 px-4 text-xs font-medium focus:bg-white focus:outline-none focus:border-bc-purple focus:ring-1 focus:ring-bc-purple transition-all"
          />
        </div>

        {/* Téléphone */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
            Téléphone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Ex: +229 90 00 00 00"
            className="block w-full rounded-full border border-zinc-200 bg-zinc-50/50 py-2.5 px-4 text-xs font-medium focus:bg-white focus:outline-none focus:border-bc-purple focus:ring-1 focus:ring-bc-purple transition-all"
          />
        </div>

        {/* Sujet */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
            Sujet
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Ex: Demande de devis pack personnalisé"
            className="block w-full rounded-full border border-zinc-200 bg-zinc-50/50 py-2.5 px-4 text-xs font-medium focus:bg-white focus:outline-none focus:border-bc-purple focus:ring-1 focus:ring-bc-purple transition-all"
          />
        </div>
      </div>

      {/* Message */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Écrivez votre message ici..."
          className="block w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 py-2.5 px-4 text-xs font-medium focus:bg-white focus:outline-none focus:border-bc-purple focus:ring-1 focus:ring-bc-purple transition-all resize-none h-28"
        ></textarea>
      </div>

      <motion.button
        whileHover={{ y: -0.5 }}
        type="submit"
        disabled={status === 'sending'}
        className="w-full sm:w-auto inline-flex items-center justify-center bg-bc-purple hover:bg-bc-purpleDark text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {status === 'sending' ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5"></span>
            Envoi en cours...
          </>
        ) : (
          <>
            Envoyer le message <Send size={13} className="ml-1.5" />
          </>
        )}
      </motion.button>
    </form>
  );
}
