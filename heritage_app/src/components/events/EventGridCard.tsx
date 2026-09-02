'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Camera,
  ArrowRight,
  Sparkles,
  Users,
  Award,
  Baby,
  Heart,
  Compass,
} from 'lucide-react';
import { FamilyEvent, EventCategory } from '@/types';

export default function EventGridCard({
  event,
}: {
  event: FamilyEvent;
}) {
  const photoUrl = event.photo || (event.photos && event.photos.length > 0 ? event.photos[0] : null);

  const eventDate = new Date(event.event_date);
  const formattedDate = eventDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
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
        return { label: 'Naissance', bg: 'bg-[#2980b9] text-white', icon: Baby };
      case 'wedding':
        return { label: 'Mariage', bg: 'bg-[#c0392b] text-white', icon: Heart };
      case 'cultural':
        return { label: 'Pèlerinage', bg: 'bg-[#496455] text-white', icon: Compass };
      default:
        return { label: 'Événement', bg: 'bg-[#727973] text-white', icon: Calendar };
    }
  };

  const badge = getCategoryBadge(event.category);
  const BadgeIcon = badge.icon;

  return (
    <Link
      href={`/events/${event.id}`}
      className="group bg-white rounded-3xl overflow-hidden border border-[#eae1da] hover:border-[#7a5739]/50 transition-all duration-300 vintage-shadow hover:shadow-xl flex flex-col justify-between"
    >
      <div>
        {/* Photo Header */}
        <div className="relative w-full h-52 sm:h-60 overflow-hidden bg-[#eae1da]">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#fbf2eb] to-[#eae1da] text-[#7a5739] p-6 text-center">
              <BadgeIcon className="w-10 h-10 opacity-40 mb-2" />
              <span className="font-serif text-sm font-semibold opacity-70">
                {badge.label}
              </span>
            </div>
          )}

          {/* Date & Category Pills overlay */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md ${badge.bg}`}>
              <BadgeIcon className="w-3 h-3" />
              <span>{badge.label}</span>
            </span>

            {event.photos && event.photos.length > 1 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white">
                <Camera className="w-3 h-3" />
                <span>{event.photos.length}</span>
              </span>
            )}
          </div>

          {/* Upcoming pill if future */}
          {!event.is_past && (
            <div className="absolute bottom-3 right-3 bg-[#173124] text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-md">
              {event.days_until === 0 ? "Aujourd'hui" : `Dans ${event.days_until}j`}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs text-[#727973]">
            <Calendar className="w-3.5 h-3.5 text-[#7a5739]" />
            <span className="font-medium capitalize">{formattedDate}</span>
            {event.location && (
              <>
                <span>•</span>
                <span className="truncate">{event.location}</span>
              </>
            )}
          </div>

          <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1f1b17] group-hover:text-[#173124] transition-colors leading-snug line-clamp-2">
            {event.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#727973] line-clamp-3 leading-relaxed">
            {event.description}
          </p>
        </div>
      </div>

      {/* Card Footer Link */}
      <div className="px-5 sm:px-6 pb-5 pt-2 border-t border-[#f5ece5] flex items-center justify-between text-xs font-semibold text-[#7a5739] group-hover:text-[#173124]">
        <span>Consulter le récit & photos</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
