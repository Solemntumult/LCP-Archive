'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function LanguageToggle({ className = '' }: { className?: string }) {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 active:scale-95 ${
        language === 'en'
          ? 'bg-[#173124] text-white border-[#173124] shadow-xs'
          : 'bg-[#f5ece5] text-[#424844] border-[#eae1da] hover:bg-[#eae1da] hover:text-[#1f1b17]'
      } ${className}`}
      title={language === 'fr' ? 'Switch to English' : 'Passer en Fran?ais'}
      aria-label="Changer de langue / Change language"
    >
      <Globe className="w-3.5 h-3.5 text-[#7a5739] shrink-0" />
      <span className="uppercase tracking-wider font-mono text-[11px]">
        {language === 'fr' ? 'FR' : 'EN'}
      </span>
      <span className="text-[10px] text-[#8c948e] font-normal hidden lg:inline">
        {language === 'fr' ? '? EN' : '? FR'}
      </span>
    </button>
  );
}
