'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { GitFork, Users, PlusCircle, Search, Menu, X, Sparkles, Home, Calendar } from 'lucide-react';
import SearchModal from '@/components/search/SearchModal';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Tableau de bord', icon: Home },
    { href: '/tree', label: 'Arbre Généalogique', icon: GitFork },
    { href: '/events', label: 'Événements & Récits', icon: Calendar },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#eae1da] bg-[#fff8f4]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-all shrink-0">
                <Image
                  src="/icon.svg"
                  alt="LCP Archives Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="min-w-0">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#173124] truncate">
                  LCP Archives
                </span>
                <p className="text-[11px] sm:text-xs text-[#727973] hidden sm:block truncate">
                  Arbre Généalogique & Mémoire Familiale
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#173124] text-white shadow-xs'
                        : 'text-[#424844] hover:bg-[#f5ece5] hover:text-[#173124]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Quick Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                type="button"
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 text-xs sm:text-sm text-[#727973] bg-[#f5ece5] hover:bg-[#eae1da] hover:text-[#1f1b17] rounded-xl transition-all border border-[#eae1da]"
                title="Rechercher (Ctrl+K)"
              >
                <Search className="w-4 h-4 text-[#7a5739]" />
                <span className="hidden sm:inline">Rechercher</span>
                <kbd className="hidden lg:inline-block text-[10px] font-mono bg-white text-[#727973] border border-[#c2c8c2] px-1.5 py-0.5 rounded shadow-2xs">
                  ⌘K
                </kbd>
              </button>

              {/* Add Member Button */}
              <Link
                href="/person/add"
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#7a5739] text-white hover:bg-[#5f4024] shadow-xs transition-all active:scale-95 shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Ajouter</span>
                <span className="sm:hidden">+</span>
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-[#424844] hover:bg-[#f5ece5]"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#eae1da] bg-[#fff8f4] px-4 pt-3 pb-5 space-y-1.5 animate-fade-in shadow-xl">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#173124] text-white shadow-xs'
                      : 'text-[#424844] hover:bg-[#f5ece5]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
