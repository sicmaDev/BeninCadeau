import { CheckCircle, Package, Phone, ArrowRight, Mail } from "lucide-react";
import { useRouter } from "../lib/context";

export default function ConfirmationPage() {
  const { navigate, params } = useRouter();
  const orderNumber = params.orderNumber || "BC-000000";
  const email = params.email || "votre email";
  const name = params.name || "Client";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 font-body text-center">
      {/* Success icon */}
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
        <CheckCircle size={48} className="text-green-600" />
      </div>

      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-primary mb-3">
        Commande confirmée !
      </h1>
      <p className="text-muted-foreground text-lg mb-8">
        Merci {name.split(" ")[0]}, votre paiement a été accepté 🎉
      </p>

      {/* Order number */}
      <div className="bg-secondary rounded-2xl px-6 py-5 mb-8 inline-block w-full">
        <p className="text-sm text-muted-foreground mb-1">Numéro de commande</p>
        <p className="font-display text-3xl font-bold text-primary tracking-wider">{orderNumber}</p>
      </div>

      {/* Steps */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-8 text-left space-y-4">
        <h2 className="font-display text-lg font-semibold text-primary mb-4">Que se passe-t-il ensuite ?</h2>
        {[
          {
            icon: <Mail size={18} className="text-accent" />,
            title: "Email de confirmation",
            desc: `Un email de confirmation a été envoyé à ${email}. Vérifiez vos spams si besoin.`,
          },
          {
            icon: <Package size={18} className="text-accent" />,
            title: "Préparation de votre commande",
            desc: "Notre équipe va préparer votre cadeau avec soin. Vous recevrez une notification dès qu'il est expédié.",
          },
          {
            icon: <CheckCircle size={18} className="text-accent" />,
            title: "Livraison à votre adresse",
            desc: "Le livreur vous contactera avant de passer. Assurez-vous d'être disponible.",
          },
        ].map(({ icon, title, desc }, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
              {icon}
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">{title}</p>
              <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* WhatsApp contact */}
      <div className="bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl p-5 mb-8">
        <p className="text-sm text-foreground mb-3">
          Vous avez une question sur votre commande <strong>{orderNumber}</strong> ?
        </p>
        <a
          href={`https://wa.me/22997000000?text=${encodeURIComponent(`Bonjour, je voudrais des informations sur ma commande ${orderNumber}.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-5 py-3 rounded-xl hover:bg-[#22c55e] transition-colors text-sm"
        >
          <Phone size={16} />
          Contacter l'équipe sur WhatsApp
        </a>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => navigate("account")}
          className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
        >
          Suivre ma commande <ArrowRight size={16} />
        </button>
        <button
          onClick={() => navigate("home")}
          className="inline-flex items-center justify-center gap-2 bg-secondary text-primary font-semibold px-6 py-3 rounded-xl hover:bg-accent hover:text-primary transition-colors"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
