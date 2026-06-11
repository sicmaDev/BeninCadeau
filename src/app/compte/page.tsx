"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, ShoppingBag, LogOut, Lock, UserPlus, ArrowRight, Calendar, CreditCard } from 'lucide-react';

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

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
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
      
      // Clear forms
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
    const statuses: Record<string, { bg: string, text: string, label: string }> = {
      EN_ATTENTE: { bg: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: 'text-yellow-800', label: 'En attente de paiement' },
      PAYEE: { bg: 'bg-blue-100 text-blue-800 border-blue-200', text: 'text-blue-800', label: 'Payée' },
      EN_PREPARATION: { bg: 'bg-purple-100 text-purple-800 border-purple-200', text: 'text-purple-800', label: 'En préparation' },
      EXPEDIEE: { bg: 'bg-indigo-100 text-indigo-800 border-indigo-200', text: 'text-indigo-800', label: 'Expédiée' },
      LIVREE: { bg: 'bg-green-100 text-green-800 border-green-200', text: 'text-green-800', label: 'Livrée' },
      ANNULEE: { bg: 'bg-red-100 text-red-800 border-red-200', text: 'text-red-800', label: 'Annulée' },
    };

    const current = statuses[status] || { bg: 'bg-gray-100 text-gray-800 border-gray-200', text: 'text-gray-800', label: status };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${current.bg}`}>
        {current.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bc-bg flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-bc-yellow border-t-bc-purple rounded-full animate-spin"></div>
          <p className="mt-4 text-bc-heading font-medium">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bc-bg py-12 px-4 sm:px-6 lg:px-8 font-instrument">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-3xl font-extrabold text-bc-purple font-montserrat tracking-tight mb-8">
          Mon Espace Client
        </h1>
        {!user ? (
          /* AUTHENTICATION FORM */
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-card overflow-hidden border border-gray-100">
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold font-montserrat text-bc-purple">
                  {isLogin ? 'Connexion' : 'Création de compte'}
                </h2>
                <p className="text-gray-500 mt-2">
                  {isLogin 
                    ? 'Accédez à votre historique et gérez vos commandes' 
                    : 'Rejoignez-nous pour passer des commandes plus rapidement'}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm mb-6 font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nom Complet</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <User size={18} />
                      </span>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Jean DUPONT"
                        className="pl-10 block w-full rounded-xl border border-gray-300 py-3 px-4 text-bc-heading focus:ring-bc-purple focus:border-bc-purple outline-none"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Adresse E-mail</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <Mail size={18} />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ex: jean.dupont@mail.com"
                      className="pl-10 block w-full rounded-xl border border-gray-300 py-3 px-4 text-bc-heading focus:ring-bc-purple focus:border-bc-purple outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Mot de Passe</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <Lock size={18} />
                    </span>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 block w-full rounded-xl border border-gray-300 py-3 px-4 text-bc-heading focus:ring-bc-purple focus:border-bc-purple outline-none"
                    />
                  </div>
                </div>

                {!isLogin && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Téléphone (WhatsApp de préférence)</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                          <Phone size={18} />
                        </span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Ex: +229 90 00 00 00"
                          className="pl-10 block w-full rounded-xl border border-gray-300 py-3 px-4 text-bc-heading focus:ring-bc-purple focus:border-bc-purple outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Adresse de livraison par défaut</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                          <MapPin size={18} />
                        </span>
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Ex: Maison X, Quartier Y, Cotonou"
                          className="pl-10 block w-full rounded-xl border border-gray-300 py-3 px-4 text-bc-heading focus:ring-bc-purple focus:border-bc-purple outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-bc-purple bg-bc-yellow hover:bg-yellow-400 focus:outline-none transition-all duration-200 cursor-pointer disabled:opacity-50"
                >
                  {formLoading ? (
                    <div className="w-6 h-6 border-2 border-bc-purple border-t-transparent rounded-full animate-spin"></div>
                  ) : isLogin ? (
                    <>
                      Se Connecter <ArrowRight size={18} className="ml-2" />
                    </>
                  ) : (
                    <>
                      Créer mon Compte <UserPlus size={18} className="ml-2" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                  className="text-sm text-bc-purple hover:underline font-semibold"
                >
                  {isLogin 
                    ? "Nouveau sur Bénin Cadeau ? Créer un compte" 
                    : "Déjà un compte ? Connectez-vous"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* CUSTOMER DASHBOARD */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* User Info Sidebar */}
            <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100 h-fit">
              <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-100">
                <div className="w-16 h-16 rounded-full bg-bc-purple text-white flex items-center justify-center font-bold text-2xl font-montserrat">
                  {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-bc-purple font-montserrat">{user.name}</h3>
                  <span className="px-2 py-0.5 rounded text-xs bg-purple-50 text-bc-purple border border-purple-100 font-semibold uppercase">
                    {user.role === 'ADMIN' ? 'Administrateur' : 'Client'}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="text-gray-400 mt-0.5" size={18} />
                  <div>
                    <span className="block text-xs text-gray-400">Adresse E-mail</span>
                    <span className="text-sm font-medium text-bc-heading">{user.email}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="text-gray-400 mt-0.5" size={18} />
                  <div>
                    <span className="block text-xs text-gray-400">Téléphone</span>
                    <span className="text-sm font-medium text-bc-heading">
                      {user.phone || 'Non renseigné'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="text-gray-400 mt-0.5" size={18} />
                  <div>
                    <span className="block text-xs text-gray-400">Adresse de livraison</span>
                    <span className="text-sm font-medium text-bc-heading">
                      {user.address || 'Non renseignée'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="mt-8 w-full flex items-center justify-center py-2.5 px-4 border border-red-200 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors duration-200 cursor-pointer"
              >
                <LogOut size={16} className="mr-2" /> Déconnexion
              </button>
            </div>

            {/* Orders History Main Area */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <h3 className="text-2xl font-bold text-bc-purple font-montserrat flex items-center">
                    <ShoppingBag className="mr-2 text-bc-yellow" size={24} /> Historique de commandes
                  </h3>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-bold">
                    {orders.length} commande{orders.length > 1 ? 's' : ''}
                  </span>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">Vous n&apos;avez pas encore passé de commande.</p>
                    <button
                      onClick={() => router.push('/catalogue')}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-bold text-bc-purple bg-bc-yellow hover:bg-yellow-400 transition-colors"
                    >
                      Parcourir le catalogue
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div 
                        key={order.id} 
                        className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors duration-200"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-50 gap-2">
                          <div>
                            <span className="text-sm font-bold text-bc-purple block font-montserrat">
                              Commande #{order.orderNumber}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center mt-1">
                              <Calendar size={12} className="mr-1" />
                              {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(order.status)}
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="py-4 space-y-3">
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
                              <div key={item.id} className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                    <img 
                                      src={images[0] || '/1-19.png'} 
                                      alt={item.product.name} 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <span className="font-medium text-bc-heading block">
                                      {item.product.name}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      Qté: {item.quantity} × {item.price.toLocaleString('fr-FR')} FCFA
                                    </span>
                                    {item.customizationMessage && (
                                      <span className="block text-xs text-bc-purple mt-0.5 italic">
                                        Perso: &quot;{item.customizationMessage}&quot;
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <span className="font-semibold text-bc-heading">
                                  {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Order Footer */}
                        <div className="pt-4 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div className="text-xs text-gray-400">
                            <span>Frais de livraison ({order.shippingZone.name}) : </span>
                            <span className="font-medium text-bc-heading">
                              {order.shippingFee.toLocaleString('fr-FR')} FCFA
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                            <div className="text-right">
                              <span className="text-xs text-gray-400 block">Total</span>
                              <span className="text-lg font-bold text-bc-purple font-montserrat">
                                {order.totalAmount.toLocaleString('fr-FR')} FCFA
                              </span>
                            </div>
                            
                            {order.status === 'EN_ATTENTE' && (
                              <button
                                onClick={() => router.push(`/commander?order=${order.orderNumber}`)}
                                className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold text-bc-purple bg-bc-yellow hover:bg-yellow-400 shadow-sm transition-all"
                              >
                                <CreditCard size={14} className="mr-1" /> Payer
                              </button>
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
    </div>
  );
}
