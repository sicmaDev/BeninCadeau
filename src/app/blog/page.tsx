import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CopyrightRow } from '@/components/CopyrightRow';

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bc-bg">
      <Header />
      <main className="flex-grow">
        <div className="bg-white">
          {/* Hero Section */}
          <section className="relative h-[750px] w-full flex flex-col md:flex-row">
            {/* Left Content */}
            <div className="w-full md:w-1/2 bg-bc-yellow p-12 md:p-24 flex flex-col justify-center relative">
              <div className="absolute inset-0 bg-black/90 m-8 md:m-12 flex flex-col justify-center p-8 md:p-12">
                <h1 className="font-instrument font-bold text-4xl md:text-5xl lg:text-[48px] text-white mb-8 uppercase leading-tight">
                  BIENVENUE SUR LE BLOG DE BÉNIN CADEAU !
                </h1>
                <p className="font-instrument font-medium text-xl md:text-2xl text-white text-center">
                  Ici, nous partageons avec vous nos idées, nos conseils et nos
                  découvertes pour transformer chaque occasion en moment magique.
                </p>
              </div>
            </div>

            {/* Right Image */}
            <div className="w-full md:w-1/2 h-full">
              <img
                src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=1000"
                alt="Christmas gift box"
                className="w-full h-full object-cover"
              />
            </div>
          </section>

          {/* Blog List */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32 space-y-12">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col md:flex-row gap-8 items-start">
                  {/* Image */}
                  <div className="w-full md:w-[390px] h-[250px] flex-shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&q=80&w=600"
                      alt="Blog post thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="bg-bc-yellow py-2 px-6 flex justify-between items-center text-black font-instrument font-medium">
                      <span>Tendances</span>
                      <span>12/04/2025</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <Link href="/blog/article">
                      <h2 className="font-instrument font-bold text-2xl md:text-3xl text-black mb-4 hover:text-bc-yellow transition-colors">
                        Les nouvelles tendances déco pour emballer vos cadeaux
                      </h2>
                    </Link>
                    <p className="font-instrument text-lg text-black text-justify line-clamp-4">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry&apos;s
                      standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a type
                      specimen book.
                    </p>
                  </div>
                </div>
              ))}
          </section>
        </div>
      </main>
      <CopyrightRow />
      <Footer />
    </div>
  );
}
