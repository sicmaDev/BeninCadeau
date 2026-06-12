"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { cn } from '@/utils/cn';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [userRole, setUserRole] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const updateCount = () => {
      try {
        const savedCart = localStorage.getItem('bc_cart');
        if (savedCart) {
          const items = JSON.parse(savedCart);
          const count = items.reduce((acc: number, item: { quantity: number }) => acc + item.quantity, 0);
          setCartCount(count);
        } else {
          setCartCount(0);
        }
      } catch (e) {
        setCartCount(0);
      }
    };

    updateCount();
    window.addEventListener('cart-updated', updateCount);

    // Fetch user info to check if they are logged in or admin
    fetch('/api/auth/me')
      .then(res => {
        if (res.ok) return res.json();
        return null;
      })
      .then(data => {
        if (data && data.user) {
          setUserRole(data.user.role);
        } else {
          setUserRole(null);
        }
      })
      .catch(() => setUserRole(null));

    return () => {
      window.removeEventListener('cart-updated', updateCount);
    };
  }, [pathname]);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Catalogue', path: '/catalogue' },
    { name: 'Nos propositions', path: '/nos-propositions' },
    { name: 'A propos', path: '/a-propos' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm font-instrument">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-[88px] relative">
          
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="/1-19.png"
              alt="Bénin Cadeau"
              className="w-[83px] h-[80px] object-contain cursor-pointer"
            />
          </Link>

          {/* Desktop Nav - right aligned */}
          <div className="hidden lg:flex items-center space-x-8">
            <nav className="flex space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    href={link.path}
                    className={cn(
                      'font-semibold text-[18px] transition-colors whitespace-nowrap',
                      isActive
                        ? 'text-bc-purple font-bold border-b-2 border-bc-yellow pb-1'
                        : 'text-bc-heading hover:text-bc-purple'
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
              {userRole === 'ADMIN' && (
                <Link
                  href="/admin"
                  className={cn(
                    'font-semibold text-[18px] text-red-600 hover:text-red-700 transition-colors whitespace-nowrap'
                  )}
                >
                  Admin Panel
                </Link>
              )}
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-5 border-l pl-5 border-gray-200">
              {/* Account Link */}
              <Link href="/compte" className="text-bc-navy hover:text-bc-purple transition-colors relative" title="Mon Compte">
                <User size={24} />
              </Link>

              {/* Cart Indicator */}
              <Link href="/panier" className="text-bc-navy hover:text-bc-purple transition-colors relative" title="Panier">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-bc-yellow text-bc-purple font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Actions (Cart, Account, Menu) */}
          <div className="flex lg:hidden items-center space-x-4">
            
            {/* Account Icon Mobile */}
            <Link href="/compte" className="text-bc-navy hover:text-bc-purple p-2">
              <User size={24} />
            </Link>

            {/* Cart Icon Mobile */}
            <Link href="/panier" className="text-bc-navy hover:text-bc-purple p-2 relative">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-bc-yellow text-bc-purple font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Burger Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-bc-heading hover:text-bc-yellow focus:outline-none p-2"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 py-3 shadow-inner">
          <div className="px-4 space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'block px-3 py-2.5 rounded-xl text-base font-semibold',
                    isActive
                      ? 'text-bc-purple bg-purple-50 font-bold'
                      : 'text-bc-heading hover:text-bc-purple hover:bg-gray-50'
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
            {userRole === 'ADMIN' && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-base font-bold text-red-600 bg-red-50"
              >
                Tableau de bord Admin
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
