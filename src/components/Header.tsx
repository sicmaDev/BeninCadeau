"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/utils/cn';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Acceuil', path: '/' },
    { name: 'A propos', path: '/a-propos' },
    { name: 'Nos propositions', path: '/nos-propositions' },
    { name: 'Nos packs', path: '/nos-packs' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center h-[88px] relative">
          {/* Logo - positioned at x=113 in Figma */}
          <Link
            href="/"
            className="flex items-center"
            style={{ marginLeft: '8px' }}>
            <img
              src="/1-19.png"
              alt="Bénin Cadeau"
              className="w-[83px] h-[80px] object-contain" />
          </Link>

          {/* Desktop Nav - right aligned */}
          <nav className="hidden lg:flex space-x-10 ml-auto">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={cn(
                    'font-instrument font-semibold text-[20px] transition-colors whitespace-nowrap',
                    isActive
                      ? 'text-bc-yellow'
                      : 'text-bc-heading hover:text-bc-yellow'
                  )}>
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden ml-auto">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-bc-heading hover:text-bc-yellow focus:outline-none">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen &&
        <div className="lg:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'block px-3 py-2 rounded-md font-instrument font-semibold text-lg',
                    isActive
                      ? 'text-bc-yellow bg-gray-50'
                      : 'text-bc-heading hover:text-bc-yellow hover:bg-gray-50'
                  )}>
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      }
    </header>
  );
}
