import type { Metadata } from "next";
import "@/styles/style.scss";

export const metadata: Metadata = {
  title: "InApp Inventory Dashboard",
  description: "Faithful conversion of InApp Inventory Dashboard template to Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-light">
        {children}
      </body>
    </html>
  );
}
