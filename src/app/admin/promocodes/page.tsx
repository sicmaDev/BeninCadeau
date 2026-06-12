"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Loader2, Tag, Calendar, Percent } from 'lucide-react';

interface PromoCode {
  id: number;
  code: string;
  discountType: 'FIXED' | 'PERCENTAGE';
  discountValue: number;
  active: boolean;
  expiresAt: string;
}

export default function AdminPromoCodesPage() {
  const [promocodes, setPromocodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);

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
        fetchPromoCodes();
      } else {
        const data = await res.json();
        alert(data.error || 'Erreur lors de la sauvegarde.');
      }
    } catch (err) {
      alert('Erreur réseau.');
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
        fetchPromoCodes();
      } else {
        alert("Impossible de modifier le statut.");
      }
    } catch (err) {
      alert("Erreur réseau.");
    }
  };

  const handleDelete = async (promoId: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce code promo ?")) return;

    try {
      const res = await fetch(`/api/admin/promocodes?id=${promoId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchPromoCodes();
      } else {
        const data = await res.json();
        alert(data.error || "Erreur lors de la suppression.");
      }
    } catch (err) {
      alert("Erreur réseau.");
    }
  };

  const isExpired = (expiryStr: string) => {
    return new Date(expiryStr) < new Date();
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-montserrat tracking-tight">Codes Promo</h1>
          <p className="text-gray-400 text-xs mt-1">Créer et activer des réductions en valeur fixe ou pourcentage</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-bc-yellow hover:bg-yellow-400 text-bc-purple font-bold text-sm shadow-sm cursor-pointer"
        >
          <Plus size={18} /> Nouveau Code Promo
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-[#191E3A] border border-[#1B2E4B] rounded-3xl overflow-hidden shadow-sm">
        {promocodes.length === 0 ? (
          <p className="p-8 text-gray-500 text-sm text-center">Aucun code promo configuré.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#1B2E4B] text-gray-400 bg-[#141a35]">
                  <th className="py-4 px-6 font-semibold">Code</th>
                  <th className="py-4 px-6 font-semibold">Type de réduction</th>
                  <th className="py-4 px-6 font-semibold">Valeur de remise</th>
                  <th className="py-4 px-6 font-semibold">Date d&apos;expiration</th>
                  <th className="py-4 px-6 font-semibold">Statut</th>
                  <th className="py-4 px-6 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2E4B] text-gray-300">
                {promocodes.map((promo) => {
                  const expired = isExpired(promo.expiresAt);
                  return (
                    <tr key={promo.id} className="hover:bg-[#1B2E4B]/20">
                      <td className="py-4 px-6 font-bold text-bc-yellow flex items-center gap-2">
                        <Tag size={14} />
                        {promo.code}
                      </td>
                      <td className="py-4 px-6 font-semibold">
                        {promo.discountType === 'PERCENTAGE' ? (
                          <span className="flex items-center text-blue-400 gap-1"><Percent size={14} /> Pourcentage</span>
                        ) : (
                          <span className="flex items-center text-green-400 gap-1">Valeur fixe (FCFA)</span>
                        )}
                      </td>
                      <td className="py-4 px-6 font-bold text-white">
                        {promo.discountType === 'PERCENTAGE'
                          ? `${promo.discountValue}%`
                          : `${promo.discountValue.toLocaleString('fr-FR')} FCFA`}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          {new Date(promo.expiresAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                          {expired && (
                            <span className="text-[10px] font-bold text-red-400 uppercase bg-red-950/40 border border-red-800/40 px-1.5 py-0.5 rounded">Expiré</span>
                          )}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          disabled={expired}
                          onClick={() => handleToggleActive(promo)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                            expired
                              ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'
                              : promo.active
                                ? 'bg-green-950/40 text-green-400 border-green-800/40 cursor-pointer'
                                : 'bg-red-950/40 text-red-400 border-red-800/40 cursor-pointer'
                          }`}
                        >
                          {expired ? 'Expiré' : promo.active ? 'Actif' : 'Inactif'}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-center space-x-2">
                        <button
                          onClick={() => openEditModal(promo)}
                          className="p-2 bg-[#1b2e4b] hover:bg-[#253b5e] text-bc-yellow rounded-xl transition-all cursor-pointer inline-flex items-center"
                          title="Modifier"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(promo.id)}
                          className="p-2 bg-[#2d1b28] hover:bg-red-900/30 text-red-400 rounded-xl transition-all cursor-pointer inline-flex items-center"
                          title="Supprimer"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
          <div className="relative w-full max-w-md bg-[#191E3A] rounded-[28px] border border-[#1B2E4B] overflow-hidden flex flex-col">
            
            <div className="h-16 border-b border-[#1B2E4B] flex items-center justify-between px-6 bg-[#141a35]">
              <span className="font-montserrat font-extrabold text-white text-base">
                {editingPromo ? 'Modifier le Code Promo' : 'Ajouter un Code Promo'}
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-semibold text-gray-300">
              
              {/* Code */}
              <div>
                <label className="block text-gray-400 mb-1.5">Code promotionnel * (En majuscules)</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Ex: CAD229"
                  className="w-full bg-[#11172a] border border-[#232e41] rounded-xl py-2.5 px-3 text-white focus:outline-none focus:ring-bc-yellow"
                />
              </div>

              {/* Discount Type */}
              <div>
                <label className="block text-gray-400 mb-1.5">Type de réduction *</label>
                <select
                  required
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="w-full appearance-none bg-[#11172a] border border-[#232e41] rounded-xl py-2.5 px-3 text-white focus:outline-none"
                >
                  <option value="PERCENTAGE">Pourcentage (%)</option>
                  <option value="FIXED">Valeur fixe (FCFA)</option>
                </select>
              </div>

              {/* Discount Value */}
              <div>
                <label className="block text-gray-400 mb-1.5">Valeur de la réduction *</label>
                <input
                  type="number"
                  required
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder="Ex: 10 pour 10%"
                  className="w-full bg-[#11172a] border border-[#232e41] rounded-xl py-2.5 px-3 text-white focus:outline-none"
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-gray-400 mb-1.5">Date d&apos;expiration *</label>
                <input
                  type="date"
                  required
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
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
                  <span className="text-white">Activer immédiatement ce code promo</span>
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
