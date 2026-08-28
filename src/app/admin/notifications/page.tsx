"use client";

import React, { useState, useEffect } from "react";
import { Loader2, CheckSquare, Bell } from "lucide-react";
import { useAdminToast } from "../layout";

export default function AdminNotificationsPage() {
  type AdminNotification = { id: number; title: string; message: string; isRead: boolean; createdAt: string };

  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useAdminToast();

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error(err);
      showToast("Erreur lors du chargement des notifications.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

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
        showToast("Toutes les notifications ont été marquées comme lues.", "success");
      }
    } catch (err) {
      showToast("Erreur lors de la mise à jour.", "error");
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <Loader2 className="animate-spin text-primary me-2" size={24} />
        <span>Chargement des notifications...</span>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h3 mb-0 text-gray-800 fw-bold">Notifications</h1>
          <p className="text-muted small mb-0">Consultez et gérez les alertes et événements système.</p>
        </div>
        <div className="d-flex gap-2">
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="btn btn-primary btn-sm d-flex align-items-center gap-1.5 fw-semibold px-3 py-2 rounded-2">
              <CheckSquare size={16} />
              Tout marquer comme lu
            </button>
          )}
        </div>
      </div>

      <div className="card shadow-sm border-0 rounded-3">
        <div className="card-header bg-white border-bottom py-3 d-flex align-items-center justify-content-between">
          <h6 className="m-0 font-weight-bold text-primary d-flex align-items-center gap-2">
            <Bell size={18} />
            Historique des notifications
          </h6>
          <span className="badge bg-light text-primary border rounded-pill fw-bold px-3 py-1">
            {notifications.length} au total
          </span>
        </div>
        <div className="card-body p-0">
          <div className="list-group list-group-flush">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`list-group-item list-group-item-action p-4 d-flex justify-content-between align-items-start gap-4 transition-all ${
                  !n.isRead ? "bg-light bg-opacity-75" : ""
                }`}
              >
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <h6 className={`mb-0 text-dark ${!n.isRead ? "fw-bold" : "fw-semibold"}`}>
                      {n.title}
                    </h6>
                    {!n.isRead && (
                      <span className="badge bg-danger rounded-pill px-2 py-0.5" style={{ fontSize: "9px" }}>
                        Nouveau
                      </span>
                    )}
                  </div>
                  <p className="text-secondary mb-2 small leading-relaxed">{n.message}</p>
                  <div className="text-muted" style={{ fontSize: "11px" }}>
                    {new Date(n.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                {!n.isRead && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="btn btn-outline-success btn-xs d-flex align-items-center gap-1 px-2.5 py-1.5 rounded-2"
                    title="Marquer comme lu"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icon-tabler-checks">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M7 12l5 5l10 -10" />
                      <path d="M2 12l5 5m5 -5l5 -5" />
                    </svg>
                    <span className="d-none d-sm-inline fw-semibold" style={{ fontSize: "11px" }}>Lu</span>
                  </button>
                )}
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="text-center py-5 text-muted">
                <p className="fs-1 mb-2">🔔</p>
                <h6>Aucune notification reçue pour le moment.</h6>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
