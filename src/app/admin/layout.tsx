"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  ListFilter,
  Users,
  Truck,
  Tag,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Lock,
  Mail,
  Loader2,
  Package
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const checkAdminSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.user && data.user.role === 'ADMIN') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    } catch (e) {
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdminSession();
  }, [pathname]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.user && data.user.role === 'ADMIN') {
          setIsAdmin(true);
          router.refresh();
        } else {
          setLoginError("Accès refusé : vous devez être administrateur.");
          // Log out immediately if customer logs in here
          await fetch('/api/auth/logout', { method: 'POST' });
        }
      } else {
        setLoginError(data.error || "Identifiants invalides.");
      }
    } catch (err) {
      setLoginError("Une erreur réseau est survenue.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAdmin(false);
      router.push('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const menuItems = [
    { name: 'Tableau de bord', path: '/admin', icon: LayoutDashboard },
    { name: 'Commandes', path: '/admin/commandes', icon: ShoppingBag },
    { name: 'Produits', path: '/admin/produits', icon: Package },
    { name: 'Catégories', path: '/admin/categories', icon: ListFilter },
    { name: 'Clients', path: '/admin/clients', icon: Users },
    { name: 'Zones de livraison', path: '/admin/livraisons', icon: Truck },
    { name: 'Codes promo', path: '/admin/promocodes', icon: Tag },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0E1726] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-bc-yellow animate-spin" />
          <p className="mt-4 text-gray-400 text-sm font-semibold">Vérification des accès administrateur...</p>
        </div>
      </div>
    );
  }

  // Si non admin, afficher le formulaire de connexion Admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0E1726] flex items-center justify-center px-4 font-instrument">
        <div className="max-w-md w-full bg-[#191e3a] rounded-3xl shadow-card p-8 border border-[#1b2e4b] space-y-6">
          
          <div className="text-center space-y-2">
            <img src="/1-19.png" alt="Bénin Cadeau Logo" className="w-20 h-20 mx-auto object-contain" />
            <h1 className="text-2xl font-black text-white font-montserrat tracking-tight">Espace Administrateur</h1>
            <p className="text-gray-400 text-xs font-medium">Connectez-vous pour accéder au back-office</p>
          </div>

          {loginError && (
            <div className="bg-red-950/50 border border-red-800 text-red-400 rounded-xl p-3 text-xs font-semibold text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Adresse E-mail</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@benincadeau.com"
                  className="pl-10 block w-full bg-[#1b2e4b] border border-[#253b5e] rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-bc-yellow text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Mot de Passe</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 block w-full bg-[#1b2e4b] border border-[#253b5e] rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-bc-yellow text-sm font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl font-bold bg-bc-yellow hover:bg-yellow-400 text-bc-purple transition-all duration-200 cursor-pointer disabled:opacity-50 text-sm"
            >
              {loginLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-bc-yellow hover:underline font-semibold">
              ← Retour au site public
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // Dashboard avec Sidebar
  return (
    <div className="min-h-screen bg-[#0E1726] flex font-instrument text-[#E0E6ED]">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#191E3A] border-r border-[#1B2E4B] flex-shrink-0 h-screen sticky top-0">
        <div className="h-20 flex items-center px-6 border-b border-[#1B2E4B] gap-3">
          <img src="/1-19.png" alt="Logo" className="w-10 h-10 object-contain" />
          <span className="font-montserrat font-extrabold text-white text-lg tracking-tight">Admin BC</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all',
                  isActive
                    ? 'bg-bc-yellow text-bc-purple font-extrabold shadow-sm'
                    : 'text-gray-400 hover:bg-[#1B2E4B] hover:text-white'
                )}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#1B2E4B]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-950/20 hover:text-red-300 rounded-xl text-sm font-bold transition-all cursor-pointer"
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative flex flex-col w-64 bg-[#191E3A] h-full border-r border-[#1B2E4B] z-10 animate-slideRight">
            <div className="h-20 flex items-center justify-between px-6 border-b border-[#1B2E4B]">
              <div className="flex items-center gap-3">
                <img src="/1-19.png" alt="Logo" className="w-10 h-10 object-contain" />
                <span className="font-montserrat font-extrabold text-white text-lg tracking-tight">Admin BC</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all',
                      isActive
                        ? 'bg-bc-yellow text-bc-purple font-extrabold shadow-sm'
                        : 'text-gray-400 hover:bg-[#1B2E4B] hover:text-white'
                    )}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-[#1B2E4B]">
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-950/20 hover:text-red-300 rounded-xl text-sm font-bold transition-all cursor-pointer"
              >
                <LogOut size={18} />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Header */}
        <header className="h-20 bg-[#191E3A] border-b border-[#1B2E4B] flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-gray-400 hover:text-white focus:outline-none"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold font-montserrat text-white tracking-tight hidden sm:block">
              Bénin Cadeau Back-Office
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xs text-bc-yellow border border-bc-yellow/30 hover:bg-bc-yellow/10 rounded-lg px-3 py-1.5 transition-all font-semibold uppercase tracking-wider">
              Aller sur le site public
            </Link>
            <span className="h-6 w-px bg-[#1B2E4B] hidden sm:block"></span>
            <div className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="hidden sm:inline">Statut : Connecté Admin</span>
            </div>
          </div>
        </header>

        {/* Dynamic page content */}
        <main className="flex-grow p-6 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
