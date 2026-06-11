import type { Metadata } from 'next';
import { MapPin, Clock, Phone } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CopyrightRow } from '@/components/CopyrightRow';
import { ContactForm } from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contactez-nous — Bénin Cadeau',
  description: 'Parlons de votre prochain cadeau ! Vous avez une question, une idée de personnalisation ou besoin d\'aide pour passer commande ? Notre équipe est là pour vous aider.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bc-bg">
      <Header />
      <main className="flex-grow">
        <div className="bg-white">
          {/* Hero Section */}
          <section className="relative h-[680px] w-full">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=2000"
                alt="Vue de la ville de Cotonou - Bénin Cadeau"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60"></div>
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center pt-12">
              <h1 className="font-instrument font-bold text-5xl md:text-6xl text-white uppercase mb-6">
                Contactez-nous
              </h1>
              <p className="font-instrument font-medium text-2xl md:text-3xl text-white max-w-4xl text-justify">
                Parlons de votre prochain cadeau ! Vous avez une question, une idée
                de personnalisation ou besoin d&apos;aide pour passer commande ? Notre
                équipe est là pour vous aider à transformer vos envies en émotions.
              </p>
            </div>
          </section>

          {/* Contact Content */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left Info Card */}
              <div className="lg:col-span-4 bg-bc-cream rounded-xl p-8 md:p-12 space-y-12 border border-[#ECEAA9]">
                {/* Adresse */}
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                    <MapPin className="text-bc-navy" size={28} />
                  </div>
                  <div>
                    <h3 className="font-instrument font-bold text-lg text-black mb-2">
                      Adresse
                    </h3>
                    <p className="font-instrument font-medium text-black">
                      Bénin, Calavi-Kpota
                      <br />
                      2ème étage, immeuble Tankaya
                    </p>
                  </div>
                </div>

                {/* Horaire */}
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                    <Clock className="text-bc-navy" size={28} />
                  </div>
                  <div>
                    <h3 className="font-instrument font-bold text-lg text-black mb-2">
                      Horaire
                    </h3>
                    <p className="font-instrument font-medium text-black">
                      Lundi-Vendredi : 08h00 - 17h30
                    </p>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                    <Phone className="text-bc-navy" size={28} />
                  </div>
                  <div>
                    <h3 className="font-instrument font-bold text-lg text-black mb-2">
                      Contact
                    </h3>
                    <p className="font-instrument font-medium text-black">
                      Téléphone : (+229) 63 90 40 00
                      <br />
                      Email : info@sicmagroup.com
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Form */}
              <div className="lg:col-span-8">
                <h2 className="font-inter font-black text-3xl md:text-4xl text-black mb-12 max-w-md leading-tight">
                  Des questions ?<br />
                  N&apos;hésitez pas à nous contacter.
                </h2>

                <ContactForm />
              </div>
            </div>
          </section>

          {/* Map Section */}
          <section className="w-full h-[470px]">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000"
              alt="World map"
              className="w-full h-full object-cover"
            />
          </section>
        </div>
      </main>
      <CopyrightRow />
      <Footer />
    </div>
  );
}
