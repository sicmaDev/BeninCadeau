import type { Metadata } from "next";
import { Instrument_Sans, Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Bénin Cadeau — Offrez du bonheur, célébrez chaque instant !",
  description:
    "Chez Bénin Cadeau, nous transformons vos envies en réalité en vous proposant des cadeaux uniques et originaux pour célébrer les moments marquants de la vie.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${instrumentSans.variable} ${inter.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bc-bg relative">
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
