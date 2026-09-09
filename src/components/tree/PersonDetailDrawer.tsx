'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, BookOpen, Plus, User } from 'lucide-react';
import { TreeNodeData } from '@/types';
import { isDeceased } from '@/lib/genealogy';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { translatePersonData } from '@/lib/i18n/dbTranslation';

export default function PersonDetailDrawer({
  person: rawPerson,
  allPersons,
  onClose,
  onAddRelative,
}: {
  person: TreeNodeData;
  allPersons: TreeNodeData[];
  isCenterPerson?: boolean;
  onClose: () => void;
  onExplore?: () => void;
  onAddRelative: () => void;
}) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();
  const person = translatePersonData(rawPerson, language);

  const isMale = person.gender === 'M';
  const birthYear = person.birth_date ? new Date(person.birth_date).getFullYear() : null;
  const deathYear = person.death_date ? new Date(person.death_date).getFullYear() : null;
  const initials = `${person.first_name?.[0] || ''}${person.last_name?.[0] || ''}`.toUpperCase();

  // Find parents
  const father = person.father_id ? allPersons.find((p) => p.id === person.father_id) : null;
  const mother = person.mother_id ? allPersons.find((p) => p.id === person.mother_id) : null;

  // Direct children count
  const childrenCount = allPersons.filter(
    (c) => c.father_id === person.id || c.mother_id === person.id
  ).length;

  // Click-outside listener
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }, 60);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div
      ref={drawerRef}
      role="dialog"
      aria-label={`${t('drawer_preview')} - ${person.name}`}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className="absolute top-3 right-3 sm:top-4 sm:right-4 w-72 sm:w-80 bg-white/98 backdrop-blur-md rounded-2xl border border-[#eae1da] shadow-2xl p-4 z-30 animate-fade-in space-y-3 pointer-events-auto select-auto"
    >
      {/* Header with Close Button */}
      <div className="flex items-center justify-between pb-2 border-b border-[#f5ece5]">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isMale ? 'bg-[#2980b9]' : 'bg-[#c0392b]'
            }`}
          />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7a5739]">
            {t('badge_overview')} • {t('drawer_gen')} {person.generation + 1}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-[#f5ece5] text-[#727973] transition-colors cursor-pointer"
          aria-label={t('close')}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Identity Card: Avatar, Name, Dates, Profession */}
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <div
            className={`w-12 h-12 rounded-xl overflow-hidden border-2 flex items-center justify-center font-serif font-bold text-sm text-white shadow-xs relative ${
              isMale ? 'border-[#2980b9] bg-[#2980b9]' : 'border-[#c0392b] bg-[#c0392b]'
            }`}
          >
            {person.photo_url || person.photo ? (
              <Image
                src={(person.photo_url || person.photo)!}
                alt={person.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            ) : (
              initials || <User className="w-6 h-6 text-white/80" />
            )}
          </div>
          {isDeceased(person) && (
            <span
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#1f1b17] text-white text-[11px] font-black flex items-center justify-center border-2 border-white shadow-md leading-none select-none z-20"
              title={t('deceased')}
            >
              ✝
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-serif font-bold text-sm text-[#1f1b17] leading-tight truncate flex items-center gap-1">
            <span>{person.name}</span>
            {isDeceased(person) && <span className="text-[#173124] font-black text-sm">✝</span>}
          </h3>
          {deathYear ? (
            <p className="text-[11px] text-[#727973] font-medium mt-0.5">
              {birthYear ? `${birthYear} — ${deathYear}` : `${t('died_in_year')} ${deathYear}`}
            </p>
          ) : isDeceased(person) ? (
            <p className="text-[11px] text-[#727973] font-medium mt-0.5">
              {birthYear ? `${t('born_in_year')} ${birthYear} — ${t('deceased')}` : t('deceased')}
            </p>
          ) : birthYear ? (
            <p className="text-[11px] text-[#727973] font-medium mt-0.5">
              {birthYear} — {t('alive')}
            </p>
          ) : (
            <p className="text-[10px] text-[#727973] italic">{t('dates_not_specified')}</p>
          )}
          {person.profession && (
            <p className="text-[10px] text-[#7a5739] font-medium truncate mt-0.5">
              {person.profession}
            </p>
          )}
        </div>
      </div>

      {/* Mini Family Summary */}
      <div className="p-2.5 rounded-xl bg-[#fff8f4] border border-[#eae1da] text-[11px] space-y-1 text-[#424844]">
        <div className="flex items-center justify-between">
          <span className="text-[#727973]">{t('drawer_parents')}</span>
          <span className="font-medium truncate max-w-[170px]">
            {father ? father.first_name : '—'} & {mother ? mother.first_name : '—'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#727973]">{t('drawer_descendance')}</span>
          <span className="font-semibold text-[#173124]">
            {childrenCount > 0 ? `${childrenCount} ${t('children_count_label')}` : t('no_children')}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={onAddRelative}
          className="py-2 px-2 rounded-xl bg-[#fff8f4] hover:bg-[#f5ece5] border border-[#eae1da] text-[#7a5739] text-[11px] font-bold transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
        >
          <Plus className="w-3 h-3" />
          <span>{t('drawer_add')}</span>
        </button>

        <Link
          href={`/person/${person.id}`}
          className="py-2 px-2 rounded-xl bg-[#173124] hover:bg-[#2d4739] text-white text-[11px] font-bold transition-all flex items-center justify-center gap-1 shadow-xs active:scale-95"
        >
          <BookOpen className="w-3 h-3 text-[#98b5a3]" />
          <span>{t('drawer_profile_card')}</span>
        </Link>
      </div>
    </div>
  );
}
