"use client";

import { useState, useEffect } from "react";
import { User, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth, useRouter } from "@/lib/context";
import { useSearchParams } from "next/navigation";

type AuthTab = "login" | "register";

export default function ConnexionPage() {
  const { user, login, register } = useAuth();
  const { navigate } = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "account";

  const [authTab, setAuthTab] = useState<AuthTab>("login");
  const [showPwd, setShowPwd] = useState(false);
  
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ name: "", email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(false);

  // Rediriger si déjà connecté
  useEffect(() => {
    if (user) {
      if (redirectTarget === "account") {
        navigate("account");
      } else {
        window.location.href = redirectTarget;
      }
    }
  }, [user, redirectTarget]);

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

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 font-body py-12 px-4 sm:px-6">
      <div className="bg-white border border-slate-200/80 shadow-xl rounded-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <button 
            onClick={() => navigate("home")}
            className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 hover:scale-105 transition-transform"
          >
            <img src="/1-19.png" alt="Bénin Cadeau" className="w-16 h-16 object-contain" />
          </button>
          <h1 className="font-display text-2xl font-bold text-primary tracking-tight">Mon Compte</h1>
          <p className="text-muted-foreground text-xs mt-1.5">Connectez-vous à l&apos;espace client Bénin Cadeau</p>
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
                className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#1A2B6D]/20 focus:border-[#1A2B6D] transition-all"
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
                  className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#1A2B6D]/20 focus:border-[#1A2B6D] pr-12 transition-all"
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
                className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#1A2B6D]/20 focus:border-[#1A2B6D] transition-all"
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
                className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#1A2B6D]/20 focus:border-[#1A2B6D] transition-all"
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
                  className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#1A2B6D]/20 focus:border-[#1A2B6D] pr-12 transition-all"
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
      </div>
    </div>
  );
}
