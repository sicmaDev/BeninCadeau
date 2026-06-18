"use client";

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useAdminToast } from '@/app/admin/layout';

interface PromoCode {
  id: number;
  code: string;
  discountType: 'FIXED' | 'PERCENTAGE';
  discountValue: number;
  active: boolean;
  expiresAt: string;
}

export default function AdminPromoCodesPage() {
  const { showToast } = useAdminToast();
  const [promocodes, setPromocodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('10');
  const [expiresAt, setExpiresAt] = useState('');
  const [active, setActive] = useState(true);

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      const res = await fetch('/api/admin/promocodes');
      if (res.ok) {
        const data = await res.json();
        setPromocodes(data.promocodes || []);
        setCurrentPage(1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingPromo(null);
    setCode('');
    setDiscountType('PERCENTAGE');
    setDiscountValue('10');
    // Set expiration to 30 days from now by default
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    setExpiresAt(defaultDate.toISOString().split('T')[0]);
    setActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (promo: PromoCode) => {
    setEditingPromo(promo);
    setCode(promo.code);
    setDiscountType(promo.discountType);
    setDiscountValue(promo.discountValue.toString());
    setExpiresAt(promo.expiresAt.split('T')[0]);
    setActive(promo.active);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      id: editingPromo?.id,
      code,
      discountType,
      discountValue: parseInt(discountValue, 10),
      expiresAt: new Date(expiresAt).toISOString(),
      active,
    };

    const method = editingPromo ? 'PUT' : 'POST';

    try {
      const res = await fetch('/api/admin/promocodes', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        showToast(editingPromo ? "Code promo modifié." : "Code promo créé.", "success");
        fetchPromoCodes();
      } else {
        const data = await res.json();
        showToast(data.error || 'Erreur lors de la sauvegarde.', 'error');
      }
    } catch (err) {
      showToast('Erreur réseau.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (promo: PromoCode) => {
    const payload = {
      ...promo,
      active: !promo.active,
    };

    try {
      const res = await fetch('/api/admin/promocodes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast("Statut mis à jour.", "success");
        fetchPromoCodes();
      } else {
        showToast("Impossible de modifier le statut.", "error");
      }
    } catch (err) {
      showToast("Erreur réseau.", "error");
    }
  };

  const handleDelete = async (promoId: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce code promo ?")) return;

    try {
      const res = await fetch(`/api/admin/promocodes?id=${promoId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showToast("Code promo supprimé.", "success");
        fetchPromoCodes();
      } else {
        const data = await res.json();
        showToast(data.error || "Erreur lors de la suppression.", "error");
      }
    } catch (err) {
      showToast("Erreur réseau.", "error");
    }
  };

  const isExpired = (expiryStr: string) => {
    return new Date(expiryStr) < new Date();
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

  const totalPages = Math.ceil(promocodes.length / itemsPerPage);
  const paginatedPromoCodes = promocodes.slice(
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
              <h1 className="fs-3 mb-1 text-dark">Codes Promo</h1>
              <p className="mb-0 text-secondary">Créer et activer des réductions en valeur fixe ou pourcentage</p>
            </div>
            <div>
              <button onClick={openAddModal} className="btn btn-primary">
                <i className="ti ti-plus me-1"></i> Nouveau Code Promo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="row">
        <div className="col-12">
          <div className="card table-responsive">
            {promocodes.length === 0 ? (
              <p className="p-4 text-muted text-center mb-0">Aucun code promo configuré.</p>
            ) : (
              <table className="table mb-0 text-nowrap table-hover">
                <thead className="table-light border-light">
                  <tr>
                    <th className="text-dark">Code</th>
                    <th className="text-dark">Type de réduction</th>
                    <th className="text-dark">Valeur de remise</th>
                    <th className="text-dark">Date d&apos;expiration</th>
                    <th className="text-dark">Statut</th>
                    <th className="text-dark text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="align-middle">
                  {paginatedPromoCodes.map((promo) => {
                    const expired = isExpired(promo.expiresAt);
                    return (
                      <tr key={promo.id}>
                        <td className="fw-bold text-primary">
                          <i className="ti ti-ticket text-[18px] me-2"></i>
                          {promo.code}
                        </td>
                        <td className="fw-semibold">
                          {promo.discountType === 'PERCENTAGE' ? (
                            <span className="text-info">
                              <i className="ti ti-percentage me-1"></i> Pourcentage
                            </span>
                          ) : (
                            <span className="text-success">
                              <i className="ti ti-cash me-1"></i> Valeur fixe (FCFA)
                            </span>
                          )}
                        </td>
                        <td className="fw-bold text-dark">
                          {promo.discountType === 'PERCENTAGE'
                            ? `${promo.discountValue}%`
                            : `${promo.discountValue.toLocaleString('fr-FR')} FCFA`}
                        </td>
                        <td className="text-secondary align-middle">
                          <span className="d-flex align-items-center gap-1">
                            <i className="ti ti-calendar me-1"></i>
                            {new Date(promo.expiresAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                            {expired && (
                              <span className="badge bg-danger bg-opacity-10 text-danger border border-danger ms-2" style={{ fontSize: "10px" }}>Expiré</span>
                            )}
                          </span>
                        </td>
                        <td>
                          <button
                            disabled={expired}
                            onClick={() => handleToggleActive(promo)}
                            className={`badge border cursor-pointer ${
                              expired
                                ? 'bg-light text-secondary border-light cursor-not-allowed'
                                : promo.active
                                  ? 'bg-success bg-opacity-10 text-success border border-success'
                                  : 'bg-danger bg-opacity-10 text-danger border border-danger'
                            }`}
                            style={{ fontSize: "11px", padding: "5px 10px", backgroundColor: "transparent" }}
                          >
                            {expired ? 'Expiré' : promo.active ? 'Actif' : 'Inactif'}
                          </button>
                        </td>
                        <td className="text-center">
                          <span
                            onClick={() => openEditModal(promo)}
                            className="text-primary me-3 cursor-pointer"
                            title="Modifier"
                          >
                            <i className="ti ti-edit fs-5"></i>
                          </span>
                          <span
                            onClick={() => handleDelete(promo.id)}
                            className="link-danger cursor-pointer"
                            title="Supprimer"
                          >
                            <i className="ti ti-trash fs-5"></i>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {totalPages > 1 && (
                  <tfoot>
                    <tr>
                      <td className="border-bottom-0 text-secondary align-middle">
                        Affichage de {paginatedPromoCodes.length} sur {promocodes.length} codes promo
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

      {/* Modal */}
      {isModalOpen && (
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
                  {editingPromo ? 'Modifier le Code Promo' : 'Ajouter un Code Promo'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="modal-body text-dark">
                  {/* Code */}
                  <div className="mb-3">
                    <label htmlFor="promoCode" className="form-label text-dark fw-medium">
                      Code promotionnel * (En majuscules)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="promoCode"
                      placeholder="Ex: CAD229"
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                    />
                  </div>

                  {/* Discount Type */}
                  <div className="mb-3">
                    <label htmlFor="discountType" className="form-label text-dark fw-medium">
                      Type de réduction *
                    </label>
                    <select
                      className="form-select"
                      id="discountType"
                      required
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value)}
                    >
                      <option value="PERCENTAGE">Pourcentage (%)</option>
                      <option value="FIXED">Valeur fixe (FCFA)</option>
                    </select>
                  </div>

                  {/* Discount Value */}
                  <div className="mb-3">
                    <label htmlFor="discountValue" className="form-label text-dark fw-medium">
                      Valeur de la réduction *
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="discountValue"
                      placeholder="Ex: 10 pour 10%"
                      required
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                    />
                  </div>

                  {/* Expiry Date */}
                  <div className="mb-3">
                    <label htmlFor="expiresAt" className="form-label text-dark fw-medium">
                      Date d&apos;expiration *
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="expiresAt"
                      required
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                    />
                  </div>

                  {/* Active */}
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="promoActive"
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                    />
                    <label className="form-check-label text-secondary" htmlFor="promoActive">
                      Activer immédiatement ce code promo
                    </label>
                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsModalOpen(false)}
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
