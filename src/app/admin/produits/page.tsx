"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdminToast } from '@/app/admin/layout';

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  estimatedDelivery: string;
  images: string; // JSON string
  isCustomizable: boolean;
  customFieldPlaceholder: string | null;
  active: boolean;
  categoryId: number;
  category: Category;
}

export default function AdminProductsPage() {
  const { showToast } = useAdminToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const prodData = await res.json();
        setProducts(prodData.products || []);
        setFilteredProducts(prodData.products || []);
      }
    } catch (e) {
      console.error(e);
      showToast('Erreur lors de la récupération des produits.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page
    if (!query.trim()) {
      setFilteredProducts(products);
    } else {
      const q = query.toLowerCase();
      setFilteredProducts(products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) || 
        p.category.name.toLowerCase().includes(q)
      ));
    }
  };

  const handleToggleActive = async (product: Product) => {
    const payload = {
      ...product,
      images: typeof product.images === 'string' ? JSON.parse(product.images) : product.images,
      active: !product.active,
    };

    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast("Statut du produit mis à jour.", "success");
        fetchProducts();
      } else {
        showToast("Impossible de modifier le statut du produit.", "error");
      }
    } catch (err) {
      showToast("Erreur réseau.", "error");
    }
  };

  const handleDelete = async (productId: number) => {
    if (!confirm("Voulez-vous vraiment désactiver ce produit ?")) return;

    try {
      const res = await fetch(`/api/admin/products?id=${productId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showToast("Produit désactivé avec succès.", "success");
        fetchProducts();
      } else {
        showToast("Erreur lors de la désactivation du produit.", "error");
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

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      {/* HEADER ROW */}
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="fs-3 mb-1 text-dark">Inventaire</h1>
              <p className="mb-0 text-secondary">Gérez les cadeaux et packs du catalogue Bénin Cadeau</p>
            </div>
            <div>
              <Link href="/admin/produits/create" className="btn btn-primary">
                <i className="ti ti-plus me-1"></i> Nouveau Produit
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="row">
        <div className="col-12">
          <div className="d-flex mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher produits..."
              style={{ maxWidth: "250px" }}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* TABLE CONTAINER */}
          <div className="card table-responsive">
            {currentItems.length === 0 ? (
              <p className="p-4 text-muted text-center mb-0">Aucun produit trouvé dans le catalogue.</p>
            ) : (
              <table className="table mb-0 text-nowrap table-hover">
                <thead className="table-light border-light">
                  <tr>
                    <th className="text-dark">Nom du Produit</th>
                    <th className="text-dark">Code</th>
                    <th className="text-dark">Catégorie</th>
                    <th className="text-dark">Prix</th>
                    <th className="text-dark">Stock</th>
                    <th className="text-dark">Statut</th>
                    <th className="text-dark text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((product, index) => {
                    let images: string[] = [];
                    try {
                      images = typeof product.images === 'string'
                        ? JSON.parse(product.images)
                        : (product.images as unknown as string[]);
                    } catch {
                      images = ['/1-19.png'];
                    }

                    return (
                      <tr key={product.id} className="align-middle">
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={images[0] || '/1-19.png'}
                              alt=""
                              className="rounded"
                              style={{ width: "40px", height: "40px", objectFit: "cover" }}
                            />
                            <span className="ms-3 text-dark fw-bold">{product.name}</span>
                          </div>
                        </td>
                        <td className="text-secondary">#PR-{product.slug.substring(0, 3).toUpperCase()}-{product.id + 100}</td>
                        <td className="text-secondary">{product.category.name}</td>
                        <td className="text-dark fw-semibold">
                          {product.price.toLocaleString('fr-FR')} FCFA
                        </td>
                        <td className="text-secondary">{product.stock} unités</td>
                        <td>
                          <span
                            onClick={() => handleToggleActive(product)}
                            className={`badge cursor-pointer ${
                              product.active
                                ? 'status-success-badge'
                                : 'status-danger-badge'
                            }`}
                            style={{ fontSize: "11px", padding: "5px 10px" }}
                          >
                            {product.active ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="text-center">
                          <Link href={`/admin/produits/create?id=${product.id}`} className="text-decoration-none me-3">
                            <i className="ti ti-edit fs-5"></i>
                          </Link>
                          <span
                            onClick={() => handleDelete(product.id)}
                            className="link-danger text-decoration-none cursor-pointer"
                          >
                            <i className="ti ti-trash fs-5"></i>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="border-bottom-0 text-secondary align-middle">
                      Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredProducts.length)} sur {filteredProducts.length} produits
                    </td>
                    <td colSpan={6} className="border-bottom-0">
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
    </>
  );
}
