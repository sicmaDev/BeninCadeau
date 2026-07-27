"use client";

import { useState, useEffect } from "react";
import { User, Lock, Eye, EyeOff, LogOut, CheckCircle, Loader2 } from "lucide-react";
import { useAuth, useRouter } from "@/lib/context";
import { toast } from "sonner";

type AuthTab = "login" | "register";

export default function AccountPage() {
  const { user, loading, updateUser, login, register, logout } = useAuth();
  const { navigate } = useRouter();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [profileSaved, setProfileSaved] = useState(false);
  const [loadingProfileSave, setLoadingProfileSave] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Synchroniser l'état du profil local quand l'utilisateur change
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name,
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  // Rediriger vers la page dédiée de connexion si non connecté
  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/connexion?redirect=/compte";
    }
  }, [user, loading]);

  const handleSaveProfile = async () => {
    if (!profile.name.trim()) {
      toast.error("Le nom ne peut pas être vide.");
      return;
    }
    if (!profile.email.trim()) {
      toast.error("L'adresse e-mail ne peut pas être vide.");
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
        updateUser(profile);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-primary mx-auto mb-3" />
          <p className="text-xs text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-primary mx-auto mb-3" />
          <p className="text-xs text-muted-foreground">Redirection vers la connexion...</p>
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
          onClick={() => setShowLogoutConfirm(true)}
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
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
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

      {/* Dialogue de confirmation de déconnexion */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-slate-200 shadow-2xl text-center">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
              <LogOut size={20} />
            </div>
            <h3 className="font-display font-bold text-slate-900 text-lg mb-2">Se déconnecter ?</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">Êtes-vous sûr de vouloir vous déconnecter de votre compte Bénin Cadeau ?</p>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={async () => {
                  setShowLogoutConfirm(false);
                  try {
                    await fetch("/api/auth/logout", { method: "POST" });
                  } catch (e) {}
                  window.location.href = "/";
                }}
                className="flex-1 bg-[#1A2B6D] hover:bg-[#1A2B6D]/90 text-white font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer shadow-md"
              >
                Oui, me déconnecter
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3 rounded-xl border border-slate-200 text-xs transition-colors cursor-pointer"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
