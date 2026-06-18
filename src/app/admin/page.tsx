"use client";

import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Users, AlertCircle, ShoppingBag, Package, TrendingUp } from 'lucide-react';

interface Stats {
  ordersCount: number;
  customersCount: number;
  totalRevenue: number;
  pendingOrdersCount: number;
}

interface RecentOrder {
  id: number;
  orderNumber: string;
  clientName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface PopularProduct {
  id: number;
  name: string;
  price: number;
  images: string;
  totalQty: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [popularProducts, setPopularProducts] = useState<PopularProduct[]>([]);
  const [statusBreakdown, setStatusBreakdown] = useState<{ status: string; count: number; revenue: number; }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setRecentOrders(data.recentOrders || []);
        setPopularProducts(data.popularProducts || []);
        setStatusBreakdown(data.statusBreakdown || []);
      }
    } catch (e) {
      console.error('Failed to fetch admin stats', e);
    } finally {
      setLoading(false);
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
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-montserrat tracking-tight">Vue d&apos;ensemble</h1>
        <p className="text-gray-400 text-xs mt-1">Résumé des activités commerciales de Bénin Cadeau</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Sales */}
        <div className="bg-[#191E3A] border border-[#1B2E4B] rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block">Chiffre d&apos;affaires</span>
            <span className="text-2xl font-black text-white font-montserrat">
              {stats?.totalRevenue.toLocaleString('fr-FR') || 0} <span className="text-xs">FCFA</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
        </div>

        {/* Orders */}
        <div className="bg-[#191E3A] border border-[#1B2E4B] rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block">Commandes</span>
            <span className="text-2xl font-black text-white font-montserrat">
              {stats?.ordersCount || 0}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-bc-yellow/10 border border-bc-yellow/20 text-bc-yellow flex items-center justify-center">
            <ShoppingBag size={24} />
          </div>
        </div>

        {/* Customers */}
        <div className="bg-[#191E3A] border border-[#1B2E4B] rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block">Clients</span>
            <span className="text-2xl font-black text-white font-montserrat">
              {stats?.customersCount || 0}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Users size={24} />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-[#191E3A] border border-[#1B2E4B] rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block">Commandes Actives</span>
            <span className="text-2xl font-black text-white font-montserrat">
              {stats?.pendingOrdersCount || 0}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
        </div>

      </div>

      {/* Chiffre d'affaires Graphe Centerpiece */}
      <div className="bg-[#191E3A] border border-[#1B2E4B] rounded-3xl p-6 shadow-sm space-y-6">
        <h2 className="text-lg font-bold font-montserrat text-white flex items-center gap-2">
          <TrendingUp className="text-bc-yellow" size={20} /> Graphique du Chiffre d&apos;affaires par Statut
        </h2>
        
        <div className="h-64 flex items-end gap-3 sm:gap-6 pt-10 pb-4 px-2 border-b border-[#1B2E4B]">
          {['EN_ATTENTE', 'PAYEE', 'EN_PREPARATION', 'EXPEDIEE', 'LIVREE', 'ANNULEE'].map((statusKey) => {
            const bd = statusBreakdown.find(s => s.status === statusKey) || { status: statusKey, count: 0, revenue: 0 };
            const maxRevenue = Math.max(...statusBreakdown.map(s => s.revenue), 1);
            const heightPct = Math.max(4, Math.min(100, (bd.revenue / maxRevenue) * 100));

            const labels: Record<string, string> = {
              EN_ATTENTE: 'En attente',
              PAYEE: 'Payée',
              EN_PREPARATION: 'En prép.',
              EXPEDIEE: 'Expédiée',
              LIVREE: 'Livrée',
              ANNULEE: 'Annulée'
            };

            const barColors: Record<string, string> = {
              EN_ATTENTE: 'from-yellow-500 to-yellow-600',
              PAYEE: 'from-blue-500 to-blue-600',
              EN_PREPARATION: 'from-purple-500 to-purple-600',
              EXPEDIEE: 'from-indigo-500 to-indigo-600',
              LIVREE: 'from-green-500 to-green-600',
              ANNULEE: 'from-red-500 to-red-600'
            };

            return (
              <div key={statusKey} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                {/* Tooltip */}
                <div className="absolute bottom-[calc(100%+8px)] bg-gray-950/95 text-white rounded-xl p-3 text-[10px] font-bold shadow-lg border border-gray-800 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 min-w-[130px] text-center">
                  <p className="text-bc-yellow font-extrabold">{labels[statusKey]}</p>
                  <p className="mt-1">{bd.revenue.toLocaleString('fr-FR')} FCFA</p>
                  <p className="text-gray-400 font-semibold">{bd.count} commande{bd.count > 1 ? 's' : ''}</p>
                </div>

                {/* Vertical Bar */}
                <div
                  style={{ height: `${heightPct}%` }}
                  className={`w-full max-w-[44px] rounded-t-lg bg-gradient-to-t ${barColors[statusKey]} cursor-pointer shadow-sm hover:brightness-110 transition-all duration-500`}
                />

                {/* X Axis Label */}
                <span className="text-[10px] sm:text-xs font-semibold text-gray-400 mt-2 block whitespace-nowrap">
                  {labels[statusKey]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Double Column content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Orders (Left) */}
        <div className="bg-[#191E3A] border border-[#1B2E4B] rounded-3xl p-6 shadow-sm lg:col-span-7 space-y-6">
          <h2 className="text-lg font-bold font-montserrat text-white">Dernières commandes</h2>
          
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-sm py-4">Aucune commande enregistrée pour le moment.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#1B2E4B] text-gray-400">
                    <th className="pb-3 font-semibold">N° Commande</th>
                    <th className="pb-3 font-semibold">Client</th>
                    <th className="pb-3 font-semibold">Montant</th>
                    <th className="pb-3 font-semibold">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1B2E4B]">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="text-gray-300 hover:bg-[#1B2E4B]/20">
                      <td className="py-4 font-bold text-bc-yellow">{order.orderNumber}</td>
                      <td className="py-4">{order.clientName}</td>
                      <td className="py-4 font-semibold">{order.totalAmount.toLocaleString('fr-FR')} FCFA</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Selling Products (Right) */}
        <div className="bg-[#191E3A] border border-[#1B2E4B] rounded-3xl p-6 shadow-sm lg:col-span-5 space-y-6">
          <h2 className="text-lg font-bold font-montserrat text-white">Produits les plus vendus</h2>

          {popularProducts.length === 0 ? (
            <p className="text-gray-500 text-sm py-4">Aucune vente enregistrée pour le moment.</p>
          ) : (
            <div className="space-y-4">
              {popularProducts.map((product) => {
                let images: string[] = [];
                try {
                  images = typeof product.images === 'string'
                    ? JSON.parse(product.images)
                    : (product.images as unknown as string[]);
                } catch {
                  images = ['/1-19.png'];
                }

                return (
                  <div key={product.id} className="flex items-center justify-between bg-[#1b203f] p-4 rounded-2xl border border-[#232a5c]">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-950 overflow-hidden flex-shrink-0">
                        <img src={images[0] || '/1-19.png'} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="font-semibold text-white block text-sm leading-tight line-clamp-1">{product.name}</span>
                        <span className="text-xs text-gray-400">Prix : {product.price.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block text-sm font-black text-bc-yellow font-montserrat">{product.totalQty} vendus</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
