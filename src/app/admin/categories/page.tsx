"use client";

import React, { useState, useEffect } from 'react';
import { useAdminToast } from '@/app/admin/layout';

interface Category {
  id: number;
  name: string;
  slug: string;
  displayOrder: number;
  active: boolean;
}

export default function AdminCategoriesPage() {
  const { showToast } = useAdminToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');
  const [active, setActive] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        const cats = data.categories || [];
        setCategories(cats);
        applyFilters(searchQuery, cats);
      }
    } catch (e) {
      console.error(e);
      showToast("Erreur lors du chargement des catégories.", "error");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (query: string, list: Category[] = categories) => {
    if (query.trim() === "") {
      setFilteredCategories(list);
    } else {
      const q = query.toLowerCase();
      setFilteredCategories(list.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.slug.toLowerCase().includes(q)
      ));
    }
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query);
  };

  const handleSlugify = (text: string) => {
    setName(text);
    setSlug(text.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
    );
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDisplayOrder((categories.length + 1).toString());
    setActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setSlug(category.slug);
    setDisplayOrder(category.displayOrder.toString());
    setActive(category.active);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      id: editingCategory?.id,
      name,
      slug,
      displayOrder: parseInt(displayOrder, 10),
      active,
    };

    const method = editingCategory ? 'PUT' : 'POST';

    try {
      const res = await fetch('/api/admin/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        showToast(editingCategory ? "Catégorie modifiée avec succès." : "Catégorie créée avec succès.", "success");
        fetchCategories();
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

  const handleToggleActive = async (category: Category) => {
    const payload = {
      ...category,
      active: !category.active,
    };

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast("Statut de la catégorie mis à jour.", "success");
        fetchCategories();
      } else {
        showToast("Impossible de modifier le statut.", "error");
      }
    } catch (err) {
      showToast("Erreur réseau.", "error");
    }
  };

  const handleDelete = async (categoryId: number) => {
    if (!confirm("Voulez-vous vraiment désactiver cette catégorie ? Les produits correspondants resteront associés mais la catégorie sera invisible.")) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${categoryId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showToast("Catégorie désactivée avec succès.", "success");
        fetchCategories();
      } else {
        showToast("Erreur lors de la désactivation de la catégorie.", "error");
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

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / itemsPerPage));
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {/* HEADER ROW */}
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="fs-3 mb-1 text-dark">Gestion des Catégories</h1>
              <p className="mb-0 text-secondary">Organisez le catalogue public en rayons thématiques</p>
            </div>
            <div>
              <button onClick={openAddModal} className="btn btn-primary">
                <i className="ti ti-plus me-1"></i> Nouvelle Catégorie
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="row mb-3 justify-content-end">
        <div className="col-12 col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Rechercher par nom, slug..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ fontSize: "14px" }}
          />
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="row">
        <div className="col-12">
          <div className="card table-responsive">
            {filteredCategories.length === 0 ? (
              <p className="p-4 text-muted text-center mb-0">Aucune catégorie trouvée.</p>
            ) : (
              <table className="table mb-0 text-nowrap table-hover">
                <thead className="table-light border-light">
                  <tr>
                    <th className="text-dark">Nom</th>
                    <th className="text-dark">Slug (URL)</th>
                    <th className="text-dark">Statut</th>
                    <th className="text-dark text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="align-middle">
                  {paginatedCategories.map((category, index) => (
                    <tr key={category.id}>
                      <td className="fw-bold text-dark">{category.name}</td>
                      <td className="text-secondary">/{category.slug}</td>
                      <td>
                        <span
                          onClick={() => handleToggleActive(category)}
                          className={`badge cursor-pointer ${
                            category.active
                              ? 'status-success-badge'
                              : 'status-danger-badge'
                          }`}
                          style={{ fontSize: "11px", padding: "5px 10px" }}
                        >
                          {category.active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="text-center">
                        <span
                          onClick={() => openEditModal(category)}
                          className="text-primary me-3 cursor-pointer"
                        >
                          <i className="ti ti-edit fs-5"></i>
                        </span>
                        <span
                          onClick={() => handleDelete(category.id)}
                          className="link-danger cursor-pointer"
                        >
                          <i className="ti ti-trash fs-5"></i>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="border-bottom-0 text-secondary align-middle">
                      Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredCategories.length)} sur {filteredCategories.length} catégories
                    </td>
                    <td colSpan={3} className="border-bottom-0">
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

      {/* MODAL FORM */}
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
                  {editingCategory ? 'Modifier la Catégorie' : 'Ajouter une Catégorie'}
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
                    <label htmlFor="catName" className="form-label text-dark fw-medium">
                      Nom de la Catégorie *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="catName"
                      placeholder="Ex: Cadeaux personnalisés"
                      required
                      value={name}
                      onChange={(e) => handleSlugify(e.target.value)}
                    />
                  </div>

                  {/* Slug */}
                  <div className="mb-3">
                    <label htmlFor="catSlug" className="form-label text-dark fw-medium">
                      Slug Unique (URL) *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="catSlug"
                      placeholder="cadeaux-personnalises"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                    />
                  </div>

                  {/* Display Order */}
                  <div className="mb-3">
                    <label htmlFor="catOrder" className="form-label text-dark fw-medium">
                      Ordre d&apos;affichage *
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="catOrder"
                      placeholder="1"
                      required
                      value={displayOrder}
                      onChange={(e) => setDisplayOrder(e.target.value)}
                    />
                  </div>

                  {/* Active Checkbox */}
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="catActive"
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                    />
                    <label className="form-check-label text-secondary" htmlFor="catActive">
                      Rendre cette catégorie visible dans la boutique
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
                    {submitting ? (
                      <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                    ) : null}
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
