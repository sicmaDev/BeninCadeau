"use client";

import { useState, useEffect } from "react";
import { User, Lock, Eye, EyeOff, Clock, Loader2, ChevronDown, ChevronUp, Package, ArrowLeft, Phone } from "lucide-react";
import { useAuth, useRouter } from "@/lib/context";
import { formatPrice } from "@/components/ProductCard";
import RepayButton from "@/components/RepayButton";
import CopyOrderNumberButton from "@/components/CopyOrderNumberButton";

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

  const [authTab, setAuthTab] = useState<AuthTab>("login");
  const [showPwd, setShowPwd] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ name: "", email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(false);

  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Charger les commandes
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

  const toggleExpand = (orderId: number) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16 font-body">
        <div className="bg-card border border-border shadow-xl rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 border border-accent/10">
              <Package size={24} className="text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-primary tracking-tight">Mes Commandes</h1>
            <p className="text-muted-foreground text-xs mt-1.5">Connectez-vous pour consulter votre historique d'achats</p>
          </div>

          {/* Tabs */}
          <div className="flex bg-muted rounded-xl p-1 mb-6 border border-slate-100">
            {(["login", "register"] as AuthTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => { setAuthTab(tab); setLoginError(""); }}
                className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  authTab === tab ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "login" ? "Connexion" : "Inscription"}
              </button>
            ))}
          </div>

          {loginError && (
            <div className="bg-red-50/75 text-destructive rounded-xl px-4 py-3 text-xs mb-5 border border-red-200/50">
              {loginError}
            </div>
          )}

          {authTab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="kossi@exemple.bj"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent pr-12 focus:border-transparent transition-all"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loadingAuth}
                className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-75 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg active:scale-98"
              >
                {loadingAuth && <Loader2 size={16} className="animate-spin" />}
                Se connecter
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider">Nom complet *</label>
                <input
                  type="text"
                  required
                  value={regForm.name}
                  onChange={(e) => setRegForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Kossi Adjovi"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider">Email *</label>
                <input
                  type="email"
                  required
                  value={regForm.email}
                  onChange={(e) => setRegForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="kossi@exemple.bj"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider">Mot de passe *</label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    required
                    value={regForm.password}
                    onChange={(e) => setRegForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="Minimum 8 caractères"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent pr-12 focus:border-transparent transition-all"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loadingAuth}
                className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-75 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg active:scale-98"
              >
                {loadingAuth && <Loader2 size={16} className="animate-spin" />}
                Créer mon compte
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Calculs de pagination
  const totalPages = Math.max(1, Math.ceil(orders.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = orders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 font-body">
      <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">Historique des Commandes</h1>
          <p className="text-xs text-muted-foreground mt-1">Consultez l'historique et l'avancement de vos achats.</p>
        </div>
        <button
          onClick={() => navigate("home")}
          className="flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          Boutique
        </button>
      </div>

      {loadingOrders ? (
        <div className="text-center py-16 bg-card border border-border rounded-2xl shadow-sm text-muted-foreground">
          <Loader2 size={32} className="animate-spin mx-auto mb-3 text-primary" />
          Chargement de vos commandes...
        </div>
      ) : orders.length > 0 ? (
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
              <div key={order.id} className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
                {/* Header card clickable */}
                <div
                  onClick={() => toggleExpand(order.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary font-bold">
                      📦
                    </div>
                    <div>
                      <p className="font-display font-bold text-primary text-base">{order.orderNumber}</p>
                      <p className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5">
                        <Clock size={12} />
                        {orderDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-muted-foreground">Montant Total</p>
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

                {/* Items list always visible (basic) */}
                <div className="px-5 pb-5 border-t border-border pt-4 bg-slate-50/20">
                  <h4 className="text-xs font-bold text-primary mb-2.5 uppercase tracking-wider">Articles</h4>
                  <div className="space-y-2">
                    {order.orderItems.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground line-clamp-1">{item.product.name}</span>
                          <span className="bg-secondary text-primary font-bold px-1.5 py-0.5 rounded text-xs">x{item.quantity}</span>
                        </div>
                        <span className="font-medium text-slate-900">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Extra details visible on expand */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-3 border-t border-border bg-slate-50/40 space-y-4 animate-fade-in">
                    <div className="grid sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="font-semibold text-primary uppercase tracking-wider mb-1">Destinataire & Adresse</p>
                        <p className="text-slate-800">{order.clientName}</p>
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

                    <div className="border-t border-border/80 pt-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <CopyOrderNumberButton orderNumber={order.orderNumber} />
                        <a
                          href={`https://wa.me/22997000000?text=${encodeURIComponent(`Bonjour Bénin Cadeau, je souhaite des informations sur ma commande ${order.orderNumber}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#25D366] hover:text-[#22c55e] border border-emerald-100 hover:border-emerald-300 bg-white px-3 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
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
            <div className="flex items-center justify-between pt-6 border-t border-border">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-border rounded-xl text-xs font-semibold text-muted-foreground hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
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
                        ? "bg-primary text-white"
                        : "border border-border text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-border rounded-xl text-xs font-semibold text-muted-foreground hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Suivant
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 bg-card border border-border rounded-2xl shadow-sm text-muted-foreground">
          <p className="text-5xl mb-4">🎁</p>
          <h3 className="font-display text-lg font-bold text-primary mb-1">Aucune commande trouvée</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">Vous n'avez pas encore passé de commande sur notre boutique.</p>
          <button 
            onClick={() => navigate("catalogue")}
            className="bg-primary text-white font-bold px-5 py-3 rounded-xl text-xs hover:bg-primary/90 transition-all cursor-pointer shadow-sm"
          >
            Découvrir le catalogue
          </button>
        </div>
      )}
    </div>
  );
}
