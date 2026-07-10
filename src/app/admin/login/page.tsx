"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { useAdminToast } from "@/app/admin/layout";

export default function AdminLoginPage() {
  const router = useRouter();
  const { showToast } = useAdminToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté en tant qu'admin
    const checkLogged = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user && data.user.role === "ADMIN") {
            router.push("/admin");
          }
        }
      } catch (e) {
        // Ignorer
      }
    };
    checkLogged();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.user && data.user.role === "ADMIN") {
          showToast("Connexion réussie ! Bienvenue sur le back-office.", "success");
          router.push("/admin");
          router.refresh();
        } else {
          showToast("Accès refusé : vous devez être administrateur.", "error");
          await fetch("/api/auth/logout", { method: "POST" });
        }
      } else {
        showToast(data.error || "Identifiants de connexion invalides.", "error");
      }
    } catch (err) {
      showToast("Une erreur réseau est survenue.", "error");
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="w-100 d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card" style={{ maxWidth: "420px", width: "100%", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}>
        <div className="card-body p-5">
          <div className="text-center mb-3">
            <Link href="/" className="mb-4 d-inline-block text-decoration-none">
              <img src="/1-19.png" alt="Logo" width="56" height="56" style={{ objectFit: "contain" }} />
              <h1 className="card-title mt-3 h5 text-dark fw-bold uppercase" style={{ letterSpacing: "1px" }}>Bénin Cadeau Admin</h1>
            </Link>
            <p className="text-secondary small">Accédez au back-office de gestion</p>
          </div>

          <form onSubmit={handleLogin} className="needs-validation mt-3" noValidate>
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-dark fw-medium" style={{ fontSize: "12px" }}>
                Identifiant E-mail
              </label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: "#dee2e6" }}>
                  <Mail size={16} className="text-secondary" />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemple@email.com"
                  className="form-control border-start-0"
                  style={{ borderColor: "#dee2e6", fontSize: "14px" }}
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label text-dark fw-medium" style={{ fontSize: "12px" }}>
                Mot de passe
              </label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: "#dee2e6" }}>
                  <Lock size={16} className="text-secondary" />
                </span>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-control border-start-0"
                  style={{ borderColor: "#dee2e6", fontSize: "14px" }}
                />
              </div>
            </div>

            <button className="btn btn-primary w-100 py-2.5 mt-2 fw-bold text-uppercase" style={{ letterSpacing: "0.5px", fontSize: "13px" }} type="submit" disabled={loginLoading}>
              {loginLoading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link href="/" className="link-primary text-decoration-none small fw-semibold">
              ← Retour à la boutique
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
