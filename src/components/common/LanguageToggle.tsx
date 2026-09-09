'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function LanguageToggle({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`relative inline-flex items-center bg-[#f5ece5] p-0.5 sm:p-1 rounded-xl border border-[#eae1da] h-8 sm:h-9 w-[68px] sm:w-[78px] shrink-0 select-none ${className}`}
      role="group"
      aria-label="Language selection"
    >
      <button
        type="button"
        onClick={() => setLanguage('fr')}
        className={`relative z-10 w-1/2 h-full flex items-center justify-center text-[10px] sm:text-[11px] font-bold font-mono tracking-wider rounded-lg transition-all duration-200 ${
          language === 'fr'
            ? 'bg-[#173124] text-white shadow-xs'
            : 'text-[#5c645e] hover:text-[#173124]'
        }`}
      >
        FR
      </button>

      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`relative z-10 w-1/2 h-full flex items-center justify-center text-[10px] sm:text-[11px] font-bold font-mono tracking-wider rounded-lg transition-all duration-200 ${
          language === 'en'
            ? 'bg-[#173124] text-white shadow-xs'
            : 'text-[#5c645e] hover:text-[#173124]'
        }`}
      >
        EN
      </button>
    </div>
  );
}
