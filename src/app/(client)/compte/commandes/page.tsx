"use client";

import { useState, useEffect } from "react";
import { User, Lock, Eye, EyeOff, Clock, Loader2, ChevronDown, ChevronUp, Package, ArrowLeft, Phone, Mail, CheckCircle } from "lucide-react";
import { useAuth, useRouter } from "@/lib/context";
import { formatPrice } from "@/components/ProductCard";
import RepayButton from "@/components/RepayButton";
import CopyOrderNumberButton from "@/components/CopyOrderNumberButton";
import { toast } from "sonner";

type AuthTab = "login" | "register";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  EN_ATTENTE:     { label: "En attente de paiement", color: "bg-amber-50 text-amber-800 border-amber-200 border" },
  PAYEE:          { label: "Payée", color: "bg-blue-50 text-blue-800 border-blue-200 border" },
  EN_PREPARATION: { label: "En préparation", color: "bg-purple-50 text-purple-800 border-purple-200 border" },
  EXPEDIEE:       { label: "Expédiée", color: "bg-indigo-50 text-indigo-800 border-indigo-200 border" },
  LIVREE:         { label: "Livrée", color: "bg-emerald-50 text-emerald-800 border-emerald-200 border" },
  ANNULEE:        { label: "Annulée", color: "bg-red-50 text-red-800 border-red-200 border" },
};

const ITEMS_PER_PAGE = 5;

