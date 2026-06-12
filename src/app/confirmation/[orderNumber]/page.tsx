import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, MessageCircle, ArrowRight, MapPin, User, Calendar, AlertCircle } from 'lucide-react';
import { prisma } from '../../../../utils/db';
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
      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8 font-instrument">
        <div className="max-w-[800px] mx-auto bg-white rounded-[36px] shadow-card border border-gray-100 overflow-hidden">
          
          {/* Success Header banner */}
          <div className="bg-gradient-to-r from-bc-purple to-bc-purpleDark text-white p-8 text-center space-y-3">
            <CheckCircle2 className="mx-auto text-bc-yellow animate-bounce" size={60} />
            <h1 className="text-3xl font-extrabold font-montserrat">Commande Enregistrée !</h1>
            <p className="text-purple-200 text-sm max-w-md mx-auto">
              Votre commande a été créée avec succès. Suivez les étapes ci-dessous pour effectuer le paiement.
            </p>
          </div>

          <div className="p-8 sm:p-12 space-y-8">
            
            {/* Order number alert */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-gray-400 font-bold block uppercase tracking-wider">Numéro de Commande</span>
                <span className="text-xl font-black text-bc-purple font-montserrat">{order.orderNumber}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 font-bold block uppercase tracking-wider">Montant total</span>
                <span className="text-xl font-black text-bc-navy font-montserrat">{order.totalAmount.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>

            {/* Instruction Box */}
            <div className="border border-green-200 bg-green-50 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-green-800 flex items-center">
                <AlertCircle className="mr-2 text-green-600" size={20} /> Action requise pour valider
              </h3>
              <p className="text-sm text-green-700 leading-relaxed">
                Afin de confirmer votre paiement et de lancer la livraison, veuillez cliquer sur le bouton ci-dessous pour envoyer vos informations à notre équipe commerciale sur WhatsApp. Nous vous transmettrons les coordonnées de paiement Mobile Money.
              </p>
              <a
                href={generateWhatsAppMessage()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center py-3.5 px-6 rounded-xl font-bold bg-[#25D366] hover:bg-[#20ba5a] text-white transition-colors shadow-sm cursor-pointer"
              >
                <MessageCircle size={18} className="mr-2 animate-pulse" /> Payer & Confirmer sur WhatsApp
              </a>
            </div>

            {/* Summary Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              
              {/* Delivery Info */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-bc-navy uppercase tracking-wider border-b pb-2 flex items-center">
                  <MapPin className="text-bc-yellow mr-1" size={16} /> Livraison
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Destinataire:</span>
                    <span className="font-semibold text-bc-heading">{order.clientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Téléphone:</span>
                    <span className="font-semibold text-bc-heading">{order.clientPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email:</span>
                    <span className="font-semibold text-bc-heading">{order.clientEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Quartier / Zone:</span>
                    <span className="font-semibold text-bc-heading">{order.shippingZone.name}</span>
                  </div>
                  <div className="flex flex-col mt-1">
                    <span className="text-gray-400">Adresse:</span>
                    <span className="font-medium text-bc-heading bg-gray-50 p-2.5 rounded-lg border mt-1">{order.shippingAddress}</span>
                  </div>
                </div>
              </div>

              {/* Order Items Summary */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-bc-navy uppercase tracking-wider border-b pb-2 flex items-center">
                  <Calendar className="text-bc-yellow mr-1" size={16} /> Résumé articles
                </h3>
                <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
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
                      <div key={idx} className="flex justify-between items-center text-sm gap-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-50 border overflow-hidden flex-shrink-0">
                            <img src={imagesList[0] || '/1-19.png'} alt={item.product.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="font-semibold text-bc-navy block line-clamp-1">{item.product.name}</span>
                            <span className="text-xs text-gray-400">
                              Quantité : {item.quantity} × {item.price.toLocaleString('fr-FR')} FCFA
                            </span>
                            {item.customizationMessage && (
                              <span className="block text-[10px] text-bc-purple italic line-clamp-1">
                                Message : &quot;{item.customizationMessage}&quot;
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="font-semibold text-bc-navy flex-shrink-0">
                          {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                {/* Financial detail */}
                <div className="border-t pt-3 space-y-1.5 text-sm">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Livraison ({order.shippingZone.name})</span>
                    <span>{order.shippingFee.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-bc-purple">
                    <span>Total final</span>
                    <span>{order.totalAmount.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="flex justify-center pt-8 border-t border-gray-100">
              <Link
                href="/catalogue"
                className="inline-flex items-center px-6 py-3 rounded-2xl font-bold text-bc-purple bg-bc-yellow hover:bg-yellow-400 transition-colors shadow-sm cursor-pointer"
              >
                Continuer mes achats <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>

          </div>

        </div>
      </main>
      <CopyrightRow />
      <Footer />
    </div>
  );
}
