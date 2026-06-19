"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminSalesPurchaseChart from "@/components/admin/charts/AdminSalesPurchaseChart";
import AdminCustomerChart from "@/components/admin/charts/AdminCustomerChart";

interface Stats {
  ordersCount: number;
  customersCount: number;
  totalRevenue: number;
  pendingOrdersCount: number;
}

interface RecentOrder {
  id: number;
  orderNumber: string;
  clientName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface PopularProduct {
  id: number;
  name: string;
  price: number;
  images: string | string[];
  totalQty: number;
}

interface LowStockProduct {
  id: number;
  name: string;
  price: number;
  stock: number;
  images: string | string[];
}

interface ThreeColumnDetails {
  profitThisMonth: number;
  shippingFeesThisMonth: number;
  discountsThisMonth: number;
}

interface CustomerSegment {
  firstTimeCount: number;
  returningCount: number;
}

interface CustomerOverview {
  global: CustomerSegment;
  thisYear: CustomerSegment;
  thisMonth: CustomerSegment;
  suppliersCount: number;
}

interface MonthlyRevenueData {
  thisYear: number[];
  lastYear: number[];
  thisMonth: number[];
  lastMonth: number[];
  thisWeek: number[];
  lastWeek: number[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [popularProducts, setPopularProducts] = useState<PopularProduct[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenueData | null>(null);
  const [threeColumnDetails, setThreeColumnDetails] = useState<ThreeColumnDetails | null>(null);
  const [customerOverview, setCustomerOverview] = useState<CustomerOverview | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [salesInterval, setSalesInterval] = useState<"ANNUELLE" | "MENSUELLE" | "HEBDOMADAIRE">("ANNUELLE");
  const [customerInterval, setCustomerInterval] = useState<"GLOBAL" | "YEAR" | "MONTH">("GLOBAL");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setRecentOrders(data.recentOrders || []);
        setPopularProducts(data.popularProducts || []);
        setLowStockProducts(data.lowStockProducts || []);
        setMonthlyRevenue(data.monthlyRevenue || null);
        setThreeColumnDetails(data.threeColumnDetails || null);
        setCustomerOverview(data.customerOverview || null);
      }
    } catch (e) {
      console.error("Failed to fetch admin stats", e);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      EN_ATTENTE: "bg-warning-subtle text-warning border border-warning",
      PAYEE: "bg-success-subtle text-success border border-success",
      EN_PREPARATION: "bg-primary-subtle text-primary border border-primary",
      EXPEDIEE: "bg-info-subtle text-info border border-info",
      LIVREE: "bg-success-subtle text-success border border-success",
      ANNULEE: "bg-danger-subtle text-danger border border-danger",
    };
    return statusColors[status] || "bg-light text-secondary border";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      EN_ATTENTE: "En attente",
      PAYEE: "Payée",
      EN_PREPARATION: "En prép.",
      EXPEDIEE: "Expédiée",
      LIVREE: "Livrée",
      ANNULEE: "Annulée",
    };
    return labels[status] || status;
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

  // Calculate percentages for customers based on interval
  const getCustomerData = () => {
    if (!customerOverview) return { firstTime: 0, returning: 0 };
    switch (customerInterval) {
      case "YEAR":
        return {
          firstTime: customerOverview.thisYear?.firstTimeCount || 0,
          returning: customerOverview.thisYear?.returningCount || 0,
        };
      case "MONTH":
        return {
          firstTime: customerOverview.thisMonth?.firstTimeCount || 0,
          returning: customerOverview.thisMonth?.returningCount || 0,
        };
      case "GLOBAL":
      default:
        return {
          firstTime: customerOverview.global?.firstTimeCount || 0,
          returning: customerOverview.global?.returningCount || 0,
        };
    }
  };

  const { firstTime: firstTimeCount, returning: returningCount } = getCustomerData();
  const totalClients = firstTimeCount + returningCount;
  const firstTimePercent = totalClients > 0 ? Math.round((firstTimeCount / totalClients) * 100) : 0;
  const returningPercent = totalClients > 0 ? Math.round((returningCount / totalClients) * 100) : 0;

  const getSalesChartData = () => {
    if (!monthlyRevenue) return { prev: [], curr: [] };
    switch (salesInterval) {
      case "MENSUELLE":
        return { prev: monthlyRevenue.lastMonth, curr: monthlyRevenue.thisMonth };
      case "HEBDOMADAIRE":
        return { prev: monthlyRevenue.lastWeek, curr: monthlyRevenue.thisWeek };
      case "ANNUELLE":
      default:
        return { prev: monthlyRevenue.lastYear, curr: monthlyRevenue.thisYear };
    }
  };
  const salesData = getSalesChartData();

