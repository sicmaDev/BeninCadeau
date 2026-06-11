"use client";

import { useState } from 'react';

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
        <div className="p-4 bg-green-50 text-green-800 rounded-xl border border-green-200 text-sm font-medium">
          Votre message a été envoyé avec succès ! Notre équipe vous répondra dans les plus brefs délais.
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 bg-red-50 text-red-800 rounded-xl border border-red-200 text-sm font-medium">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-bc-cream rounded-lg p-6">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Votre nom"
            className="w-full bg-transparent border-none focus:outline-none font-inter font-medium text-xl text-gray-500 placeholder-gray-400"
          />
        </div>
        <div className="bg-bc-cream rounded-lg p-6">
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Votre sujet"
            className="w-full bg-transparent border-none focus:outline-none font-inter font-medium text-xl text-gray-500 placeholder-gray-400"
          />
        </div>
        <div className="bg-bc-cream rounded-lg p-6">
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Téléphone"
            className="w-full bg-transparent border-none focus:outline-none font-inter font-medium text-xl text-gray-500 placeholder-gray-400"
          />
        </div>
        <div className="bg-bc-cream rounded-lg p-6">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Email"
            className="w-full bg-transparent border-none focus:outline-none font-inter font-medium text-xl text-gray-500 placeholder-gray-400"
          />
        </div>
      </div>

      <div className="bg-bc-cream rounded-lg p-6 h-64">
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          placeholder="Votre message"
          className="w-full h-full bg-transparent border-none focus:outline-none font-inter font-bold text-xl text-bc-heading placeholder-bc-heading resize-none"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="bg-bc-purple text-white font-instrument font-medium text-2xl px-12 py-4 rounded-md hover:bg-bc-purpleDark transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {status === 'sending' ? 'Envoi en cours...' : 'Envoyer le message'}
      </button>
    </form>
  );
}
