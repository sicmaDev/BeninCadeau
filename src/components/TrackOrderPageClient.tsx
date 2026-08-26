"use client";

import { useState } from "react";
import { Search, Package, Truck, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

// ── Types ────────────────────────────────────────────────────────────────────

type OrderStatus =
  | "EN_ATTENTE"
  | "PAYEE"
  | "EN_PREPARATION"
  | "EXPEDIEE"
  | "LIVREE"
  | "ANNULEE";

interface TrackedOrder {
  orderNumber: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  clientName: string;
  shippingAddress: string;
  shippingZone: { name: string } | null;
}

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bg: string; icon: React.ElementType; step: number }
> = {
  EN_ATTENTE: {
    label: "En attente",
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
    icon: Clock,
    step: 1,
  },
  PAYEE: {
    label: "Payée",
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
    icon: CheckCircle,
    step: 2,
  },
  EN_PREPARATION: {
    label: "En préparation",
    color: "text-violet-600",
    bg: "bg-violet-50 border-violet-200",
    icon: Package,
    step: 3,
  },
  EXPEDIEE: {
    label: "Expédiée",
    color: "text-cyan-600",
    bg: "bg-cyan-50 border-cyan-200",
    icon: Truck,
    step: 4,
  },
  LIVREE: {
    label: "Livrée ✓",
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-200",
    icon: CheckCircle,
    step: 5,
  },
  ANNULEE: {
    label: "Annulée",
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
    icon: XCircle,
    step: 0,
  },
};

const STEPS = [
  { key: "EN_ATTENTE", label: "En attente", icon: Clock },
  { key: "PAYEE", label: "Payée", icon: CheckCircle },
  { key: "EN_PREPARATION", label: "En préparation", icon: Package },
  { key: "EXPEDIEE", label: "Expédiée", icon: Truck },
  { key: "LIVREE", label: "Livrée", icon: CheckCircle },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}



// ── Component ─────────────────────────────────────────────────────────────────

export default function TrackOrderPageClient() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/track?code=${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Une erreur est survenue.");
      } else {
        setOrder(data.order);
      }
    } catch {
      setError("Impossible de contacter le serveur. Vérifiez votre connexion internet.");
    } finally {
      setLoading(false);
    }
  };

  const statusCfg = order ? STATUS_CONFIG[order.status] : null;
  const currentStep = statusCfg ? statusCfg.step : 0;
  const isCancelled = order?.status === "ANNULEE";

  return (
    <div className="font-body min-h-screen bg-background">

      {/* Banner */}
      <section className="relative h-[250px] sm:h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            src="/images/track_order_banner.png"
            alt="Suivre ma commande"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 tracking-tight"
          >
            Suivre ma commande
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-accent text-sm sm:text-base md:text-lg font-medium max-w-xl mx-auto opacity-90"
          >
            Connaître l'état de votre livraison en temps réel
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="max-w-2xl mx-auto px-4 py-12"
      >

        {/* Search form */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 mb-6"
        >
          <label
            htmlFor="order-code"
            className="block text-sm font-semibold text-foreground mb-2"
          >
            Numéro de commande
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                id="order-code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ex : BC-OR42"
                autoComplete="off"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-foreground font-mono text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search size={16} />
              )}
              {loading ? "Recherche..." : "Rechercher"}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Vous trouverez ce numéro dans votre email de confirmation (format : BC-OR…)
          </p>
        </form>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 mb-6 animate-fade-in">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Order result */}
        {order && statusCfg && (
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden animate-fade-in">

            {/* Status banner */}
            <div className={`px-6 py-4 border-b ${statusCfg.bg} flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${statusCfg.color} bg-white/70`}>
                  <statusCfg.icon size={22} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                    Statut actuel
                  </p>
                  <p className={`text-base font-bold ${statusCfg.color}`}>
                    {statusCfg.label}
                  </p>
                </div>
              </div>
              <span className="font-mono text-sm font-bold text-slate-600">
                {order.orderNumber}
              </span>
            </div>

            {/* Progress steps (only for non-cancelled orders) */}
            {!isCancelled && (
              <div className="px-6 pt-5 pb-2">
                <div className="flex items-center justify-between relative">
                  {/* Track line */}
                  <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-200 z-0" />
                  <div
                    className="absolute top-4 left-4 h-0.5 bg-primary z-0 transition-all duration-700"
                    style={{
                      width: `${Math.max(0, ((currentStep - 1) / (STEPS.length - 1)) * 100)}%`,
                    }}
                  />

                  {STEPS.map((step, idx) => {
                    const StepIcon = step.icon;
                    const done = currentStep > idx + 1;
                    const active = currentStep === idx + 1;
                    return (
                      <div key={step.key} className="flex flex-col items-center z-10 gap-1.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                            done
                              ? "bg-primary border-primary text-white"
                              : active
                              ? "bg-white border-primary text-primary shadow-md scale-110"
                              : "bg-white border-slate-200 text-slate-300"
                          }`}
                        >
                          <StepIcon size={14} />
                        </div>
                        <span
                          className={`text-[10px] font-medium text-center leading-tight max-w-[52px] ${
                            done || active ? "text-primary" : "text-slate-400"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cancelled notice */}
            {isCancelled && (
              <div className="mx-6 mt-4 flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <XCircle size={18} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700 font-medium">
                  Cette commande a été annulée. Contactez-nous si vous avez des questions.
                </p>
              </div>
            )}

            {/* Order details */}
            <div className="px-6 py-5 space-y-4">
              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 font-medium mb-0.5">Client</p>
                  <p className="text-sm font-semibold text-foreground">{order.clientName}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 font-medium mb-0.5">Zone de livraison</p>
                  <p className="text-sm font-semibold text-foreground">
                    {order.shippingZone?.name || "–"}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 font-medium mb-0.5">Date de commande</p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 font-medium mb-0.5">Dernière mise à jour</p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatDate(order.updatedAt)}
                  </p>
                </div>
              </div>

              {/* Delivery address */}
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400 font-medium mb-0.5">Adresse de livraison</p>
                <p className="text-sm font-semibold text-foreground">{order.shippingAddress}</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
