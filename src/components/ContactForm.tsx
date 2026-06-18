"use client";

import { useState } from 'react';
import { Send, User, Tag, Phone, Mail, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {status === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100 text-sm font-medium flex items-start gap-3 shadow-sm"
        >
          <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <span className="font-bold block mb-0.5">Message envoyé avec succès !</span>
            Notre équipe a bien reçu votre demande et vous répondra dans les plus brefs délais.
          </div>
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-red-50 text-red-800 rounded-2xl border border-red-100 text-sm font-medium flex items-start gap-3 shadow-sm"
        >
          <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <span className="font-bold block mb-0.5">Une erreur est survenue</span>
            {errorMessage}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nom */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-bc-navy uppercase tracking-wider font-montserrat">
            Votre Nom <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
              <User size={16} />
            </span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ex: Jean Dupont"
              className="pl-11 block w-full rounded-2xl border border-gray-200 bg-white/50 py-3.5 px-4 text-bc-heading focus:ring-bc-purple focus:border-bc-purple outline-none text-sm font-medium transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-bc-navy uppercase tracking-wider font-montserrat">
            Votre Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
              <Mail size={16} />
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Ex: jean.dupont@email.com"
              className="pl-11 block w-full rounded-2xl border border-gray-200 bg-white/50 py-3.5 px-4 text-bc-heading focus:ring-bc-purple focus:border-bc-purple outline-none text-sm font-medium transition-all"
            />
          </div>
        </div>

        {/* Téléphone */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-bc-navy uppercase tracking-wider font-montserrat">
            Téléphone
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
              <Phone size={16} />
            </span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Ex: +229 90 00 00 00"
              className="pl-11 block w-full rounded-2xl border border-gray-200 bg-white/50 py-3.5 px-4 text-bc-heading focus:ring-bc-purple focus:border-bc-purple outline-none text-sm font-medium transition-all"
            />
          </div>
        </div>

        {/* Sujet */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-bc-navy uppercase tracking-wider font-montserrat">
            Sujet
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
              <Tag size={16} />
            </span>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Ex: Demande de devis pack personnalisé"
              className="pl-11 block w-full rounded-2xl border border-gray-200 bg-white/50 py-3.5 px-4 text-bc-heading focus:ring-bc-purple focus:border-bc-purple outline-none text-sm font-medium transition-all"
            />
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-bc-navy uppercase tracking-wider font-montserrat">
          Message <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute top-4 left-4 text-gray-400">
            <FileText size={16} />
          </span>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            placeholder="Écrivez votre message ici..."
            className="pl-11 block w-full rounded-2xl border border-gray-200 bg-white/50 py-3.5 px-4 text-bc-heading focus:ring-bc-purple focus:border-bc-purple outline-none text-sm font-medium transition-all resize-none"
          ></textarea>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={status === 'sending'}
        className="w-full sm:w-auto inline-flex items-center justify-center bg-gold-gradient text-bc-purpleDark font-montserrat font-bold text-sm uppercase tracking-wider px-10 py-4 rounded-2xl shadow-yellow-glow hover:bg-yellow-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {status === 'sending' ? (
          <>
            <span className="w-4 h-4 border-2 border-bc-purpleDark border-t-transparent rounded-full animate-spin mr-2"></span>
            Envoi en cours...
          </>
        ) : (
          <>
            Envoyer le message <Send size={15} className="ml-2" />
          </>
        )}
      </motion.button>
    </form>
  );
}
