"use client";

import React, { useState, useEffect } from "react";
import { useAdminToast } from "@/app/admin/layout";
import { History, RefreshCw, ShoppingCart, UserPlus, Package, Filter, Clock } from "lucide-react";

interface ActivityLog {
  id: string;
  timestamp: string;
  type: "ORDER" | "USER" | "PRODUCT";
  description: string;
  icon: string;
  color: string;
}

export default function AdminLogsPage() {
  const { showToast } = useAdminToast();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"ALL" | "ORDER" | "USER" | "PRODUCT">("ALL");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats/logs");
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (e) {
      console.error(e);
      showToast("Erreur lors du chargement des journaux d'activités.", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (filterType === "ALL") return true;
    return log.type === filterType;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "ORDER":
        return <ShoppingCart size={16} className="text-success" />;
      case "USER":
        return <UserPlus size={16} className="text-primary" />;
      case "PRODUCT":
        return <Package size={16} className="text-warning" />;
      default:
        return <History size={16} className="text-secondary" />;
    }
  };

  const getLogTypeBadge = (type: string) => {
    switch (type) {
      case "ORDER":
        return <span className="badge bg-success bg-opacity-10 text-success border border-success-subtle px-2 py-0.5" style={{ fontSize: "10px" }}>Commande</span>;
      case "USER":
        return <span className="badge bg-primary bg-opacity-10 text-primary border border-primary-subtle px-2 py-0.5" style={{ fontSize: "10px" }}>Client</span>;
      case "PRODUCT":
        return <span className="badge bg-warning bg-opacity-10 text-warning border border-warning-subtle px-2 py-0.5" style={{ fontSize: "10px" }}>Produit</span>;
      default:
        return <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary-subtle px-2 py-0.5" style={{ fontSize: "10px" }}>Système</span>;
    }
  };

  return (
    <>
      {/* Page Title */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fs-3 mb-1 text-dark flex items-center gap-2">
                <History size={26} className="text-primary" /> Journal d&apos;activité
              </h1>
              <p className="mb-0 text-secondary">Suivi en temps réel des derniers événements et modifications de la plateforme</p>
            </div>
            <div>
              <button
                onClick={fetchLogs}
                disabled={loading}
                className="btn btn-outline-secondary d-flex align-items-center gap-2 btn-sm"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                Actualiser
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Options */}
      <div className="card mb-4">
        <div className="card-body py-3">
          <div className="d-flex flex-wrap align-items-center gap-2">
            <span className="text-secondary small fw-bold me-2 uppercase d-flex align-items-center gap-1">
              <Filter size={14} /> Filtrer :
            </span>
            <button
              onClick={() => setFilterType("ALL")}
              className={`btn btn-xs px-3 py-1.5 ${filterType === "ALL" ? "btn-primary" : "btn-outline-secondary"}`}
              style={{ fontSize: "11px" }}
            >
              Tous
            </button>
            <button
              onClick={() => setFilterType("ORDER")}
              className={`btn btn-xs px-3 py-1.5 ${filterType === "ORDER" ? "btn-primary" : "btn-outline-secondary"}`}
              style={{ fontSize: "11px" }}
            >
              Commandes uniquement
            </button>
            <button
              onClick={() => setFilterType("USER")}
              className={`btn btn-xs px-3 py-1.5 ${filterType === "USER" ? "btn-primary" : "btn-outline-secondary"}`}
              style={{ fontSize: "11px" }}
            >
              Nouveaux comptes
            </button>
            <button
              onClick={() => setFilterType("PRODUCT")}
              className={`btn btn-xs px-3 py-1.5 ${filterType === "PRODUCT" ? "btn-primary" : "btn-outline-secondary"}`}
              style={{ fontSize: "11px" }}
            >
              Produits ajoutés
            </button>
          </div>
        </div>
      </div>

      {/* Activity Logs Timeline */}
      <div className="card">
        <div className="card-body p-4">
          {loading ? (
            <div className="d-flex align-items-center justify-content-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : filteredLogs.length === 0 ? (
            <p className="text-muted text-center py-5 mb-0">Aucune activité enregistrée dans cette catégorie.</p>
          ) : (
            <div className="position-relative ps-4" style={{ borderLeft: "2px solid #e9ecef" }}>
              {filteredLogs.map((log) => {
                const dateObj = new Date(log.timestamp);
                const formattedTime = dateObj.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' });
                const formattedDate = dateObj.toLocaleDateString("fr-FR", { day: 'numeric', month: 'short', year: 'numeric' });

                return (
                  <div key={log.id} className="position-relative mb-4 pb-2">
                    {/* Floating circular icon marker on the vertical line */}
                    <div
                      className="position-absolute d-flex align-items-center justify-content-center rounded-circle bg-white shadow-sm border"
                      style={{
                        width: "32px",
                        height: "32px",
                        left: "-37px",
                        top: "0px",
                        zIndex: 2,
                      }}
                    >
                      {getIcon(log.type)}
                    </div>

                    <div className="ms-2">
                      <div className="d-flex flex-wrap align-items-center gap-2 mb-1.5">
                        {getLogTypeBadge(log.type)}
                        <span className="text-secondary small d-flex align-items-center gap-1" style={{ fontSize: "11px" }}>
                          <Clock size={12} />
                          {formattedDate} à {formattedTime}
                        </span>
                      </div>
                      <p className="text-dark mb-0 fw-medium" style={{ fontSize: "13.5px", lineHeight: "1.5" }}>
                        {log.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
