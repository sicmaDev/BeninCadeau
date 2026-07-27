"use client";

import { useState, useEffect } from "react";
import { User, Lock, Eye, EyeOff, LogOut, CheckCircle, Loader2 } from "lucide-react";
import { useAuth, useRouter } from "@/lib/context";
import { toast } from "sonner";

type AuthTab = "login" | "register";

export default function AccountPage() {
  const { user, login, register, logout } = useAuth();
  const { navigate } = useRouter();

  const [authTab, setAuthTab] = useState<AuthTab>("login");
  const [showPwd, setShowPwd] = useState(false);
  
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ name: "", email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(false);

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
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16 font-body">
        <div className="bg-card border border-border shadow-xl rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 border border-accent/10">
              <User size={24} className="text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-primary tracking-tight">Mon Profil</h1>
            <p className="text-muted-foreground text-xs mt-1.5">Connectez-vous pour modifier vos coordonnées</p>
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

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 font-body">
      {/* Profil Header Card */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-md mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 bg-primary text-white font-display text-2xl font-bold rounded-2xl flex items-center justify-center shadow-md">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-primary">{user.name}</h1>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>
        </div>
        <button
          onClick={async () => { await logout(); navigate("home"); }}
          className="flex items-center gap-2 text-muted-foreground hover:text-destructive text-sm font-semibold border border-border px-4 py-2 rounded-xl hover:bg-red-50/50 transition-all cursor-pointer"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>

      {/* Profil Detail Settings Card */}
      <div className="bg-card border border-border rounded-2xl p-8 shadow-md">
        <div className="border-b border-border pb-4 mb-6">
          <h2 className="font-display text-lg font-bold text-primary">Informations du Profil</h2>
          <p className="text-xs text-muted-foreground mt-1">Mettez à jour vos coordonnées personnelles et votre adresse de livraison par défaut.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-6">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider">Nom complet</label>
            <input
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider">Téléphone</label>
            <input
              value={profile.phone}
              onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
              placeholder="+229 97 00 00 00"
              className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider">Adresse Email</label>
            <input
              value={user.email}
              disabled
              className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm text-muted-foreground cursor-not-allowed"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider">Adresse de livraison par défaut</label>
            <input
              value={profile.address}
              onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
              placeholder="Cotonou, Quartier Akpakpa, Rue..."
              className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
            />
          </div>
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={loadingProfileSave}
          className={`flex items-center justify-center gap-2 font-bold px-6 py-3 rounded-xl transition-all text-sm cursor-pointer shadow ${
            profileSaved ? "bg-accent text-primary" : "bg-primary text-white hover:bg-primary/90 disabled:opacity-70 active:scale-98"
          }`}
        >
          {loadingProfileSave ? (
            <Loader2 size={16} className="animate-spin" />
          ) : profileSaved ? (
            <><CheckCircle size={16} /> Modifications Enregistrées !</>
          ) : (
            <>Sauvegarder les modifications</>
          )}
        </button>
      </div>
    </div>
  );
}
