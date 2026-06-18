"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Loader2 } from 'lucide-react';
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

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSlugify = (text: string) => {
    setName(text);
    setSlug(text.toLowerCase()
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
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-bc-yellow border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-instrument">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-montserrat tracking-tight">Gestion des Catégories</h1>
          <p className="text-gray-400 text-xs mt-1">Organiser le catalogue en rayons et ordonner l&apos;affichage</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-bc-yellow hover:bg-yellow-400 text-bc-purple font-bold text-sm shadow-sm cursor-pointer"
        >
          <Plus size={18} /> Nouvelle Catégorie
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-[#191E3A] border border-[#1B2E4B] rounded-3xl overflow-hidden shadow-sm max-w-4xl">
        {categories.length === 0 ? (
          <p className="p-8 text-gray-500 text-sm text-center">Aucune catégorie enregistrée.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#1B2E4B] text-gray-400 bg-[#141a35]">
                  <th className="py-4 px-6 font-semibold">Ordre d&apos;affichage</th>
                  <th className="py-4 px-6 font-semibold">Nom</th>
                  <th className="py-4 px-6 font-semibold">Slug (URL)</th>
                  <th className="py-4 px-6 font-semibold">Statut</th>
                  <th className="py-4 px-6 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2E4B] text-gray-300">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-[#1B2E4B]/20">
                    <td className="py-4 px-6 font-bold text-bc-yellow">{category.displayOrder}</td>
                    <td className="py-4 px-6 font-semibold">{category.name}</td>
                    <td className="py-4 px-6 text-gray-400">/{category.slug}</td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleActive(category)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border cursor-pointer uppercase ${
                          category.active
                            ? 'bg-green-950/40 text-green-400 border-green-800/40'
                            : 'bg-red-950/40 text-red-400 border-red-800/40'
                        }`}
                      >
                        {category.active ? 'Actif' : 'Inactif'}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-center space-x-2">
                      <button
                        onClick={() => openEditModal(category)}
                        className="p-2 bg-[#1b2e4b] hover:bg-[#253b5e] text-bc-yellow rounded-xl transition-all cursor-pointer inline-flex items-center"
                        title="Modifier"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-2 bg-[#2d1b28] hover:bg-red-900/30 text-red-400 rounded-xl transition-all cursor-pointer inline-flex items-center"
                        title="Supprimer (Désactiver)"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
          <div className="relative w-full max-w-md bg-[#191E3A] rounded-[28px] border border-[#1B2E4B] overflow-hidden flex flex-col">
            
            <div className="h-16 border-b border-[#1B2E4B] flex items-center justify-between px-6 bg-[#141a35]">
              <span className="font-montserrat font-extrabold text-white text-base">
                {editingCategory ? 'Modifier la Catégorie' : 'Ajouter une Catégorie'}
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-semibold text-gray-300">
              
              {/* Name */}
              <div>
                <label className="block text-gray-400 mb-1.5">Nom de la Catégorie *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleSlugify(e.target.value)}
                  placeholder="Cadeaux corporatifs"
                  className="w-full bg-[#11172a] border border-[#232e41] rounded-xl py-2.5 px-3 text-white focus:outline-none focus:ring-bc-yellow"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-gray-400 mb-1.5">Slug unique (URL) *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="cadeaux-corporatifs"
                  className="w-full bg-[#11172a] border border-[#232e41] rounded-xl py-2.5 px-3 text-white focus:outline-none focus:ring-bc-yellow"
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-gray-400 mb-1.5">Ordre d&apos;affichage *</label>
                <input
                  type="number"
                  required
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  placeholder="1"
                  className="w-full bg-[#11172a] border border-[#232e41] rounded-xl py-2.5 px-3 text-white focus:outline-none"
                />
              </div>

              {/* Active */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="accent-bc-yellow w-4 h-4"
                  />
                  <span className="text-white">Rendre cette catégorie Active</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#1B2E4B] mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#1b2e4b] hover:bg-[#253b5e] text-white cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bc-yellow hover:bg-yellow-400 text-bc-purple font-bold cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Sauvegarder
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
