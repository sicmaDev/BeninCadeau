"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, User, Phone, MapPin, ShoppingBag, Eye, X, Loader2 } from 'lucide-react';

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
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // Detail Modal States
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [fetchingOrders, setFetchingOrders] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/admin/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
      }
    } catch (e) {
      console.error(e);
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
    } finally {
      setFetchingOrders(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      EN_ATTENTE: 'bg-yellow-950/40 text-yellow-400 border-yellow-800/40',
      PAYEE: 'bg-blue-950/40 text-blue-400 border-blue-800/40',
      EN_PREPARATION: 'bg-purple-950/40 text-purple-400 border-purple-800/40',
      EXPEDIEE: 'bg-indigo-950/40 text-indigo-400 border-indigo-800/40',
      LIVREE: 'bg-green-950/40 text-green-400 border-green-800/40',
      ANNULEE: 'bg-red-950/40 text-red-400 border-red-800/40',
    };
    return statusColors[status] || 'bg-gray-950/40 text-gray-400 border-gray-800/40';
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-montserrat tracking-tight">Gestion des Clients</h1>
        <p className="text-gray-400 text-xs mt-1">Consulter les profils clients inscrits et leur volume de commandes</p>
      </div>

      {/* Table Container */}
      <div className="bg-[#191E3A] border border-[#1B2E4B] rounded-3xl overflow-hidden shadow-sm">
        {customers.length === 0 ? (
          <p className="p-8 text-gray-500 text-sm text-center">Aucun client inscrit pour le moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#1B2E4B] text-gray-400 bg-[#141a35]">
                  <th className="py-4 px-6 font-semibold">Client</th>
                  <th className="py-4 px-6 font-semibold">Email</th>
                  <th className="py-4 px-6 font-semibold">Téléphone</th>
                  <th className="py-4 px-6 font-semibold">Adresse par défaut</th>
                  <th className="py-4 px-6 font-semibold text-center">Commandes</th>
                  <th className="py-4 px-6 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2E4B] text-gray-300">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#1B2E4B]/20">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-bc-yellow/10 border border-bc-yellow/20 text-bc-yellow flex items-center justify-center font-bold text-xs">
                          {c.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-bold text-white">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-400">{c.email}</td>
                    <td className="py-4 px-6 font-semibold">{c.phone || 'Non renseigné'}</td>
                    <td className="py-4 px-6 max-w-xs truncate" title={c.address || ''}>
                      {c.address || 'Aucune adresse enregistrée'}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#1b203f] border border-[#232a5c] text-white">
                        <ShoppingBag size={12} className="text-bc-yellow" /> {c._count.orders} commande{c._count.orders > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleViewCustomerOrders(c)}
                        className="p-2 bg-[#1b2e4b] hover:bg-[#253b5e] text-bc-yellow rounded-xl transition-all inline-flex items-center gap-1 text-xs font-semibold cursor-pointer"
                      >
                        <Eye size={14} /> Profil & Historique
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer profile and orders history modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
          <div className="relative w-full max-w-2xl bg-[#191E3A] rounded-[28px] border border-[#1B2E4B] overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="h-16 border-b border-[#1B2E4B] flex items-center justify-between px-6 bg-[#141a35]">
              <span className="font-montserrat font-extrabold text-white text-base">
                Profil & Historique : {selectedCustomer.name}
              </span>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-gray-300">
              
              {/* Profile details */}
              <div className="bg-[#1b203f] border border-[#232a5c] rounded-2xl p-5 space-y-4">
                <h3 className="font-bold text-white uppercase tracking-wider text-xs border-b border-[#232a5c] pb-2 flex items-center">
                  <User className="text-bc-yellow mr-1" size={14} /> Fiche Client
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center space-x-2">
                    <User size={16} className="text-gray-500" />
                    <div>
                      <span className="block text-[10px] text-gray-400">Nom complet</span>
                      <span className="font-semibold text-white">{selectedCustomer.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-gray-500" />
                    <div>
                      <span className="block text-[10px] text-gray-400">Membre depuis le</span>
                      <span className="font-semibold text-white">
                        {new Date(selectedCustomer.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Phone size={16} className="text-gray-500" />
                    <div>
                      <span className="block text-[10px] text-gray-400">Téléphone</span>
                      <span className="font-semibold text-white">{selectedCustomer.phone || 'Non renseigné'}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <MapPin size={16} className="text-gray-500" />
                    <div>
                      <span className="block text-[10px] text-gray-400">Adresse par défaut</span>
                      <span className="font-semibold text-white">{selectedCustomer.address || 'Non renseignée'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order history */}
              <div className="space-y-3">
                <h3 className="font-bold text-white uppercase tracking-wider text-xs border-b border-[#1B2E4B] pb-2 flex items-center">
                  <ShoppingBag className="text-bc-yellow mr-1" size={14} /> Historique de commandes
                </h3>

                {fetchingOrders ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 text-bc-yellow animate-spin" />
                  </div>
                ) : customerOrders.length === 0 ? (
                  <p className="text-gray-500 text-xs py-4 text-center">Ce client n&apos;a pas encore passé de commande.</p>
                ) : (
                  <div className="space-y-3">
                    {customerOrders.map((order) => (
                      <div key={order.id} className="flex justify-between items-center bg-[#1b203f] p-4 rounded-xl border border-[#232a5c] gap-4">
                        <div className="space-y-1">
                          <span className="font-bold text-bc-yellow text-sm block">{order.orderNumber}</span>
                          <span className="text-[10px] text-gray-400 block">
                            Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR')} (Zone: {order.shippingZone.name})
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 flex-shrink-0">
                          <span className="font-bold text-white text-sm">
                            {order.totalAmount.toLocaleString('fr-FR')} FCFA
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="h-16 border-t border-[#1B2E4B] flex items-center justify-end px-6 bg-[#141a35]">
              <button
                onClick={() => setSelectedCustomer(null)}
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
