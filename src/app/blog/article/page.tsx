import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CopyrightRow } from '@/components/CopyrightRow';
import { BlogPostClient } from '@/components/BlogPostClient';

export const metadata: Metadata = {
  title: 'Tendances d\'Emballage Cadeaux — Bénin Cadeau',
  description: 'Découvrez les nouvelles tendances de décoration et d\'emballage pour vos boîtes de cadeaux de prestige au Bénin.',
};

export default function BlogPostPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bc-bg">
      <Header />
      <main className="flex-grow">
        <BlogPostClient />
      </main>
      <CopyrightRow />
      <Footer />
    </div>
  );
}
