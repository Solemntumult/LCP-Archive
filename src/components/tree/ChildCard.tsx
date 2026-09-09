'use client';

import React from 'react';
import Image from 'next/image';
import { GitFork, User } from 'lucide-react';
import { FoyerChildData } from '@/types';
import { isDeceased } from '@/lib/genealogy';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export interface ChildCardProps {
  child: FoyerChildData;
  onDeploy: (childId: number) => void;
}

export default function ChildCard({ child, onDeploy }: ChildCardProps) {
  const { t, language } = useLanguage();
  const isMale = child.gender === 'M';

  const getYear = (dateStr?: string | null): number | null => {
    if (!dateStr) return null;
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getFullYear())) {
      return parsed.getFullYear();
    }
    const match = dateStr.match(/\b\d{4}\b/);
    return match ? parseInt(match[0], 10) : null;
  };

  const birthYear = getYear(child.birth_date);
  const deathYear = getYear(child.death_date);
  const dead = isDeceased(child);

  const yearDisplay = birthYear
    ? deathYear
      ? `${t('born_in_year')} ${birthYear} ? ?${deathYear}`
      : dead
      ? `${t('born_in_year')} ${birthYear} ? ${t('deceased')}`
      : `${t('born_in_year')} ${birthYear}`
    : deathYear
    ? `?${deathYear}`
    : dead
    ? t('deceased')
    : t('unknown_date');

  const initials = `${child.first_name?.[0] || ''}${child.last_name?.[0] || ''}`.toUpperCase();

  return (
    <div className="bg-[#fff8f4] rounded-2xl border border-[#eae1da] p-4 hover:border-[#173124] hover:shadow-md transition-all flex flex-col justify-between gap-3 group">
      <div className="flex items-start gap-3 min-w-0">
        <div className="relative shrink-0">
          <div
            className={`w-[44px] h-[44px] rounded-full overflow-hidden border-2 flex items-center justify-center shadow-xs relative ${
              isMale
                ? 'border-[#2980b9] bg-[#2980b9]'
                : 'border-[#c0392b] bg-[#c0392b]'
            }`}
          >
            {child.photo_url ? (
              <Image
                src={child.photo_url}
                alt={child.name}
                fill
                className="object-cover"
                sizes="44px"
              />
            ) : initials ? (
              <span className="font-serif font-bold text-sm text-white select-none">
                {initials}
              </span>
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>
          {dead && (
            <span
              className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-[#1f1b17] text-white text-[10px] font-black flex items-center justify-center border-1.5 border-white shadow-md leading-none select-none z-20"
              title={t('deceased')}
            >
              ?
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1 leading-tight">
          <h4 className="font-serif font-bold text-sm text-[#1f1b17] group-hover:text-[#173124] transition-colors truncate flex items-center gap-1">
            <span>{child.name}</span>
            {dead && <span className="text-[#173124] font-black text-xs">?</span>}
          </h4>
          <p className="text-[10px] text-[#727973] font-medium mt-0.5">
            {yearDisplay}
          </p>
          {child.profession && (
            <p className="text-xs text-[#7a5739] font-medium truncate mt-0.5">
              {child.profession}
            </p>
          )}
        </div>
      </div>

      <div className="pt-2.5 border-t border-[#f5ece5]">
        {child.hasDescendants ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#173124]">
              <GitFork className="w-3.5 h-3.5 text-[#7a5739] shrink-0" />
              <span>
                {child.descendantsCount} {t('children_count_label')}
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeploy(child.id);
              }}
              className="deploy-btn-shimmer bg-[#173124] hover:bg-[#2d4739] text-white rounded-xl px-4 py-2 font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer text-center"
            >
              <span>{t('tree_deploy_btn')}</span>
            </button>
          </div>
        ) : child.isPartiallyDocumented ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <p className="text-xs text-[#c69214] italic">
              {language === 'fr' ? 'Descendance partielle' : 'Partial branch'}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeploy(child.id);
              }}
              className="deploy-btn-shimmer bg-[#7a5739] hover:bg-[#63452c] text-white rounded-xl px-3 py-1.5 font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer text-center"
            >
              <span>{t('explore_foyer')}</span>
            </button>
          </div>
        ) : (
          <div className="py-1">
            <p className="text-xs text-[#727973] italic">
              {language === 'fr' ? 'Aucun descendant r?pertori?' : 'No descendants recorded'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
