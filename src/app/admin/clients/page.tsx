"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, User, Phone, MapPin, ShoppingBag } from 'lucide-react';

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

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

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
                  <th className="py-4 px-6 font-semibold">Membre depuis</th>
                  <th className="py-4 px-6 font-semibold text-center">Commandes passées</th>
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
                    <td className="py-4 px-6 text-xs text-gray-400">
                      {new Date(c.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#1b203f] border border-[#232a5c] text-white">
                        <ShoppingBag size={12} className="text-bc-yellow" /> {c._count.orders} commande{c._count.orders > 1 ? 's' : ''}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
