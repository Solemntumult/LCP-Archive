'use client';

import React from 'react';
import Image from 'next/image';
import { GitFork, User } from 'lucide-react';
import { FoyerChildData } from '@/types';

export interface ChildCardProps {
  child: FoyerChildData;
  /** Called when the user clicks the deploy button to explore this child's family */
  onDeploy: (childId: number) => void;
}

export default function ChildCard({ child, onDeploy }: ChildCardProps) {
  const isMale = child.gender === 'M';

  // Helper to extract year safely from date string or ISO format
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

  const yearDisplay = birthYear
    ? deathYear
      ? `Né(e) en ${birthYear} • †${deathYear}`
      : `Né(e) en ${birthYear}`
    : deathYear
    ? `†${deathYear}`
    : 'Date de naissance inconnue';

  const initials = `${child.first_name?.[0] || ''}${child.last_name?.[0] || ''}`.toUpperCase();

  return (
    <div className="bg-[#fff8f4] rounded-2xl border border-[#eae1da] p-4 hover:border-[#173124] hover:shadow-md transition-all flex flex-col justify-between gap-3 group">
      {/* Identity & Avatar */}
      <div className="flex items-start gap-3 min-w-0">
        {/* Photo / Initials 44x44 */}
        <div
          className={`relative w-[44px] h-[44px] rounded-full overflow-hidden shrink-0 border-2 flex items-center justify-center shadow-xs ${
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

        {/* Info Column */}
        <div className="min-w-0 flex-1 leading-tight">
          <h4 className="font-serif font-bold text-sm text-[#1f1b17] group-hover:text-[#173124] transition-colors truncate">
            {child.name}
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

      {/* Variant Footer / Actions */}
      <div className="pt-2.5 border-t border-[#f5ece5]">
        {child.hasDescendants ? (
          /* Variant A: Child WITH descendants */
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#173124]">
              <GitFork className="w-3.5 h-3.5 text-[#7a5739] shrink-0" />
              <span>
                {child.descendantsCount} enfant{child.descendantsCount > 1 ? 's' : ''}
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
              <span>Déployer sa famille</span>
            </button>
          </div>
        ) : child.isPartiallyDocumented ? (
          /* Variant C: Partially documented */
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <p className="text-xs text-[#c69214] italic">
              Descendance partiellement documentée
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeploy(child.id);
              }}
              className="deploy-btn-shimmer bg-[#7a5739] hover:bg-[#63452c] text-white rounded-xl px-3 py-1.5 font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer text-center"
            >
              <span>Explorer</span>
            </button>
          </div>
        ) : (
          /* Variant B: Child WITHOUT descendants */
          <div className="py-1">
            <p className="text-xs text-[#727973] italic">
              Aucun descendant répertorié
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
