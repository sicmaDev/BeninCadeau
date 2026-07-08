"use client";

import { useState, useEffect } from "react";
import { User, Lock, Eye, EyeOff, Package, Clock, LogOut, Edit3, CheckCircle, Loader2 } from "lucide-react";
import { useAuth, useRouter } from "@/lib/context";
import { formatPrice } from "@/components/ProductCard";
import { toast } from "sonner";

type AuthTab = "login" | "register";
type AccountTab = "orders" | "profile";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  EN_ATTENTE:     { label: "En attente",      color: "bg-amber-100 text-amber-700" },
  PAYEE:          { label: "Payée",            color: "bg-blue-100 text-blue-700" },
  EN_PREPARATION: { label: "En préparation",  color: "bg-purple-100 text-purple-700" },
  EXPEDIEE:       { label: "Expédiée",         color: "bg-indigo-100 text-indigo-700" },
  LIVREE:         { label: "Livrée",           color: "bg-secondary text-accent border border-accent/20" },
  ANNULEE:        { label: "Annulée",          color: "bg-red-100 text-red-700" },
};

export default function AccountPage() {
  const { user, login, register, logout } = useAuth();
  const { navigate } = useRouter();
  const [authTab, setAuthTab] = useState<AuthTab>("login");
  const [accountTab, setAccountTab] = useState<AccountTab>("orders");
  const [showPwd, setShowPwd] = useState(false);
  
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ name: "", email: "", password: "", phone: "", address: "" });
  const [loginError, setLoginError] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(false);

  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [profileSaved, setProfileSaved] = useState(false);
  const [loadingProfileSave, setLoadingProfileSave] = useState(false);

  // Synchroniser l'état du profil local quand l'utilisateur change
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name,
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  // Charger les commandes réelles de l'utilisateur
  useEffect(() => {
    if (user && accountTab === "orders") {
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
  }, [user, accountTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) { setLoginError("Veuillez remplir tous les champs."); return; }
    setLoginError("");
    setLoadingAuth(true);
    const success = await login(loginForm.email, loginForm.password);
    setLoadingAuth(false);
    if (!success) {
      setLoginError("Email ou mot de passe incorrect.");
    } else {
      toast.success("Connexion réussie !");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name || !regForm.email || !regForm.password) { setLoginError("Veuillez remplir tous les champs."); return; }
    setLoginError("");
    setLoadingAuth(true);
    const success = await register(regForm.name, regForm.email, regForm.password);
    setLoadingAuth(false);
    if (!success) {
      setLoginError("Cet e-mail est déjà utilisé ou mot de passe trop court.");
    } else {
      toast.success("Inscription réussie !");
    }
  };

  const handleSaveProfile = async () => {
    if (!profile.name.trim()) {
      toast.error("Le nom ne peut pas être vide.");
      return;
    }
    setLoadingProfileSave(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        setProfileSaved(true);
        toast.success("Profil mis à jour !");
        setTimeout(() => setProfileSaved(false), 2000);
      } else {
        const data = await res.json();
        toast.error(data.error || "Impossible de sauvegarder le profil.");
      }
    } catch (err) {
      toast.error("Erreur réseau lors de la mise à jour.");
    } finally {
      setLoadingProfileSave(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-12 font-body">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User size={28} className="text-primary" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-primary">Mon Compte</h1>
          <p className="text-muted-foreground text-sm mt-1">Connectez-vous pour gérer vos commandes</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-muted rounded-xl p-1 mb-6">
          {(["login", "register"] as AuthTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => { setAuthTab(tab); setLoginError(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                authTab === tab ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
              }`}
            >
              {tab === "login" ? "Connexion" : "Inscription"}
            </button>
          ))}
        </div>

        {loginError && (
          <div className="bg-red-50 text-destructive rounded-xl px-4 py-3 text-sm mb-4 border border-red-200">{loginError}</div>
        )}

        {authTab === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Email</label>
              <input
                type="email"
                required
                value={loginForm.email}
                onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="kossi@exemple.bj"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent pr-12 focus:border-transparent"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loadingAuth}
              className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-75 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loadingAuth && <Loader2 size={16} className="animate-spin" />}
              Se connecter
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Nom complet *</label>
              <input
                type="text"
                required
                value={regForm.name}
                onChange={(e) => setRegForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Kossi Adjovi"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Email *</label>
              <input
                type="email"
                required
                value={regForm.email}
                onChange={(e) => setRegForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="kossi@exemple.bj"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Mot de passe *</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  value={regForm.password}
                  onChange={(e) => setRegForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="Minimum 8 caractères"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent pr-12 focus:border-transparent"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loadingAuth}
              className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-75 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loadingAuth && <Loader2 size={16} className="animate-spin" />}
              Créer mon compte
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 font-body">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-xl font-display shadow-lg">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold text-primary">{user.name}</h1>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>
        </div>
        <button
          onClick={async () => { await logout(); navigate("home"); }}
          className="flex items-center gap-2 text-muted-foreground hover:text-destructive text-sm font-medium transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          <span className="hidden sm:block">Déconnexion</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-muted rounded-xl p-1 mb-8">
        {([
          { id: "orders", icon: <Package size={16} />, label: "Mes commandes" },
          { id: "profile", icon: <Edit3 size={16} />, label: "Mon profil" },
        ] as { id: AccountTab; icon: React.ReactNode; label: string }[]).map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() => setAccountTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              accountTab === id ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* Orders */}
      {accountTab === "orders" && (
        <div className="space-y-4">
          {loadingOrders ? (
            <div className="text-center py-12 text-muted-foreground">
              <Loader2 size={32} className="animate-spin mx-auto mb-3" />
              Chargement de vos commandes...
            </div>
          ) : orders.length > 0 ? (
            orders.map((order) => {
              const statusConf = STATUS_CONFIG[order.status] || { label: order.status, color: "bg-gray-100 text-gray-700" };
              const orderDate = new Date(order.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              });
              return (
                <div key={order.id} className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="font-bold text-primary font-display text-lg">{order.orderNumber}</p>
                      <p className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5">
                        <Clock size={12} />
                        {orderDate}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConf.color}`}>
                      {statusConf.label}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    {order.orderItems.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-muted-foreground line-clamp-1">{item.product.name} <span className="text-xs font-semibold">x{item.quantity}</span></span>
                        <span className="font-medium flex-shrink-0 ml-2">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="font-display font-bold text-primary">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-card border border-border rounded-2xl text-muted-foreground">
              <p className="text-4xl mb-2">🎁</p>
              <p>Vous n'avez pas encore passé de commande.</p>
              <button 
                onClick={() => navigate("catalogue")}
                className="mt-4 bg-primary text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-primary/90 transition-all cursor-pointer"
              >
                Faire mes premiers achats
              </button>
            </div>
          )}
        </div>
      )}

      {/* Profile */}
      {accountTab === "profile" && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-display text-xl font-semibold text-primary mb-6">Modifier mon profil</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Nom complet</label>
              <input
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Téléphone</label>
              <input
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+229 97 00 00 00"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-foreground mb-1.5">Email</label>
              <input
                value={user.email}
                disabled
                className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm text-muted-foreground cursor-not-allowed"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-foreground mb-1.5">Adresse par défaut</label>
              <input
                value={profile.address}
                onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
                placeholder="Cotonou, Akpakpa..."
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={handleSaveProfile}
            disabled={loadingProfileSave}
            className={`flex items-center gap-2 font-bold px-6 py-3 rounded-xl transition-all text-sm cursor-pointer ${
              profileSaved ? "bg-accent text-primary" : "bg-primary text-white hover:bg-primary/90 disabled:opacity-70"
            }`}
          >
            {loadingProfileSave ? (
              <Loader2 size={16} className="animate-spin" />
            ) : profileSaved ? (
              <><CheckCircle size={16} /> Enregistré !</>
            ) : (
              <><Lock size={16} /> Sauvegarder</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
