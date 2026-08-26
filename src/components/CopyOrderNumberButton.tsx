"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface CopyOrderNumberButtonProps {
  orderNumber: string;
  className?: string;
}

export default function CopyOrderNumberButton({ orderNumber, className = "" }: CopyOrderNumberButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      toast.success("Numéro de commande copié dans le presse-papier !");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Impossible de copier le code.");
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      title="Copier le numéro de commande"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-background hover:bg-muted/80 text-muted-foreground hover:text-primary rounded-lg border border-border text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95 ${className}`}
    >
      {copied ? (
        <>
          <Check size={14} className="text-emerald-600" />
          <span className="text-emerald-600 font-bold">Copié !</span>
        </>
      ) : (
        <>
          <Copy size={14} />
          <span>Copier</span>
        </>
      )}
    </button>
  );
}
