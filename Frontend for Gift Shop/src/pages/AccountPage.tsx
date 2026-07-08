import { useState } from "react";
import { User, Lock, Eye, EyeOff, Package, Clock, LogOut, Edit3, CheckCircle } from "lucide-react";
import { useAuth, useRouter } from "../lib/context";
import { formatPrice } from "../data/mockData";

type AuthTab = "login" | "register";
type AccountTab = "orders" | "profile";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  "en_attente":  { label: "En attente",      color: "bg-amber-100 text-amber-700" },
  "payee":       { label: "Payée",            color: "bg-blue-100 text-blue-700" },
  "preparation": { label: "En préparation",  color: "bg-purple-100 text-purple-700" },
  "expediee":    { label: "Expédiée",         color: "bg-indigo-100 text-indigo-700" },
  "livree":      { label: "Livrée",           color: "bg-green-100 text-green-700" },
  "annulee":     { label: "Annulée",          color: "bg-red-100 text-red-700" },
};

const MOCK_ORDERS = [
  {
    id: "BC-243891",
    date: "28 juin 2025",
    status: "livree",
    total: 47000,
    items: [
      { name: "Coffret Cadeau Luxe Premium", qty: 1, price: 35000 },
      { name: "Bougie Parfumée Luxe à l'Ambre", qty: 1, price: 12000 },
    ],
  },
  {
    id: "BC-243765",
    date: "15 juin 2025",
    status: "expediee",
    total: 28000,
    items: [{ name: "Bouquet de Roses Premium 50 Tiges", qty: 1, price: 28000 }],
  },
  {
    id: "BC-243612",
    date: "2 juin 2025",
    status: "payee",
    total: 22500,
    items: [
      { name: "Mug Personnalisé Premium", qty: 1, price: 8500 },
      { name: "Box Chocolats Artisanaux", qty: 1, price: 18000 },
    ],
  },
];

export default function AccountPage() {
  const { user, login, register, logout } = useAuth();
  const { navigate } = useRouter();
  const [authTab, setAuthTab] = useState<AuthTab>("login");
  const [accountTab, setAccountTab] = useState<AccountTab>("orders");
  const [showPwd, setShowPwd] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ name: "", email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) { setLoginError("Veuillez remplir tous les champs."); return; }
    login(loginForm.email, loginForm.password);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name || !regForm.email || !regForm.password) { setLoginError("Veuillez remplir tous les champs."); return; }
    register(regForm.name, regForm.email, regForm.password);
  };

  const handleSaveProfile = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
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
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                authTab === tab ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
              }`}
            >
              {tab === "login" ? "Connexion" : "Inscription"}
            </button>
          ))}
        </div>

        {loginError && (
          <div className="bg-red-50 text-destructive rounded-xl px-4 py-3 text-sm mb-4">{loginError}</div>
        )}

        {authTab === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Email</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="kossi@exemple.bj"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent pr-12"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-colors">
              Se connecter
            </button>
            <p className="text-center text-xs text-muted-foreground">
              <em>Démo : tout email + tout mot de passe fonctionnent</em>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Nom complet</label>
              <input
                type="text"
                value={regForm.name}
                onChange={(e) => setRegForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Kossi Adjovi"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Email</label>
              <input
                type="email"
                value={regForm.email}
                onChange={(e) => setRegForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="kossi@exemple.bj"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={regForm.password}
                  onChange={(e) => setRegForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="Minimum 8 caractères"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent pr-12"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-colors">
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
          onClick={() => { logout(); navigate("home"); }}
          className="flex items-center gap-2 text-muted-foreground hover:text-destructive text-sm font-medium transition-colors"
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
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
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
          {MOCK_ORDERS.map((order) => {
            const statusConf = STATUS_CONFIG[order.status];
            return (
              <div key={order.id} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="font-bold text-primary font-display text-lg">{order.id}</p>
                    <p className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5">
                      <Clock size={12} />
                      {order.date}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConf.color}`}>
                    {statusConf.label}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-muted-foreground line-clamp-1">{item.name} <span className="text-xs">x{item.qty}</span></span>
                      <span className="font-medium flex-shrink-0 ml-2">{formatPrice(item.price)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-3 flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="font-display font-bold text-primary">{formatPrice(order.total)}</span>
                </div>
              </div>
            );
          })}
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
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Téléphone</label>
              <input
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+229 97 00 00 00"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
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
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
          <button
            onClick={handleSaveProfile}
            className={`flex items-center gap-2 font-bold px-6 py-3 rounded-xl transition-all text-sm ${
              profileSaved ? "bg-green-600 text-white" : "bg-primary text-white hover:bg-primary/90"
            }`}
          >
            {profileSaved ? <><CheckCircle size={16} /> Enregistré !</> : <><Lock size={16} /> Sauvegarder</>}
          </button>
        </div>
      )}
    </div>
  );
}
