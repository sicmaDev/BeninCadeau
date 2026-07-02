import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mon Espace Client | Bénin Cadeau',
  description: 'Gérez votre compte client, consultez l\'historique de vos commandes et suivez l\'état de vos livraisons.',
};

export default function CompteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
