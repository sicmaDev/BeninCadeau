import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, Phone, ArrowRight, Mail, Clock, XCircle, AlertTriangle } from "lucide-react";
import { prisma } from "@/utils/db";
import { sendPaymentConfirmationEmail } from "@/utils/emails";
import { OrderStatus } from "@prisma/client";
import RepayButton from "@/components/RepayButton";
import CopyOrderNumberButton from "@/components/CopyOrderNumberButton";

interface PageProps {
  params: Promise<{
    orderNumber: string;
  }>;
  searchParams: Promise<{
    id?: string;
    status?: string;
    close?: string;
  }>;
}

const WHATSAPP_NUMBER = "22997000000";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const { orderNumber } = resolvedParams;

  const searchParamsResolved = await searchParams;
  const transactionId = searchParamsResolved.id;
  const queryStatus = searchParamsResolved.status;

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

  // Vérifier le statut actuel de la commande
  let isPaid = order.status === OrderStatus.PAYEE || 
               order.status === OrderStatus.EN_PREPARATION || 
               order.status === OrderStatus.EXPEDIEE || 
               order.status === OrderStatus.LIVREE;

  let paymentState: "APPROVED" | "PENDING" | "FAILED" = isPaid ? "APPROVED" : "PENDING";

  // Si non payé et qu'on dispose d'un ID de transaction ou de la clé secrète FedaPay
  const fedapaySecret = process.env.FEDAPAY_SECRET_KEY;
  const targetTxId = transactionId || order.transactionId;

  if (!isPaid && targetTxId && fedapaySecret && !fedapaySecret.includes("remplacez_par")) {
    try {
      const isSandbox = fedapaySecret.includes("sandbox") || fedapaySecret.startsWith("sk_sandbox_");
      const FEDAPAY_API_URL = isSandbox 
        ? "https://sandbox-api.fedapay.com/v1" 
        : "https://api.fedapay.com/v1";

      const verifyRes = await fetch(`${FEDAPAY_API_URL}/transactions/${targetTxId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${fedapaySecret}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (verifyRes.ok) {
        const verifyData = await verifyRes.json();
        const transactionObj = verifyData["v1/transaction"] || verifyData.transaction;
        const fedaStatus = transactionObj?.status;

        if (fedaStatus === "approved" || fedaStatus === "transferred") {
          order = await prisma.order.update({
            where: { id: order.id },
            data: { 
              status: OrderStatus.PAYEE,
              transactionId: targetTxId,
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
          paymentState = "APPROVED";

          // Envoyer l'email de confirmation de paiement
          sendPaymentConfirmationEmail(order).catch((err) =>
            console.error("Failed to send payment email in confirmation page:", err)
          );
        } else if (["canceled", "declined", "refused", "failed"].includes(fedaStatus)) {
          paymentState = "FAILED";
          if (order.status === OrderStatus.EN_ATTENTE) {
            order = await prisma.order.update({
              where: { id: order.id },
              data: { status: OrderStatus.ANNULEE },
              include: {
                orderItems: {
                  include: {
                    product: { select: { name: true, images: true } }
                  }
                },
                shippingZone: true,
              }
            });
          }
        } else if (fedaStatus === "pending") {
          paymentState = "PENDING";
        }
      } else {
        if (queryStatus === "canceled" || queryStatus === "declined") {
          paymentState = "FAILED";
        }
      }
    } catch (err) {
      console.error("Error verifying transaction in confirmation page:", err);
      if (queryStatus === "canceled" || queryStatus === "declined") {
        paymentState = "FAILED";
      }
    }
  } else if (!isPaid) {
    if (queryStatus === "canceled" || queryStatus === "declined") {
      paymentState = "FAILED";
    }
  }

  const name = order.clientName;
  const email = order.clientEmail;

  // Message WhatsApp
  const whatsappMsg = encodeURIComponent(
    `Bonjour Bénin Cadeau, je vous contacte concernant ma commande ${order.orderNumber} d'un montant de ${order.totalAmount} FCFA.`
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 font-body text-center">
      {/* Dynamic Header & Icon depending on paymentState */}
      {paymentState === "APPROVED" && (
        <>
          <div className="w-24 h-24 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
            <CheckCircle size={48} className="text-emerald-600" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-primary mb-3">
            Paiement validé !
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Merci {name.split(" ")[0]}, votre paiement a été accepté et votre commande est en cours de préparation 🎉
          </p>
        </>
      )}

      {paymentState === "PENDING" && (
        <>
          <div className="w-24 h-24 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
            <Clock size={48} className="text-amber-600 animate-pulse" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-primary mb-3">
            Paiement en attente
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Merci {name.split(" ")[0]}, votre commande est bien enregistrée mais le paiement n'est pas encore finalisé ⏳
          </p>

          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-5 mb-8 text-left text-sm space-y-2 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-amber-800 text-base">
              <AlertTriangle size={20} className="text-amber-600 flex-shrink-0" />
              <span>Action requise pour valider votre commande</span>
            </div>
            <p className="text-amber-800 leading-relaxed">
              Votre règlement via FedaPay n'a pas été complété. Si vous avez fermé la fenêtre de paiement ou si la transaction s'est interrompue, cliquez sur le bouton ci-dessous pour finaliser votre paiement.
            </p>
          </div>
        </>
      )}

      {paymentState === "FAILED" && (
        <>
          <div className="w-24 h-24 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
            <XCircle size={48} className="text-red-600" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-primary mb-3">
            Paiement non effectué
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Désolé {name.split(" ")[0]}, le paiement de votre commande n'a pas pu aboutir ou a été annulé ❌
          </p>

          <div className="bg-red-50 border border-red-200 text-red-900 rounded-2xl p-5 mb-8 text-left text-sm space-y-2 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-red-800 text-base">
              <XCircle size={20} className="text-red-600 flex-shrink-0" />
              <span>Paiement interrompu ou décliné</span>
            </div>
            <p className="text-red-800 leading-relaxed">
              La transaction FedaPay a échoué ou a été annulée. Aucun débit n'a été effectué sur votre compte. Vous pouvez réessayer de régler votre commande.
            </p>
          </div>
        </>
      )}

      {/* Order Summary Box */}
      <div className="bg-secondary rounded-2xl px-6 py-5 mb-8 inline-block w-full text-center">
        <p className="text-sm text-muted-foreground mb-1">Numéro de commande</p>
        <div className="flex items-center justify-center gap-2 mb-1">
          <p className="font-display text-3xl font-bold text-primary tracking-wider">{order.orderNumber}</p>
          <CopyOrderNumberButton orderNumber={order.orderNumber} />
        </div>
        <div className="mt-2 flex items-center justify-center gap-3">
          <p className="text-sm font-semibold text-primary/80">
            Montant : {new Intl.NumberFormat("fr-FR").format(order.totalAmount)} FCFA
          </p>
          {paymentState === "APPROVED" && (
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold border border-emerald-200">
              Payée ✓
            </span>
          )}
          {paymentState === "PENDING" && (
            <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-bold border border-amber-200">
              En attente de paiement
            </span>
          )}
          {paymentState === "FAILED" && (
            <span className="bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-full font-bold border border-red-200">
              Annulée / Échouée
            </span>
          )}
        </div>
      </div>

      {/* Steps (Only when approved or pending) */}
      {paymentState === "APPROVED" && (
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 text-left space-y-4 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-primary mb-4">Prochaines étapes</h2>
          {[
            {
              icon: <Mail size={18} className="text-accent" />,
              title: "Email de confirmation",
              desc: `Un email de confirmation de paiement a été envoyé à ${email}.`,
            },
            {
              icon: <Package size={18} className="text-accent" />,
              title: "Préparation de votre commande",
              desc: "Notre équipe prépare minutieusement votre cadeau avec le plus grand soin.",
            },
            {
              icon: <CheckCircle size={18} className="text-accent" />,
              title: "Livraison à votre adresse",
              desc: `Livraison prévue vers la zone "${order.shippingZone.name}". Le livreur vous contactera.`,
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
      )}

      {/* Action Buttons depending on status */}
      {(paymentState === "PENDING" || paymentState === "FAILED") && (
        <div className="mb-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <RepayButton
            orderNumber={order.orderNumber}
            text={paymentState === "PENDING" ? "Finaliser mon paiement sur FedaPay" : "Réessayer le paiement"}
            className="w-full sm:w-auto"
          />
        </div>
      )}

      {/* WhatsApp contact */}
      <div className="bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl p-5 mb-8">
        <p className="text-sm text-foreground mb-3">
          Vous avez une question sur votre commande <strong>{order.orderNumber}</strong> ?
        </p>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-5 py-3 rounded-xl hover:bg-[#22c55e] transition-colors text-sm cursor-pointer shadow-sm"
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
