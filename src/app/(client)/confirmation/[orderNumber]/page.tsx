import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, Phone, ArrowRight, Mail } from "lucide-react";
import { prisma } from "@/utils/db";
import { sendPaymentConfirmationEmail } from "@/utils/emails";

interface PageProps {
  params: Promise<{
    orderNumber: string;
  }>;
  searchParams: Promise<{
    id?: string;
    status?: string;
  }>;
}

const WHATSAPP_NUMBER = "22997000000";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const { orderNumber } = resolvedParams;

  const searchParamsResolved = await searchParams;
  const transactionId = searchParamsResolved.id;

  // Récupérer la commande en DB
  let order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      orderItems: {
        include: {
          product: {
            select: {
              name: true,
              images: true,
            },
          },
        },
      },
      shippingZone: true,
    },
  });

  if (!order) {
    notFound();
  }

  // Vérifier la transaction FedaPay si elle est toujours en attente
  const fedapaySecret = process.env.FEDAPAY_SECRET_KEY;
  let isPaid = order.status === "PAYEE";

  if (!isPaid && transactionId && fedapaySecret && !fedapaySecret.includes("remplacez_par")) {
    try {
      const isSandbox = fedapaySecret.includes("sandbox") || fedapaySecret.startsWith("sk_sandbox_");
      const FEDAPAY_API_URL = isSandbox 
        ? "https://sandbox-api.fedapay.com/v1" 
        : "https://api.fedapay.com/v1";

      const verifyRes = await fetch(`${FEDAPAY_API_URL}/transactions/${transactionId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${fedapaySecret}`,
          "Content-Type": "application/json",
        },
      });

      if (verifyRes.ok) {
        const verifyData = await verifyRes.json();
        const transactionObj = verifyData["v1/transaction"] || verifyData.transaction;
        const fedaStatus = transactionObj?.status;

        if (fedaStatus === "approved") {
          order = await prisma.order.update({
            where: { id: order.id },
            data: { 
              status: "PAYEE",
              transactionId: transactionId,
            },
            include: {
              orderItems: {
                include: {
                  product: {
                    select: {
                      name: true,
                      images: true,
                    },
                  },
                },
              },
              shippingZone: true,
            },
          });
          isPaid = true;

          // Envoyer l'email de confirmation de paiement
          sendPaymentConfirmationEmail(order).catch((err) =>
            console.error("Failed to send payment email in confirmation page:", err)
          );
        }
      }
    } catch (err) {
      console.error("Error verifying transaction in confirmation page:", err);
    }
  }

  const name = order.clientName;
  const email = order.clientEmail;

  // Message WhatsApp
  const whatsappMsg = encodeURIComponent(
    `Bonjour Bénin Cadeau, je viens de passer la commande ${order.orderNumber} d'un montant de ${order.totalAmount} FCFA. Je souhaite avoir des informations sur la livraison.`
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 font-body text-center">
      {/* Success icon */}
      <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg border border-accent/20">
        <CheckCircle size={48} className="text-accent" />
      </div>

      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-primary mb-3">
        {isPaid ? "Paiement validé !" : "Commande enregistrée !"}
      </h1>
      <p className="text-muted-foreground text-lg mb-8">
        Merci {name.split(" ")[0]}, {isPaid ? "votre paiement a été accepté 🎉" : "votre commande est en cours de validation ⏳"}
      </p>

      {/* Order number */}
      <div className="bg-secondary rounded-2xl px-6 py-5 mb-8 inline-block w-full text-center">
        <p className="text-sm text-muted-foreground mb-1">Numéro de commande</p>
        <p className="font-display text-3xl font-bold text-primary tracking-wider">{order.orderNumber}</p>
        <p className="text-sm font-semibold text-primary/80 mt-1">Montant : {new Intl.NumberFormat("fr-FR").format(order.totalAmount)} FCFA</p>
      </div>

      {/* Steps */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-8 text-left space-y-4">
        <h2 className="font-display text-lg font-semibold text-primary mb-4">Que se passe-t-il ensuite ?</h2>
        {[
          {
            icon: <Mail size={18} className="text-accent" />,
            title: "Email de confirmation",
            desc: `Un email de confirmation de commande a été envoyé à ${email}. Vérifiez vos spams si besoin.`,
          },
          {
            icon: <Package size={18} className="text-accent" />,
            title: "Préparation de votre commande",
            desc: "Notre équipe va préparer votre cadeau avec le plus grand soin. Vous recevrez une notification dès qu'il est expédié.",
          },
          {
            icon: <CheckCircle size={18} className="text-accent" />,
            title: "Livraison à votre adresse",
            desc: `Livraison prévue vers la zone "${order.shippingZone.name}". Le livreur vous contactera avant de passer.`,
          },
        ].map(({ icon, title, desc }, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
              {icon}
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">{title}</p>
              <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* WhatsApp contact */}
      <div className="bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl p-5 mb-8">
        <p className="text-sm text-foreground mb-3">
          Vous avez une question sur votre commande <strong>{order.orderNumber}</strong> ?
        </p>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-5 py-3 rounded-xl hover:bg-[#22c55e] transition-colors text-sm cursor-pointer"
        >
          <Phone size={16} />
          Contacter l'équipe sur WhatsApp
        </a>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/compte"
          className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors text-sm cursor-pointer"
        >
          Suivre ma commande <ArrowRight size={16} />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-secondary text-primary font-semibold px-6 py-3 rounded-xl hover:bg-accent hover:text-primary transition-colors text-sm cursor-pointer"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
