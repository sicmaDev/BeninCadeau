import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, MessageCircle, ArrowRight, MapPin, User, Calendar, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { prisma } from '@/utils/db';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CopyrightRow } from '@/components/CopyrightRow';

interface PageProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

const WHATSAPP_NUMBER = "22955250000"; 

export const dynamic = 'force-dynamic';

export default async function ConfirmationPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { orderNumber } = resolvedParams;

  // Récupérer la commande en DB
  const order = await prisma.order.findUnique({
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

  // Générer le message WhatsApp
  const generateWhatsAppMessage = () => {
    let msg = `Bonjour Bénin Cadeau !\n\n`;
    msg += `Je viens de passer la commande *${order.orderNumber}* pour un montant total de *${order.totalAmount.toLocaleString('fr-FR')} FCFA*.\n\n`;
    msg += `*Détails de livraison* :\n`;
    msg += `- *Client* : ${order.clientName}\n`;
    msg += `- *Téléphone* : ${order.clientPhone}\n`;
    msg += `- *Adresse* : ${order.shippingAddress} (Zone: ${order.shippingZone.name})\n\n`;
    msg += `Je souhaite recevoir vos instructions de paiement par Mobile Money (MTN MoMo / Moov Money) pour lancer la préparation. Merci !`;
    
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50/30">
      <Header />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 font-instrument pb-24">
        <div className="max-w-[800px] mx-auto bg-white rounded-3xl shadow-sm border border-zinc-200/50 overflow-hidden">
          
          {/* Success Header banner (Clean Minimalist) */}
          <div className="bg-zinc-50 text-center p-8 sm:p-10 border-b border-zinc-200/50 relative">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
              <CheckCircle2 size={30} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 mt-4">Commande Enregistrée !</h1>
            <p className="text-zinc-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed mt-1 font-instrument">
              Votre commande a été créée avec succès. Suivez les étapes ci-dessous pour finaliser votre règlement et lancer la livraison.
            </p>
          </div>

          <div className="p-6 sm:p-10 space-y-6">
            
            {/* Order number alert */}
            <div className="bg-white border border-zinc-200/50 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block mb-0.5">Numéro de Commande</span>
                <span className="text-lg font-black text-bc-purple tracking-tight">{order.orderNumber}</span>
              </div>
              <div className="sm:text-right">
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block mb-0.5">Total à régler</span>
                <span className="text-base font-black text-bc-purple px-3 py-1 bg-bc-yellow/10 rounded-xl">
                  {order.totalAmount.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
            </div>

            {/* Instruction Box */}
            <div className="border border-emerald-150 bg-emerald-50/60 rounded-2xl p-5 sm:p-6 space-y-3.5 shadow-sm">
              <h3 className="font-bold text-emerald-800 flex items-center text-sm">
                <AlertCircle className="mr-2 text-emerald-600" size={16} /> Étape indispensable pour validation
              </h3>
              <p className="text-xs text-emerald-700 leading-relaxed font-semibold">
                Afin de confirmer votre réservation, d&apos;effectuer le paiement par Mobile Money (MTN MoMo, Moov) et de planifier l&apos;expédition, veuillez envoyer vos détails de commande à notre service client en cliquant ci-dessous.
              </p>
              <a
                href={generateWhatsAppMessage()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center py-3 px-5 rounded-full font-bold text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm cursor-pointer"
              >
                <MessageCircle size={14} className="mr-1.5 animate-pulse" /> Finaliser & Payer sur WhatsApp
              </a>
            </div>

            {/* Summary Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              
              {/* Delivery Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-widest border-b border-zinc-150 pb-2.5 flex items-center">
                  <MapPin className="text-zinc-400 mr-1.5" size={14} /> Destinataire
                </h3>
                <div className="space-y-2.5 text-xs font-medium">
                  <div className="flex justify-between border-b border-zinc-100 pb-1.5">
                    <span className="text-zinc-400">Nom Complet:</span>
                    <span className="font-bold text-zinc-800">{order.clientName}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-100 pb-1.5">
                    <span className="text-zinc-400">Téléphone:</span>
                    <span className="font-bold text-zinc-800">{order.clientPhone}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-100 pb-1.5">
                    <span className="text-zinc-400">E-mail:</span>
                    <span className="font-semibold text-zinc-850">{order.clientEmail}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-100 pb-1.5">
                    <span className="text-zinc-400">Zone de livraison:</span>
                    <span className="font-bold text-zinc-800">{order.shippingZone.name}</span>
                  </div>
                  <div className="flex flex-col mt-2">
                    <span className="text-zinc-400 mb-1.5">Adresse exacte:</span>
                    <span className="font-semibold text-zinc-700 bg-zinc-50/60 p-3 rounded-xl border border-zinc-200/50 leading-relaxed">{order.shippingAddress}</span>
                  </div>
                </div>
              </div>

              {/* Order Items Summary */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-widest border-b border-zinc-150 pb-2.5 flex items-center">
                  <Calendar className="text-zinc-400 mr-1.5" size={14} /> Résumé Articles
                </h3>
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 divide-y divide-zinc-100">
                  {order.orderItems.map((item, idx) => {
                    let imagesList: string[] = [];
                    try {
                      imagesList = typeof item.product.images === 'string'
                        ? JSON.parse(item.product.images)
                        : (item.product.images as string[]);
                    } catch {
                      imagesList = ['/1-19.png'];
                    }

                    return (
                      <div key={idx} className="flex justify-between items-center text-xs gap-3 pt-3 first:pt-0">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-150 overflow-hidden flex-shrink-0">
                            <img src={imagesList[0] || '/1-19.png'} alt={item.product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="space-y-0.5">
                            <span className="font-bold text-zinc-800 block line-clamp-1">{item.product.name}</span>
                            <span className="text-[10px] text-zinc-400 font-semibold">
                              Qté : {item.quantity} × {item.price.toLocaleString('fr-FR')} FCFA
                            </span>
                            {item.customizationMessage && (
                              <span className="block text-[9px] text-bc-purple italic line-clamp-1">
                                Perso : &quot;{item.customizationMessage}&quot;
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="font-bold text-zinc-700 flex-shrink-0">
                          {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                {/* Financial detail */}
                <div className="border-t border-zinc-150 pt-3 space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-400 font-medium">
                    <span>Frais de livraison</span>
                    <span>{order.shippingFee.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-bc-purple pt-2 border-t border-dashed border-zinc-100">
                    <span>Montant total</span>
                    <span>{order.totalAmount.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col items-center gap-3 pt-6 border-t border-zinc-150 justify-center">
              <Link
                href="/catalogue"
                className="inline-flex items-center px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-bc-purple hover:bg-bc-purpleDark transition-colors shadow-sm cursor-pointer"
              >
                Continuer mes achats <ArrowRight size={14} className="ml-1.5" />
              </Link>
              <div className="flex items-center gap-1.5 text-[9px] text-zinc-400 font-semibold uppercase tracking-wider font-instrument">
                <ShieldCheck size={13} className="text-bc-yellow" /> Service commercial à votre écoute
              </div>
            </div>

          </div>

        </div>
      </main>
      <CopyrightRow />
      <Footer />
    </div>
  );
}
