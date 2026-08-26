import type { Metadata } from "next";
import "./globals.css";

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
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-background relative">
        {children}
      </body>
    </html>
  );
}
