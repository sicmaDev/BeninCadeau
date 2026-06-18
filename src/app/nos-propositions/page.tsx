import type { Metadata } from 'next';
import { prisma } from '../../utils/db';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CopyrightRow } from '@/components/CopyrightRow';
import { PropositionsClient } from '@/components/PropositionsClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Nos Propositions — Bénin Cadeau',
  description: 'Découvrez nos différentes catégories thématiques pour trouver le cadeau idéal : cadeaux personnalisés, occasions spéciales, et paniers de ravitaillement pour vos proches au Bénin.',
};

export default async function NosPropositionsPage() {
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { displayOrder: 'asc' },
  });

  return (
    <div className="min-h-screen flex flex-col bg-bc-bg">
      <Header />
      <main className="flex-grow">
        <PropositionsClient categories={categories} />
      </main>
      <CopyrightRow />
      <Footer />
    </div>
  );
}
