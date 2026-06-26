"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, ShoppingBag, LogOut, Lock, UserPlus, ArrowRight, Calendar, CreditCard, Sparkles, ShieldCheck, Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CopyrightRow } from '@/components/CopyrightRow';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderItem {
  id: number;
  product: {
    name: string;
    slug: string;
    images: string; 
  };
  quantity: number;
  price: number;
  customizationMessage: string | null;
}

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  totalAmount: number;
  shippingFee: number;
  shippingZone: {
    name: string;
  };
  createdAt: string;
  orderItems: OrderItem[];
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Profile edit states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setEditName(data.user.name || '');
        setEditPhone(data.user.phone || '');
        setEditAddress(data.user.address || '');
        fetchOrders();
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Session check failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSubmitting(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          phone: editPhone,
          address: editAddress,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        setProfileSuccess('Profil mis à jour avec succès !');
        setIsEditingProfile(false);
        setTimeout(() => setProfileSuccess(''), 4000);
      } else {
        setProfileError(data.error || 'Erreur lors de la mise à jour.');
      }
    } catch (err) {
      setProfileError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setProfileSubmitting(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch orders', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFormLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin 
      ? { email, password } 
      : { name, email, password, phone, address };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      setUser(data.user);
      setEditName(data.user.name || '');
      setEditPhone(data.user.phone || '');
      setEditAddress(data.user.address || '');
      fetchOrders();
      
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setAddress('');
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setOrders([]);
      router.push('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const getStatusBadge = (status: string) => {
    const statuses: Record<string, { bg: string, label: string }> = {
      EN_ATTENTE: { bg: 'bg-yellow-50 text-amber-700 border-amber-200/50', label: 'Attente de paiement' },
      PAYEE: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/50', label: 'Payée' },
      EN_PREPARATION: { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/50', label: 'En préparation' },
      EXPEDIEE: { bg: 'bg-blue-50 text-blue-700 border-blue-200/50', label: 'Expédiée' },
      LIVREE: { bg: 'bg-teal-50 text-teal-700 border-teal-200/50', label: 'Livrée' },
      ANNULEE: { bg: 'bg-red-50 text-red-700 border-red-200/50', label: 'Annulée' },
    };

    const current = statuses[status] || { bg: 'bg-zinc-50 text-zinc-700 border-zinc-200', label: status };

    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${current.bg}`}>
        {current.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-2 border-bc-purple border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-650 font-semibold text-xs tracking-wider uppercase">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50/30">
      <Header />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-12 font-instrument pb-24">
        <div className="max-w-[1280px] mx-auto">
          
          <div className="flex items-center gap-3 mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              Mon Espace Client
            </h1>
            {user && (
              <span className="bg-bc-purpleLight text-bc-purple font-semibold text-xs px-3 py-1 rounded-full border border-bc-purple/10 uppercase tracking-wider">
                Tableau de bord
              </span>
            )}
          </div>

          {!user ? (
            /* AUTHENTICATION FORM */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/50 shadow-sm"
            >
              <div className="space-y-6">
                <div className="text-center space-y-1.5">
                  <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">
                    {isLogin ? 'Connexion' : 'Création de compte'}
                  </h2>
                  <p className="text-xs text-zinc-500 leading-relaxed max-w-[280px] mx-auto">
                    {isLogin 
                      ? 'Accédez à votre historique et gérez vos commandes de prestige.' 
                      : 'Rejoignez le club Bénin Cadeau pour commander plus rapidement.'}
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-650 rounded-2xl p-4 text-xs font-semibold shadow-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Nom Complet</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Jean DUPONT"
                        className="w-full rounded-full border border-zinc-200 bg-zinc-50/50 py-2.5 px-4 text-xs font-medium focus:bg-white focus:outline-none focus:border-bc-purple focus:ring-1 focus:ring-bc-purple transition-all"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Adresse E-mail</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ex: jean.dupont@mail.com"
                      className="w-full rounded-full border border-zinc-200 bg-zinc-50/50 py-2.5 px-4 text-xs font-medium focus:bg-white focus:outline-none focus:border-bc-purple focus:ring-1 focus:ring-bc-purple transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Mot de Passe</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-full border border-zinc-200 bg-zinc-50/50 py-2.5 px-4 text-xs font-medium focus:bg-white focus:outline-none focus:border-bc-purple focus:ring-1 focus:ring-bc-purple transition-all"
                    />
                  </div>

                  {!isLogin && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Téléphone (WhatsApp)</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Ex: +229 90 00 00 00"
                          className="w-full rounded-full border border-zinc-200 bg-zinc-50/50 py-2.5 px-4 text-xs font-medium focus:bg-white focus:outline-none focus:border-bc-purple focus:ring-1 focus:ring-bc-purple transition-all"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Adresse de livraison par défaut</label>
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Ex: Maison X, Quartier Y, Cotonou"
                          className="w-full rounded-full border border-zinc-200 bg-zinc-50/50 py-2.5 px-4 text-xs font-medium focus:bg-white focus:outline-none focus:border-bc-purple focus:ring-1 focus:ring-bc-purple transition-all"
                        />
                      </div>
                    </>
                  )}

                  <motion.button
                    whileHover={{ y: -1 }}
                    type="submit"
                    disabled={formLoading}
                    className="w-full flex justify-center items-center py-3.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-bc-purple hover:bg-bc-purpleDark focus:outline-none transition-all cursor-pointer disabled:opacity-50"
                  >
                    {formLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : isLogin ? (
                      <>
                        Se Connecter <ArrowRight size={14} className="ml-1.5" />
                      </>
                    ) : (
                      <>
                        Créer mon Compte <UserPlus size={14} className="ml-1.5" />
                      </>
                    )}
                  </motion.button>
                </form>

                <div className="text-center pt-2">
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError('');
                    }}
                    className="text-xs text-bc-purple hover:underline font-bold uppercase tracking-wider"
                  >
                    {isLogin 
                      ? "Nouveau ? Créer un compte" 
                      : "Déjà membre ? Connectez-vous"}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* CUSTOMER DASHBOARD */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* User Info Sidebar (Left) */}
              <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/50 shadow-sm h-fit space-y-6">
                {profileSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-600 rounded-2xl p-4 text-xs font-semibold shadow-sm">
                    {profileSuccess}
                  </div>
                )}
                
                <div className="flex items-center space-x-3.5 pb-5 border-b border-zinc-100">
                  <div className="w-12 h-12 rounded-full bg-bc-purple text-white flex items-center justify-center font-bold text-base shadow-sm">
                    {user.name ? user.name.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-base font-bold text-zinc-900 line-clamp-1 leading-tight">{user.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[9px] bg-bc-purpleLight text-bc-purple border border-bc-purple/10 font-bold uppercase tracking-wider inline-block">
                      {user.role === 'ADMIN' ? 'Administrateur' : 'Client Privilégié'}
                    </span>
                  </div>
                </div>

                {isEditingProfile ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    {profileError && (
                      <div className="bg-red-50 border border-red-200 text-red-650 rounded-2xl p-4 text-xs font-semibold shadow-sm">
                        {profileError}
                      </div>
                    )}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Nom Complet</label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full rounded-full border border-zinc-200 bg-zinc-50/50 py-2.5 px-4 text-xs font-medium focus:bg-white focus:outline-none focus:border-bc-purple focus:ring-1 focus:ring-bc-purple transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Téléphone (WhatsApp)</label>
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full rounded-full border border-zinc-200 bg-zinc-50/50 py-2.5 px-4 text-xs font-medium focus:bg-white focus:outline-none focus:border-bc-purple focus:ring-1 focus:ring-bc-purple transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Adresse de livraison</label>
                      <input
                        type="text"
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        className="w-full rounded-full border border-zinc-200 bg-zinc-50/50 py-2.5 px-4 text-xs font-medium focus:bg-white focus:outline-none focus:border-bc-purple focus:ring-1 focus:ring-bc-purple transition-all"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={profileSubmitting}
                        className="flex-1 py-2.5 px-4 bg-bc-purple hover:bg-bc-purpleDark text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                      >
                        {profileSubmitting ? '...' : 'Enregistrer'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingProfile(false);
                          setProfileError('');
                        }}
                        className="flex-1 py-2.5 px-4 border border-zinc-250 text-zinc-550 hover:bg-zinc-50 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="space-y-3.5">
                      <div className="flex items-start space-x-3 text-xs">
                        <Mail className="text-zinc-400 mt-1 flex-shrink-0" size={14} />
                        <div className="space-y-0.5">
                          <span className="block text-[9px] text-zinc-400 font-bold uppercase tracking-wider">E-mail</span>
                          <span className="font-semibold text-zinc-700">{user.email}</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 text-xs">
                        <Phone className="text-zinc-400 mt-1 flex-shrink-0" size={14} />
                        <div className="space-y-0.5">
                          <span className="block text-[9px] text-zinc-400 font-bold uppercase tracking-wider">WhatsApp / Tél</span>
                          <span className="font-semibold text-zinc-700 text-xs">
                            {user.phone || 'Non renseigné'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 text-xs">
                        <MapPin className="text-zinc-400 mt-1 flex-shrink-0" size={14} />
                        <div className="space-y-0.5">
                          <span className="block text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Adresse par défaut</span>
                          <span className="font-semibold text-zinc-700 leading-relaxed">
                            {user.address || 'Non renseignée'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5 pt-2">
                      <motion.button
                        whileHover={{ y: -0.5 }}
                        onClick={() => {
                          setEditName(user.name || '');
                          setEditPhone(user.phone || '');
                          setEditAddress(user.address || '');
                          setIsEditingProfile(true);
                        }}
                        className="w-full flex items-center justify-center py-2.5 px-4 bg-zinc-50 border border-zinc-200/60 hover:bg-zinc-100 text-zinc-700 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Modifier mon profil
                      </motion.button>

                      <motion.button
                        whileHover={{ y: -0.5 }}
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center py-2.5 px-4 border border-red-200 rounded-full text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <LogOut size={13} className="mr-1.5" /> Déconnexion
                      </motion.button>
                    </div>
                  </>
                )}
              </div>

              {/* Orders History Main Area (Right) */}
              <div className="lg:col-span-8">
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/50 shadow-sm">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-100">
                    <h3 className="text-lg font-bold text-zinc-900 flex items-center">
                      <ShoppingBag className="mr-2 text-bc-purple" size={18} /> Mes Commandes
                    </h3>
                    <span className="bg-bc-purpleLight text-bc-purple px-3 py-1 rounded-full text-xs font-bold border border-bc-purple/10">
                      {orders.length} commande{orders.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-12 space-y-5">
                      <div className="w-14 h-14 bg-zinc-50 rounded-full flex items-center justify-center mx-auto text-zinc-400">
                        <ShoppingBag size={24} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-zinc-550 font-bold text-xs">Vous n&apos;avez pas encore passé de commande.</p>
                        <p className="text-[11px] text-zinc-400">Parcourez notre catalogue premium pour faire plaisir à vos proches.</p>
                      </div>
                      <button
                        onClick={() => router.push('/catalogue')}
                        className="inline-flex items-center px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-bc-purple bg-bc-yellow hover:bg-yellow-400 transition-colors shadow-sm cursor-pointer"
                      >
                        Parcourir le catalogue
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {orders.map((order) => (
                        <div 
                          key={order.id} 
                          className="border border-zinc-200/50 rounded-2xl p-5 hover:border-zinc-300 transition-all space-y-3.5 shadow-sm"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-100 gap-2">
                            <div className="space-y-0.5">
                              <span className="text-xs font-bold text-bc-purple block">
                                Commande #{order.orderNumber}
                              </span>
                              <span className="text-[10px] text-zinc-400 flex items-center font-medium">
                                <Calendar size={11} className="mr-1 text-zinc-400" />
                                {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <div className="flex items-center">
                              {getStatusBadge(order.status)}
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="py-1 space-y-3">
                            {order.orderItems.map((item) => {
                              let images: string[] = [];
                              try {
                                images = typeof item.product.images === 'string' 
                                  ? JSON.parse(item.product.images)
                                  : (item.product.images as unknown as string[]);
                              } catch {
                                images = ['/1-19.png'];
                              }
                              
                              return (
                                <div key={item.id} className="flex items-center justify-between text-xs gap-3">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-xl bg-zinc-50 overflow-hidden flex-shrink-0 border border-zinc-200/40">
                                      <img 
                                        src={images[0] || '/1-19.png'} 
                                        alt={item.product.name} 
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="space-y-0.5">
                                      <span className="font-semibold text-zinc-800 block line-clamp-1">
                                        {item.product.name}
                                      </span>
                                      <span className="text-[10px] text-zinc-400 font-semibold">
                                        Qté : {item.quantity} × {item.price.toLocaleString('fr-FR')} FCFA
                                      </span>
                                      {item.customizationMessage && (
                                        <span className="block text-[9px] text-bc-purple font-medium italic">
                                          Message : &quot;{item.customizationMessage}&quot;
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <span className="font-bold text-zinc-700 flex-shrink-0">
                                    {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Order Footer */}
                          <div className="pt-3 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="text-[10px] text-zinc-400 font-medium font-instrument">
                              <span>Frais d&apos;expédition ({order.shippingZone.name}) : </span>
                              <span className="font-bold text-zinc-700">
                                {order.shippingFee.toLocaleString('fr-FR')} FCFA
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                              <div className="text-right">
                                <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-wider block">Montant Total</span>
                                <span className="text-base font-black text-bc-purple">
                                  {order.totalAmount.toLocaleString('fr-FR')} FCFA
                                </span>
                              </div>
                              
                              {order.status === 'EN_ATTENTE' && (
                                <motion.button
                                  whileHover={{ y: -0.5 }}
                                  onClick={() => router.push(`/commander?order=${order.orderNumber}`)}
                                  className="inline-flex items-center px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider text-bc-purple bg-bc-yellow hover:bg-yellow-400 shadow-sm transition-all cursor-pointer"
                                >
                                  <CreditCard size={12} className="mr-1" /> Payer
                                </motion.button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
      <CopyrightRow />
      <Footer />
    </div>
  );
}
