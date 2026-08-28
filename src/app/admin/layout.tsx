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
type AdminNotification = { id: number; title: string; message: string; isRead: boolean; createdAt: string };

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
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(null);

  // Sidebar states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Desktop collapse
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile Drawer

  // Dropdown states
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Notifications dynamiques
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const showToast = (message: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      if (res.ok) {
        const data = await res.json();
        const list = data.notifications || [];
        setNotifications(list);
        setUnreadCount(list.filter((n) => !n.isRead).length);
      }
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "read_one", id }),
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        showToast("Notification marquée comme lue.", "success");
      }
    } catch (err) {
      showToast("Erreur lors de la mise à jour.", "error");
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "read_all" }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
        showToast("Toutes les notifications ont été marquées comme lues.", "success");
      }
    } catch (err) {
      showToast("Erreur lors de la mise à jour.", "error");
    }
  };

  const checkAdminSession = async () => {
    const isLoginPage = pathname === "/admin/login";
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.user && data.user.role === "ADMIN") {
          setIsAdmin(true);
          setAdminUser({ name: data.user.name, email: data.user.email });
          if (isLoginPage) {
            router.push("/admin");
          }
        } else {
          setIsAdmin(false);
          setAdminUser(null);
          if (!isLoginPage) {
            router.push("/admin/login");
          }
        }
      } else {
        setIsAdmin(false);
        setAdminUser(null);
        if (!isLoginPage) {
          router.push("/admin/login");
        }
      }
    } catch (e) {
      setIsAdmin(false);
      setAdminUser(null);
      if (!isLoginPage) {
        router.push("/admin/login");
      }
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
    if (isAdmin) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
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

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsAdmin(false);
      showToast("Déconnexion réussie.", "success");
      router.push("/admin/login");
    } catch (err) {
      showToast("Erreur lors de la déconnexion.", "error");
    }
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin", iconClass: "ti ti-home" },
    { name: "Commandes", path: "/admin/commandes", iconClass: "ti ti-shopping-cart" },
    { name: "Paiements", path: "/admin/paiements", iconClass: "ti ti-credit-card" },
    { name: "Produits", path: "/admin/produits", iconClass: "ti ti-box-seam" },
    { name: "Catégories", path: "/admin/categories", iconClass: "ti ti-list" },
    { name: "Clients", path: "/admin/clients", iconClass: "ti ti-users" },
    { name: "Zones de livraison", path: "/admin/livraisons", iconClass: "ti ti-truck" },
    { name: "Codes promo", path: "/admin/promocodes", iconClass: "ti ti-ticket" },
    { name: "Notifications", path: "/admin/notifications", iconClass: "ti ti-bell animate-bounce-slow" },
    { name: "Log des activités", path: "/admin/logs", iconClass: "ti ti-history" },
  ];

  const isLoginPage = pathname === "/admin/login";

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
      {isLoginPage ? (
        children
      ) : !isAdmin ? (
        null
      ) : (
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
                    {unreadCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger mt-2 ms-n2">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <div
                    className={`dropdown-menu dropdown-menu-end dropdown-menu-md p-0 ${
                      notificationOpen ? "show" : ""
                    }`}
                    style={{
                      position: "absolute",
                      inset: "0px 0px auto auto",
                      transform: "translate(0px, 40px)",
                      minWidth: "340px",
                      display: notificationOpen ? "block" : "none",
                    }}
                  >
                    <ul className="list-unstyled p-0 m-0">
                      <li className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light rounded-top-2">
                        <span className="fw-bold text-dark small">Notifications ({unreadCount} non lues)</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="btn btn-link btn-xs p-0 text-primary text-decoration-none fw-bold small border-0 bg-transparent"
                            style={{ fontSize: "11px" }}
                          >
                            Tout marquer comme lu
                          </button>
                        )}
                      </li>

                      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                        {notifications.filter((n) => !n.isRead).slice(0, 5).map((n) => (
                          <li key={n.id} className="p-3 border-bottom bg-light bg-opacity-50">
                            <div className="d-flex gap-3 align-items-start">
                              <div className="flex-grow-1 small">
                                <p className="mb-0 text-dark fw-bold">
                                  {n.title}
                                </p>
                                <p className="mb-1 text-muted" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                                  {n.message}
                                </p>
                                <div className="text-secondary" style={{ fontSize: '10px' }}>
                                  {new Date(n.createdAt).toLocaleDateString("fr-FR", {
                                    day: "numeric",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                              </div>
                              <button
                                onClick={() => markAsRead(n.id)}
                                className="btn btn-link p-0 text-success border-0 bg-transparent align-self-center"
                                title="Marquer comme lu"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icon-tabler-checks">
                                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                  <path d="M7 12l5 5l10 -10" />
                                  <path d="M2 12l5 5m5 -5l5 -5" />
                                </svg>
                              </button>
                            </div>
                          </li>
                        ))}

                        {notifications.filter((n) => !n.isRead).length === 0 && (
                          <li className="p-4 text-center text-muted small">Aucune notification non lue.</li>
                        )}
                      </div>

                      <li className="px-4 py-3 text-center border-top">
                        <Link href="/admin/notifications" className="text-primary text-decoration-none fw-semibold small" onClick={() => setNotificationOpen(false)}>
                          Voir toutes les notifications
                        </Link>
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
                          <h4 className="mb-0 small fw-bold text-dark">{adminUser?.name || "Administrateur"}</h4>
                          <p className="mb-0 small text-secondary">{adminUser?.email || "admin@benincadeau.bj"}</p>
                        </div>
                      </div>
                      <div className="p-3 d-flex flex-column gap-1 small lh-lg">
                        <Link href="/" className="text-decoration-none text-dark">
                          Boutique publique
                        </Link>
                        <Link href="/admin/profile" className="text-decoration-none text-dark">
                          Profile
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

            <div className="border-top mt-auto d-flex align-items-center px-3" style={{ height: "70px" }}>
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
            <footer
              className="admin-footer text-center border-top bg-white px-3"
              style={{
                position: "fixed",
                bottom: 0,
                right: 0,
                left: sidebarCollapsed ? "60px" : "240px",
                height: "70px",
                zIndex: 1020,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "left 0.3s ease",
              }}
            >
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
              t.type === "success"
                ? "bg-primary bg-opacity-10 border-primary"
                : "bg-warning bg-opacity-10 border-warning"
            }`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-header bg-transparent border-0 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                {t.type === "success" ? (
                  <CheckCircle size={16} className="text-primary" />
                ) : (
                  <AlertCircle size={16} className="text-warning" />
                )}
                <strong
                  className={`me-auto ${
                    t.type === "success" ? "text-primary" : "text-warning"
                  }`}
                >
                  {t.type === "success" ? "Succès" : "Erreur"}
                </strong>
              </div>
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
