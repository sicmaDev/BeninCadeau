"use client";

import React, { useState, useEffect } from "react";
import { useAdminToast } from "@/app/admin/layout";
import { CreditCard, Search, ArrowUpRight, CheckCircle, Clock, XCircle, RefreshCw } from "lucide-react";

interface Order {
  id: number;
  orderNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  totalAmount: number;
  status: string;
  transactionId: string | null;
  createdAt: string;
}

export default function AdminPaiementsPage() {
  const { showToast } = useAdminToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"ALL" | "FEDAPAY" | "MANUAL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [verifyingId, setVerifyingId] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error(e);
      showToast("Erreur lors du chargement des transactions.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyFedaPayStatus = async (order: Order) => {
    if (!order.transactionId) return;
    setVerifyingId(order.id);

    try {
      // Appeler une vérification FedaPay via l'id de transaction
      const res = await fetch(`/api/webhooks/fedapay?id=${order.transactionId}`, {
        method: "GET", // On peut faire un GET ou interroger directement la route de confirmation
      });

      // Si le statut est validé
      const checkRes = await fetch(`/confirmation/${order.orderNumber}?id=${order.transactionId}&silent=true`);
      if (checkRes.ok) {
        showToast(`Vérification effectuée pour la commande ${order.orderNumber}.`, "success");
        fetchOrders();
      } else {
        showToast("Impossible de valider automatiquement avec FedaPay. La transaction est probablement expirée ou invalide.", "error");
      }
    } catch (err) {
      showToast("Erreur lors de la vérification de la transaction.", "error");
    } finally {
      setVerifyingId(null);
    }
  };

  // Filtrer les commandes
  const filteredOrders = orders.filter((order) => {
    // 1. Filtrer par type de paiement
    if (filterType === "FEDAPAY" && !order.transactionId) return false;
    if (filterType === "MANUAL" && order.transactionId) return false;

    // 2. Filtrer par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchOrderNumber = order.orderNumber.toLowerCase().includes(query);
      const matchTxId = order.transactionId?.toLowerCase().includes(query) || false;
      const matchClientName = order.clientName.toLowerCase().includes(query);
      const matchClientEmail = order.clientEmail.toLowerCase().includes(query);
      return matchOrderNumber || matchTxId || matchClientName || matchClientEmail;
    }

    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAYEE":
        return <span className="badge bg-success bg-opacity-10 text-success border border-success px-2.5 py-1">Payé</span>;
      case "EN_ATTENTE":
        return <span className="badge bg-warning bg-opacity-10 text-warning border border-warning px-2.5 py-1">En attente</span>;
      case "ANNULEE":
        return <span className="badge bg-danger bg-opacity-10 text-danger border border-danger px-2.5 py-1">Annulé</span>;
      default:
        return <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary px-2.5 py-1">{status}</span>;
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

  // Calculs de stats rapides
  const fedaPayOrders = orders.filter(o => o.transactionId);
  const totalFedaPayRevenue = fedaPayOrders.filter(o => o.status === "PAYEE").reduce((sum, o) => sum + o.totalAmount, 0);
  const totalManualRevenue = orders.filter(o => !o.transactionId && o.status === "PAYEE").reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <>
      {/* Title */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="fs-3 mb-1 text-dark">Suivi des Paiements</h1>
          <p className="mb-0 text-secondary">Visualisez et contrôlez les règlements par carte bancaire, Mobile Money et paiements directs</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <span className="text-secondary small fw-bold uppercase">Volume FedaPay (Payé)</span>
              <h3 className="mt-2 mb-1 fw-bold text-dark">{totalFedaPayRevenue.toLocaleString("fr-FR")} FCFA</h3>
              <p className="mb-0 text-success small flex items-center gap-1">
                <CheckCircle size={14} /> Transactions validées en ligne
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <span className="text-secondary small fw-bold uppercase">Volume Manuel (Payé)</span>
              <h3 className="mt-2 mb-1 fw-bold text-dark">{totalManualRevenue.toLocaleString("fr-FR")} FCFA</h3>
              <p className="mb-0 text-secondary small flex items-center gap-1">
                <RefreshCw size={14} /> Règlement physique / WhatsApp
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <span className="text-secondary small fw-bold uppercase">Transactions FedaPay</span>
              <h3 className="mt-2 mb-1 fw-bold text-dark">{fedaPayOrders.length}</h3>
              <p className="mb-0 text-secondary small">
                Dont {fedaPayOrders.filter(o => o.status === "PAYEE").length} approuvées
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="card mb-4">
        <div className="card-body py-3">
          <div className="row g-3 align-items-center">
            {/* Payment Type Filters */}
            <div className="col-12 col-md-6">
              <div className="btn-group" role="group" aria-label="Type de paiement">
                <button
                  type="button"
                  className={`btn btn-sm ${filterType === "ALL" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => setFilterType("ALL")}
                >
                  Tous les paiements
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${filterType === "FEDAPAY" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => setFilterType("FEDAPAY")}
                >
                  FedaPay uniquement
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${filterType === "MANUAL" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => setFilterType("MANUAL")}
                >
                  Paiements manuels
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="col-12 col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0">
                  <Search size={16} className="text-secondary" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Rechercher par N° de commande, ID FedaPay ou client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table grid */}
      <div className="card table-responsive">
        {filteredOrders.length === 0 ? (
          <p className="p-5 text-muted text-center mb-0">Aucun paiement correspondant à vos filtres.</p>
        ) : (
          <table className="table mb-0 text-nowrap table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th className="text-dark">Code Commande</th>
                <th className="text-dark">ID Transaction FedaPay</th>
                <th className="text-dark">Client</th>
                <th className="text-dark">Montant</th>
                <th className="text-dark">Méthode</th>
                <th className="text-dark">Statut</th>
                <th className="text-dark">Date</th>
                <th className="text-dark text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  {/* Order Code */}
                  <td className="fw-bold text-dark">
                    <span className="text-primary">{order.orderNumber}</span>
                  </td>

                  {/* FedaPay Tx ID */}
                  <td>
                    {order.transactionId ? (
                      <code className="text-secondary bg-light px-2 py-1 rounded" style={{ fontSize: "11px" }}>
                        {order.transactionId}
                      </code>
                    ) : (
                      <span className="text-muted small">Aucun (Manuel)</span>
                    )}
                  </td>

                  {/* Client name / Email */}
                  <td>
                    <div className="d-flex flex-column">
                      <span className="fw-semibold text-dark" style={{ fontSize: "13px" }}>{order.clientName}</span>
                      <span className="text-secondary small" style={{ fontSize: "11px" }}>{order.clientEmail}</span>
                    </div>
                  </td>

                  {/* Total Amount */}
                  <td className="fw-bold text-dark">
                    {order.totalAmount.toLocaleString("fr-FR")} FCFA
                  </td>

                  {/* Payment Method badge */}
                  <td>
                    {order.transactionId ? (
                      <span className="badge bg-primary bg-opacity-10 text-primary border border-primary px-2 py-1">FedaPay</span>
                    ) : (
                      <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary px-2.5 py-1">WhatsApp / Espèces</span>
                    )}
                  </td>

                  {/* Order / Payment Status */}
                  <td>{getStatusBadge(order.status)}</td>

                  {/* Creation Date */}
                  <td className="text-secondary small">
                    {new Date(order.createdAt).toLocaleDateString("fr-FR")} - {new Date(order.createdAt).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}
                  </td>

                  {/* Action button */}
                  <td className="text-center">
                    {order.transactionId && order.status === "EN_ATTENTE" ? (
                      <button
                        onClick={() => handleVerifyFedaPayStatus(order)}
                        disabled={verifyingId === order.id}
                        className="btn btn-xs btn-outline-primary py-1 px-2 d-inline-flex align-items-center gap-1.5"
                        style={{ fontSize: "10px" }}
                        title="Vérifier le statut actuel sur FedaPay"
                      >
                        <RefreshCw size={11} className={verifyingId === order.id ? "animate-spin" : ""} />
                        Vérifier
                      </button>
                    ) : (
                      <span className="text-muted small">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
