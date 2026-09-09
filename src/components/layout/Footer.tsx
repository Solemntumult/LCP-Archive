'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, ArrowUpRight, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t, language } = useLanguage();

  return (
    <footer className="w-full bg-[#173124] text-white border-t-4 border-[#7a5739] mt-24 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10 pb-10 border-b border-white/15">
          {/* Col 1: Brand & Legacy (2 cols on md) */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-2xl overflow-hidden border border-white/20 shadow-md shrink-0">
                <Image
                  src="/icon.svg"
                  alt="LCP Archives Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-serif font-black text-2xl text-white tracking-tight">
                  LCP Archives
                </span>
                <p className="text-xs text-[#b0cdbb] font-medium">
                  {t('nav_subtitle')}
                </p>
              </div>
            </div>

            <p className="text-sm text-[#d8e5dc] leading-relaxed max-w-md font-light">
              {t('footer_tagline')}
            </p>
          </div>

          {/* Col 2: Navigation Rapide */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-base text-[#fdcea9] tracking-wide">
              {t('footer_quick_links')}
            </h4>
            <ul className="space-y-2 text-sm text-[#d8e5dc]">
              <li>
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>{t('nav_dashboard')}</span>
                </Link>
              </li>
              <li>
                <Link href="/tree" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>{t('nav_tree')}</span>
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>{t('nav_events')}</span>
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-[#fdcea9]" />
                  <span>{t('nav_help')}</span>
                </Link>
              </li>
              <li>
                <Link href="/person/add" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>{t('nav_add_member')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Archives & Mémoire */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-base text-[#fdcea9] tracking-wide">
              {t('footer_archives')}
            </h4>
            <ul className="space-y-2 text-sm text-[#d8e5dc]">
              <li>
                <Link href="/person/1" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>{language === 'fr' ? 'Patriarche Paul LISSANON' : 'Patriarch Paul LISSANON'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#fdcea9]" />
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white transition-colors">
                  <span>{language === 'fr' ? 'Chroniques & Récits de famille' : 'Family Chronicles & Stories'}</span>
                </Link>
              </li>
              <li>
                <Link href="/tree" className="hover:text-white transition-colors">
                  <span>{language === 'fr' ? 'Exploration par Foyers' : 'Household Tree Exploration'}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Guarantee */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#98b5a3]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#fdcea9]" />
            <span>{t('footer_made_with_love')}</span>
          </div>

          <p className="text-center sm:text-right">
            © {currentYear} <strong>LCP Archives</strong>. {t('footer_rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
