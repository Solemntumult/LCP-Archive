'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  MapPin,
  Users,
  ChevronRight,
  ChevronLeft,
  Edit3,
  Trash2,
  Camera,
  Sparkles,
  Award,
  Heart,
  Baby,
  Compass,
  AlertTriangle,
  X,
  Maximize2,
  Play,
  Pause,
  Film,
  Video
} from 'lucide-react';
import { FamilyEvent, EventCategory, Person } from '@/types';
import EventFormModal from './EventFormModal';
import { removeLocalStoredEvent } from '@/lib/eventStorage';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { translateEventData, getCategoryBadgeData } from '@/lib/i18n/dbTranslation';

export default function EventDetailView({
  initialEvent,
  allPersons = [],
}: {
  initialEvent: FamilyEvent;
  allPersons?: Person[];
}) {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [event, setEvent] = useState<FamilyEvent>(initialEvent);
  const displayEvent = translateEventData(event, language);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Portal mount flag
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Photos list
  const photos = useMemo(() => {
    return event.photos && event.photos.length > 0
      ? event.photos
      : event.photo
      ? [event.photo]
      : [];
  }, [event.photos, event.photo]);

  // Videos list
  const videos = useMemo(() => {
    return event.videos && event.videos.length > 0
      ? event.videos
      : event.video
      ? [event.video]
      : [];
  }, [event.videos, event.video]);

  // 1. Story photos: Strictly pick from PHOTOS only (never videos!)
  const storyPhotos = useMemo(() => {
    if (photos.length <= 5) return photos;
    const shuffled = [...photos].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }, [photos]);

  const [storyIndex, setStoryIndex] = useState(0);
  const [isStoryPaused, setIsStoryPaused] = useState(false);

  // 2. Automated Story timer (5 seconds delay per photo)
  useEffect(() => {
    if (storyPhotos.length <= 1 || isStoryPaused) return;

    const timer = setInterval(() => {
      setStoryIndex((prev) => (prev + 1) % storyPhotos.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [storyPhotos.length, isStoryPaused]);

  // 3. Lightbox modal state for viewing full-size photo
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxIndex]);

  // Keyboard navigation for lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + photos.length) % photos.length : 0
        );
      }
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % photos.length : 0
        );
      }
    },
    [lightboxIndex, photos.length]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const eventDate = new Date(event.event_date);
  const formattedDate = eventDate.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const badge = getCategoryBadgeData(event.category, t);
  const BadgeIcon = badge.icon;

  const refreshEvent = async () => {
    try {
      const res = await fetch(`/api/events/${event.id}`);
      if (res.ok) {
        const data = await res.json();
        setEvent(data);
      }
    } catch (err) {
      console.error('Failed to refresh event:', err);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to delete event');
      }
      removeLocalStoredEvent(event.id);
      router.push('/events');
      router.refresh();
    } catch (err) {
      console.error('Error deleting event:', err);
      alert(language === 'en' ? 'Error deleting event.' : "Erreur lors de la suppression de l'événement.");
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#eae1da]">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-[#727973]">
          <Link href="/" className="hover:text-[#173124] transition-colors">
            {t('nav_dashboard')}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/events" className="hover:text-[#173124] transition-colors">
            {t('nav_events')}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-[#173124] truncate max-w-[200px] sm:max-w-xs">
            {displayEvent.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#eae1da] bg-white text-xs font-semibold text-[#424844] hover:bg-[#f5ece5] hover:text-[#173124] shadow-2xs transition-all active:scale-95"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#7a5739]" />
            <span>{t('edit')}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#ffdad6] bg-[#fff8f4] text-xs font-semibold text-[#ba1a1a] hover:bg-[#ffdad6] shadow-2xs transition-all active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t('delete')}</span>
          </button>
        </div>
      </div>

      {/* Main Header & Story Media Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#eae1da] vintage-shadow space-y-8">
        {/* Category Badge & Meta */}
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xs ${badge.bg}`}
          >
            <BadgeIcon className="w-3.5 h-3.5" />
            <span>{badge.label}</span>
          </span>

          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#7a5739] bg-[#faebe0] px-3 py-1.5 rounded-full">
            <Calendar className="w-3.5 h-3.5" />
            <span className="capitalize">{formattedDate}</span>
          </div>

          {displayEvent.location && (
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#5c645e] bg-[#f5ece5] px-3 py-1.5 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-[#7a5739]" />
              <span>{displayEvent.location}</span>
            </div>
          )}
        </div>

        {/* 1. Top Story Slideshow (STRICTLY PHOTOS ONLY) */}
        {storyPhotos.length > 0 && (
          <div
            className="relative w-full aspect-16/9 sm:aspect-21/9 rounded-3xl overflow-hidden bg-[#0c0d0c] shadow-lg border border-[#eae1da] group cursor-pointer"
            onMouseEnter={() => setIsStoryPaused(true)}
            onMouseLeave={() => setIsStoryPaused(false)}
            onClick={() => {
              const currentPhoto = storyPhotos[storyIndex % storyPhotos.length];
              const idxInFull = photos.indexOf(currentPhoto);
              setLightboxIndex(idxInFull >= 0 ? idxInFull : 0);
            }}
          >
            {/* Story Top Progress Bars */}
            {storyPhotos.length > 1 && (
              <div className="absolute top-3 left-4 right-4 z-20 flex items-center gap-1.5 pointer-events-none">
                {storyPhotos.map((_, i) => (
                  <div
                    key={`story-bar-${i}`}
                    className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden backdrop-blur-xs"
                  >
                    <div
                      className={`h-full bg-white rounded-full transition-all duration-300 ${
                        i < storyIndex
                          ? 'w-full'
                          : i === storyIndex
                          ? 'w-full animate-story-progress'
                          : 'w-0'
                      }`}
                      style={{
                        animationDuration: '5000ms',
                        animationPlayState: isStoryPaused ? 'paused' : 'running',
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Ambient Blurred Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <Image
                src={storyPhotos[storyIndex % storyPhotos.length]}
                alt=""
                fill
                className="object-cover object-center blur-xl scale-110 opacity-40 brightness-75"
              />
            </div>

            {/* Crisp Centered Active Story Photo */}
            <Image
              key={`story-img-${storyIndex}`}
              src={storyPhotos[storyIndex % storyPhotos.length]}
              alt={event.title}
              fill
              className="object-contain object-center animate-fade-in transition-all duration-500"
              priority
              sizes="(max-width: 1024px) 100vw, 1000px"
            />

            {/* Step Controls */}
            {storyPhotos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setStoryIndex((prev) => (prev - 1 + storyPhotos.length) % storyPhotos.length);
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-all opacity-0 group-hover:opacity-100 z-10"
                  aria-label={language === 'en' ? 'Previous' : 'précédent'}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setStoryIndex((prev) => (prev + 1) % storyPhotos.length);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-all opacity-0 group-hover:opacity-100 z-10"
                  aria-label={language === 'en' ? 'Next' : 'Suivant'}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Tap hint */}
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] text-white font-medium flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{t('events_view_full')}</span>
            </div>
          </div>
        )}

        {/* Event Title */}
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#173124] tracking-tight leading-tight">
          {displayEvent.title}
        </h1>

        {/* Narrative Description */}
        <div className="pt-2 text-base sm:text-lg text-[#424844] leading-relaxed whitespace-pre-line border-t border-[#f5ece5]">
          <p className="drop-cap">{displayEvent.description}</p>
        </div>
      </div>

      {/* 2. Rich Photo Gallery */}
      {photos.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#eae1da] vintage-shadow space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#f5ece5]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#f5ece5] flex items-center justify-center text-[#7a5739]">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-2xl text-[#173124]">
                  {t('events_gallery_photos')}
                </h2>
                <p className="text-xs text-[#727973] mt-0.5">
                  {language === 'en' ? 'Click on any photo to view in full size' : "Cliquez sur une photo pour l'afficher en grand"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="text-xs font-semibold text-[#173124] hover:underline"
            >
              + {t('events_manage_photos')} ({photos.length}/20)
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((photoUrl, idx) => (
              <div
                key={`gallery-photo-${idx}`}
                onClick={() => setLightboxIndex(idx)}
                className="group relative rounded-2xl overflow-hidden aspect-4/3 bg-[#0e0e0e] border-2 border-[#eae1da] hover:border-[#7a5739] cursor-pointer shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Image
                  src={photoUrl}
                  alt={event.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />

                <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <div className="w-9 h-9 rounded-full bg-black/60 flex items-center justify-center backdrop-blur-xs">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Video Gallery (vidéos souvenirs compressées) */}
      {videos.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#eae1da] vintage-shadow space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#f5ece5]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#faebe0] flex items-center justify-center text-[#7a5739]">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-2xl text-[#173124]">
                  {t('events_gallery_videos')}
                </h2>
                <p className="text-xs text-[#727973] mt-0.5">
                  {language === 'en' ? 'Event videos optimized for instant streaming' : "vidéos de l'événement optimisées pour une lecture instantanée"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="text-xs font-semibold text-[#7a5739] hover:underline"
            >
              + {t('events_manage_videos')} ({videos.length}/5)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {videos.map((videoUrl, idx) => (
              <div
                key={`gallery-video-${idx}`}
                className="relative rounded-2xl overflow-hidden aspect-video bg-black border-2 border-[#eae1da] shadow-md flex items-center justify-center"
              >
                <video
                  src={videoUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Fullscreen Lightbox Modal */}
      {mounted &&
        lightboxIndex !== null &&
        photos[lightboxIndex] &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in select-none"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white transition-all z-20 shadow-lg cursor-pointer"
              aria-label={t('close')}
            >
              <X className="w-5 h-5" />
            </button>

            <div
              className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full max-h-[80vh] flex items-center justify-center">
                <Image
                  src={photos[lightboxIndex]}
                  alt={event.title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>

              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((prev) =>
                        prev !== null ? (prev - 1 + photos.length) % photos.length : 0
                      );
                    }}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all shadow-xl z-20"
                    aria-label={language === 'en' ? 'Previous' : 'précédent'}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((prev) =>
                        prev !== null ? (prev + 1) % photos.length : 0
                      );
                    }}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all shadow-xl z-20"
                    aria-label={language === 'en' ? 'Next' : 'Suivant'}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          </div>,
          document.body
        )}

      {/* 5. Edit Modal */}
      <EventFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialEvent={event}
        onSuccess={refreshEvent}
      />

      {/* 6. Delete Confirmation Modal */}
      {isDeleteModalOpen &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-fade-in"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            <div
              className="bg-white rounded-2xl sm:rounded-3xl border border-[#eae1da] shadow-2xl max-w-md w-full p-6 space-y-5 cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 text-[#ba1a1a]">
                <div className="w-12 h-12 rounded-2xl bg-[#ffdad6] flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1f1b17]">
                    {t('events_confirm_delete_title')}
                  </h3>
                  <p className="text-xs text-[#727973] mt-0.5">
                    {displayEvent.title}
                  </p>
                </div>
              </div>

              <p className="text-sm text-[#424844] leading-relaxed">
                {t('events_confirm_delete_desc')}
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={deleting}
                  className="px-4 py-2.5 rounded-xl border border-[#eae1da] text-xs font-semibold text-[#424844] hover:bg-[#f5ece5] transition-all"
                >
                  {t('cancel')}
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-5 py-2.5 rounded-xl bg-[#ba1a1a] text-white text-xs font-bold hover:bg-[#93000a] shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  {deleting ? t('loading') : t('events_delete_confirm_btn')}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
