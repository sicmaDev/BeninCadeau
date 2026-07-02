"use client";

import React, { useState, useEffect } from "react";
import { useAdminToast } from "@/app/admin/layout";
import { User, Lock, Mail, Phone, MapPin, Save, Shield } from "lucide-react";

export default function AdminProfilePage() {
  const { showToast } = useAdminToast();
  const [loading, setLoading] = useState(true);
  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [submittingPassword, setSubmittingPassword] = useState(false);

  // Profile fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setName(data.user.name || "");
          setEmail(data.user.email || "");
          setPhone(data.user.phone || "");
          setAddress(data.user.address || "");
        }
      }
    } catch (err) {
      console.error(err);
      showToast("Erreur lors du chargement des informations du profil.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast("Le nom complet et l'adresse e-mail sont requis.", "error");
      return;
    }

    setSubmittingProfile(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, address }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast("Profil mis à jour avec succès !", "success");
        // Re-charger pour s'assurer que tout est propre
        fetchProfile();
      } else {
        showToast(data.error || "Une erreur est survenue.", "error");
      }
    } catch (err) {
      showToast("Erreur réseau. Impossible de sauvegarder.", "error");
    } finally {
      setSubmittingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast("Veuillez saisir votre mot de passe actuel.", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("Le nouveau mot de passe doit contenir au moins 6 caractères.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("La confirmation ne correspond pas au nouveau mot de passe.", "error");
      return;
    }

    setSubmittingPassword(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          address,
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast("Mot de passe mis à jour avec succès !", "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        showToast(data.error || "Une erreur est survenue.", "error");
      }
    } catch (err) {
      showToast("Erreur réseau.", "error");
    } finally {
      setSubmittingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center py-10" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Page Title */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="fs-3 mb-1 text-dark">Mon Profil</h1>
          <p className="mb-0 text-secondary">Gérez vos informations de compte Administrateur et votre mot de passe</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Left column: Information and form */}
        <div className="col-12 col-lg-7">
          <div className="card h-100">
            <div className="card-header bg-transparent border-bottom py-3">
              <h5 className="card-title text-dark fw-bold mb-0 flex items-center gap-2">
                <User size={18} className="text-primary" /> Informations personnelles
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleUpdateProfile}>
                {/* Full name */}
                <div className="mb-3">
                  <label htmlFor="adminName" className="form-label text-dark fw-medium">
                    Nom Complet *
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <User size={16} className="text-secondary" />
                    </span>
                    <input
                      id="adminName"
                      type="text"
                      className="form-control"
                      placeholder="Ex: Administrateur Principal"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Email address */}
                <div className="mb-3">
                  <label htmlFor="adminEmail" className="form-label text-dark fw-medium">
                    Adresse E-mail *
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <Mail size={16} className="text-secondary" />
                    </span>
                    <input
                      id="adminEmail"
                      type="email"
                      className="form-control"
                      placeholder="admin@benincadeau.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <small className="form-text text-muted">
                    Changer l&apos;adresse email modifiera votre identifiant de connexion.
                  </small>
                </div>

                {/* Phone number */}
                <div className="mb-3">
                  <label htmlFor="adminPhone" className="form-label text-dark fw-medium">
                    Téléphone (WhatsApp)
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <Phone size={16} className="text-secondary" />
                    </span>
                    <input
                      id="adminPhone"
                      type="text"
                      className="form-control"
                      placeholder="Ex: +229 90 00 00 00"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="mb-3">
                  <label htmlFor="adminAddress" className="form-label text-dark fw-medium">
                    Adresse physique / Bureau
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <MapPin size={16} className="text-secondary" />
                    </span>
                    <input
                      id="adminAddress"
                      type="text"
                      className="form-control"
                      placeholder="Ex: Cotonou, Bénin"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <button type="submit" className="btn btn-primary d-flex align-items-center gap-2" disabled={submittingProfile}>
                    {submittingProfile ? (
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                    ) : (
                      <Save size={16} />
                    )}
                    Enregistrer les modifications
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right column: Password update & credentials check */}
        <div className="col-12 col-lg-5">
          <div className="card">
            <div className="card-header bg-transparent border-bottom py-3">
              <h5 className="card-title text-dark fw-bold mb-0 flex items-center gap-2">
                <Lock size={18} className="text-danger" /> Sécurité & Mot de passe
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleChangePassword}>
                {/* Current password */}
                <div className="mb-3">
                  <label htmlFor="currentPass" className="form-label text-dark fw-medium">
                    Mot de passe actuel *
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <Lock size={16} className="text-secondary" />
                    </span>
                    <input
                      id="currentPass"
                      type="password"
                      className="form-control"
                      placeholder="Saisissez votre mot de passe actuel"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                </div>

                {/* New password */}
                <div className="mb-3">
                  <label htmlFor="newPass" className="form-label text-dark fw-medium">
                    Nouveau mot de passe *
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <Lock size={16} className="text-secondary" />
                    </span>
                    <input
                      id="newPass"
                      type="password"
                      className="form-control"
                      placeholder="Minimum 6 caractères"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>

                {/* Confirm password */}
                <div className="mb-3">
                  <label htmlFor="confirmPass" className="form-label text-dark fw-medium">
                    Confirmer le nouveau mot de passe *
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <Lock size={16} className="text-secondary" />
                    </span>
                    <input
                      id="confirmPass"
                      type="password"
                      className="form-control"
                      placeholder="Répétez le nouveau mot de passe"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <button type="submit" className="btn btn-danger d-flex align-items-center gap-2" disabled={submittingPassword}>
                    {submittingPassword ? (
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                    ) : (
                      <Shield size={16} />
                    )}
                    Mettre à jour le mot de passe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
