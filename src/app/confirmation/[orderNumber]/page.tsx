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

const WHATSAPP_NUMBER = "22955250000"; // Numéro commercial officiel Bénin Cadeau

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
    <div className="min-h-screen flex flex-col bg-bc-bg">
      <Header />
      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8 font-instrument pb-24">
        <div className="max-w-[850px] mx-auto bg-white rounded-[32px] shadow-premium border border-gray-100 overflow-hidden">
          
          {/* Success Header banner */}
          <div className="bg-purple-gradient text-white p-8 sm:p-10 text-center space-y-4 relative">
            <div className="absolute top-5 right-10 text-bc-yellow/20 animate-pulse">
              <Sparkles size={24} />
            </div>
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto border border-white/20 shadow-inner">
              <CheckCircle2 className="text-bc-yellow" size={36} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-montserrat">Commande Enregistrée !</h1>
            <p className="text-purple-100 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              Votre commande a été créée avec succès. Suivez les étapes ci-dessous pour finaliser votre règlement et lancer la livraison.
            </p>
          </div>

          <div className="p-8 sm:p-12 space-y-8">
            
            {/* Order number alert */}
            <div className="bg-bc-yellow/5 border border-bc-yellow/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block font-montserrat mb-1">Numéro de Commande</span>
                <span className="text-xl font-black text-bc-purple font-montserrat tracking-tight">{order.orderNumber}</span>
              </div>
              <div className="sm:text-right">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block font-montserrat mb-1">Total à régler</span>
                <span className="text-xl font-black text-bc-navy font-montserrat tracking-tight px-4 py-1 bg-bc-yellow/15 rounded-xl border border-bc-yellow/20">
                  {order.totalAmount.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
            </div>

            {/* Instruction Box */}
            <div className="border border-green-200/60 bg-green-50/70 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
              <h3 className="font-montserrat font-bold text-green-800 flex items-center text-base">
                <AlertCircle className="mr-2 text-green-600" size={18} /> Étape indispensable pour validation
              </h3>
              <p className="text-xs sm:text-sm text-green-700 leading-relaxed font-medium">
                Afin de confirmer votre réservation, d&apos;effectuer le paiement par Mobile Money (MTN MoMo, Moov) et de planifier l&apos;expédition, veuillez envoyer vos détails de commande à notre service client en cliquant ci-dessous.
              </p>
              <a
                href={generateWhatsAppMessage()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center py-4 px-6 rounded-2xl font-montserrat font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20ba5a] hover:to-[#0e6f63] text-white transition-all shadow-md cursor-pointer"
              >
                <MessageCircle size={16} className="mr-2 animate-pulse" /> Finaliser & Payer sur WhatsApp
              </a>
            </div>

            {/* Summary Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
              
              {/* Delivery Info */}
              <div className="space-y-5">
                <h3 className="text-sm font-bold text-bc-navy uppercase tracking-widest border-b border-gray-100 pb-3 flex items-center font-montserrat">
                  <MapPin className="text-bc-yellow mr-1.5" size={16} /> Destinataire
                </h3>
                <div className="space-y-3.5 text-xs sm:text-sm font-medium">
                  <div className="flex justify-between border-b border-gray-50 pb-1.5">
                    <span className="text-gray-400">Nom Complet:</span>
                    <span className="font-bold text-bc-heading">{order.clientName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-1.5">
                    <span className="text-gray-400">Téléphone:</span>
                    <span className="font-bold text-bc-heading">{order.clientPhone}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-1.5">
                    <span className="text-gray-400">E-mail:</span>
                    <span className="font-semibold text-bc-heading">{order.clientEmail}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-1.5">
                    <span className="text-gray-400">Zone de livraison:</span>
                    <span className="font-bold text-bc-heading">{order.shippingZone.name}</span>
                  </div>
                  <div className="flex flex-col mt-2">
                    <span className="text-gray-400 mb-1.5">Adresse exacte:</span>
                    <span className="font-semibold text-bc-heading bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100 leading-relaxed">{order.shippingAddress}</span>
                  </div>
                </div>
              </div>

              {/* Order Items Summary */}
              <div className="space-y-5">
                <h3 className="text-sm font-bold text-bc-navy uppercase tracking-widest border-b border-gray-100 pb-3 flex items-center font-montserrat">
                  <Calendar className="text-bc-yellow mr-1.5" size={16} /> Résumé Articles
                </h3>
                <div className="space-y-4 max-h-[240px] overflow-y-auto pr-1 divide-y divide-gray-50">
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
                      <div key={idx} className="flex justify-between items-center text-xs sm:text-sm gap-3 pt-3 first:pt-0">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-50 border overflow-hidden flex-shrink-0">
                            <img src={imagesList[0] || '/1-19.png'} alt={item.product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="space-y-0.5">
                            <span className="font-bold text-bc-navy block line-clamp-1">{item.product.name}</span>
                            <span className="text-xs text-gray-400 font-semibold">
                              Qté : {item.quantity} × {item.price.toLocaleString('fr-FR')} FCFA
                            </span>
                            {item.customizationMessage && (
                              <span className="block text-[10px] text-bc-purple italic line-clamp-1">
                                Perso : &quot;{item.customizationMessage}&quot;
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="font-bold text-bc-navy flex-shrink-0">
                          {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                {/* Financial detail */}
                <div className="border-t border-gray-100 pt-4 space-y-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between text-gray-400 font-medium">
                    <span>Frais de livraison</span>
                    <span>{order.shippingFee.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-bc-purple pt-1.5 border-t border-dashed border-gray-100">
                    <span>Montant total</span>
                    <span>{order.totalAmount.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col items-center gap-4 pt-8 border-t border-gray-100/60 justify-center">
              <Link
                href="/catalogue"
                className="inline-flex items-center px-8 py-4 rounded-2xl font-montserrat font-bold text-xs uppercase tracking-wider text-bc-purple bg-bc-yellow hover:bg-yellow-400 transition-colors shadow-yellow-glow cursor-pointer"
              >
                Continuer mes achats <ArrowRight size={16} className="ml-2" />
              </Link>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                <ShieldCheck size={14} className="text-bc-yellow" /> Service commercial à votre écoute
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

