"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  X,
  Lock,
  Mail,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import "@/styles/admin/style.scss";

// Types pour le système de Toasts
interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

interface ToastContextType {
  showToast: (message: string, type: "success" | "error") => void;
}

// Création du Contexte
const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

// Hook personnalisé pour consommer le Toast
export const useAdminToast = () => useContext(ToastContext);

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sidebar states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Desktop collapse
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile Drawer

  // Dropdown states
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Login Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const showToast = (message: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const checkAdminSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.user && data.user.role === "ADMIN") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    } catch (e) {
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setNotificationOpen(false);
    setProfileOpen(false);
    checkAdminSession();
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Close dropdowns if clicking outside of the dropdown triggers or menus
      if (!target.closest("#nav-notifications")) {
        setNotificationOpen(false);
      }
      if (!target.closest("#nav-profile")) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          setIsAdmin(true);
          showToast("Connexion réussie ! Bienvenue sur le back-office.", "success");
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

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsAdmin(false);
      showToast("Déconnexion réussie.", "success");
      router.push("/");
    } catch (err) {
      showToast("Erreur lors de la déconnexion.", "error");
    }
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin", iconClass: "ti ti-home" },
    { name: "Commandes", path: "/admin/commandes", iconClass: "ti ti-shopping-cart" },
    { name: "Produits", path: "/admin/produits", iconClass: "ti ti-box-seam" },
    { name: "Catégories", path: "/admin/categories", iconClass: "ti ti-list" },
    { name: "Clients", path: "/admin/clients", iconClass: "ti ti-users" },
    { name: "Zones de livraison", path: "/admin/livraisons", iconClass: "ti ti-truck" },
    { name: "Codes promo", path: "/admin/promocodes", iconClass: "ti ti-ticket" },
  ];

  if (loading) {
    return (
      <div className="d-flex items-center justify-content-center min-vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Vérification de session...</span>
          </div>
          <p className="mt-3 text-secondary text-uppercase fw-semibold" style={{ fontSize: "11px" }}>
            Vérification de session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {!isAdmin ? (
        /* CONNEXION ADMIN - Design Template signin.html */
        <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
          <div className="card" style={{ maxWidth: "420px", width: "100%" }}>
            <div className="card-body p-5">
              <div className="text-center mb-3">
                <Link href="/" className="mb-4 d-inline-block text-decoration-none">
                  <img src="/1-19.png" alt="Logo" width="48" height="48" style={{ objectFit: "contain" }} />
                  <h1 className="card-title mt-3 h5 text-dark fw-bold uppercase">Bénin Cadeau Admin</h1>
                </Link>
                <p className="text-secondary small">Accédez au back-office de gestion</p>
              </div>

              <form onSubmit={handleLogin} className="needs-validation mt-3" noValidate>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label text-dark fw-medium">
                    Identifiant E-mail
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0">
                      <Mail size={16} className="text-secondary" />
                    </span>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@benincadeau.bj"
                      className="form-control border-start-0"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label text-dark fw-medium">
                    Mot de passe
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0">
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
                    />
                  </div>
                </div>

                <button className="btn btn-primary w-100 py-2.5 mt-2 fw-bold" type="submit" disabled={loginLoading}>
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
      ) : (
        /* BACK-OFFICE ADMIN - Design Template Structure */
        <>
          {/* OVERLAY FOR MOBILE */}
          <div
            id="overlay"
            className={`overlay ${sidebarOpen ? "show" : ""}`}
            onClick={() => setSidebarOpen(false)}
          ></div>

          {/* TOPBAR */}
          <nav
            id="topbar"
            className={`navbar bg-white border-bottom fixed-top topbar px-3 ${
              sidebarCollapsed ? "full" : ""
            }`}
          >
            <button
              id="toggleBtn"
              className="d-none d-lg-inline-flex btn btn-light btn-icon btn-sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <i className="ti ti-layout-sidebar-left-expand"></i>
            </button>

            {/* MOBILE BUTTON */}
            <button
              id="mobileBtn"
              className="btn btn-light btn-icon btn-sm d-lg-none me-2"
              onClick={() => setSidebarOpen(true)}
            >
              <i className="ti ti-layout-sidebar-left-expand"></i>
            </button>

            <h2 className="fs-6 mb-0 text-dark fw-bold uppercase tracking-wider d-none d-sm-block">
              Back-Office Bénin Cadeau
            </h2>

            <div>
              <ul className="list-unstyled d-flex align-items-center mb-0 gap-1">
                {/* Public Shop Link */}
                <li className="d-none d-md-block me-2">
                  <Link href="/" className="btn btn-outline-primary btn-sm px-3 rounded-2 fw-bold text-uppercase">
                    Visiter le site
                  </Link>
                </li>

                {/* Bell Notifications */}
                <li className="position-relative" id="nav-notifications">
                  <button
                    className="position-relative btn-icon btn-sm btn-light btn rounded-circle border-0"
                    onClick={() => {
                      setNotificationOpen(!notificationOpen);
                      setProfileOpen(false);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-bell"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
                      <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
                    </svg>
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger mt-2 ms-n2">
                      2
                    </span>
                  </button>

                  <div
                    className={`dropdown-menu dropdown-menu-end dropdown-menu-md p-0 ${
                      notificationOpen ? "show" : ""
                    }`}
                    style={{
                      position: "absolute",
                      inset: "0px 0px auto auto",
                      transform: "translate(0px, 40px)",
                      minWidth: "320px",
                      display: notificationOpen ? "block" : "none",
                    }}
                  >
                    <ul className="list-unstyled p-0 m-0">
                      <li className="p-3 border-bottom">
                        <div className="d-flex gap-3">
                          <img
                            src="/assets/images/avatar/avatar-1.jpg"
                            alt=""
                            className="avatar avatar-sm rounded-circle"
                          />
                          <div className="flex-grow-1 small">
                            <p className="mb-0 text-dark fw-semibold">Nouvelle commande reçue</p>
                            <p className="mb-1 text-muted">La commande #BC-9923 a été passée.</p>
                            <div className="text-secondary">Il y a 5 min</div>
                          </div>
                        </div>
                      </li>
                      <li className="p-3 border-bottom">
                        <div className="d-flex gap-3">
                          <img
                            src="/assets/images/avatar/avatar-4.jpg"
                            alt=""
                            className="avatar avatar-sm rounded-circle"
                          />
                          <div className="flex-grow-1 small">
                            <p className="mb-0 text-dark fw-semibold">Nouveau client inscrit</p>
                            <p className="mb-1 text-muted">Marie Soglo a créé un compte client.</p>
                            <div className="text-secondary">Il y a 30 min</div>
                          </div>
                        </div>
                      </li>
                      <li className="p-3 border-bottom">
                        <div className="d-flex gap-3">
                          <img
                            src="/assets/images/avatar/avatar-2.jpg"
                            alt=""
                            className="avatar avatar-sm rounded-circle"
                          />
                          <div className="flex-grow-1 small">
                            <p className="mb-0 text-dark fw-semibold">Paiement confirmé</p>
                            <p className="mb-1 text-muted">Le paiement de 299 $ a été reçu.</p>
                            <div className="text-secondary">Il y a 1 heure</div>
                          </div>
                        </div>
                      </li>
                      <li className="px-4 py-3 text-center">
                        <a href="#!" className="text-primary text-decoration-none fw-semibold">
                          Voir toutes les notifications
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>

                {/* Profile Dropdown */}
                <li className="ms-3 position-relative" id="nav-profile">
                  <button
                    className="bg-transparent border-0 p-0 d-flex align-items-center"
                    onClick={() => {
                      setProfileOpen(!profileOpen);
                      setNotificationOpen(false);
                    }}
                  >
                    <img
                      src="/assets/images/avatar/avatar-1.jpg"
                      alt=""
                      className="avatar avatar-sm rounded-circle"
                    />
                    <i className="ti ti-chevron-down text-xs text-secondary ms-1"></i>
                  </button>

                  <div
                    className={`dropdown-menu dropdown-menu-end p-0 ${profileOpen ? "show" : ""}`}
                    style={{
                      position: "absolute",
                      inset: "0px 0px auto auto",
                      transform: "translate(0px, 40px)",
                      minWidth: "280px",
                      display: profileOpen ? "block" : "none",
                    }}
                  >
                    <div>
                      <div className="d-flex gap-3 align-items-center border-dashed border-bottom px-3 py-3">
                        <img
                          src="/assets/images/avatar/avatar-1.jpg"
                          alt=""
                          className="avatar avatar-md rounded-circle"
                        />
                        <div>
                          <h4 className="mb-0 small fw-bold text-dark">Administrateur</h4>
                          <p className="mb-0 small text-secondary">admin@benincadeau.bj</p>
                        </div>
                      </div>
                      <div className="p-3 d-flex flex-column gap-1 small lh-lg">
                        <Link href="/" className="text-decoration-none text-dark">
                          Boutique publique
                        </Link>
                        <Link href="#!" className="text-decoration-none text-dark">
                          Paramètres du compte
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="text-decoration-none text-danger border-0 bg-transparent p-0 text-start"
                          style={{ fontSize: "inherit", lineHeight: "inherit" }}
                        >
                          Déconnexion
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </nav>

          {/* SIDEBAR */}
          <aside
            id="sidebar"
            className={`sidebar d-flex flex-column ${sidebarCollapsed ? "collapsed" : ""} ${
              sidebarOpen ? "mobile-show" : ""
            }`}
          >
            <div className="logo-area">
              <Link href="/admin" className="d-inline-flex align-items-center text-decoration-none">
                <img src="/1-19.png" alt="" width="24" height="24" style={{ objectFit: "contain" }} />
                {!sidebarCollapsed && <span className="logo-text ms-2 fw-bold text-primary">Bénin Cadeau</span>}
              </Link>
            </div>
            <ul className="nav flex-column">
              <li className="px-4 py-2">
                <small className="nav-text text-secondary text-uppercase fw-semibold" style={{ fontSize: "11px" }}>
                  Main
                </small>
              </li>
              {menuItems.map((item, index) => {
                const isActive = pathname === item.path;
                return (
                  <li key={index}>
                    <Link
                      className={`nav-link ${isActive ? "active" : ""}`}
                      href={item.path}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <i className={item.iconClass}></i>
                      <span className="nav-text">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="p-3 border-top mt-auto">
              <button
                onClick={handleLogout}
                className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
                style={{ fontSize: "13px" }}
              >
                <i className="ti ti-logout"></i>
                {!sidebarCollapsed && <span>Déconnexion</span>}
              </button>
            </div>
          </aside>

          {/* CONTENT */}
          <main
            id="content"
            className={`content d-flex flex-column min-vh-100 py-10 ${sidebarCollapsed ? "full" : ""}`}
          >
            <div className="container-fluid flex-grow-1">{children}</div>
            <footer className="admin-footer text-center bg-white">
              <p className="mb-0 small text-secondary">
                © {new Date().getFullYear()} Bénin Cadeau Back-Office. Tous droits réservés.
              </p>
            </footer>
          </main>
        </>
      )}

      {/* TOAST SYSTEM */}
      <div
        className="position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: 1060, maxWidth: "400px", width: "100%" }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast show mb-3 border-start border-4 ${
              t.type === "success" ? "bg-success bg-opacity-10 border-success" : "bg-danger bg-opacity-10 border-danger"
            }`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-header bg-transparent border-0 d-flex justify-content-between">
              <strong className={`me-auto ${t.type === "success" ? "text-success" : "text-danger"}`}>
                {t.type === "success" ? "Succès" : "Erreur"}
              </strong>
              <button
                type="button"
                className="btn-close"
                onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
              ></button>
            </div>
            <div className="toast-body text-dark fw-medium pt-0">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
