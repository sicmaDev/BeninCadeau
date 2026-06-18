import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CopyrightRow } from '@/components/CopyrightRow';
import { ContactClient } from '@/components/ContactClient';

export const metadata: Metadata = {
  title: 'Contactez-nous — Bénin Cadeau',
  description: 'Parlons de votre prochain cadeau ! Vous avez une question, une idée de personnalisation ou besoin d\'aide pour passer commande ? Notre équipe est là pour vous aider.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bc-bg">
      <Header />
      <main className="flex-grow">
        <ContactClient />
      </main>
      <CopyrightRow />
      <Footer />
    </div>
  );
}
