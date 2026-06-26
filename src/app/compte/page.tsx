"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, ShoppingBag, LogOut, Lock, UserPlus, ArrowRight, Calendar, CreditCard, Sparkles, ShieldCheck } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CopyrightRow } from '@/components/CopyrightRow';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderItem {
  id: number;
  product: {
    name: string;
    slug: string;
    images: string; // JSON string or array
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

    const current = statuses[status] || { bg: 'bg-gray-50 text-gray-700 border-gray-200', label: status };

    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-montserrat font-bold uppercase tracking-wider border ${current.bg}`}>
        {current.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bc-bg flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-bc-yellow border-t-bc-purple rounded-full animate-spin"></div>
          <p className="text-bc-heading font-montserrat font-bold text-sm tracking-wider uppercase">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bc-bg">
      <Header />
      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8 font-instrument pb-24">
        <div className="max-w-[1200px] mx-auto">
          
          <div className="flex items-center gap-3 mb-10">
            <h1 className="text-3xl font-extrabold text-bc-purple font-montserrat tracking-tight">
              Mon Espace Client
            </h1>
            {user && (
              <span className="bg-bc-purple/10 text-bc-purple font-montserrat font-bold text-xs px-3.5 py-1 rounded-full border border-bc-purple/20 uppercase tracking-wider">
                Tableau de bord
              </span>
            )}
          </div>

          {!user ? (
            /* AUTHENTICATION FORM */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto bg-white rounded-[32px] shadow-premium overflow-hidden border border-gray-100/60"
            >
              <div className="p-8 sm:p-10">
                <div className="text-center mb-8 space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-montserrat text-bc-purple">
                    {isLogin ? 'Connexion' : 'Création de compte'}
                  </h2>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-[280px] mx-auto">
                    {isLogin 
                      ? 'Accédez à votre historique et gérez vos commandes de prestige.' 
                      : 'Rejoignez le club Bénin Cadeau pour commander plus rapidement.'}
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-xs font-semibold mb-6 shadow-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div>
                      <label className="block text-[10px] font-bold text-bc-navy uppercase tracking-widest font-montserrat mb-1.5 ml-1">Nom Complet</label>
                      <div className="relative border border-gray-200 rounded-2xl p-3 flex items-center bg-gray-50/30 focus-within:bg-white focus-within:ring-2 focus-within:ring-bc-purple/10 focus-within:border-bc-purple transition-all">
                        <span className="text-gray-400 mr-2.5 flex-shrink-0">
                          <User size={16} />
                        </span>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ex: Jean DUPONT"
                          className="w-full focus:outline-none text-bc-heading placeholder-gray-400 text-sm font-medium bg-transparent"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-bc-navy uppercase tracking-widest font-montserrat mb-1.5 ml-1">Adresse E-mail</label>
                    <div className="relative border border-gray-200 rounded-2xl p-3 flex items-center bg-gray-50/30 focus-within:bg-white focus-within:ring-2 focus-within:ring-bc-purple/10 focus-within:border-bc-purple transition-all">
                      <span className="text-gray-400 mr-2.5 flex-shrink-0">
                        <Mail size={16} />
                      </span>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Ex: jean.dupont@mail.com"
                        className="w-full focus:outline-none text-bc-heading placeholder-gray-400 text-sm font-medium bg-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-bc-navy uppercase tracking-widest font-montserrat mb-1.5 ml-1">Mot de Passe</label>
                    <div className="relative border border-gray-200 rounded-2xl p-3 flex items-center bg-gray-50/30 focus-within:bg-white focus-within:ring-2 focus-within:ring-bc-purple/10 focus-within:border-bc-purple transition-all">
                      <span className="text-gray-400 mr-2.5 flex-shrink-0">
                        <Lock size={16} />
                      </span>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full focus:outline-none text-bc-heading placeholder-gray-400 text-sm font-medium bg-transparent"
                      />
                    </div>
                  </div>

                  {!isLogin && (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold text-bc-navy uppercase tracking-widest font-montserrat mb-1.5 ml-1">Téléphone (WhatsApp)</label>
                        <div className="relative border border-gray-200 rounded-2xl p-3 flex items-center bg-gray-50/30 focus-within:bg-white focus-within:ring-2 focus-within:ring-bc-purple/10 focus-within:border-bc-purple transition-all">
                          <span className="text-gray-400 mr-2.5 flex-shrink-0">
                            <Phone size={16} />
                          </span>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Ex: +229 90 00 00 00"
                            className="w-full focus:outline-none text-bc-heading placeholder-gray-400 text-sm font-medium bg-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-bc-navy uppercase tracking-widest font-montserrat mb-1.5 ml-1">Adresse de livraison par défaut</label>
                        <div className="relative border border-gray-200 rounded-2xl p-3 flex items-center bg-gray-50/30 focus-within:bg-white focus-within:ring-2 focus-within:ring-bc-purple/10 focus-within:border-bc-purple transition-all">
                          <span className="text-gray-400 mr-2.5 flex-shrink-0">
                            <MapPin size={16} />
                          </span>
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Ex: Maison X, Quartier Y, Cotonou"
                            className="w-full focus:outline-none text-bc-heading placeholder-gray-400 text-sm font-medium bg-transparent"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={formLoading}
                    className="w-full flex justify-center items-center py-4 px-4 rounded-2xl shadow-yellow-glow text-sm font-montserrat font-bold uppercase tracking-wider text-bc-purple bg-gold-gradient hover:bg-yellow-400 focus:outline-none transition-all duration-200 cursor-pointer disabled:opacity-50"
                  >
                    {formLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-bc-purple" />
                    ) : isLogin ? (
                      <>
                        Se Connecter <ArrowRight size={16} className="ml-2" />
                      </>
                    ) : (
                      <>
                        Créer mon Compte <UserPlus size={16} className="ml-2" />
                      </>
                    )}
                  </motion.button>
                </form>

                <div className="mt-8 text-center">
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError('');
                    }}
                    className="text-xs text-bc-purple hover:underline font-bold font-montserrat uppercase tracking-wider"
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* User Info Sidebar (Left) */}
              <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-[32px] shadow-card border border-gray-100/60 h-fit space-y-8">
                {profileSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-600 rounded-2xl p-4 text-xs font-semibold shadow-sm">
                    {profileSuccess}
                  </div>
                )}
                
                <div className="flex items-center space-x-4 pb-6 border-b border-gray-100">
                  <div className="w-16 h-16 rounded-2xl bg-purple-gradient text-white flex items-center justify-center font-bold text-xl font-montserrat shadow-purple-glow">
                    {user.name ? user.name.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-bc-navy font-montserrat line-clamp-1 leading-tight">{user.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] bg-purple-50 text-bc-purple border border-purple-100 font-extrabold uppercase tracking-widest inline-block">
                      {user.role === 'ADMIN' ? 'Administrateur' : 'Client Privilégié'}
                    </span>
                  </div>
                </div>

                {isEditingProfile ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    {profileError && (
                      <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-xs font-semibold shadow-sm">
                        {profileError}
                      </div>
                    )}
                    <div>
                      <label className="block text-[10px] font-bold text-bc-navy uppercase tracking-widest font-montserrat mb-1.5 ml-1">Nom Complet</label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-bc-heading focus:ring-2 focus:ring-bc-purple focus:border-bc-purple outline-none text-sm font-medium transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-bc-navy uppercase tracking-widest font-montserrat mb-1.5 ml-1">Téléphone (WhatsApp)</label>
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-bc-heading focus:ring-2 focus:ring-bc-purple focus:border-bc-purple outline-none text-sm font-medium transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-bc-navy uppercase tracking-widest font-montserrat mb-1.5 ml-1">Adresse de livraison</label>
                      <input
                        type="text"
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-bc-heading focus:ring-2 focus:ring-bc-purple focus:border-bc-purple outline-none text-sm font-medium transition-all"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={profileSubmitting}
                        className="flex-1 py-3 px-4 bg-bc-purple hover:bg-bc-purpleDark text-white rounded-2xl text-xs font-montserrat font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                      >
                        {profileSubmitting ? '...' : 'Enregistrer'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingProfile(false);
                          setProfileError('');
                        }}
                        className="flex-1 py-3 px-4 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-2xl text-xs font-montserrat font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3.5 text-sm">
                        <Mail className="text-gray-400 mt-1 flex-shrink-0" size={16} />
                        <div className="space-y-0.5">
                          <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest font-montserrat">E-mail</span>
                          <span className="font-semibold text-bc-heading">{user.email}</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3.5 text-sm">
                        <Phone className="text-gray-400 mt-1 flex-shrink-0" size={16} />
                        <div className="space-y-0.5">
                          <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest font-montserrat">WhatsApp / Tél</span>
                          <span className="font-semibold text-bc-heading">
                            {user.phone || 'Non renseigné'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3.5 text-sm">
                        <MapPin className="text-gray-400 mt-1 flex-shrink-0" size={16} />
                        <div className="space-y-0.5">
                          <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest font-montserrat">Adresse de livraison</span>
                          <span className="font-semibold text-bc-heading leading-relaxed">
                            {user.address || 'Non renseignée'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setEditName(user.name || '');
                          setEditPhone(user.phone || '');
                          setEditAddress(user.address || '');
                          setIsEditingProfile(true);
                        }}
                        className="w-full flex items-center justify-center py-3 px-4 bg-bc-purple/10 text-bc-purple hover:bg-bc-purple/20 rounded-2xl text-xs font-montserrat font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Modifier mon profil
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center py-3 px-4 border border-red-200 rounded-2xl text-xs font-montserrat font-bold uppercase tracking-wider text-red-600 hover:bg-red-50/50 transition-colors cursor-pointer"
                      >
                        <LogOut size={14} className="mr-2" /> Déconnexion
                      </motion.button>
                    </div>
                  </>
                )}
              </div>

              {/* Orders History Main Area (Right) */}
              <div className="lg:col-span-8">
                <div className="bg-white p-6 sm:p-8 rounded-[32px] shadow-card border border-gray-100/60">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-bc-purple font-montserrat flex items-center">
                      <ShoppingBag className="mr-2.5 text-bc-yellow animate-pulse" size={20} /> Mes Commandes
                    </h3>
                    <span className="bg-bc-purple/10 text-bc-purple px-3.5 py-1 rounded-full text-xs font-montserrat font-bold">
                      {orders.length} commande{orders.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-16 space-y-6">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                        <ShoppingBag size={32} />
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-500 font-medium text-sm">Vous n&apos;avez pas encore passé de commande.</p>
                        <p className="text-xs text-gray-400">Parcourez notre catalogue premium pour faire plaisir à vos proches.</p>
                      </div>
                      <button
                        onClick={() => router.push('/catalogue')}
                        className="inline-flex items-center px-6 py-3 rounded-2xl text-xs font-montserrat font-bold uppercase tracking-wider text-bc-purple bg-bc-yellow hover:bg-yellow-400 transition-colors shadow-sm"
                      >
                        Parcourir le catalogue
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div 
                          key={order.id} 
                          className="border border-gray-100 rounded-3xl p-5 sm:p-6 hover:border-gray-200/80 hover:shadow-card transition-all duration-300 space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100/50 gap-3">
                            <div className="space-y-1">
                              <span className="text-sm font-bold text-bc-purple block font-montserrat">
                                Commande #{order.orderNumber}
                              </span>
                              <span className="text-xs text-gray-400 flex items-center font-medium">
                                <Calendar size={12} className="mr-1.5 text-bc-yellow" />
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
                          <div className="py-2 space-y-4">
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
                                <div key={item.id} className="flex items-center justify-between text-sm gap-3">
                                  <div className="flex items-center space-x-3.5">
                                    <div className="w-12 h-12 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                                      <img 
                                        src={images[0] || '/1-19.png'} 
                                        alt={item.product.name} 
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="space-y-0.5">
                                      <span className="font-bold text-bc-navy block line-clamp-1">
                                        {item.product.name}
                                      </span>
                                      <span className="text-xs text-gray-400 font-semibold">
                                        Qté : {item.quantity} × {item.price.toLocaleString('fr-FR')} FCFA
                                      </span>
                                      {item.customizationMessage && (
                                        <span className="block text-[11px] text-bc-purple font-medium italic">
                                          Message : &quot;{item.customizationMessage}&quot;
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <span className="font-extrabold text-bc-navy flex-shrink-0">
                                    {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Order Footer */}
                          <div className="pt-4 border-t border-gray-100/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="text-xs text-gray-400 font-medium">
                              <span>Frais d&apos;expédition ({order.shippingZone.name}) : </span>
                              <span className="font-bold text-bc-heading">
                                {order.shippingFee.toLocaleString('fr-FR')} FCFA
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-5">
                              <div className="text-right">
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block font-montserrat">Montant Total</span>
                                <span className="text-lg font-black text-bc-purple font-montserrat">
                                  {order.totalAmount.toLocaleString('fr-FR')} FCFA
                                </span>
                              </div>
                              
                              {order.status === 'EN_ATTENTE' && (
                                <motion.button
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() => router.push(`/commander?order=${order.orderNumber}`)}
                                  className="inline-flex items-center px-4.5 py-2.5 rounded-2xl text-xs font-montserrat font-extrabold uppercase tracking-wider text-bc-purple bg-bc-yellow hover:bg-yellow-400 shadow-sm transition-all cursor-pointer"
                                >
                                  <CreditCard size={14} className="mr-1.5" /> Payer
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

