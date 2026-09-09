'use client';

import React from 'react';
import { Home, ChevronRight, Users } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface BreadcrumbProps {
  navigationHistory: number[];
  activePersonId: number;
  personNames: Record<number, string>;
  onNavigate: (personId: number) => void;
  onGoHome: () => void;
}

export default function Breadcrumb({
  navigationHistory,
  activePersonId,
  personNames,
  onNavigate,
  onGoHome,
}: BreadcrumbProps) {
  const { t } = useLanguage();

  return (
    <nav className="flex items-center gap-1.5 text-xs text-[#727973] flex-wrap" aria-label="Breadcrumb">
      <button
        onClick={onGoHome}
        className="flex items-center gap-1 hover:text-[#173124] transition-colors p-1 rounded-lg hover:bg-white/80"
        title={t('tree_root_patriarch')}
      >
        <Home className="w-3.5 h-3.5 text-[#7a5739]" />
        <span className="font-semibold text-[#173124]">{t('tree_root_patriarch')}</span>
      </button>

      {navigationHistory.map((id) => (
        <React.Fragment key={`crumb-${id}`}>
          <ChevronRight className="w-3 h-3 text-[#c2c8c2] shrink-0" />
          <button
            onClick={() => onNavigate(id)}
            className="hover:text-[#173124] transition-colors p-1 rounded-lg hover:bg-white/80 truncate max-w-[120px] sm:max-w-[160px]"
          >
            {personNames[id] || `${t('explore_foyer')} #${id}`}
          </button>
        </React.Fragment>
      ))}

      {navigationHistory.length > 0 && (
        <>
          <ChevronRight className="w-3 h-3 text-[#c2c8c2] shrink-0" />
          <span className="font-bold text-[#173124] truncate max-w-[140px] sm:max-w-[180px] bg-white px-2 py-0.5 rounded-lg border border-[#eae1da] shadow-2xs">
            {personNames[activePersonId] || `${t('explore_foyer')} #${activePersonId}`}
          </span>
        </>
      )}
    </nav>
  );
}
