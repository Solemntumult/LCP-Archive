'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, BookOpen, Plus } from 'lucide-react';
import { TreeNodeData } from '@/types';

export default function PersonDetailDrawer({
  person,
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

  const isMale = person.gender === 'M';
  const birthYear = person.birth_date ? new Date(person.birth_date).getFullYear() : null;
  const deathYear = person.death_date ? new Date(person.death_date).getFullYear() : null;
  const initials = `${person.first_name[0] || ''}${person.last_name[0] || ''}`;

  // Find parents
  const father = person.father_id ? allPersons.find((p) => p.id === person.father_id) : null;
  const mother = person.mother_id ? allPersons.find((p) => p.id === person.mother_id) : null;

  // Direct children count
  const childrenCount = allPersons.filter(
    (c) => c.father_id === person.id || c.mother_id === person.id
  ).length;

  // ----------------------------------------------------
  // Click-outside listener to auto-close pop-up
  // ----------------------------------------------------
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    // Delay listener registration so the click that opened this drawer doesn't instantly close it
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
      aria-label={`Aperçu de ${person.name}`}
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
            Aperçu • Gen {person.generation + 1}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-[#f5ece5] text-[#727973] transition-colors"
          aria-label="Fermer l'aperçu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Identity Card: Avatar, Name, Dates, Profession */}
      <div className="flex items-center gap-3">
        <div
          className={`relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 flex items-center justify-center font-serif font-bold text-sm text-white shadow-xs ${
            isMale ? 'border-[#2980b9] bg-[#2980b9]' : 'border-[#c0392b] bg-[#c0392b]'
          }`}
        >
          {person.photo_url ? (
            <Image src={person.photo_url} alt={person.name} fill className="object-cover" sizes="48px" />
          ) : (
            initials
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-serif font-bold text-sm text-[#1f1b17] leading-tight truncate">
            {person.name}
          </h3>
          {birthYear ? (
            <p className="text-[11px] text-[#727973] font-medium mt-0.5">
              {birthYear} {deathYear ? `– ${deathYear}` : '• Vivant(e)'}
            </p>
          ) : (
            <p className="text-[10px] text-[#727973] italic">Dates non renseignées</p>
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
          <span className="text-[#727973]">Parents :</span>
          <span className="font-medium truncate max-w-[170px]">
            {father ? father.first_name : '—'} & {mother ? mother.first_name : '—'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#727973]">Descendance :</span>
          <span className="font-semibold text-[#173124]">
            {childrenCount > 0 ? `${childrenCount} enfant${childrenCount > 1 ? 's' : ''}` : 'Sans enfant'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={onAddRelative}
          className="py-2 px-2 rounded-xl bg-[#fff8f4] hover:bg-[#f5ece5] border border-[#eae1da] text-[#7a5739] text-[11px] font-bold transition-all flex items-center justify-center gap-1 active:scale-95"
        >
          <Plus className="w-3 h-3" />
          <span>Ajouter</span>
        </button>

        <Link
          href={`/person/${person.id}`}
          className="py-2 px-2 rounded-xl bg-[#173124] hover:bg-[#2d4739] text-white text-[11px] font-bold transition-all flex items-center justify-center gap-1 shadow-xs active:scale-95"
        >
          <BookOpen className="w-3 h-3 text-[#98b5a3]" />
          <span>Fiche profil &rarr;</span>
        </Link>
      </div>
    </div>
  );
}