  return (
    <>
      {/* PAGE HEADER */}
      <div className="row">
        <div className="col-12">
          <div className="mb-6">
            <h1 className="fs-3 mb-1 text-dark">Dashboard</h1>
            <p className="text-secondary">Résumé en temps réel des indicateurs de Bénin Cadeau</p>
          </div>
        </div>
      </div>

      {/* STAT CARDS (Exact Template Row 1) */}
      <div className="row g-3 mb-3">
        {/* Card 1: Total Sales */}
        <div className="col-lg-3 col-12">
          <div className="card p-4 bg-primary bg-opacity-10 border border-primary border-opacity-25 rounded-2">
            <div className="d-flex gap-3">
              <div className="icon-shape icon-md bg-primary text-white rounded-2">
                <i className="ti ti-report-analytics fs-4"></i>
              </div>
              <div>
                <h2 className="mb-3 fs-6 text-dark">Total Ventes</h2>
                <h3 className="fw-bold mb-0 text-dark">
                  {stats?.totalRevenue.toLocaleString("fr-FR") || 0} FCFA
                </h3>
                <p className="text-primary mb-0 small">Chiffre d&apos;affaires global</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Total Purchase (Commandes) */}
        <div className="col-lg-3 col-12">
          <div className="card p-4 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-2">
            <div className="d-flex gap-3">
              <div className="icon-shape icon-md bg-success text-white rounded-2">
                <i className="ti ti-repeat fs-4"></i>
              </div>
              <div>
                <h2 className="mb-3 fs-6 text-dark">Total Commandes</h2>
                <h3 className="fw-bold mb-0 text-dark">
                  {stats?.ordersCount || 0}
                </h3>
                <p className="text-success mb-0 small">Volume total enregistré</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Total Expenses (Clients) */}
        <div className="col-lg-3 col-12">
          <div className="card p-4 bg-info bg-opacity-10 border border-info border-opacity-25 rounded-2">
            <div className="d-flex gap-3">
              <div className="icon-shape icon-md bg-info text-white rounded-2">
                <i className="ti ti-users fs-4"></i>
              </div>
              <div>
                <h2 className="mb-3 fs-6 text-dark">Clients Inscrits</h2>
                <h3 className="fw-bold mb-0 text-dark">
                  {stats?.customersCount || 0}
                </h3>
                <p className="text-info mb-0 small">Clients enregistrés</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Invoice Due (Commandes Actives) */}
        <div className="col-lg-3 col-12">
          <div className="card p-4 bg-warning bg-opacity-10 border border-warning border-opacity-25 rounded-2">
            <div className="d-flex gap-3">
              <div className="icon-shape icon-md bg-warning text-white rounded-2">
                <i className="ti ti-notes fs-4"></i>
              </div>
              <div>
                <h2 className="mb-3 fs-6 text-dark">Commandes Actives</h2>
                <h3 className="fw-bold mb-0 text-dark">
                  {stats?.pendingOrdersCount || 0}
                </h3>
                <p className="text-warning mb-0 small">En cours de traitement</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* THREE COLUMN DETAILS (Exact Template Row 2) */}
      <div className="row g-3 mb-3">
        {/* Detail 1: Total Profit (Ventes du mois) */}
        <div className="col-lg-4 col-12">
          <div className="card">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between border-bottom pb-5 mb-3">
                <div>
                  <h3 className="fw-bold h4 text-dark">
                    {(threeColumnDetails?.profitThisMonth || 0).toLocaleString("fr-FR")} FCFA
                  </h3>
                  <span className="text-secondary">Ventes ce mois</span>
                </div>
                <div>
                  <i className="ti ti-layers-subtract fs-1 text-primary"></i>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center small">
                <div className="text-muted">
                  Ventes du mois en cours
                </div>
                <div>
                  <Link href="/admin/commandes" className="link-primary text-decoration-underline">
                    Détails
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detail 2: Total Payment Returns (Livraison ce mois) */}
        <div className="col-lg-4 col-12">
          <div className="card">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between border-bottom pb-5 mb-3">
                <div>
                  <h3 className="fw-bold h4 text-dark">
                    {(threeColumnDetails?.shippingFeesThisMonth || 0).toLocaleString("fr-FR")} FCFA
                  </h3>
                  <span className="text-secondary">Frais de livraison perçus</span>
                </div>
                <div>
                  <i className="ti ti-credit-card fs-1 text-danger"></i>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center small">
                <div className="text-muted">
                  Frais de livraison (Mois en cours)
                </div>
                <div>
                  <Link href="/admin/livraisons" className="link-primary text-decoration-underline">
                    Zones
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detail 3: Total Expenses (Codes Promos appliqués) */}
        <div className="col-lg-4 col-12">
          <div className="card">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between border-bottom pb-5 mb-3">
                <div>
                  <h3 className="fw-bold h4 text-dark">
                    {(threeColumnDetails?.discountsThisMonth || 0).toLocaleString("fr-FR")} FCFA
                  </h3>
                  <span className="text-secondary">Réductions appliquées</span>
                </div>
                <div>
                  <i className="ti ti-cash-banknote fs-1 text-warning"></i>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center small">
                <div className="text-muted">
                  Remises codes promo (Ce mois)
                </div>
                <div>
                  <Link href="/admin/promocodes" className="link-primary text-decoration-underline">
                    Codes promo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION (Exact Template Row 3) */}
      <div className="row g-3 mb-3">
        {/* Sales vs Purchase Column Chart */}
        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center bg-transparent px-4 py-3">
              <h3 className="h5 mb-0 text-dark">Ventes mensuelles</h3>
              <div>
                <select
                  className="form-select form-select-sm"
                  value={salesInterval}
                  onChange={(e) => setSalesInterval(e.target.value as any)}
                >
                  <option value="ANNUELLE">Comparaison annuelle</option>
                  <option value="MENSUELLE">Comparaison mensuelle</option>
                  <option value="HEBDOMADAIRE">Comparaison hebdomadaire</option>
                </select>
              </div>
            </div>
            <div className="card-body p-4">
              {monthlyRevenue && (
                <AdminSalesPurchaseChart
                  thisYear={salesData.curr}
                  lastYear={salesData.prev}
                />
              )}
            </div>
          </div>
        </div>

        {/* Overall Information / Radial Donut Chart */}
        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center bg-transparent px-4 py-3">
              <h3 className="h5 mb-0 text-dark">Aperçu global</h3>
              <div>
                <select
                  className="form-select form-select-sm"
                  value={customerInterval}
                  onChange={(e) => setCustomerInterval(e.target.value as any)}
                >
                  <option value="GLOBAL">Tous les clients</option>
                  <option value="YEAR">Cette année</option>
                  <option value="MONTH">Ce mois</option>
                </select>
              </div>
            </div>
            <div className="card-body p-4">
              <h3 className="h6 text-dark mb-4">Répartition des clients</h3>
              <div className="row align-items-center">
                <div className="col-sm-6">
                  {customerOverview && (
                    <AdminCustomerChart
                      firstTimeCount={firstTimeCount}
                      returningCount={returningCount}
                    />
                  )}
                </div>
                <div className="col-sm-6">
                  <div className="row">
                    <div className="col-6 border-end">
                      <div className="text-center">
                        <h2 className="mb-1 text-dark fw-bold">{firstTimeCount}</h2>
                        <p className="text-success mb-2 small" style={{ fontSize: "11px" }}>Nouveaux</p>
                        <span className="badge bg-success" style={{ fontSize: "10px" }}>
                          <i className="ti ti-arrow-up-left me-1"></i>{firstTimePercent}%
                        </span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center">
                        <h2 className="mb-1 text-dark fw-bold">{returningCount}</h2>
                        <p className="text-warning mb-2 small" style={{ fontSize: "11px" }}>Fidèles</p>
                        <span className="badge bg-success" style={{ fontSize: "10px" }}>
                          <i className="ti ti-arrow-up-left me-1"></i>{returningPercent}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom indicators */}
              <div className="row text-center border-top mt-4 pt-4">
                <div className="col-4 border-end">
                  <h3 className="fw-bold mb-2 text-dark fs-5">{customerOverview?.suppliersCount || 0}</h3>
                  <small className="text-secondary" style={{ fontSize: "11px" }}>Produits</small>
                </div>
                <div className="col-4 border-end">
                  <h3 className="fw-bold mb-2 text-dark fs-5">{stats?.customersCount || 0}</h3>
                  <small className="text-secondary" style={{ fontSize: "11px" }}>Clients</small>
                </div>
                <div className="col-4">
                  <h3 className="fw-bold mb-2 text-dark fs-5">{stats?.ordersCount || 0}</h3>
                  <small className="text-secondary" style={{ fontSize: "11px" }}>Commandes</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LISTS SECTION (Exact Template Row 4) */}
      <div className="row g-3">
        {/* Card 1: Top Selling Products */}
        <div className="col-lg-4 col-12">
          <div className="card h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center px-4 py-3">
              <h4 className="mb-0 h5 text-dark">Produits populaires</h4>
              <Link href="/admin/produits" className="text-xs text-primary font-bold text-decoration-none">
                Inventaire <i className="ti ti-chevron-right"></i>
              </Link>
            </div>

            <ul className="list-group list-group-flush">
              {popularProducts.length === 0 ? (
                <p className="text-muted text-center py-5">Aucun produit vendu pour le moment.</p>
              ) : (
                popularProducts.map((product) => {
                  let images: string[] = [];
                  try {
                    images =
                      typeof product.images === "string"
                        ? JSON.parse(product.images)
                        : (product.images as string[]);
                  } catch {
                    images = ["/assets/images/product-1.png"];
                  }

                  return (
                    <li key={product.id} className="list-group-item d-flex align-items-center gap-3">
                      <img
                        src={images[0] || "/assets/images/product-1.png"}
                        alt={product.name}
                        className="rounded"
                        width="48"
                        height="48"
                        style={{ objectFit: "cover" }}
                      />
                      <div className="flex-grow-1 min-w-0">
                        <p className="mb-1 text-dark text-truncate fw-medium">{product.name}</p>
                        <div className="d-flex align-items-center gap-2 text-muted">
                          <small className="fw-semibold text-secondary">
                            {product.price.toLocaleString("fr-FR")} FCFA
                          </small>
                          <small>•</small>
                          <small>{product.totalQty} vendus</small>
                        </div>
                      </div>
                      <span className="badge bg-primary-subtle text-primary border border-primary">
                        Top
                      </span>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </div>

        {/* Card 2: Low Stock Products */}
        <div className="col-lg-4 col-12">
          <div className="card h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center px-4 py-3">
              <h4 className="mb-0 h5 text-dark">Stocks faibles</h4>
              <Link href="/admin/produits" className="text-xs text-primary font-bold text-decoration-none">
                Voir tout
              </Link>
            </div>

            <ul className="list-group list-group-flush">
              {lowStockProducts.length === 0 ? (
                <p className="text-muted text-center py-5">Aucun produit en stock.</p>
              ) : (
                lowStockProducts.map((product) => {
                  let images: string[] = [];
                  try {
                    images =
                      typeof product.images === "string"
                        ? JSON.parse(product.images)
                        : (product.images as string[]);
                  } catch {
                    images = ["/assets/images/product-1.png"];
                  }

                  return (
                    <li key={product.id} className="list-group-item d-flex align-items-center gap-3">
                      <img
                        src={images[0] || "/assets/images/product-1.png"}
                        alt={product.name}
                        className="rounded"
                        width="48"
                        height="48"
                        style={{ objectFit: "cover" }}
                      />
                      <div className="flex-grow-1 min-w-0">
                        <p className="mb-1 text-dark text-truncate fw-medium">{product.name}</p>
                        <small className="text-secondary">ID: #{product.id}</small>
                      </div>
                      <div className="d-flex flex-column gap-0 align-items-center">
                        <span className={`fw-bold ${product.stock === 0 ? "text-danger" : "text-primary"}`}>
                          {product.stock.toString().padStart(2, "0")}
                        </span>
                        <small className="text-muted" style={{ fontSize: "10px" }}>En stock</small>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </div>

        {/* Card 3: Recent Sales (Commandes Récentes) */}
        <div className="col-lg-4 col-12">
          <div className="card h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center px-4 py-3">
              <h4 className="mb-0 h5 text-dark">Dernières commandes</h4>
              <Link href="/admin/commandes" className="text-xs text-primary font-bold text-decoration-none">
                Voir tout
              </Link>
            </div>

            <ul className="list-group list-group-flush">
              {recentOrders.length === 0 ? (
                <p className="text-muted text-center py-5">Aucune commande récente.</p>
              ) : (
                recentOrders.map((order) => (
                  <li key={order.id} className="list-group-item d-flex align-items-center gap-3">
                    <div className="flex-grow-1 min-w-0">
                      <p className="mb-1 text-dark text-truncate fw-medium">Commande {order.orderNumber}</p>
                      <div className="d-flex align-items-center gap-2 text-muted">
                        <small className="fw-semibold text-secondary">{order.clientName}</small>
                        <small>•</small>
                        <small>{order.totalAmount.toLocaleString("fr-FR")} FCFA</small>
                      </div>
                    </div>
                    <span
                      className={`badge ${getStatusColor(order.status)}`}
                      style={{ fontSize: "10px", padding: "4px 8px" }}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

