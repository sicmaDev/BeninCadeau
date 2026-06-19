"use client";

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useAdminToast } from '@/app/admin/layout';

interface ShippingZone {
  id: number;
  name: string;
  deliveryFee: number;
}

export default function AdminShippingZonesPage() {
  const { showToast } = useAdminToast();
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('');

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      const res = await fetch('/api/admin/shipping-zones');
      if (res.ok) {
        const data = await res.json();
        setZones(data.zones || []);
        setCurrentPage(1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingZone(null);
    setName('');
    setDeliveryFee('1500');
    setIsModalOpen(true);
  };

  const openEditModal = (zone: ShippingZone) => {
    setEditingZone(zone);
    setName(zone.name);
    setDeliveryFee(zone.deliveryFee.toString());
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      id: editingZone?.id,
      name,
      deliveryFee: parseInt(deliveryFee, 10),
    };

    const method = editingZone ? 'PUT' : 'POST';

    try {
      const res = await fetch('/api/admin/shipping-zones', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        showToast(editingZone ? "Zone modifiée avec succès." : "Zone créée avec succès.", "success");
        fetchZones();
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

  const handleDelete = async (zoneId: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette zone ?")) return;

    try {
      const res = await fetch(`/api/admin/shipping-zones?id=${zoneId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showToast("Zone supprimée avec succès.", "success");
        fetchZones();
      } else {
        const data = await res.json();
        showToast(data.error || "Erreur lors de la suppression.", "error");
      }
    } catch (err) {
      showToast("Erreur réseau.", "error");
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

  const totalPages = Math.ceil(zones.length / itemsPerPage);
  const paginatedZones = zones.slice(
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
              <h1 className="fs-3 mb-1 text-dark">Frais de Livraison</h1>
              <p className="mb-0 text-secondary">Configurer les zones de distribution et les frais associés pour Cotonou et environs</p>
            </div>
            <div>
              <button onClick={openAddModal} className="btn btn-primary">
                <i className="ti ti-plus me-1"></i> Nouvelle Zone
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="row">
        <div className="col-12">
          <div className="card table-responsive">
            {zones.length === 0 ? (
              <p className="p-4 text-muted text-center mb-0">Aucune zone de livraison configurée.</p>
            ) : (
              <table className="table mb-0 text-nowrap table-hover">
                <thead className="table-light border-light">
                  <tr>
                    <th className="text-dark">#</th>
                    <th className="text-dark">Zone / Quartier</th>
                    <th className="text-dark">Frais de livraison</th>
                    <th className="text-dark text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="align-middle">
                  {paginatedZones.map((zone, index) => (
                    <tr key={zone.id}>
                      <td className="text-secondary fw-semibold">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="fw-bold text-dark">
                        <i className="ti ti-truck text-primary me-2"></i>
                        {zone.name}
                      </td>
                      <td className="fw-bold text-dark">
                        {zone.deliveryFee.toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="text-center">
                        <span
                          onClick={() => openEditModal(zone)}
                          className="text-primary me-3 cursor-pointer"
                          title="Modifier"
                        >
                          <i className="ti ti-edit fs-5"></i>
                        </span>
                        <span
                          onClick={() => handleDelete(zone.id)}
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
                        Affichage de {paginatedZones.length} sur {zones.length} zones
                      </td>
                      <td colSpan={2} className="border-bottom-0">
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
                  {editingZone ? 'Modifier la Zone' : 'Ajouter une Zone'}
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
                  {/* Name */}
                  <div className="mb-3">
                    <label htmlFor="zoneName" className="form-label text-dark fw-medium">
                      Nom de la Zone / Ville / Quartier *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="zoneName"
                      placeholder="Ex: Cotonou (Fidjrossè)"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  {/* Delivery Fee */}
                  <div className="mb-3">
                    <label htmlFor="deliveryFee" className="form-label text-dark fw-medium">
                      Frais de livraison (FCFA) *
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="deliveryFee"
                      placeholder="1500"
                      required
                      value={deliveryFee}
                      onChange={(e) => setDeliveryFee(e.target.value)}
                    />
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
