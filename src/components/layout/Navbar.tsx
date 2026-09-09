'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { GitFork, PlusCircle, Search, Menu, X, Home, Calendar, HelpCircle } from 'lucide-react';
import SearchModal from '@/components/search/SearchModal';
import LanguageToggle from '@/components/common/LanguageToggle';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { href: '/', label: t('nav_dashboard'), icon: Home },
    { href: '/tree', label: t('nav_tree'), icon: GitFork },
    { href: '/events', label: t('nav_events'), icon: Calendar },
    { href: '/help', label: t('nav_help'), icon: HelpCircle },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#eae1da] bg-[#fff8f4]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink min-w-0">
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-all shrink-0">
                <Image
                  src="/icon.svg"
                  alt="LCP Archives Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="min-w-0">
                <span className="font-serif text-base sm:text-xl font-bold tracking-tight text-[#173124] block truncate">
                  LCP Archives
                </span>
                <p className="text-[10px] sm:text-xs text-[#727973] hidden md:block truncate">
                  {t('nav_subtitle')}
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1.5 shrink-0">
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
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Toolbar */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {/* Language Switcher */}
              <LanguageToggle />

              {/* Quick Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                type="button"
                className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 text-xs sm:text-sm text-[#727973] bg-[#f5ece5] hover:bg-[#eae1da] hover:text-[#1f1b17] rounded-xl transition-all border border-[#eae1da] shrink-0"
                title={`${t('nav_search')} (Ctrl+K)`}
                aria-label={t('nav_search')}
              >
                <Search className="w-4 h-4 text-[#7a5739] shrink-0" />
                <span className="hidden md:inline whitespace-nowrap">{t('nav_search')}</span>
                <kbd className="hidden xl:inline-block text-[10px] font-mono bg-white text-[#727973] border border-[#c2c8c2] px-1.5 py-0.5 rounded shadow-2xs">
                  Ctrl+K
                </kbd>
              </button>

              {/* Add Member Button (Desktop & Tablet) */}
              <Link
                href="/person/add"
                className="hidden sm:flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#7a5739] text-white hover:bg-[#5f4024] shadow-xs transition-all active:scale-95 shrink-0"
              >
                <PlusCircle className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">{t('nav_add_member')}</span>
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-[#424844] hover:bg-[#f5ece5] transition-colors shrink-0"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#eae1da] bg-[#fff8f4] px-4 pt-3 pb-5 space-y-2 animate-fade-in shadow-xl">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[#173124] text-white shadow-xs'
                        : 'text-[#424844] hover:bg-[#f5ece5]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Quick Add Member button in mobile drawer */}
            <div className="pt-2 border-t border-[#eae1da]">
              <Link
                href="/person/add"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-bold bg-[#7a5739] text-white hover:bg-[#5f4024] shadow-xs transition-all active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t('nav_add_member')}</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
