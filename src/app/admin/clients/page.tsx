"use client";

import React, { useState, useEffect } from 'react';
import { useAdminToast } from '@/app/admin/layout';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  createdAt: string;
  _count: {
    orders: number;
  };
}

interface CustomerOrder {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  shippingZone: {
    name: string;
  };
}

export default function AdminCustomersPage() {
  const { showToast } = useAdminToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Detail Modal States
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [fetchingOrders, setFetchingOrders] = useState(false);

  // Edit Modal States
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/admin/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
        setCurrentPage(1);
      }
    } catch (e) {
      console.error(e);
      showToast("Erreur lors du chargement des clients.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleViewCustomerOrders = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setFetchingOrders(true);
    setCustomerOrders([]);

    try {
      const res = await fetch(`/api/admin/orders?userId=${customer.id}`);
      if (res.ok) {
        const data = await res.json();
        setCustomerOrders(data.orders || []);
      }
    } catch (err) {
      console.error(err);
      showToast("Impossible de récupérer l'historique des commandes.", "error");
    } finally {
      setFetchingOrders(false);
    }
  };

  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setEditName(customer.name);
    setEditEmail(customer.email);
    setEditPhone(customer.phone || '');
    setEditAddress(customer.address || '');
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/customers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCustomer.id,
          name: editName,
          email: editEmail,
          phone: editPhone || null,
          address: editAddress || null,
        }),
      });

      if (res.ok) {
        setIsEditModalOpen(false);
        showToast("Informations du client mises à jour.", "success");
        fetchCustomers();
      } else {
        const data = await res.json();
        showToast(data.error || "Erreur lors de la modification.", "error");
      }
    } catch (err) {
      showToast("Erreur réseau.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCustomer = async (customer: Customer) => {
    if (!confirm(`Voulez-vous vraiment supprimer définitivement le client "${customer.name}" ? Ses commandes associées seront désassociées de son profil.`)) return;

    try {
      const res = await fetch(`/api/admin/customers?id=${customer.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showToast("Compte client supprimé avec succès.", "success");
        fetchCustomers();
      } else {
        const data = await res.json();
        showToast(data.error || "Erreur lors de la suppression.", "error");
      }
    } catch (err) {
      showToast("Erreur réseau.", "error");
    }
  };

  const getStatusBadgeClass = (status: string) => {
    const statusClasses: Record<string, string> = {
      EN_ATTENTE:     'status-warning-badge',
      PAYEE:          'status-success-badge',
      EN_PREPARATION: 'status-primary-badge',
      EXPEDIEE:       'status-info-badge',
      LIVREE:         'status-success-badge',
      ANNULEE:        'status-danger-badge',
    };
    return statusClasses[status] || 'status-primary-badge';
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

  const totalPages = Math.ceil(customers.length / itemsPerPage);
  const paginatedCustomers = customers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {/* Header */}
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="fs-3 mb-1 text-dark">Gestion des Clients</h1>
              <p className="mb-0 text-secondary">Consultez, modifiez et gérez les profils clients inscrits et leur volume de commandes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="row">
        <div className="col-12">
          <div className="card table-responsive">
            {customers.length === 0 ? (
              <p className="p-4 text-muted text-center mb-0">Aucun client inscrit pour le moment.</p>
            ) : (
              <table className="table mb-0 text-nowrap table-hover">
                <thead className="table-light border-light">
                  <tr>
                    <th className="text-dark">Client</th>
                    <th className="text-dark">Email</th>
                    <th className="text-dark">Téléphone</th>
                    <th className="text-dark">Adresse par défaut</th>
                    <th className="text-dark text-center">Commandes</th>
                    <th className="text-dark text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="align-middle">
                  {paginatedCustomers.map((c, index) => (
                    <tr key={c.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div
                            className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold me-2"
                            style={{ width: "32px", height: "32px", fontSize: "11px" }}
                          >
                            {c.name.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="fw-bold text-dark">{c.name}</span>
                        </div>
                      </td>
                      <td className="text-secondary">{c.email}</td>
                      <td className="fw-semibold text-dark">{c.phone || 'Non renseigné'}</td>
                      <td className="text-secondary max-w-xs truncate" title={c.address || ''}>
                        {c.address || 'Aucune adresse enregistrée'}
                      </td>
                      <td className="text-center">
                        <span
                          className="badge bg-primary bg-opacity-10 text-primary border border-primary"
                          style={{ fontSize: "11px", padding: "5px 10px" }}
                        >
                          <i className="ti ti-shopping-cart me-1"></i> {c._count.orders} commande{c._count.orders > 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => handleViewCustomerOrders(c)}
                          className="btn btn-outline-primary btn-sm px-2 rounded-2 me-2 fw-semibold"
                          style={{ fontSize: "12px" }}
                        >
                          <i className="ti ti-eye me-1"></i> Historique
                        </button>
                        <span
                          onClick={() => openEditModal(c)}
                          className="text-primary me-3 cursor-pointer"
                          title="Modifier"
                        >
                          <i className="ti ti-edit fs-5"></i>
                        </span>
                        <span
                          onClick={() => handleDeleteCustomer(c)}
                          className="link-danger cursor-pointer"
                          title="Supprimer"
                        >
                          <i className="ti ti-trash fs-5"></i>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {totalPages > 1 && (
                  <tfoot>
                    <tr>
                      <td className="border-bottom-0 text-secondary align-middle">
                        Affichage de {paginatedCustomers.length} sur {customers.length} clients
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
                            {[...Array(totalPages)].map((_, i) => (
                              <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
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
                )}
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Profil & Historique Modal */}
      {selectedCustomer && (
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
                <h5 className="modal-title text-dark fw-bold uppercase">
                  Profil & Historique : {selectedCustomer.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setSelectedCustomer(null)}
                ></button>
              </div>

              {/* Body */}
              <div className="modal-body text-dark" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                {/* Fiche Client Details */}
                <div className="card p-3 bg-light border-0 mb-4 rounded-3">
                  <h6 className="fw-bold text-dark uppercase mb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>
                    <i className="ti ti-user text-primary me-2 fs-5 align-middle"></i>
                    Fiche Coordonnées Client
                  </h6>
                  <div className="row g-3 small">
                    <div className="col-12 col-sm-6">
                      <span className="text-secondary d-block">Nom complet</span>
                      <strong className="text-dark">{selectedCustomer.name}</strong>
                    </div>
                    <div className="col-12 col-sm-6">
                      <span className="text-secondary d-block">Membre depuis le</span>
                      <strong className="text-dark">
                        {new Date(selectedCustomer.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </strong>
                    </div>
                    <div className="col-12 col-sm-6">
                      <span className="text-secondary d-block">E-mail</span>
                      <strong className="text-dark">{selectedCustomer.email}</strong>
                    </div>
                    <div className="col-12 col-sm-6">
                      <span className="text-secondary d-block">Téléphone</span>
                      <strong className="text-dark">{selectedCustomer.phone || 'Non renseigné'}</strong>
                    </div>
                    <div className="col-12">
                      <span className="text-secondary d-block">Adresse par défaut</span>
                      <strong className="text-dark">{selectedCustomer.address || 'Aucune adresse enregistrée'}</strong>
                    </div>
                  </div>
                </div>

                {/* Orders History List */}
                <div>
                  <h6 className="fw-bold text-dark uppercase mb-3" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>
                    <i className="ti ti-shopping-cart text-primary me-2 fs-5 align-middle"></i>
                    Historique de commandes
                  </h6>

                  {fetchingOrders ? (
                    <div className="text-center py-4">
                      <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                    </div>
                  ) : customerOrders.length === 0 ? (
                    <p className="text-muted small py-2">Ce client n&apos;a pas encore passé de commande.</p>
                  ) : (
                    <div className="list-group list-group-flush">
                      {customerOrders.map((order) => (
                        <div key={order.id} className="list-group-item d-flex justify-content-between align-items-center px-0 py-3 gap-3">
                          <div>
                            <strong className="text-primary d-block">{order.orderNumber}</strong>
                            <span className="text-secondary small d-block">
                              Le {new Date(order.createdAt).toLocaleDateString('fr-FR')} (Zone: {order.shippingZone.name})
                            </span>
                          </div>
                          <div className="d-flex align-items-center gap-3">
                            <span className="fw-bold text-dark">{order.totalAmount.toLocaleString('fr-FR')} FCFA</span>
                            <span className={`badge ${getStatusBadgeClass(order.status)}`} style={{ fontSize: "10px", padding: "5px 8px" }}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedCustomer(null)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modifier Client Modal */}
      {isEditModalOpen && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          role="dialog"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              {/* Header */}
              <div className="modal-header">
                <h5 className="modal-title text-dark fw-bold">
                  Modifier le Client
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setIsEditModalOpen(false)}
                ></button>
              </div>

              {/* Form */}
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body text-dark">
                  {/* Name */}
                  <div className="mb-3">
                    <label htmlFor="editCustName" className="form-label text-dark fw-medium">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="editCustName"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label htmlFor="editCustEmail" className="form-label text-dark fw-medium">
                      Adresse e-mail *
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="editCustEmail"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                    />
                  </div>

                  {/* Phone */}
                  <div className="mb-3">
                    <label htmlFor="editCustPhone" className="form-label text-dark fw-medium">
                      Téléphone
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="editCustPhone"
                      placeholder="Ex: +229 97 00 00 00"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                    />
                  </div>

                  {/* Address */}
                  <div className="mb-3">
                    <label htmlFor="editCustAddress" className="form-label text-dark fw-medium">
                      Adresse de livraison par défaut
                    </label>
                    <textarea
                      className="form-control"
                      id="editCustAddress"
                      rows={2}
                      placeholder="Ex: Quartier Fidjrossè, Cotonou"
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting && <span className="spinner-border spinner-border-sm me-1" role="status"></span>}
                    Sauvegarder
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
