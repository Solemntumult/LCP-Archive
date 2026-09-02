'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Crown, BookOpen, User } from 'lucide-react';
import { TreeNodeData } from '@/types';

interface CenterPersonCardProps {
  person: TreeNodeData;
  totalChildren: number;
  totalSpouses: number;
}

export default function CenterPersonCard({
  person,
  totalChildren,
  totalSpouses,
}: CenterPersonCardProps) {
  const isMale = person.gender === 'M';
  const fullName = person.name || `${person.first_name || ''} ${person.last_name || ''}`.trim();
  const initials = `${person.first_name?.[0] || ''}${person.last_name?.[0] || ''}`.toUpperCase();

  const isPatriarch = !person.father_id && !person.mother_id && Boolean(person.is_blood);

  const getYear = (dateStr?: string | null): number | null => {
    if (!dateStr) return null;
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getFullYear())) {
      return parsed.getFullYear();
    }
    const match = String(dateStr).match(/\b(\d{4})\b/);
    return match ? parseInt(match[1], 10) : null;
  };

  const birthYear = getYear(person.birth_date);
  const deathYear = getYear(person.death_date);

  let lifeDatesText = '';
  if (deathYear) {
    lifeDatesText = birthYear
      ? `Né(e) en ${birthYear} • Décédé(e) en ${deathYear}`
      : `Décédé(e) en ${deathYear}`;
  } else {
    lifeDatesText = birthYear
      ? `Né(e) en ${birthYear} • Vivant(e)`
      : 'Vivant(e)';
  }

  return (
    <div className="w-full bg-white rounded-3xl border-2 border-[#173124] vintage-shadow p-6 flex flex-col items-center text-center space-y-4">
      {/* Badges Header */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {isPatriarch && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#f5e7c8] text-[#7a5739] border border-[#c69214]/40 shadow-xs">
            <Crown className="w-3.5 h-3.5 text-[#c69214]" />
            Patriarche
          </span>
        )}
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#f5ece5] text-[#173124] border border-[#eae1da]">
          Génération {person.generation}
        </span>
      </div>

      {/* Photo / Avatar */}
      <div className="relative">
        {person.photo_url ? (
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-md border-2 border-[#173124]/20 shrink-0">
            <Image
              src={person.photo_url}
              alt={fullName}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
        ) : (
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center font-serif font-bold text-2xl text-white shadow-md shrink-0 ${
              isMale ? 'bg-[#2980b9]' : 'bg-[#c0392b]'
            }`}
          >
            {initials || <User className="w-9 h-9 text-white/80" />}
          </div>
        )}
      </div>

      {/* Name, Life Dates & Profession */}
      <div className="space-y-1">
        <h3 className="font-serif text-xl font-bold text-[#173124] leading-tight">
          {fullName}
        </h3>
        <p className="text-xs text-[#727973] font-sans font-medium">
          {lifeDatesText}
        </p>
        {person.profession && (
          <p className="text-xs text-[#7a5739] font-medium pt-0.5">
            {person.profession}
          </p>
        )}
      </div>

      {/* Summary Stats */}
      <div className="text-xs font-medium text-[#424844] bg-[#f5ece5] px-4 py-1.5 rounded-xl border border-[#eae1da]">
        {totalSpouses} union(s) • {totalChildren} enfant(s)
      </div>

      {/* Biography Link Button */}
      <div className="pt-1">
        <Link
          href={`/person/${person.id}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#173124] hover:bg-[#2d4739] active:scale-95 transition-all shadow-sm group"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#98b5a3] group-hover:scale-110 transition-transform" />
          <span>Consulter la biographie →</span>
        </Link>
      </div>
    </div>
  );
}
export { type CenterPersonCardProps };
