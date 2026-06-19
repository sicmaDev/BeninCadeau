"use client";

import React, { useState, useEffect } from 'react';
import { useAdminToast } from '@/app/admin/layout';

interface OrderItem {
  id: number;
  productId: number;
  product: {
    name: string;
    images: string;
  };
  quantity: number;
  price: number;
  customizationMessage: string | null;
}

interface Order {
  id: number;
  orderNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  shippingAddress: string;
  status: string;
  totalAmount: number;
  shippingFee: number;
  shippingZone: {
    name: string;
  };
  promoCode: {
    code: string;
    discountType: string;
    discountValue: number;
  } | null;
  orderItems: OrderItem[];
  createdAt: string;
}

export default function AdminOrdersPage() {
  const { showToast } = useAdminToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setFilteredOrders(data.orders || []);
      }
    } catch (e) {
      console.error('Failed to fetch orders', e);
      showToast("Impossible de charger les commandes.", "error");
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1); // reset page
    if (status === 'ALL') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(o => o.status === status));
    }
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });

      if (res.ok) {
        const updatedOrders = orders.map((o) => {
          if (o.id === orderId) {
            const updated = { ...o, status: newStatus };
            if (selectedOrder?.id === orderId) {
              setSelectedOrder(updated);
            }
            return updated;
          }
          return o;
        });

        setOrders(updatedOrders);
        if (selectedStatus === 'ALL') {
          setFilteredOrders(updatedOrders);
        } else {
          setFilteredOrders(updatedOrders.filter(o => o.status === selectedStatus));
        }
        showToast("Statut de la commande mis à jour.", "success");
      } else {
        showToast("Erreur lors de la mise à jour du statut.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Erreur réseau.", "error");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statuses: Record<string, { badgeClass: string, label: string }> = {
      EN_ATTENTE: { badgeClass: 'bg-warning bg-opacity-10 text-warning border border-warning', label: 'En attente' },
      PAYEE: { badgeClass: 'bg-success bg-opacity-10 text-success border border-success', label: 'Payée' },
      EN_PREPARATION: { badgeClass: 'bg-primary bg-opacity-10 text-primary border border-primary', label: 'En préparation' },
      EXPEDIEE: { badgeClass: 'bg-info bg-opacity-10 text-info border border-info', label: 'Expédiée' },
      LIVREE: { badgeClass: 'bg-success bg-opacity-10 text-success border border-success', label: 'Livrée' },
      ANNULEE: { badgeClass: 'bg-danger bg-opacity-10 text-danger border border-danger', label: 'Annulée' },
    };
    const current = statuses[status] || { badgeClass: 'bg-light text-secondary border', label: status };

    return (
      <span
        className={`badge uppercase tracking-wider ${current.badgeClass}`}
        style={{ fontSize: '10px', padding: '5px 10px' }}
      >
        {current.label}
      </span>
    );
  };

  const statusOptions = [
    { value: 'ALL', label: 'Toutes' },
    { value: 'EN_ATTENTE', label: 'En attente' },
    { value: 'PAYEE', label: 'Payées' },
    { value: 'EN_PREPARATION', label: 'En préparation' },
    { value: 'EXPEDIEE', label: 'Expédiées' },
    { value: 'LIVREE', label: 'Livrées' },
    { value: 'ANNULEE', label: 'Annulées' },
  ];

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center py-10" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      {/* HEADER ROW */}
      <div className="row">
        <div className="col-12">
          <div className="mb-4">
            <h1 className="fs-3 mb-1 text-dark">Gestion des Commandes</h1>
            <p className="mb-0 text-secondary">Gérez les statuts de commande, les livraisons et les cadeaux à préparer</p>
          </div>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="d-flex flex-wrap gap-2">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => filterOrders(opt.value)}
                className={`btn btn-sm ${
                  selectedStatus === opt.value ? 'btn-primary' : 'btn-outline-secondary'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="row">
        <div className="col-12">
          <div className="card table-responsive">
            {currentItems.length === 0 ? (
              <p className="p-4 text-muted text-center mb-0">Aucune commande trouvée correspondant à ce filtre.</p>
            ) : (
              <table className="table mb-0 text-nowrap table-hover">
                <thead className="table-light border-light">
                  <tr>
                    <th className="text-dark" style={{ width: "15%" }}>N° Commande</th>
                    <th className="text-dark" style={{ width: "15%" }}>Date</th>
                    <th className="text-dark" style={{ width: "30%" }}>Client</th>
                    <th className="text-dark" style={{ width: "15%" }}>Montant</th>
                    <th className="text-dark" style={{ width: "15%" }}>Statut</th>
                    <th className="text-dark text-center" style={{ width: "10%" }}>Action</th>
                  </tr>
                </thead>
                <tbody className="align-middle">
                  {currentItems.map((order, index) => (
                    <tr key={order.id}>
                      <td>
                        <span className="fw-bold text-primary">{order.orderNumber}</span>
                      </td>
                      <td className="text-secondary">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="text-dark fw-bold">{order.clientName}</td>
                      <td className="text-dark fw-bold">{order.totalAmount.toLocaleString('fr-FR')} FCFA</td>
                      <td>{getStatusBadge(order.status)}</td>
                      <td className="text-center">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="btn btn-outline-primary btn-xs"
                          style={{ padding: "4px 8px", fontSize: "12px" }}
                        >
                          <i className="ti ti-eye me-1"></i> Détails
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="border-bottom-0 text-secondary align-middle">
                      Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredOrders.length)} sur {filteredOrders.length} commandes
                    </td>
                    <td colSpan={5} className="border-bottom-0">
                      <nav aria-label="Page navigation" className="d-flex justify-content-end">
                        <ul className="pagination mb-0">
                          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              Précédent
                            </button>
                          </li>
                          {Array.from({ length: totalPages }, (_, i) => (
                            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                              <button
                                className="page-link"
                                onClick={() => setCurrentPage(i + 1)}
                              >
                                {i + 1}
                              </button>
                            </li>
                          ))}
                          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              Suivant
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* BOOTSTRAP MODAL DETAILS */}
      {selectedOrder && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          role="dialog"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              {/* Header */}
              <div className="modal-header">
                <h5 className="modal-title text-dark fw-bold">
                  Détail Commande #{selectedOrder.orderNumber}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setSelectedOrder(null)}
                ></button>
              </div>

              {/* Body */}
              <div className="modal-body text-dark">
                <div className="row g-3 mb-4">
                  {/* Client Info */}
                  <div className="col-md-6">
                    <div className="card p-3 bg-light border border-light">
                      <h6 className="fw-bold text-dark border-bottom pb-2 mb-2">
                        <i className="ti ti-user text-primary me-1"></i> Client & Contact
                      </h6>
                      <div className="lh-lg" style={{ fontSize: "13px" }}>
                        <div><strong>Nom :</strong> {selectedOrder.clientName}</div>
                        <div><strong>Téléphone :</strong> {selectedOrder.clientPhone}</div>
                        <div><strong>Email :</strong> {selectedOrder.clientEmail}</div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="col-md-6">
                    <div className="card p-3 bg-light border border-light">
                      <h6 className="fw-bold text-dark border-bottom pb-2 mb-2">
                        <i className="ti ti-map-pin text-primary me-1"></i> Livraison
                      </h6>
                      <div className="lh-lg" style={{ fontSize: "13px" }}>
                        <div><strong>Zone :</strong> {selectedOrder.shippingZone.name}</div>
                        <div><strong>Frais :</strong> {selectedOrder.shippingFee.toLocaleString('fr-FR')} FCFA</div>
                        <div className="mt-1">
                          <strong>Adresse :</strong>
                          <div className="p-2 bg-white border border-gray rounded mt-1 text-secondary leading-normal" style={{ fontSize: "12px" }}>
                            {selectedOrder.shippingAddress}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status selector */}
                <div className="card p-3 bg-light border border-light mb-4">
                  <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
                    <div>
                      <span className="text-secondary small d-block mb-1">Mettre à jour le Statut</span>
                      <div className="d-flex align-items-center">
                        <span className="small text-secondary me-2">Statut actuel : </span>
                        {getStatusBadge(selectedOrder.status)}
                      </div>
                    </div>
                    <div>
                      <select
                        disabled={updatingStatus}
                        value={selectedOrder.status}
                        onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                        className="form-select form-select-sm"
                        style={{ minWidth: "180px" }}
                      >
                        <option value="EN_ATTENTE">En attente</option>
                        <option value="PAYEE">Payée</option>
                        <option value="EN_PREPARATION">En préparation</option>
                        <option value="EXPEDIEE">Expédiée</option>
                        <option value="LIVREE">Livrée</option>
                        <option value="ANNULEE">Annulée</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Ordered Items */}
                <div className="mb-3">
                  <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">
                    <i className="ti ti-shopping-cart text-primary me-1"></i> Articles Commandés
                  </h6>
                  <div className="d-flex flex-column gap-2">
                    {selectedOrder.orderItems.map((item) => {
                      let images: string[] = [];
                      try {
                        images = typeof item.product.images === 'string'
                          ? JSON.parse(item.product.images)
                          : (item.product.images as unknown as string[]);
                      } catch {
                        images = ['/1-19.png'];
                      }

                      return (
                        <div
                          key={item.id}
                          className="d-flex justify-content-between align-items-center p-3 bg-light border border-light rounded-2 gap-3"
                        >
                          <div className="d-flex align-items-center">
                            <img
                              src={images[0] || '/1-19.png'}
                              alt=""
                              className="rounded"
                              style={{ width: "45px", height: "45px", objectFit: "cover" }}
                            />
                            <div className="ms-3">
                              <span className="fw-bold text-dark d-block" style={{ fontSize: "14px" }}>
                                {item.product.name}
                              </span>
                              <span className="text-secondary small">
                                {item.quantity} × {item.price.toLocaleString('fr-FR')} FCFA
                              </span>
                              {item.customizationMessage && (
                                <div
                                  className="mt-1 p-2 bg-primary bg-opacity-10 text-primary rounded border border-primary border-opacity-10"
                                  style={{ fontSize: "11px", fontWeight: "600" }}
                                >
                                  Personnalisation : &quot;{item.customizationMessage}&quot;
                                </div>
                              )}
                            </div>
                          </div>
                          <span className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Total Invoice */}
                <div className="border-top pt-3 space-y-1 text-end">
                  {selectedOrder.promoCode && (
                    <div className="text-success small">
                      Code promo ({selectedOrder.promoCode.code}) : -
                      {selectedOrder.promoCode.discountType === 'PERCENTAGE'
                        ? `${selectedOrder.promoCode.discountValue}%`
                        : `${selectedOrder.promoCode.discountValue} FCFA`}
                    </div>
                  )}
                  <div className="fw-bold text-dark fs-5">
                    Total Facturé :{" "}
                    <span className="text-primary">
                      {selectedOrder.totalAmount.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedOrder(null)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
