"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CopyrightRow } from '@/components/CopyrightRow';

export default function HomePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const faqs = [
    {
      question: 'Quels types de cadeaux proposez-vous ?',
      answer:
        "Nous proposons une large gamme de cadeaux personnalisés pour toutes les occasions : anniversaires, mariages, naissances, baptêmes, fêtes de fin d'année, remerciements, etc. Cela va des objets décoratifs aux articles textiles, en passant par des paniers de ravitaillement (packs alimentaires) soigneusement préparés.",
    },
    {
      question: 'Est-ce que je peux personnaliser entièrement mon cadeau ?',
      answer:
        'Oui, absolument ! Vous pouvez choisir les couleurs, ajouter des prénoms, des messages personnels ou même des photos sur certains de nos articles.',
    },
    {
      question: "Je ne sais pas quoi offrir. Pouvez-vous m'aider ?",
      answer:
        "Bien sûr ! Notre équipe est là pour vous conseiller en fonction de l'occasion, du destinataire et de votre budget.",
    },
    {
      question: 'Livrez-vous partout au Bénin ?',
      answer:
        'Nous livrons principalement à Cotonou, Abomey-Calavi et environs. Pour les autres villes, veuillez nous contacter.',
    },
    {
      question: 'Combien de temps faut-il pour recevoir ma commande ?',
      answer:
        'Le délai dépend de la personnalisation demandée. En général, il faut compter entre 48h et 72h après validation de la commande.',
    },
  ];

  const propositions = [
    {
      img: '/3-28.png',
      title: 'Cadeaux personnalisés',
      desc: 'Pour ceux qui veulent offrir un objet unique : mugs, t-shirts, sacs, cadre déco, pagnes...',
    },
    {
      img: '/3-40.png',
      title: 'Occasions spéciales',
      desc: "Anniversaires, mariages, baptêmes, fiançailles, baby showers, ... On crée des cadeaux adaptés à l'événement.",
    },
    {
      img: '/3-46.png',
      title: 'Autres moments de vie',
      desc: 'Remerciements, promotions, départs à la retraite, fêtes religieuses (Tabaski, Noël, Aid, etc.), encouragements…',
    },
    {
      img: '/3-52.png',
      title: 'Petits paniers alimentaires à offrir',
      desc: 'Un ravitaillement utile et attentionné : riz, sucre, huile, lait etc. Présenté dans un joli panier ou sac prêt à offrir.',
    },
  ];

  const packImages = [
    '/5-104.png',
    '/6-114.png',
    '/6-118.png',
    '/6-122.png',
    '/5-104.png',
    '/6-114.png',
    '/6-118.png',
    '/6-122.png',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bc-bg">
      <Header />
      <main className="flex-grow">
        <div className="bg-white">
          {/* 1. HERO */}
          <section className="relative w-full h-[679px] overflow-hidden">
            <img
              src="/1-12.png"
              alt="Christmas gift box"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-full">
              <div className="pt-[120px] max-w-[750px]">
                <h1 className="font-instrument font-bold text-white text-4xl md:text-5xl lg:text-[64px] leading-[1.22] mb-8">
                  Bénin Cadeau : Offrez du bonheur, célébrez chaque instant !
                </h1>
                <p className="font-instrument font-medium text-white text-lg md:text-xl lg:text-2xl leading-[1.22] text-justify max-w-[751px]">
                  Chez Bénin Cadeau, nous transformons vos envies en réalité en vous
                  proposant des cadeaux uniques et originaux pour célébrer les
                  moments marquants de la vie. Que ce soit pour un anniversaire, un
                  mariage, une naissance ou toute autre occasion spéciale, nous
                  avons ce qu&apos;il vous faut pour faire plaisir à vos proches avec des
                  présents à la fois élégants et mémorables.
                </p>
              </div>
            </div>
          </section>

          {/* 2. FLOATING CTA */}
          <div className="relative z-20 max-w-[1050px] mx-auto px-4 -mt-[110px] mb-20">
            <div className="bg-white rounded-[58px] shadow-card flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-6 md:py-0 md:h-[218px] relative overflow-hidden">
              <img
                src="/18-186.png"
                alt="Gift"
                className="hidden md:block absolute left-0 top-0 h-full w-auto object-contain"
              />
              <div className="md:ml-[200px] flex-1">
                <h2 className="font-instrument font-medium text-xl md:text-2xl text-[#012C3F] leading-[1.22] text-center md:text-left whitespace-pre-line">
                  {"Besoin d'un cadeau\nmaintenant ?"}
                </h2>
              </div>
              <Link href="/commander">
                <button
                  className="px-6 md:px-10 py-4 rounded-[23px] font-instrument font-bold text-white text-base md:text-xl uppercase shadow-yellow-glow"
                  style={{
                    background:
                      'linear-gradient(180deg, #F7BD0D 72%, #DEDADA 100%)',
                  }}>
                  CHOISISSEZ UN CADEAU
                </button>
              </Link>
            </div>
          </div>

          {/* 3. NOS PROPOSITIONS */}
          <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[114px] mb-28">
            <h2 className="font-inter font-black text-[40px] text-bc-heading uppercase mb-10">
              NOS PROPOSITIONS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
              {propositions.map((prop, i) => (
                <div
                  key={i}
                  className="relative h-[217px] rounded-[20px] overflow-hidden group">
                  <img
                    src={prop.img}
                    alt={prop.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/55"></div>
                  <div className="absolute inset-0 p-4 flex flex-col justify-center">
                    <h3 className="font-instrument font-bold text-xl text-white leading-tight mb-2">
                      {prop.title}
                    </h3>
                    <p className="font-instrument text-sm text-white text-justify leading-snug">
                      {prop.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. COMMENT ÇA MARCHE */}
          <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[114px] mb-28">
            <h2 className="font-inter font-black text-[40px] text-bc-heading uppercase mb-10">
              COMMENT ÇA MARCHE ?
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Steps */}
              <div className="relative min-h-[589px]">
                {/* Step 01 - top left */}
                <div className="absolute top-[110px] left-[40px] w-[266px] flex flex-col items-center">
                  <div className="w-[110px] h-[105px] rounded-2xl bg-[#CDFFCB] flex items-center justify-center mb-4">
                    <span className="font-instrument font-bold text-[64px] text-bc-heading leading-none">
                      01
                    </span>
                  </div>
                  <p className="font-instrument font-medium text-xl md:text-2xl text-black text-center leading-tight">
                    Choisissez parmi nos thèmes de cadeaux pour l&apos;occasion dont il
                    s&apos;agit.
                  </p>
                </div>
                {/* Step 02 - top right */}
                <div className="absolute top-[110px] right-0 w-[266px] flex flex-col items-center">
                  <div className="w-[110px] h-[105px] rounded-2xl bg-[#FFCBFF] flex items-center justify-center mb-4">
                    <span className="font-instrument font-bold text-[64px] text-bc-heading leading-none">
                      02
                    </span>
                  </div>
                  <p className="font-instrument font-medium text-xl md:text-2xl text-black text-center leading-tight">
                    Indiquez l&apos;adresse, la date et l&apos;heure de livraison. Ajoutez un
                    message.
                  </p>
                </div>
                {/* Step 03 - bottom center */}
                <div className="absolute top-[360px] left-1/2 -translate-x-1/2 w-[266px] flex flex-col items-center">
                  <div className="w-[110px] h-[105px] rounded-2xl bg-[#CBEDFF] flex items-center justify-center mb-4">
                    <span className="font-instrument font-bold text-[64px] text-bc-heading leading-none">
                      03
                    </span>
                  </div>
                  <p className="font-instrument font-medium text-xl md:text-2xl text-black text-center leading-tight">
                    Faites livrer vos cadeaux à domicile chez vos proches.
                  </p>
                </div>
              </div>

              {/* Right Image with purple banner */}
              <div className="relative rounded-[17px] overflow-hidden h-[580px]">
                <img
                  src="/3-84.png"
                  alt="Femme heureuse avec cadeau"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-bc-purple py-6 px-6">
                  <p className="font-instrument font-medium text-xl md:text-2xl lg:text-[30px] text-white text-center leading-tight">
                    Nous ne nous contentons pas d&apos;envoyer des cadeaux. Nous donnons
                    vie à vos envies.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 5. NOS PACKS */}
          <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[114px] mb-28">
            <h2 className="font-inter font-black text-[40px] text-bc-heading uppercase mb-10">
              Nos packs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {packImages.map((img, i) => (
                <div key={i} className="bg-white flex flex-col">
                  <img
                    src={img}
                    alt="Pack"
                    className="w-full h-[190px] object-cover"
                  />
                  <div className="bg-white py-8 px-4 flex flex-col items-center text-center">
                    <h3 className="font-instrument font-bold text-base md:text-lg text-black uppercase mb-4 leading-tight">
                      Boîte surprise pour mariage
                    </h3>
                    <div className="bg-bc-yellow text-white font-instrument font-bold text-sm md:text-base px-6 py-1 inline-block">
                      30 000 FCFA
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Link
                href="/catalogue?category=paniers-ravitaillement"
                className="bg-bc-purple text-white px-6 py-2 rounded-[5px] font-inter font-light text-base">
                VOIR TOUT
              </Link>
            </div>
          </section>

          {/* 6. NEWSLETTER CTA */}
          <div className="relative z-10 max-w-[1050px] mx-auto px-4 mb-24">
            <div className="bg-white rounded-[58px] shadow-card flex flex-col md:flex-row items-center justify-between gap-6 px-8 md:px-16 py-6 md:h-[218px]">
              <h2 className="font-instrument font-medium text-xl md:text-2xl text-[#012C3F] leading-tight text-center md:text-left max-w-md">
                Envie d&apos;autres idées cadeaux originales ?
              </h2>
              <button
                className="px-8 py-4 rounded-[23px] font-instrument font-bold text-white text-base md:text-xl uppercase shadow-yellow-glow whitespace-nowrap"
                style={{
                  background: 'linear-gradient(180deg, #F7BD0D 72%, #DEDADA 100%)',
                }}>
                ABONNEZ-VOUS À NOTRE NEWSLETTER
              </button>
            </div>
          </div>

          {/* 7. TEMOIGNAGES */}
          <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[114px] mb-24">
            <h2 className="font-inter font-black text-[40px] text-bc-heading uppercase mb-10">
              temoignages
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative flex-shrink-0">
                <div className="w-[69px] h-[69px] bg-bc-yellow rounded-full absolute top-2 left-0"></div>
                <img
                  src="/11-157.png"
                  alt="Lara ANAGONOU"
                  className="w-[142px] h-[142px] rounded-full object-cover relative"
                />
              </div>
              <div className="flex-1 max-w-2xl">
                <p className="font-inter text-base text-black text-justify mb-4">
                  Lorem Ipsum is simply dummy text of the printing and typesetting
                  industry. Lorem Ipsum has been the industry&apos;s standard dummy text.
                </p>
                <p className="font-inter font-bold text-base text-black">
                  Lara ANAGONOU
                </p>
              </div>
              <button className="w-10 h-10 bg-bc-purple rounded-full flex items-center justify-center text-white flex-shrink-0">
                <ChevronRight size={20} />
              </button>
            </div>
          </section>

          {/* 8. FAQ */}
          <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[114px] mb-24">
            <h2 className="font-inter font-black text-[40px] text-bc-heading uppercase mb-10">
              faq
            </h2>
            <div>
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-[#C6C1C1] py-6">
                  <button
                    className="w-full flex justify-between items-center text-left focus:outline-none"
                    onClick={() =>
                      setOpenFaqIndex(openFaqIndex === index ? null : index)
                    }>
                    <h3
                      className={cn(
                        'font-inter font-bold text-xl md:text-2xl pr-8 transition-colors',
                        openFaqIndex === index
                          ? 'text-bc-purple'
                          : 'text-bc-heading'
                      )}>
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={cn(
                        'text-bc-heading transition-transform duration-300 flex-shrink-0',
                        openFaqIndex === index && 'rotate-180 text-bc-purple'
                      )}
                      size={24}
                    />
                  </button>
                  <AnimatePresence>
                    {openFaqIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden">
                        <p className="font-inter text-base md:text-lg text-bc-heading text-justify mt-4 leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </section>

          {/* 9. BIG CTA BANNER */}
          <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[112px] mb-16">
            <div className="relative h-[400px] md:h-[502px] rounded-2xl overflow-hidden">
              <img
                src="/14-174.png"
                alt="Cadeau"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
                <h2 className="font-instrument font-bold text-xl md:text-2xl lg:text-3xl text-black max-w-md leading-tight mb-8 whitespace-pre-line">
                  {'Prêt(e) à offrir autrement ?\nDemandez un cadeau personnalisé maintenant !'}
                </h2>
                <Link href="/commander" className="inline-block w-fit">
                  <button
                    className="px-8 py-4 rounded-[23px] font-instrument font-bold text-white text-base md:text-xl uppercase shadow-yellow-glow"
                    style={{
                      background:
                        'linear-gradient(180deg, #F7BD0D 72%, #DEDADA 100%)',
                    }}>
                    Passer une commande
                  </button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
      <CopyrightRow />
      <Footer />
    </div>
  );
}
