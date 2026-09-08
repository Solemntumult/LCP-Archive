'use client';

import React from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { FoyerSpouseData } from '@/types';
import { isDeceased } from '@/lib/genealogy';

export interface SpouseCardProps {
  spouse: FoyerSpouseData;
  unionIndex: number; // 0-based index for '1ère union', '2ème union', etc.
  childrenCount: number; // number of children from this union
  onSelect?: (spouse: FoyerSpouseData) => void;
  className?: string;
}

export default function SpouseCard({
  spouse,
  unionIndex,
  childrenCount,
  onSelect,
  className = '',
}: SpouseCardProps) {
  const isMale = spouse.gender === 'M';

  // Extract year safely from date strings
  const getYear = (dateStr?: string | null): string | number | null => {
    if (!dateStr) return null;
    const match = dateStr.match(/\b\d{4}\b/);
    if (match) return match[0];
    const d = new Date(dateStr);
    return isNaN(d.getFullYear()) ? null : d.getFullYear();
  };

  const birthYear = getYear(spouse.birth_date);
  const deathYear = getYear(spouse.death_date);
  const dead = isDeceased(spouse);

  const fullName =
    spouse.name ||
    `${spouse.first_name || ''} ${spouse.last_name || ''}`.trim() ||
    'Conjoint(e)';

  const firstInitial = spouse.first_name?.[0] || spouse.name?.[0] || '';
  const lastInitial =
    spouse.last_name?.[0] ||
    (spouse.name && spouse.name.includes(' ')
      ? spouse.name.split(' ').pop()?.[0] || ''
      : '');
  const initials = `${firstInitial}${lastInitial}`.toUpperCase() || '?';

  const getUnionLabel = (index: number): string => {
    if (index === 0) return '1ère union';
    return `${index + 1}ème union`;
  };

  return (
    <div
      onClick={() => onSelect?.(spouse)}
      className={`relative bg-[#fff8f4] rounded-2xl border border-[#eae1da] border-t-2 border-dashed border-t-[#c69214] p-4 shadow-xs transition-all duration-200 hover:shadow-md ${
        onSelect ? 'cursor-pointer hover:border-[#c69214]/50' : ''
      } ${className}`}
    >
      {/* Alliance Union Badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f5e7c8] text-[#7a5739] text-[11px] font-semibold border border-[#c69214]/30">
          <Heart className="w-3.5 h-3.5 text-[#c69214] fill-[#c69214]/30 shrink-0" />
          <span>{getUnionLabel(unionIndex)}</span>
        </div>
      </div>

      {/* Main Spouse Identity */}
      <div className="flex items-center gap-3">
        {/* Photo (48x48) or Initials Avatar */}
        <div className="relative shrink-0">
          <div
            className={`w-12 h-12 rounded-full overflow-hidden border-2 flex items-center justify-center font-serif font-bold text-sm shadow-xs relative ${
              isMale
                ? 'border-[#2980b9] bg-[#ebf5fb] text-[#2980b9]'
                : 'border-[#c0392b] bg-[#fdedec] text-[#c0392b]'
            }`}
          >
            {spouse.photo_url ? (
              <Image
                src={spouse.photo_url}
                alt={fullName}
                fill
                className="object-cover"
                sizes="48px"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          {dead && (
            <span
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#1f1b17] text-white text-[11px] font-black flex items-center justify-center border-2 border-white shadow-md leading-none select-none z-20"
              title="Décédé(e)"
            >
              †
            </span>
          )}
        </div>

        {/* Name, Birth Year, Profession */}
        <div className="min-w-0 flex-1">
          <h4 className="font-serif font-bold text-sm text-[#1f1b17] truncate leading-snug flex items-center gap-1">
            <span>{fullName}</span>
            {dead && <span className="text-[#173124] font-black text-sm">†</span>}
          </h4>

          {deathYear ? (
            <p className="text-xs text-[#727973] font-medium mt-0.5">
              {birthYear ? `${birthYear} – ${deathYear}` : `Décédé(e) en ${deathYear}`}
            </p>
          ) : dead ? (
            <p className="text-xs text-[#727973] font-medium mt-0.5">
              {birthYear ? `${birthYear} • Décédé(e)` : 'Décédé(e)'}
            </p>
          ) : birthYear ? (
            <p className="text-xs text-[#727973] font-medium mt-0.5">
              {birthYear} • Vivant(e)
            </p>
          ) : null}

          {spouse.profession && (
            <p className="text-[10px] text-[#7a5739] truncate mt-0.5">
              {spouse.profession}
            </p>
          )}
        </div>
      </div>

      {/* Children Count Footer */}
      <div className="mt-3 pt-2.5 border-t border-[#eae1da]/70 flex items-center justify-between text-[10px] text-[#7a5739] font-medium">
        <span>
          {childrenCount} enfant{childrenCount > 1 ? 's' : ''} de cette union
        </span>
      </div>
    </div>
  );
}
