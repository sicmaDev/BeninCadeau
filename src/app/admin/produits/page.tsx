"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Search, X, Loader2 } from 'lucide-react';
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('24h à 48h');
  const [imagesInput, setImagesInput] = useState(''); // Comma separated list of URLs
  const [isCustomizable, setIsCustomizable] = useState(false);
  const [customFieldPlaceholder, setCustomFieldPlaceholder] = useState('');
  const [active, setActive] = useState(true);
  const [categoryId, setCategoryId] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setImagesInput(prev => prev ? `${prev}, ${data.url}` : data.url);
        showToast('Image transférée avec succès.', 'success');
      } else {
        showToast(data.error || 'Erreur lors du transfert.', 'error');
      }
    } catch (err) {
      showToast('Erreur réseau.', 'error');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const fetchProductsAndCategories = async () => {
    try {
      const [resProducts, resCategories] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/categories'),
      ]);

      if (resProducts.ok) {
        const prodData = await resProducts.json();
        setProducts(prodData.products || []);
        setFilteredProducts(prodData.products || []);
      }
      if (resCategories.ok) {
        const catData = await resCategories.json();
        setCategories(catData.categories || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setSlug('');
    setDescription('');
    setPrice('');
    setStock('10');
    setEstimatedDelivery('24h à 48h');
    setImagesInput('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800');
    setIsCustomizable(false);
    setCustomFieldPlaceholder('Texte à inscrire');
    setActive(true);
    setCategoryId(categories[0]?.id.toString() || '');
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    let urls: string[] = [];
    try {
      urls = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
    } catch {
      urls = [product.images as unknown as string];
    }

    setEditingProduct(product);
    setName(product.name);
    setSlug(product.slug);
    setDescription(product.description);
    setPrice(product.price.toString());
    setStock(product.stock.toString());
    setEstimatedDelivery(product.estimatedDelivery);
    setImagesInput(urls.join(', '));
    setIsCustomizable(product.isCustomizable);
    setCustomFieldPlaceholder(product.customFieldPlaceholder || '');
    setActive(product.active);
    setCategoryId(product.categoryId.toString());
    setIsModalOpen(true);
  };

  const handleSlugify = (text: string) => {
    setName(text);
    setSlug(text.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const urlsArray = imagesInput.split(',').map(u => u.trim()).filter(Boolean);

    const payload = {
      id: editingProduct?.id,
      name,
      slug,
      description,
      price: parseInt(price, 10),
      stock: parseInt(stock, 10),
      estimatedDelivery,
      images: urlsArray,
      isCustomizable,
      customFieldPlaceholder: isCustomizable ? customFieldPlaceholder : null,
      active,
      categoryId: parseInt(categoryId, 10),
    };

    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const res = await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        showToast(editingProduct ? 'Produit modifié avec succès.' : 'Produit créé avec succès.', 'success');
        fetchProductsAndCategories();
      } else {
        const data = await res.json();
        showToast(data.error || 'Une erreur est survenue.', 'error');
      }
    } catch (err) {
      showToast('Erreur réseau.', 'error');
    } finally {
      setSubmitting(false);
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
        fetchProductsAndCategories();
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
        fetchProductsAndCategories();
      } else {
        showToast("Erreur lors de la désactivation du produit.", "error");
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-montserrat tracking-tight">Gestion des Produits</h1>
          <p className="text-gray-400 text-xs mt-1">Ajouter, modifier ou retirer des cadeaux et packs du catalogue</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-bc-yellow hover:bg-yellow-400 text-bc-purple font-bold text-sm shadow-sm cursor-pointer"
        >
          <Plus size={18} /> Nouveau Produit
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-[#191E3A] border border-[#1B2E4B] rounded-2xl p-4 flex items-center max-w-md">
        <Search className="text-gray-500 mr-2 flex-shrink-0" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Rechercher par nom, catégorie, etc..."
          className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm font-medium"
        />
      </div>

      {/* Table Container */}
      <div className="bg-[#191E3A] border border-[#1B2E4B] rounded-3xl overflow-hidden shadow-sm">
        {filteredProducts.length === 0 ? (
          <p className="p-8 text-gray-500 text-sm text-center">Aucun produit trouvé dans la base de données.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#1B2E4B] text-gray-400 bg-[#141a35]">
                  <th className="py-4 px-6 font-semibold">Image</th>
                  <th className="py-4 px-6 font-semibold">Nom</th>
                  <th className="py-4 px-6 font-semibold">Catégorie</th>
                  <th className="py-4 px-6 font-semibold">Prix</th>
                  <th className="py-4 px-6 font-semibold">Stock</th>
                  <th className="py-4 px-6 font-semibold">Statut</th>
                  <th className="py-4 px-6 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2E4B] text-gray-300">
                {filteredProducts.map((product) => {
                  let images: string[] = [];
                  try {
                    images = typeof product.images === 'string'
                      ? JSON.parse(product.images)
                      : (product.images as unknown as string[]);
                  } catch {
                    images = ['/1-19.png'];
                  }

                  return (
                    <tr key={product.id} className="hover:bg-[#1B2E4B]/20">
                      <td className="py-3 px-6">
                        <div className="w-10 h-10 rounded-lg bg-gray-950 overflow-hidden border">
                          <img src={images[0] || '/1-19.png'} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="py-3 px-6 font-bold">{product.name}</td>
                      <td className="py-3 px-6 text-gray-400">{product.category.name}</td>
                      <td className="py-3 px-6 font-bold text-white">{product.price.toLocaleString('fr-FR')} FCFA</td>
                      <td className="py-3 px-6 font-semibold">{product.stock} u</td>
                      <td className="py-3 px-6">
                        <button
                          onClick={() => handleToggleActive(product)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border cursor-pointer uppercase ${
                            product.active
                              ? 'bg-green-950/40 text-green-400 border-green-800/40'
                              : 'bg-red-950/40 text-red-400 border-red-800/40'
                          }`}
                        >
                          {product.active ? 'Actif' : 'Inactif'}
                        </button>
                      </td>
                      <td className="py-3 px-6 text-center space-x-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 bg-[#1b2e4b] hover:bg-[#253b5e] text-bc-yellow rounded-xl transition-all cursor-pointer inline-flex items-center"
                          title="Modifier"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 bg-[#2d1b28] hover:bg-red-900/30 text-red-400 rounded-xl transition-all cursor-pointer inline-flex items-center"
                          title="Supprimer (Désactiver)"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
          <div className="relative w-full max-w-2xl bg-[#191E3A] rounded-[28px] border border-[#1B2E4B] overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="h-16 border-b border-[#1B2E4B] flex items-center justify-between px-6 bg-[#141a35]">
              <span className="font-montserrat font-extrabold text-white text-base">
                {editingProduct ? 'Modifier le Produit' : 'Ajouter un Produit'}
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-4 text-xs font-semibold text-gray-300">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-gray-400 mb-1.5">Nom du Produit *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleSlugify(e.target.value)}
                    placeholder="Mug magique"
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
                    placeholder="mug-magique"
                    className="w-full bg-[#11172a] border border-[#232e41] rounded-xl py-2.5 px-3 text-white focus:outline-none focus:ring-bc-yellow"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-gray-400 mb-1.5">Catégorie *</label>
                  <div className="relative">
                    <select
                      required
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full appearance-none bg-[#11172a] border border-[#232e41] rounded-xl py-2.5 px-3 text-white focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-gray-400 mb-1.5">Prix (FCFA) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="5000"
                    className="w-full bg-[#11172a] border border-[#232e41] rounded-xl py-2.5 px-3 text-white focus:outline-none"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-gray-400 mb-1.5">Stock disponible *</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="10"
                    className="w-full bg-[#11172a] border border-[#232e41] rounded-xl py-2.5 px-3 text-white focus:outline-none"
                  />
                </div>

                {/* Estimated Delivery */}
                <div>
                  <label className="block text-gray-400 mb-1.5">Délai estimé de livraison *</label>
                  <input
                    type="text"
                    required
                    value={estimatedDelivery}
                    onChange={(e) => setEstimatedDelivery(e.target.value)}
                    placeholder="24h à 48h"
                    className="w-full bg-[#11172a] border border-[#232e41] rounded-xl py-2.5 px-3 text-white focus:outline-none"
                  />
                </div>

                {/* Images commas */}
                <div className="sm:col-span-2">
                  <label className="block text-gray-400 mb-1.5">URLs des images (séparées par une virgule ou téléversées)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={imagesInput}
                      onChange={(e) => setImagesInput(e.target.value)}
                      placeholder="http://img1.jpg, http://img2.jpg"
                      className="flex-1 bg-[#11172a] border border-[#232e41] rounded-xl py-2.5 px-3 text-white focus:outline-none"
                    />
                    <label className="px-4 py-2.5 rounded-xl bg-[#1b2e4b] hover:bg-[#253b5e] text-bc-yellow font-bold cursor-pointer text-xs flex items-center justify-center whitespace-nowrap">
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Téléverser'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-gray-400 mb-1.5">Description complète</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ajoutez les détails techniques, composants du pack, etc..."
                    className="w-full bg-[#11172a] border border-[#232e41] rounded-xl py-2.5 px-3 text-white focus:outline-none resize-none"
                  />
                </div>

                {/* Custom Checkbox */}
                <div className="sm:col-span-2 bg-[#1b203f] p-4 rounded-2xl border border-[#232a5c] space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isCustomizable}
                      onChange={(e) => setIsCustomizable(e.target.checked)}
                      className="accent-bc-yellow w-4 h-4"
                    />
                    <span className="text-white font-bold text-sm">Produit personnalisable par le client</span>
                  </label>

                  {isCustomizable && (
                    <div className="space-y-1">
                      <label className="block text-gray-400">Placeholder du champ texte de personnalisation</label>
                      <input
                        type="text"
                        value={customFieldPlaceholder}
                        onChange={(e) => setCustomFieldPlaceholder(e.target.value)}
                        placeholder="Ex: Prénom à graver"
                        className="w-full bg-[#11172a] border border-[#232e41] rounded-xl py-2 px-3 text-white focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Active Checkbox */}
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                      className="accent-bc-yellow w-4 h-4"
                    />
                    <span className="text-white">Marquer ce produit comme Actif (visible dans le catalogue)</span>
                  </label>
                </div>
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