export default function OrdersHistoryPage() {
  const { user, login, register } = useAuth();
  const { navigate } = useRouter();

  // Standard Login/Register state
  const [authTab, setAuthTab] = useState<AuthTab>("login");
  const [showPwd, setShowPwd] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ name: "", email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(false);

  // Guest OTP state
  const [guestMode, setGuestMode] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [guestVerified, setGuestVerified] = useState(false);
  const [guestOrders, setGuestOrders] = useState<any[]>([]);

  // Authenticated user orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Charger les commandes pour l'utilisateur connecté
  useEffect(() => {
    if (user) {
      setLoadingOrders(true);
      fetch("/api/orders")
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Erreur de chargement des commandes.");
        })
        .then((data) => {
          if (data.orders) setOrders(data.orders);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoadingOrders(false));
    }
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      setLoginError("Veuillez remplir tous les champs.");
      return;
    }
    setLoginError("");
    setLoadingAuth(true);
    const success = await login(loginForm.email, loginForm.password);
    setLoadingAuth(false);
    if (!success) {
      setLoginError("Email ou mot de passe incorrect.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name || !regForm.email || !regForm.password) {
      setLoginError("Veuillez remplir tous les champs.");
      return;
    }
    setLoginError("");
    setLoadingAuth(true);
    const success = await register(regForm.name, regForm.email, regForm.password);
    setLoadingAuth(false);
    if (!success) {
      setLoginError("Cet e-mail est déjà utilisé ou mot de passe trop court.");
    }
  };

  // OTP : Envoyer le code
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestEmail.trim()) {
      setOtpError("Veuillez saisir votre adresse e-mail.");
      return;
    }
    setOtpError("");
    setLoadingOtp(true);
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", email: guestEmail }),
      });
      const data = await res.json();
      setLoadingOtp(false);
      if (res.ok) {
        setOtpSent(true);
        toast.success("Code de vérification envoyé à " + guestEmail);
      } else {
        setOtpError(data.error || "Erreur lors de l'envoi du code.");
      }
    } catch (err) {
      setLoadingOtp(false);
      setOtpError("Erreur réseau. Veuillez réessayer.");
    }
  };

  // OTP : Vérifier le code et charger les commandes de cet e-mail
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setOtpError("Veuillez saisir le code reçu.");
      return;
    }
    setOtpError("");
    setLoadingOtp(true);
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", email: guestEmail, code: otpCode }),
      });
      const data = await res.json();
      setLoadingOtp(false);
      if (res.ok && data.success) {
        setGuestOrders(data.orders || []);
        setGuestVerified(true);
        toast.success("Identité vérifiée avec succès !");
      } else {
        setOtpError(data.error || "Code incorrect ou expiré.");
      }
    } catch (err) {
      setLoadingOtp(false);
      setOtpError("Erreur réseau. Veuillez réessayer.");
    }
  };

  const toggleExpand = (orderId: number) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  // Décider de la liste de commandes et du statut d'authentification
  const isAuthenticated = !!user;
  const isVerified = isAuthenticated || guestVerified;
  const activeOrders = isAuthenticated ? orders : guestOrders;

  // Si l'utilisateur n'est ni connecté ni authentifié par OTP
  if (!isVerified) {
    if (guestMode) {
      // Formulaire élargi pour le mode invité / OTP
      return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 font-body">
          <div className="bg-white border border-slate-200/80 shadow-xl rounded-2xl p-8 flex flex-col md:flex-row gap-8">
            
            {/* Colonne Gauche : Formulaire OTP */}
            <div className="flex-1 space-y-5">
              <div className="text-center md:text-left mb-6">
                <button 
                  onClick={() => navigate("home")}
                  className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 mx-auto md:mx-0 hover:scale-105 transition-transform"
                >
                  <img src="/1-19.png" alt="Bénin Cadeau" className="w-10 h-10 object-contain" />
                </button>
                <h1 className="font-display text-xl font-bold text-primary tracking-tight">Suivre mes commandes</h1>
                <p className="text-muted-foreground text-xs mt-1">Saisissez l'e-mail utilisé pour recevoir un code temporaire</p>
              </div>

              {otpError && (
                <div className="bg-red-50 text-destructive rounded-xl px-4 py-3 text-xs mb-3 border border-red-100">
                  {otpError}
                </div>
              )}

              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Adresse E-mail</label>
                    <input
                      type="email"
                      required
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="votre-email@exemple.bj"
                      className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={loadingOtp}
                    className="w-full bg-[#1A2B6D] hover:bg-[#1A2B6D]/90 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-75 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    {loadingOtp && <Loader2 size={16} className="animate-spin" />}
                    Recevoir le code OTP
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Code de vérification (OTP)</label>
                    <input
                      type="text"
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Saisir les 6 chiffres"
                      className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-center tracking-widest font-bold"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={loadingOtp}
                    className="w-full bg-primary text-white font-bold py-3 rounded-xl transition-all disabled:opacity-75 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    {loadingOtp && <Loader2 size={16} className="animate-spin" />}
                    Vérifier et voir mes commandes
                  </button>
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors underline"
                    >
                      Modifier mon adresse e-mail
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Colonne Droite : Pourquoi créer un compte */}
            <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div>
                <h3 className="font-display font-bold text-primary text-base mb-4">Pourquoi créer un compte ?</h3>
                <ul className="space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <Mail size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Recevoir des offres promotionnelles et codes de réduction exclusifs.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Gérer et sauvegarder vos adresses de livraison par défaut pour commander plus vite.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Package size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Accéder à votre historique de commande complet en un clic sans code OTP temporaire.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200/60">
                <button
                  type="button"
                  onClick={() => setGuestMode(false)}
                  className="w-full bg-white hover:bg-slate-100 text-slate-700 font-bold py-2.5 rounded-xl border border-slate-200 text-xs transition-colors cursor-pointer text-center"
                >
                  S'inscrire ou se connecter
                </button>
              </div>
            </div>

          </div>
        </div>
      );
    }

    // Formulaire de connexion/inscription par défaut (Largeur standard, centré)
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16 font-body">
        <div className="bg-white border border-slate-200/80 shadow-xl rounded-2xl p-8">
          <div className="text-center mb-8">
            <button 
              onClick={() => navigate("home")}
              className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 hover:scale-105 transition-transform"
            >
              <img src="/1-19.png" alt="Bénin Cadeau" className="w-10 h-10 object-contain" />
            </button>
            <h1 className="font-display text-2xl font-bold text-primary tracking-tight">Mes Commandes</h1>
            <p className="text-muted-foreground text-xs mt-1.5">Connectez-vous pour consulter votre historique d'achats</p>
          </div>

          {/* Tabs */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-6 border border-slate-200/40">
            {(["login", "register"] as AuthTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => { setAuthTab(tab); setLoginError(""); }}
                className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  authTab === tab ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab === "login" ? "Connexion" : "Inscription"}
              </button>
            ))}
          </div>

          {loginError && (
            <div className="bg-red-50 text-destructive rounded-xl px-4 py-3 text-xs mb-5 border border-red-100">
              {loginError}
            </div>
          )}

          {authTab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="kossi@exemple.bj"
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-accent pr-12 focus:border-transparent transition-all"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loadingAuth}
                className="w-full bg-[#1A2B6D] hover:bg-[#1A2B6D]/90 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-75 flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
              >
                {loadingAuth && <Loader2 size={16} className="animate-spin" />}
                Se connecter
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Nom complet *</label>
                <input
                  type="text"
                  required
                  value={regForm.name}
                  onChange={(e) => setRegForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Kossi Adjovi"
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Email *</label>
                <input
                  type="email"
                  required
                  value={regForm.email}
                  onChange={(e) => setRegForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="kossi@exemple.bj"
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Mot de passe *</label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    required
                    value={regForm.password}
                    onChange={(e) => setRegForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="Minimum 8 caractères"
                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent pr-12 focus:border-transparent transition-all"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loadingAuth}
                className="w-full bg-[#1A2B6D] hover:bg-[#1A2B6D]/90 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-75 flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
              >
                {loadingAuth && <Loader2 size={16} className="animate-spin" />}
                Créer mon compte
              </button>
            </form>
          )}

          {/* Option : Continuer avec mon e-mail */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-4 text-xs text-slate-400 uppercase font-semibold">Ou</span>
          </div>

          <button
            onClick={() => setGuestMode(true)}
            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3 rounded-xl border border-slate-200 text-xs transition-colors cursor-pointer text-center"
          >
            Continuer avec mon e-mail (OTP)
          </button>
        </div>
      </div>
    );
  }

  // Calculs de pagination
  const totalPages = Math.max(1, Math.ceil(activeOrders.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = activeOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 font-body">
      <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">Historique des Commandes</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {isAuthenticated 
              ? "Consultez l'historique et l'avancement de vos achats." 
              : `Commandes associées à l'adresse e-mail : ${guestEmail}`}
          </p>
        </div>
        <button
          onClick={() => {
            if (guestVerified) {
              setGuestVerified(false);
              setGuestOrders([]);
              setGuestEmail("");
              setOtpCode("");
              setOtpSent(false);
            } else {
              navigate("home");
            }
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-2.5 rounded-xl border border-slate-200"
        >
          <ArrowLeft size={14} />
          {guestVerified ? "Quitter le suivi" : "Boutique"}
        </button>
      </div>

      {loadingOrders ? (
        <div className="text-center py-16 bg-white border border-slate-200/80 rounded-2xl shadow-sm text-muted-foreground">
          <Loader2 size={32} className="animate-spin mx-auto mb-3 text-primary" />
          Chargement de vos commandes...
        </div>
      ) : activeOrders.length > 0 ? (
        <div className="space-y-4">
          {paginatedOrders.map((order) => {
            const statusConf = STATUS_CONFIG[order.status] || { label: order.status, color: "bg-gray-100 text-gray-700" };
            const orderDate = new Date(order.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            });
            const isExpanded = expandedOrder === order.id;

            return (
              <div key={order.id} className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
                {/* Header card clickable */}
                <div
                  onClick={() => toggleExpand(order.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-primary font-bold">
                      📦
                    </div>
                    <div>
                      <p className="font-display font-bold text-primary text-base">{order.orderNumber}</p>
                      <p className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5">
                        <Clock size={12} />
                        Passée le {orderDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-slate-400">Montant Total</p>
                      <p className="font-display font-bold text-primary text-base">{formatPrice(order.totalAmount)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConf.color}`}>
                      {statusConf.label}
                    </span>
                    <div>
                      {isExpanded ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
                    </div>
                  </div>
                </div>

                {/* Items list always visible */}
                <div className="px-5 pb-5 border-t border-slate-100 pt-4 bg-slate-50/20">
                  <h4 className="text-xs font-bold text-primary mb-2.5 uppercase tracking-wider">Articles</h4>
                  <div className="space-y-2">
                    {order.orderItems.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground line-clamp-1">{item.product.name}</span>
                          <span className="bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded text-xs">x{item.quantity}</span>
                        </div>
                        <span className="font-medium text-slate-900">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Extra details visible on expand */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-3 border-t border-slate-100 bg-slate-50/40 space-y-4 animate-fade-in">
                    <div className="grid sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="font-semibold text-primary uppercase tracking-wider mb-1">Destinataire & Adresse</p>
                        <p className="text-slate-800 font-semibold">{order.clientName}</p>
                        <p className="text-slate-600 mt-0.5">{order.shippingAddress}</p>
                        <p className="text-slate-500 mt-0.5">Zone : {order.shippingZone?.name}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-primary uppercase tracking-wider mb-1">Contact & Paiement</p>
                        <p className="text-slate-600">Tél : {order.clientPhone}</p>
                        <p className="text-slate-600">Email : {order.clientEmail}</p>
                        {order.transactionId && (
                          <p className="text-slate-500 mt-1 font-mono">Tx ID : {order.transactionId}</p>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-slate-200/60 pt-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <CopyOrderNumberButton orderNumber={order.orderNumber} />
                        <a
                          href={`https://wa.me/22997000000?text=${encodeURIComponent(`Bonjour Bénin Cadeau, je souhaite des informations sur ma commande ${order.orderNumber}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#25D366] hover:text-[#22c55e] border border-emerald-100 hover:border-emerald-300 bg-white px-3.5 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
                        >
                          <Phone size={14} />
                          Aide WhatsApp
                        </a>
                      </div>
                      {(order.status === "EN_ATTENTE" || order.status === "ANNULEE") && (
                        <RepayButton
                          orderNumber={order.orderNumber}
                          text="Procéder au paiement"
                          className="w-full sm:w-auto"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 hover:text-primary hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Précédent
              </button>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentPage === i + 1
                        ? "bg-primary text-white shadow-sm"
                        : "border border-slate-200 text-slate-500 hover:text-primary hover:bg-slate-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 hover:text-primary hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Suivant
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-slate-200/80 rounded-2xl shadow-sm text-slate-500">
          <p className="text-5xl mb-4">🎁</p>
          <h3 className="font-display text-lg font-bold text-primary mb-1">Aucune commande trouvée</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">Aucune commande trouvée pour l'adresse e-mail renseignée.</p>
          <button 
            onClick={() => navigate("catalogue")}
            className="bg-primary text-white font-bold px-5 py-3 rounded-xl text-xs hover:bg-primary/90 transition-all cursor-pointer shadow-md"
          >
            Découvrir le catalogue
          </button>
        </div>
      )}
    </div>
  );
}
