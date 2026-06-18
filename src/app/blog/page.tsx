import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CopyrightRow } from '@/components/CopyrightRow';
import { BlogClient } from '@/components/BlogClient';

export const metadata: Metadata = {
  title: 'Le Blog Cadeaux — Bénin Cadeau',
  description: 'Retrouvez nos idées de cadeaux originaux, nos guides de personnalisation, nos conseils de tendances et nos inspirations pour faire plaisir à vos proches au Bénin.',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bc-bg">
      <Header />
      <main className="flex-grow">
        <BlogClient />
      </main>
      <CopyrightRow />
      <Footer />
    </div>
  );
}
