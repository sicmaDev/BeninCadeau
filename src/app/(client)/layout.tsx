"use client";

import { AppProvider } from "@/lib/context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Toaster } from "sonner";
import { Suspense } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-xs text-muted-foreground">Chargement...</p>
        </div>
      </div>
    }>
      <AppProvider>
        <div className="min-h-screen flex flex-col bg-background font-body">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: "var(--font-body), DM Sans, sans-serif",
                borderRadius: "16px",
                background: "#FFFFFF",
                color: "#111827",
                border: "1px solid rgba(26, 43, 109, 0.12)",
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
              },
              actionButtonStyle: {
                background: "#1A2B6D",
                color: "#FFFFFF",
                fontWeight: "700",
                fontSize: "12px",
                borderRadius: "10px",
                padding: "8px 12px",
              },
              cancelButtonStyle: {
                background: "rgba(26, 43, 109, 0.08)",
                color: "#1A2B6D",
                borderRadius: "10px",
              }
            }}
          />
        </div>
      </AppProvider>
    </Suspense>
  );
}
