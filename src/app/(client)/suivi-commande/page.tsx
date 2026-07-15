import type { Metadata } from "next";
import TrackOrderPageClient from "../../../components/TrackOrderPageClient";

export const metadata: Metadata = {
  title: "Suivre ma commande | Bénin Cadeau",
  description:
    "Entrez votre numéro de commande pour suivre l'état de votre livraison en temps réel. Aucune connexion requise.",
};

export default function TrackOrderPage() {
  return <TrackOrderPageClient />;
}
