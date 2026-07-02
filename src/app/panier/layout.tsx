import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Votre Panier | Bénin Cadeau',
  description: 'Finalisez votre commande et offrez un moment inoubliable à vos proches avec nos créations uniques.',
};

export default function PanierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
