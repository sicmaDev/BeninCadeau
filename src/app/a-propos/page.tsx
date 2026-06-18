import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CopyrightRow } from '@/components/CopyrightRow';
import { AboutClient } from '@/components/AboutClient';

export const metadata: Metadata = {
  title: 'À Propos — Bénin Cadeau',
  description: 'Découvrez notre histoire, notre mission, nos valeurs et nos engagements pour offrir du bonheur et célébrer chaque instant avec des cadeaux uniques et personnalisés au Bénin.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bc-bg">
      <Header />
      <main className="flex-grow">
        <AboutClient />
      </main>
      <CopyrightRow />
      <Footer />
    </div>
  );
}
