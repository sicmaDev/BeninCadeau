"use client";

import React, { useState, useEffect } from 'react';
import { Eye, Calendar, User, Phone, MapPin, Truck, ShieldAlert, X, DollarSign, ArrowUpDown, ChevronDown } from 'lucide-react';
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
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = (status: string) => {
    setSelectedStatus(status);
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
        // Mettre à jour la liste locale
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
        // Appliquer à la liste filtrée
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
    const statuses: Record<string, { bg: string, text: string, label: string }> = {
      EN_ATTENTE: { bg: 'bg-yellow-950/40 text-yellow-400 border-yellow-800/40', text: 'text-yellow-400', label: 'En attente' },
      PAYEE: { bg: 'bg-blue-950/40 text-blue-400 border-blue-800/40', text: 'text-blue-400', label: 'Payée' },
      EN_PREPARATION: { bg: 'bg-purple-950/40 text-purple-400 border-purple-800/40', text: 'text-purple-400', label: 'En préparation' },
      EXPEDIEE: { bg: 'bg-indigo-950/40 text-indigo-400 border-indigo-800/40', text: 'text-indigo-400', label: 'Expédiée' },
      LIVREE: { bg: 'bg-green-950/40 text-green-400 border-green-800/40', text: 'text-green-400', label: 'Livrée' },
      ANNULEE: { bg: 'bg-red-950/40 text-red-400 border-red-800/40', text: 'text-red-400', label: 'Annulée' },
    };
    const current = statuses[status] || { bg: 'bg-gray-950/40 text-gray-400 border-gray-800/40', text: 'text-gray-400', label: status };

    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${current.bg}`}>
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
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-bc-yellow border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-instrument">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-montserrat tracking-tight font-montserrat">Gestion des Commandes</h1>
        <p className="text-gray-400 text-xs mt-1">Gérer les statuts, livraisons et messages de personnalisation des commandes clients</p>
      </div>

      {/* Tabs / Filters */}
      <div className="flex flex-wrap gap-2 border-b border-[#1B2E4B] pb-4">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => filterOrders(opt.value)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedStatus === opt.value
                ? 'bg-bc-yellow text-bc-purple shadow-sm'
                : 'bg-[#191E3A] border border-[#1B2E4B] text-gray-400 hover:text-white'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="bg-[#191E3A] border border-[#1B2E4B] rounded-3xl overflow-hidden shadow-sm">
        {filteredOrders.length === 0 ? (
          <p className="p-8 text-gray-500 text-sm text-center">Aucune commande trouvée correspondant à ce filtre.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#1B2E4B] text-gray-400 bg-[#141a35]">
                  <th className="py-4 px-6 font-semibold">N° Commande</th>
                  <th className="py-4 px-6 font-semibold">Date</th>
                  <th className="py-4 px-6 font-semibold">Client</th>
                  <th className="py-4 px-6 font-semibold">Montant</th>
                  <th className="py-4 px-6 font-semibold">Statut</th>
                  <th className="py-4 px-6 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2E4B] text-gray-300">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#1B2E4B]/20">
                    <td className="py-4 px-6 font-bold text-bc-yellow">{order.orderNumber}</td>
                    <td className="py-4 px-6">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-6">{order.clientName}</td>
                    <td className="py-4 px-6 font-bold">{order.totalAmount.toLocaleString('fr-FR')} FCFA</td>
                    <td className="py-4 px-6">{getStatusBadge(order.status)}</td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 bg-[#1b2e4b] hover:bg-[#253b5e] text-bc-yellow rounded-xl transition-all inline-flex items-center gap-1 text-xs font-semibold cursor-pointer"
                      >
                        <Eye size={14} /> Voir Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
          <div className="relative w-full max-w-3xl bg-[#191E3A] rounded-[28px] border border-[#1B2E4B] overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="h-16 border-b border-[#1B2E4B] flex items-center justify-between px-6 bg-[#141a35]">
              <span className="font-montserrat font-extrabold text-white text-base">
                Détail Commande #{selectedOrder.orderNumber}
              </span>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-gray-300">
              
              {/* Top Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Client Box */}
                <div className="bg-[#1b203f] border border-[#232a5c] rounded-2xl p-5 space-y-3">
                  <h3 className="font-bold text-white uppercase tracking-wider text-xs border-b border-[#232a5c] pb-2 flex items-center">
                    <User className="text-bc-yellow mr-1" size={14} /> Client & Contact
                  </h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between"><span className="text-gray-400">Nom :</span> <span className="font-semibold">{selectedOrder.clientName}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Téléphone :</span> <span className="font-semibold">{selectedOrder.clientPhone}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Email :</span> <span className="font-semibold">{selectedOrder.clientEmail}</span></div>
                  </div>
                </div>

                {/* Delivery Box */}
                <div className="bg-[#1b203f] border border-[#232a5c] rounded-2xl p-5 space-y-3">
                  <h3 className="font-bold text-white uppercase tracking-wider text-xs border-b border-[#232a5c] pb-2 flex items-center">
                    <MapPin className="text-bc-yellow mr-1" size={14} /> Livraison
                  </h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between"><span className="text-gray-400">Zone :</span> <span className="font-semibold">{selectedOrder.shippingZone.name}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Frais :</span> <span className="font-semibold">{selectedOrder.shippingFee.toLocaleString('fr-FR')} FCFA</span></div>
                    <div className="flex flex-col mt-1"><span className="text-gray-400">Adresse complète :</span> <span className="mt-1 font-semibold text-white bg-[#0e122b] p-2 rounded border border-[#232a5c]">{selectedOrder.shippingAddress}</span></div>
                  </div>
                </div>

              </div>

              {/* Status Update section */}
              <div className="bg-[#192231] border border-[#232e41] rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-xs text-gray-400 font-bold block uppercase tracking-wider mb-1">Mettre à jour le Statut</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Statut actuel : </span>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                </div>

                <div className="relative w-full sm:w-auto">
                  <select
                    disabled={updatingStatus}
                    value={selectedOrder.status}
                    onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                    className="w-full sm:w-48 appearance-none bg-[#11172a] border border-[#232e41] rounded-xl py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-bc-yellow text-xs font-semibold cursor-pointer"
                  >
                    <option value="EN_ATTENTE">En attente</option>
                    <option value="PAYEE">Payée</option>
                    <option value="EN_PREPARATION">En préparation</option>
                    <option value="EXPEDIEE">Expédiée</option>
                    <option value="LIVREE">Livrée</option>
                    <option value="ANNULEE">Annulée</option>
                  </select>
                  <ChevronDown className="text-gray-400 absolute right-3 top-2.5 pointer-events-none" size={14} />
                </div>
              </div>

              {/* Ordered Items Table */}
              <div className="space-y-3">
                <h3 className="font-bold text-white uppercase tracking-wider text-xs border-b border-[#1B2E4B] pb-2 flex items-center">
                  <ShoppingBag className="text-bc-yellow mr-1" size={14} /> Articles Commandés
                </h3>
                <div className="space-y-3">
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
                      <div key={item.id} className="flex justify-between items-center bg-[#1b203f] p-4 rounded-xl border border-[#232a5c] gap-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-950 overflow-hidden flex-shrink-0 border">
                            <img src={images[0] || '/1-19.png'} alt={item.product.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="font-semibold text-white block text-sm leading-tight">{item.product.name}</span>
                            <span className="text-xs text-gray-400">
                              {item.quantity} × {item.price.toLocaleString('fr-FR')} FCFA
                            </span>
                            {item.customizationMessage && (
                              <div className="mt-1 bg-purple-950/60 border border-purple-800/40 rounded-lg p-2 text-xs text-purple-300 font-medium">
                                Message de perso : &quot;{item.customizationMessage}&quot;
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="font-bold text-white text-sm flex-shrink-0">
                          {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Promo code & Invoice total details */}
              <div className="border-t border-[#1B2E4B] pt-4 space-y-2 text-xs text-gray-400">
                {selectedOrder.promoCode && (
                  <div className="flex justify-between font-medium text-green-500">
                    <span>Code promo ({selectedOrder.promoCode.code}) :</span>
                    <span>
                      -{selectedOrder.promoCode.discountType === 'PERCENTAGE'
                        ? `${selectedOrder.promoCode.discountValue}%`
                        : `${selectedOrder.promoCode.discountValue} FCFA`}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-white font-bold">
                  <span>Total facturé (livraison comprise) :</span>
                  <span className="text-bc-yellow text-base">{selectedOrder.totalAmount.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="h-16 border-t border-[#1B2E4B] flex items-center justify-end px-6 bg-[#141a35]">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 rounded-xl bg-[#1b2e4b] hover:bg-[#253b5e] text-white text-xs font-bold transition-all cursor-pointer"
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
