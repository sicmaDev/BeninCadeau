import React from "react";
import "./globals.css";

export const metadata = {
  title: "Ciseco - E-commerce Template",
  description:
    "Ciseco is a modern and elegant template for Next.js, Tailwind CSS, and TypeScript. It is designed to be simple and easy to use, with a focus on performance and accessibility.",
  keywords: "Next.js, Tailwind CSS, TypeScript, Ciseco, Headless UI, Fashion, E-commerce",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/assets/_next/static/media/47fe1b7cd6e6ed85-s.p.855a563b.woff2"
          as="font"
          crossOrigin=""
          type="font/woff2"
        />
        <link
          rel="preload"
          href="/assets/_next/static/media/8e6fa89aa22d24ec-s.p.3aec397d.woff2"
          as="font"
          crossOrigin=""
          type="font/woff2"
        />
        <link
          rel="preload"
          href="/assets/_next/static/media/a218039a3287bcfd-s.p.4a23d71b.woff2"
          as="font"
          crossOrigin=""
          type="font/woff2"
        />
        <link
          rel="preload"
          href="/assets/_next/static/media/c875c6f5d3e977ac-s.p.80fc2c9e.woff2"
          as="font"
          crossOrigin=""
          type="font/woff2"
        />
        <link
          rel="preload"
          href="/assets/_next/static/media/e2334d715941921e-s.p.d82a9aff.woff2"
          as="font"
          crossOrigin=""
          type="font/woff2"
        />
        <link
          rel="icon"
          href="/icon.png?icon.c96d5b6f.png"
          sizes="512x512"
          type="image/png"
        />
      </head>
      <body className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-200" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
