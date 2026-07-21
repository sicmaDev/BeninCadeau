"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface RepayButtonProps {
  orderNumber: string;
  className?: string;
  text?: string;
}

export default function RepayButton({
  orderNumber,
  className = "",
  text = "Finaliser mon paiement sur FedaPay",
}: RepayButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleRepay = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders/repay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber }),
      });

      const data = await res.json();
      if (res.ok && data.checkoutUrl) {
        toast.loading("Redirection vers FedaPay...");
        window.location.href = data.checkoutUrl;
      } else {
        toast.error(data.error || "Impossible d'initier le paiement.");
        setLoading(false);
      }
    } catch (err) {
      toast.error("Erreur de connexion. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRepay}
      disabled={loading}
      className={`inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-6 py-3.5 rounded-xl hover:bg-primary/90 transition-colors text-sm cursor-pointer disabled:opacity-70 shadow-md ${className}`}
    >
      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          Redirection vers FedaPay...
        </>
      ) : (
        <>
          <CreditCard size={18} />
          {text}
        </>
      )}
    </button>
  );
}
