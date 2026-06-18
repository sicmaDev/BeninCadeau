"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

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
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('cart-updated', updateCount);
    };
  }, [pathname]);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Catalogue', path: '/catalogue' },
    { name: 'Nos propositions', path: '/nos-propositions' },
    { name: 'À propos', path: '/a-propos' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 font-instrument w-full",
        isScrolled
          ? "glass-panel py-2 shadow-card"
          : "bg-white py-4 border-b border-gray-100"
      )}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-[68px]">
          
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              src="/1-19.png"
              alt="Bénin Cadeau"
              className="w-[70px] h-[68px] object-contain cursor-pointer"
            />
          </Link>

          {/* Desktop Nav - right aligned */}
          <div className="hidden lg:flex items-center space-x-10">
            <nav className="flex space-x-10 items-center">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    href={link.path}
                    className="relative py-1 font-semibold text-[17px] tracking-wide text-bc-heading hover:text-bc-purple transition-colors whitespace-nowrap group"
                  >
                    <span>{link.name}</span>
                    {isActive ? (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[3px] bg-bc-yellow rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    ) : (
                      <span className="absolute bottom-0 left-1/2 w-0 h-[3px] bg-bc-yellow/60 rounded-full transition-all duration-300 group-hover:w-full group-hover:left-0" />
                    )}
                  </Link>
                );
              })}
              {userRole === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="font-bold text-[17px] text-red-500 hover:text-red-700 transition-colors whitespace-nowrap border border-red-200 hover:border-red-400 rounded-xl px-4 py-1.5 bg-red-50/50"
                >
                  Admin Panel
                </Link>
              )}
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-6 border-l pl-6 border-gray-200">
              {/* Account Link */}
              <Link href="/compte" className="text-bc-navy hover:text-bc-purple transition-all hover:scale-110 relative p-1" title="Mon Compte">
                <User size={23} />
              </Link>

              {/* Cart Indicator */}
              <Link href="/panier" className="text-bc-navy hover:text-bc-purple transition-all hover:scale-110 relative p-1" title="Panier">
                <ShoppingCart size={23} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1.5 -right-1.5 bg-bc-yellow text-bc-purple font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-yellow-glow"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center space-x-3">
            
            {/* Account Icon Mobile */}
            <Link href="/compte" className="text-bc-navy hover:text-bc-purple p-2 transition-transform active:scale-95">
              <User size={22} />
            </Link>

            {/* Cart Icon Mobile */}
            <Link href="/panier" className="text-bc-navy hover:text-bc-purple p-2 relative transition-transform active:scale-95">
              <ShoppingCart size={22} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-1 right-1 bg-bc-yellow text-bc-purple font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Burger Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-bc-heading hover:text-bc-purple focus:outline-none p-2 rounded-xl transition-colors hover:bg-gray-100"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 py-4 shadow-premium"
          >
            <div className="px-6 space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'block px-4 py-3 rounded-xl text-base font-semibold transition-all',
                      isActive
                        ? 'text-bc-purple bg-bc-purpleLight font-bold'
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
                  className="block px-4 py-3 rounded-xl text-base font-bold text-red-500 bg-red-50"
                >
                  Tableau de bord Admin
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

