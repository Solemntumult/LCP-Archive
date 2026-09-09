'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  ArrowRight,
  BookOpen,
  Camera,
  Play,
  Pause,
  Clock,
} from 'lucide-react';
import { FamilyEvent, EventCategory } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function UpcomingEventCarousel({
  events,
}: {
  events: FamilyEvent[];
}) {
  const { t, language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Upcoming events only
  const upcomingEvents = useMemo(() => {
    const upcoming = events.filter((e) => !e.is_past);
    return [...upcoming].sort(
      (a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
    );
  }, [events]);

  const nextSlide = useCallback(() => {
    if (upcomingEvents.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % upcomingEvents.length);
  }, [upcomingEvents.length]);

  const prevSlide = useCallback(() => {
    if (upcomingEvents.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + upcomingEvents.length) % upcomingEvents.length);
  }, [upcomingEvents.length]);

  useEffect(() => {
    if (!isAutoPlay || upcomingEvents.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoPlay, upcomingEvents.length, nextSlide]);

  if (upcomingEvents.length === 0) {
    return (
      <div className="w-full py-14 sm:py-16 bg-white rounded-3xl border border-[#eae1da] text-center p-6 sm:p-8 space-y-3">
        <Calendar className="w-10 h-10 text-[#727973] mx-auto opacity-40" />
        <h3 className="font-serif font-bold text-lg text-[#1f1b17]">
          {t('events_empty_upcoming_title')}
        </h3>
        <p className="text-xs text-[#727973]">
          {t('events_empty_upcoming_desc')}
        </p>
      </div>
    );
  }

  const current = upcomingEvents[currentIndex];
  const photoUrl = current.photo || (current.photos && current.photos.length > 0 ? current.photos[0] : null);

  const formattedDate = new Date(current.event_date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const getCategoryLabel = (cat: EventCategory) => {
    switch (cat) {
      case 'reunion':
        return t('evform_cat_reunion');
      case 'commemoration':
        return t('evform_cat_commemoration');
      case 'celebration':
        return t('evform_cat_celebration');
      case 'birth':
        return t('evform_cat_birth');
      case 'wedding':
        return t('evform_cat_wedding');
      case 'cultural':
        return t('evform_cat_cultural');
      default:
        return t('events_upcoming_title');
    }
  };

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden bg-[#111111] text-white shadow-2xl border border-[#eae1da] group select-none"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      <div className="relative min-h-[360px] sm:min-h-[420px] flex flex-col justify-end p-6 sm:p-10 z-10">
        {/* Background photo with subtle zoom */}
        {photoUrl ? (
          <div className="absolute inset-0 z-0">
            <Image
              src={photoUrl}
              alt={current.title}
              fill
              className="object-cover object-center transition-all duration-700 ease-out"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30" />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#7a5739] to-[#1f1b17]" />
        )}

        {/* Content Details */}
        <div className="relative z-10 max-w-3xl space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#c69214] text-white shadow-md">
              {current.days_until === 0 ? t('events_today_pill') : `${t('events_days_left')} ${current.days_until}${t('events_days_unit')}`}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/20">
              {getCategoryLabel(current.category)}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-[#fdcea9] bg-black/50 backdrop-blur-xs px-3 py-1 rounded-full">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>
            {current.location && (
              <div className="flex items-center gap-1.5 text-xs text-white/80 bg-black/50 backdrop-blur-xs px-3 py-1 rounded-full">
                <MapPin className="w-3.5 h-3.5" />
                <span>{current.location}</span>
              </div>
            )}
          </div>

          <h3 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            {current.title}
          </h3>

          <p className="text-xs sm:text-sm text-white/85 line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-2xl">
            {current.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href={`/events/${current.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#1f1b17] font-bold text-xs hover:bg-[#faebe0] transition-all shadow-lg active:scale-95"
            >
              <span>{t('events_read_narrative')}</span>
            </Link>
          </div>
        </div>

        {/* Carousel Slide Indicators */}
        {upcomingEvents.length > 1 && (
          <div className="absolute top-6 right-6 z-20 flex items-center gap-1.5">
            {upcomingEvents.map((_, idx) => (
              <button
                key={`indicator-${idx}`}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-7 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Prev / Next Buttons */}
        {upcomingEvents.length > 1 && (
          <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="p-2.5 rounded-xl bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all active:scale-95"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2.5 rounded-xl bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all active:scale-95"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
