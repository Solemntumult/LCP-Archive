'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
} from 'lucide-react';
import { FamilyEvent, EventCategory } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function EventCarousel({
  events,
  onOpenCreateModal,
}: {
  events: FamilyEvent[];
  onOpenCreateModal?: () => void;
}) {
  const { t, language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const nextSlide = useCallback(() => {
    if (events.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % events.length);
  }, [events.length]);

  const prevSlide = useCallback(() => {
    if (events.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  }, [events.length]);

  useEffect(() => {
    if (!isAutoPlay || events.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoPlay, events.length, nextSlide]);

  if (events.length === 0) {
    return (
      <div className="w-full py-16 sm:py-20 bg-white rounded-3xl border border-[#eae1da] text-center p-6 sm:p-8 space-y-4">
        <Calendar className="w-12 h-12 text-[#727973] mx-auto opacity-40" />
        <div className="space-y-1">
          <h3 className="font-serif font-bold text-xl text-[#1f1b17]">
            {t('events_empty_title')}
          </h3>
          <p className="text-xs sm:text-sm text-[#727973] max-w-md mx-auto">
            {t('events_empty_desc')}
          </p>
        </div>
        {onOpenCreateModal && (
          <button
            onClick={onOpenCreateModal}
            className="px-5 py-2.5 rounded-xl bg-[#173124] text-white text-xs font-semibold hover:bg-[#2d4739] shadow-sm transition-all"
          >
            + {t('events_add_btn')}
          </button>
        )}
      </div>
    );
  }

  const current = events[currentIndex];
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
        return t('evform_cat_other');
    }
  };

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden bg-[#173124] text-white shadow-2xl border border-[#eae1da] group select-none"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      <div className="relative min-h-[380px] sm:min-h-[460px] flex flex-col justify-end p-6 sm:p-10 z-10">
        {/* Background Photo with Gradient */}
        {photoUrl ? (
          <div className="absolute inset-0 z-0">
            <Image
              src={photoUrl}
              alt={current.title}
              fill
              className="object-cover object-center transition-all duration-700 ease-out"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#173124] to-[#2d4739]" />
        )}

        {/* Content Details */}
        <div className="relative z-10 max-w-3xl space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/20">
              {getCategoryLabel(current.category)}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-[#fdcea9] bg-black/40 backdrop-blur-xs px-3 py-1 rounded-full">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>
            {current.location && (
              <div className="flex items-center gap-1.5 text-xs text-white/80 bg-black/40 backdrop-blur-xs px-3 py-1 rounded-full">
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#173124] font-bold text-xs hover:bg-[#faebe0] transition-all shadow-lg active:scale-95"
            >
              <span>{t('events_read_narrative')}</span>
            </Link>

            {current.photos && current.photos.length > 1 && (
              <span className="text-xs text-white/70 flex items-center gap-1.5 bg-black/30 px-3 py-2 rounded-xl backdrop-blur-xs">
                <Camera className="w-3.5 h-3.5 text-[#fdcea9]" />
                <span>{current.photos.length} {t('events_photos_attached')}</span>
              </span>
            )}
          </div>
        </div>

        {/* Carousel Slide Indicators */}
        {events.length > 1 && (
          <div className="absolute top-6 right-6 z-20 flex items-center gap-1.5">
            {events.map((_, idx) => (
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
        {events.length > 1 && (
          <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="p-2.5 rounded-xl bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 transition-all active:scale-95"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2.5 rounded-xl bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 transition-all active:scale-95"
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
