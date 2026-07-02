import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catalogue Premium | Bénin Cadeau',
  description: 'Découvrez notre collection exclusive de cadeaux personnalisés, coffrets de prestige et créations uniques au Bénin.',
};

export default function CatalogueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
