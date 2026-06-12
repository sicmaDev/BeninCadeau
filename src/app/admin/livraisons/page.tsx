"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Loader2, Truck } from 'lucide-react';

interface ShippingZone {
  id: number;
  name: string;
  deliveryFee: number;
}

export default function AdminShippingZonesPage() {
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [loading, setLoading] = useState(true);

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
        fetchZones();
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

  const handleDelete = async (zoneId: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette zone ?")) return;

    try {
      const res = await fetch(`/api/admin/shipping-zones?id=${zoneId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchZones();
      } else {
        const data = await res.json();
        alert(data.error || "Erreur lors de la suppression.");
      }
    } catch (err) {
      alert("Erreur réseau.");
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-montserrat tracking-tight">Frais de Livraison</h1>
          <p className="text-gray-400 text-xs mt-1">Configurer les zones de distribution et les frais associés pour Cotonou et environs</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-bc-yellow hover:bg-yellow-400 text-bc-purple font-bold text-sm shadow-sm cursor-pointer"
        >
          <Plus size={18} /> Nouvelle Zone
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-[#191E3A] border border-[#1B2E4B] rounded-3xl overflow-hidden shadow-sm max-w-2xl">
        {zones.length === 0 ? (
          <p className="p-8 text-gray-500 text-sm text-center">Aucune zone de livraison configurée.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#1B2E4B] text-gray-400 bg-[#141a35]">
                  <th className="py-4 px-6 font-semibold">Zone / Quartier</th>
                  <th className="py-4 px-6 font-semibold">Frais de livraison</th>
                  <th className="py-4 px-6 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2E4B] text-gray-300">
                {zones.map((zone) => (
                  <tr key={zone.id} className="hover:bg-[#1B2E4B]/20">
                    <td className="py-4 px-6 font-semibold flex items-center gap-2">
                      <Truck size={14} className="text-bc-yellow" />
                      {zone.name}
                    </td>
                    <td className="py-4 px-6 font-bold text-white">
                      {zone.deliveryFee.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="py-4 px-6 text-center space-x-2">
                      <button
                        onClick={() => openEditModal(zone)}
                        className="p-2 bg-[#1b2e4b] hover:bg-[#253b5e] text-bc-yellow rounded-xl transition-all cursor-pointer inline-flex items-center"
                        title="Modifier"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(zone.id)}
                        className="p-2 bg-[#2d1b28] hover:bg-red-900/30 text-red-400 rounded-xl transition-all cursor-pointer inline-flex items-center"
                        title="Supprimer"
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
                {editingZone ? 'Modifier la Zone' : 'Ajouter une Zone'}
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
                <label className="block text-gray-400 mb-1.5">Nom de la Zone / Ville / Quartier *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Cotonou (Fidjrossè)"
                  className="w-full bg-[#11172a] border border-[#232e41] rounded-xl py-2.5 px-3 text-white focus:outline-none focus:ring-bc-yellow"
                />
              </div>

              {/* Delivery Fee */}
              <div>
                <label className="block text-gray-400 mb-1.5">Frais de livraison (FCFA) *</label>
                <input
                  type="number"
                  required
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(e.target.value)}
                  placeholder="1500"
                  className="w-full bg-[#11172a] border border-[#232e41] rounded-xl py-2.5 px-3 text-white focus:outline-none"
                />
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
