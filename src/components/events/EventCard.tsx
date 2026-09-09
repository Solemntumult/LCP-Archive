'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Clock,
  Heart,
  Award,
  Baby,
  Users,
  Compass,
  Sparkles,
  Edit3,
  Trash2,
  CheckCircle,
} from 'lucide-react';
import { FamilyEvent, EventCategory, Person } from '@/types';
import { getFullName } from '@/lib/genealogy';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function EventCard({
  event,
  allPersons,
  onEdit,
  onDelete,
}: {
  event: FamilyEvent;
  allPersons: Person[];
  onEdit?: (event: FamilyEvent) => void;
  onDelete?: (id: number) => void;
}) {
  const { t, language } = useLanguage();
  const eventDate = new Date(event.event_date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'short' });
  const year = eventDate.getFullYear();

  const formattedFullDate = eventDate.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const getCategoryBadge = (category: EventCategory) => {
    switch (category) {
      case 'reunion':
        return { label: t('evform_cat_reunion'), bg: 'bg-[#173124] text-white', icon: Users };
      case 'commemoration':
        return { label: t('evform_cat_commemoration'), bg: 'bg-[#7a5739] text-white', icon: Award };
      case 'celebration':
        return { label: t('evform_cat_celebration'), bg: 'bg-[#c69214] text-white', icon: Sparkles };
      case 'birth':
        return { label: t('evform_cat_birth'), bg: 'bg-[#2980b9] text-white', icon: Baby };
      case 'wedding':
        return { label: t('evform_cat_wedding'), bg: 'bg-[#c0392b] text-white', icon: Heart };
      case 'cultural':
        return { label: t('evform_cat_cultural'), bg: 'bg-[#496455] text-white', icon: Compass };
      default:
        return { label: t('evform_cat_other'), bg: 'bg-[#727973] text-white', icon: Calendar };
    }
  };

  const badge = getCategoryBadge(event.category);
  const BadgeIcon = badge.icon;

  const relatedPersons = (event.related_person_ids || [])
    .map((id) => allPersons.find((p) => p.id === id))
    .filter((p): p is Person => p !== undefined);

  return (
    <div
      className={`bg-white rounded-3xl p-5 sm:p-7 border transition-all vintage-shadow flex flex-col justify-between gap-6 ${
        event.is_past
          ? 'border-[#eae1da] hover:border-[#7a5739]/30'
          : 'border-[#173124]/30 ring-1 ring-[#173124]/10 hover:border-[#173124]'
      }`}
    >
      <div className="space-y-4">
        {/* Top Header: Date Block + Category Badge + Countdown */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Calendar Stamp */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#fff8f4] border-2 border-[#eae1da] flex flex-col items-center justify-center shrink-0 shadow-2xs">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#7a5739] leading-none">
                {month}
              </span>
              <span className="font-serif text-xl sm:text-2xl font-black text-[#173124] leading-tight">
                {day}
              </span>
              <span className="text-[9px] text-[#727973] leading-none font-medium">
                {year}
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${badge.bg}`}>
                  <BadgeIcon className="w-3 h-3" />
                  <span>{badge.label}</span>
                </span>

                {!event.is_past && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#faebe0] text-[#7a5739]">
                    <Clock className="w-3 h-3" />
                    <span>
                      {event.days_until === 0
                        ? t('events_today_pill')
                        : `${t('events_days_left')} ${event.days_until}${t('events_days_unit')}`}
                    </span>
                  </span>
                )}
              </div>

              <span className="text-xs text-[#727973] block mt-1 capitalize">
                {formattedFullDate}
              </span>
            </div>
          </div>

          {/* Admin action buttons */}
          {(onEdit || onDelete) && (
            <div className="flex items-center gap-1 shrink-0">
              {onEdit && (
                <button
                  onClick={() => onEdit(event)}
                  className="p-2 rounded-xl text-[#727973] hover:text-[#173124] hover:bg-[#f5ece5] transition-all"
                  aria-label={t('edit')}
                  title={t('edit')}
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(event.id)}
                  className="p-2 rounded-xl text-[#727973] hover:text-[#ba1a1a] hover:bg-[#ffdad6] transition-all"
                  aria-label={t('delete')}
                  title={t('delete')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <Link
            href={`/events/${event.id}`}
            className="group/title block"
          >
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1f1b17] group-hover/title:text-[#7a5739] transition-colors leading-tight">
              {event.title}
            </h3>
          </Link>

          {event.location && (
            <div className="flex items-center gap-1.5 text-xs text-[#5c645e]">
              <MapPin className="w-3.5 h-3.5 text-[#7a5739] shrink-0" />
              <span>{event.location}</span>
            </div>
          )}

          <p className="text-sm text-[#424844] line-clamp-3 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Attached Members Avatars */}
        {relatedPersons.length > 0 && (
          <div className="pt-3 border-t border-[#f5ece5] space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#727973] block">
              {language === 'en' ? 'Concerned members :' : 'Membres concern?s :'}
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {relatedPersons.map((p) => (
                <Link
                  key={p.id}
                  href={`/person/${p.id}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#fbf2eb] hover:bg-[#f5ece5] border border-[#eae1da] text-xs font-serif font-bold text-[#173124] transition-all"
                >
                  <span className={`w-2 h-2 rounded-full ${p.gender === 'M' ? 'bg-[#2980b9]' : 'bg-[#c0392b]'}`} />
                  <span>{getFullName(p)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer: Photo Thumbnail + Read Story */}
      <div className="pt-3 border-t border-[#f5ece5] flex items-center justify-between">
        <Link
          href={`/events/${event.id}`}
          className="text-xs font-bold text-[#173124] hover:text-[#7a5739] transition-colors flex items-center gap-1"
        >
          <span>{t('events_read_narrative')}</span>
        </Link>

        {event.photos && event.photos.length > 0 && (
          <span className="text-[11px] text-[#727973] font-mono font-medium">
            {event.photos.length} {t('events_photos_count')}
          </span>
        )}
      </div>
    </div>
  );
}
