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

export default function EventCarousel({
  events,
  onOpenCreateModal,
}: {
  events: FamilyEvent[];
  onOpenCreateModal?: () => void;
}) {
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
            Aucun événement pour le moment
          </h3>
          <p className="text-xs sm:text-sm text-[#727973] max-w-md mx-auto">
            Créez le premier récit ou événement de la famille pour enrichir les archives vivantes.
          </p>
        </div>
        {onOpenCreateModal && (
          <button
            onClick={onOpenCreateModal}
            className="px-5 py-2.5 rounded-xl bg-[#173124] text-white text-xs font-semibold hover:bg-[#2d4739] shadow-sm transition-all"
          >
            + Ajouter un événement
          </button>
        )}
      </div>
    );
  }

  const current = events[currentIndex];
  const photoUrl = current.photo || (current.photos && current.photos.length > 0 ? current.photos[0] : null);

  const formattedDate = new Date(current.event_date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const getCategoryLabel = (cat: EventCategory) => {
    switch (cat) {
      case 'reunion':
        return 'Rassemblement';
      case 'commemoration':
        return 'Commémoration';
      case 'celebration':
        return 'Célébration';
      case 'birth':
        return 'Naissance';
      case 'wedding':
        return 'Mariage';
      case 'cultural':
        return 'Pèlerinage';
      default:
        return "Récit d'histoire";
    }
  };

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden bg-[#111111] text-white shadow-2xl border border-[#eae1da] group select-none"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Background Image: Dual-layer ambient fill + centered pure framed image */}
      <div className="relative w-full h-[420px] sm:h-[480px] lg:h-[540px] overflow-hidden bg-[#0e0e0e]">
        {photoUrl ? (
          <>
            {/* Ambient blurred backdrop to seamlessly fill any aspect-ratio */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <Image
                src={photoUrl}
                alt=""
                fill
                className="object-cover object-center blur-2xl scale-110 opacity-40 brightness-75"
              />
            </div>

            {/* Sharp, pure photo centered without awkward cropping */}
            <Image
              src={photoUrl}
              alt={current.title}
              fill
              priority
              className="object-contain object-center transition-transform duration-700 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </>
        ) : (
          <div className="w-full h-full bg-[#1c1917]" />
        )}

        {/* Minimal neutral dark gradient strictly at bottom for text readability */}
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/95 via-black/45 to-transparent pointer-events-none" />

        {/* Foreground Content Card */}
        <div
          key={current.id}
          className="absolute inset-0 p-5 sm:p-8 lg:p-12 flex flex-col justify-end max-w-3xl z-10 space-y-2.5 sm:space-y-3.5 animate-fade-in"
        >
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-white text-[#1f1b17] shadow-sm">
              {getCategoryLabel(current.category)}
            </span>

            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium bg-black/60 backdrop-blur-md text-white border border-white/20">
              <Calendar className="w-3.5 h-3.5 text-[#eae1da]" />
              <span>{formattedDate}</span>
            </span>

            {current.location && (
              <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-black/50 backdrop-blur-md text-[#eae1da] border border-white/10">
                <MapPin className="w-3.5 h-3.5 text-[#eae1da]" />
                <span>{current.location}</span>
              </span>
            )}

            {current.photos && current.photos.length > 1 && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium bg-black/60 backdrop-blur-md text-white border border-white/10">
                <Camera className="w-3.5 h-3.5" />
                <span>{current.photos.length} photos</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight line-clamp-2">
            {current.title}
          </h2>

          {/* Descriptive text snippet */}
          <p className="text-xs sm:text-sm text-[#f0f0f0] leading-relaxed line-clamp-2 sm:line-clamp-3 max-w-2xl font-normal drop-shadow-xs">
            {current.description}
          </p>

          {/* CTA Link */}
          <div className="pt-1 flex items-center gap-3">
            <Link
              href={`/events/${current.id}`}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white text-[#1f1b17] hover:bg-[#f5ece5] text-xs sm:text-sm font-bold shadow-lg transition-all flex items-center gap-2 active:scale-95 group/btn"
            >
              <BookOpen className="w-4 h-4 text-[#7a5739]" />
              <span>Lire le récit & la galerie</span>
              <ArrowRight className="w-4 h-4 text-[#7a5739] group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        {events.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                prevSlide();
              }}
              className="absolute left-2.5 sm:left-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95 z-20"
              aria-label="Récit précédent"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                nextSlide();
              }}
              className="absolute right-2.5 sm:right-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95 z-20"
              aria-label="Récit suivant"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Slide Indicators */}
        {events.length > 1 && (
          <div className="absolute bottom-3 right-4 sm:bottom-5 sm:right-8 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className="text-white/80 hover:text-white transition-colors mr-1"
              title={isAutoPlay ? 'Mettre en pause' : 'Défilement automatique'}
            >
              {isAutoPlay ? <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
            </button>

            {events.map((_, idx) => (
              <button
                key={`dot-event-${idx}`}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all rounded-full ${
                  currentIndex === idx
                    ? 'w-5 sm:w-6 h-1.5 sm:h-2 bg-white'
                    : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Aller au récit ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
