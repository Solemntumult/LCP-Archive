'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  MapPin,
  Briefcase,
  GitFork,
  Edit3,
  Trash2,
  PlusCircle,
  Clock,
  Award,
} from 'lucide-react';
import { PersonDetail } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { translatePersonData } from '@/lib/i18n/dbTranslation';

export default function PersonHero({
  person: rawPerson,
  onDelete,
}: {
  person: PersonDetail;
  onDelete?: () => void;
}) {
  const { t, language } = useLanguage();
  const person = translatePersonData(rawPerson, language);
  const isMale = person.gender === 'M';
  const initials = `${person.first_name[0] || ''}${person.last_name[0] || ''}`;

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#eae1da] vintage-shadow-lg">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Person Avatar Profile */}
        <div className="shrink-0 flex flex-col items-center">
          <div className="relative">
            <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden shadow-md border-4 border-white ring-4 ring-[#173124]/10 relative">
              {person.photo || (person as any).photo_url ? (
                <Image
                  src={(person.photo || (person as any).photo_url)!}
                  alt={person.full_name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 144px, 160px"
                />
              ) : (
                <div
                  className={`w-full h-full flex items-center justify-center font-serif font-bold text-3xl sm:text-4xl text-white ${
                    isMale ? 'bg-[#2980b9]' : 'bg-[#c0392b]'
                  }`}
                >
                  {initials}
                </div>
              )}
            </div>
            {/* Catholic Cross badge for deceased */}
            {!person.is_alive && (
              <span
                className="absolute bottom-0 right-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1f1b17] text-white text-base sm:text-lg font-black flex items-center justify-center border-2.5 border-white shadow-lg leading-none select-none z-20"
                title={t('deceased')}
              >
                ✝
              </span>
            )}
          </div>

          {/* Badges under portrait */}
          <div className="mt-3 flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                isMale
                  ? 'bg-[#ebf5fb] text-[#2980b9] border border-[#2980b9]/30'
                  : 'bg-[#fdedec] text-[#c0392b] border border-[#c0392b]/30'
              }`}
            >
              {isMale ? t('male') : t('female')}
            </span>

            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#f5ece5] text-[#795638] border border-[#eae1da]">
              {t('generation')} {person.generation + 1}
            </span>
          </div>
        </div>

        {/* Vital Info & Details */}
        <div className="flex-1 text-center md:text-left min-w-0 space-y-4">
          <div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#173124] tracking-tight flex items-center gap-2 justify-center md:justify-start">
                <span>{person.full_name}</span>
                {!person.is_alive && (
                  <span className="text-[#173124] text-2xl sm:text-3xl font-black select-none" title={t('deceased')}>
                    ✝
                  </span>
                )}
              </h1>
              {person.spouse_of && (
                <span className="text-xs bg-[#fdcea9] text-[#795638] font-semibold px-2.5 py-0.5 rounded-full">
                  {t('by_marriage')}
                </span>
              )}
            </div>

            {person.profession && (
              <p className="text-lg text-[#7a5739] font-medium flex items-center justify-center md:justify-start gap-2">
                <Briefcase className="w-4 h-4 text-[#7a5739]" />
                {person.profession}
              </p>
            )}
          </div>

          {/* Vital Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
            {/* Birth Info */}
            <div className="p-3.5 rounded-2xl bg-[#fff8f4] border border-[#eae1da]">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#7a5739]">
                <Calendar className="w-4 h-4" />
                <span>{t('birth')}</span>
              </div>
              <p className="text-sm font-medium text-[#1f1b17] mt-1">
                {formatDate(person.birth_date) || t('unknown_date')}
              </p>
              {person.birth_place && (
                <p className="text-xs text-[#727973] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#7a5739]" /> {person.birth_place}
                </p>
              )}
            </div>

            {/* Death Info */}
            <div className="p-3.5 rounded-2xl bg-[#fff8f4] border border-[#eae1da]">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#7a5739]">
                <Clock className="w-4 h-4" />
                <span>{t('death_status')}</span>
              </div>
              <p className="text-sm font-medium text-[#1f1b17] mt-1">
                {person.is_alive ? (
                  <span className="text-[#173124] font-semibold">{t('alive')}</span>
                ) : (
                  formatDate(person.death_date) || t('deceased')
                )}
              </p>
              {person.death_place && (
                <p className="text-xs text-[#727973] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#7a5739]" /> {person.death_place}
                </p>
              )}
            </div>

            {/* Age */}
            {person.age !== null && (
              <div className="p-3.5 rounded-2xl bg-[#fff8f4] border border-[#eae1da]">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#7a5739]">
                  <Award className="w-4 h-4" />
                  <span>{t('age')}</span>
                </div>
                <p className="text-sm font-bold text-[#1f1b17] mt-1">
                  {person.age} {t('years_old')}
                  {!person.is_alive && (
                    <span className="text-xs font-normal text-[#727973] ml-1">
                      {t('at_death')}
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Quick Actions Toolbar */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-3">
            <Link
              href={
                person.father_id || person.mother_id
                  ? `/tree?foyer=${person.father_id || person.mother_id}&highlight=${person.id}`
                  : person.spouse_of_id
                  ? `/tree?foyer=${person.spouse_of_id}&highlight=${person.id}`
                  : `/tree?foyer=${person.id}&highlight=${person.id}`
              }
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#173124] text-white hover:bg-[#2d4739] shadow-xs transition-all"
            >
              <GitFork className="w-3.5 h-3.5 text-[#98b5a3]" />
              <span>{t('view_in_tree')}</span>
            </Link>

            <Link
              href={`/person/add?parent_id=${person.id}&parent_gender=${person.gender}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#fdcea9] text-[#795638] hover:bg-[#ebbe99] shadow-xs transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t('add_child')}</span>
            </Link>

            <Link
              href={`/person/${person.id}/edit`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-[#eae1da] text-[#424844] hover:bg-[#f5ece5] transition-all"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#7a5739]" />
              <span>{t('edit')}</span>
            </Link>

            {onDelete && (
              <button
                onClick={onDelete}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-all ml-auto"
                title={t('delete')}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t('delete')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
