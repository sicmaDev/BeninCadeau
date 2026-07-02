"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, User, Search } from 'lucide-react';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchVal, setSearchVal] = useState('');
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      window.location.href = `/catalogue?q=${encodeURIComponent(searchVal.trim())}`;
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 w-full",
        isScrolled
          ? "bg-white/95 backdrop-blur-md py-2.5 border-b border-zinc-100 shadow-sm"
          : "bg-white py-3.5 border-b border-zinc-100"
      )}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-[60px]">
          
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <motion.img
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 12 }}
              src="/1-19.png"
              alt="Bénin Cadeau"
              className="w-[60px] h-[58px] object-contain cursor-pointer"
            />
          </Link>

          {/* Desktop Nav - center aligned */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={cn(
                    "relative py-2 text-sm font-semibold tracking-wide transition-colors whitespace-nowrap",
                    isActive ? "text-bc-purple font-bold" : "text-zinc-600 hover:text-bc-purple"
                  )}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-bc-yellow rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side controls */}
          <div className="hidden lg:flex items-center space-x-5">
            {/* Search Pill */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="pl-9 pr-4 py-1.5 rounded-full border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white focus:outline-none focus:border-bc-purple text-xs w-40 focus:w-56 transition-all font-medium"
              />
              <Search size={14} className="absolute left-3 text-zinc-400 pointer-events-none" />
            </form>

            <div className="h-5 w-[1px] bg-zinc-200" />

            {/* Account Icon */}
            <Link href="/compte" className="text-zinc-700 hover:text-bc-purple transition-all p-1.5 rounded-full hover:bg-zinc-50 relative flex items-center justify-center" title="Mon Compte">
              <User size={19} />
            </Link>

            {/* Cart Icon */}
            <Link href="/panier" className="text-zinc-700 hover:text-bc-purple transition-all p-1.5 rounded-full hover:bg-zinc-50 relative flex items-center justify-center" title="Panier">
              <ShoppingCart size={19} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 bg-bc-yellow text-bc-purple font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white shadow-sm"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center space-x-2">
            {/* Account Mobile */}
            <Link href="/compte" className="text-zinc-700 hover:text-bc-purple p-2 rounded-full hover:bg-zinc-50 transition-colors">
              <User size={19} />
            </Link>

            {/* Cart Mobile */}
            <Link href="/panier" className="text-zinc-700 hover:text-bc-purple p-2 rounded-full hover:bg-zinc-50 transition-colors relative">
              <ShoppingCart size={19} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-1 right-1 bg-bc-yellow text-bc-purple font-black text-[8px] w-4 h-4 rounded-full flex items-center justify-center border border-white"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Search Button Mobile (redirects to catalog) */}
            <Link href="/catalogue" className="text-zinc-700 hover:text-bc-purple p-2 rounded-full hover:bg-zinc-50 transition-colors">
              <Search size={19} />
            </Link>

            {/* Burger Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-700 hover:text-bc-purple p-2 rounded-full hover:bg-zinc-50 transition-colors focus:outline-none"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-zinc-100 py-3 shadow-md"
          >
            <div className="px-5 space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all',
                      isActive
                        ? 'text-bc-purple bg-bc-purpleLight font-bold'
                        : 'text-zinc-700 hover:text-bc-purple hover:bg-zinc-50'
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
