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
  const eventDate = new Date(event.event_date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleDateString('fr-FR', { month: 'short' });
  const year = eventDate.getFullYear();

  const formattedFullDate = eventDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const getCategoryBadge = (category: EventCategory) => {
    switch (category) {
      case 'reunion':
        return { label: 'Rassemblement', bg: 'bg-[#173124] text-white', icon: Users };
      case 'commemoration':
        return { label: 'Commémoration', bg: 'bg-[#7a5739] text-white', icon: Award };
      case 'celebration':
        return { label: 'Célébration', bg: 'bg-[#c69214] text-white', icon: Sparkles };
      case 'birth':
        return { label: 'Naissance & Anniversaire', bg: 'bg-[#2980b9] text-white', icon: Baby };
      case 'wedding':
        return { label: 'Mariage & Alliance', bg: 'bg-[#c0392b] text-white', icon: Heart };
      case 'cultural':
        return { label: 'Pèlerinage & Racines', bg: 'bg-[#496455] text-white', icon: Compass };
      default:
        return { label: 'Événement', bg: 'bg-[#727973] text-white', icon: Calendar };
    }
  };

  const badge = getCategoryBadge(event.category);
  const BadgeIcon = badge.icon;

  // Attached members
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

                {event.is_past ? (
                  <span className="text-[10px] bg-[#f5ece5] text-[#795638] px-2 py-0.5 rounded-full font-semibold">
                    Récit historique
                  </span>
                ) : (
                  <span className="text-[10px] bg-[#ccead6] text-[#062014] px-2 py-0.5 rounded-full font-bold">
                    {event.days_until === 0
                      ? "Aujourd'hui !"
                      : `Dans ${event.days_until} jour${(event.days_until || 0) > 1 ? 's' : ''}`}
                  </span>
                )}
              </div>

              <p className="text-xs text-[#727973] capitalize mt-1">
                {formattedFullDate}
              </p>
            </div>
          </div>

          {/* Action Menu buttons */}
          <div className="flex items-center gap-1 shrink-0">
            {onEdit && (
              <button
                onClick={() => onEdit(event)}
                className="p-2 rounded-xl text-[#727973] hover:text-[#173124] hover:bg-[#f5ece5] transition-all"
                title="Modifier"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(event.id)}
                className="p-2 rounded-xl text-[#727973] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-all"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Event Title */}
        <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#173124] tracking-tight leading-snug">
          {event.title}
        </h3>

        {/* Location if present */}
        {event.location && (
          <p className="flex items-center gap-1.5 text-xs text-[#7a5739] font-medium">
            <MapPin className="w-3.5 h-3.5" />
            <span>{event.location}</span>
          </p>
        )}

        {/* Photo if attached */}
        {event.photo && (
          <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden bg-[#0e0e0e] border border-[#eae1da] vintage-photo-frame my-3 group/img">
            {/* Ambient background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <Image
                src={event.photo}
                alt=""
                fill
                className="object-cover object-center blur-lg scale-110 opacity-40 brightness-75"
              />
            </div>
            <Image
              src={event.photo}
              alt={event.title}
              fill
              className="object-contain sm:object-cover object-center transition-transform duration-500 group-hover/img:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}

        {/* Narrative Description / Story */}
        <div className="text-sm sm:text-base text-[#424844] leading-relaxed whitespace-pre-line bg-[#fff8f4] p-4.5 rounded-2xl border border-[#eae1da]">
          {event.description}
        </div>
      </div>

      {/* Footer: Related Family Members */}
      {relatedPersons.length > 0 && (
        <div className="pt-3 border-t border-[#f5ece5]">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#727973] mb-2">
            Membres associés :
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {relatedPersons.map((p) => (
              <Link
                key={`rel-ev-${p.id}`}
                href={`/person/${p.id}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-[#eae1da] text-xs font-semibold text-[#173124] hover:bg-[#173124] hover:text-white transition-all shadow-2xs"
              >
                <div className="w-4 h-4 rounded-full bg-[#7a5739] text-white text-[8px] flex items-center justify-center font-bold">
                  {p.first_name[0]}
                </div>
                <span>{getFullName(p)}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
