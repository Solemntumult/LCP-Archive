'use client';

import React, { useState } from 'react';
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
  User,
  AlertTriangle,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { FamilyEvent, EventCategory, Person } from '@/types';
import EventFormModal from './EventFormModal';
import { removeLocalStoredEvent } from '@/lib/eventStorage';

export default function EventDetailView({
  initialEvent,
  allPersons = [],
}: {
  initialEvent: FamilyEvent;
  allPersons?: Person[];
}) {
  const router = useRouter();
  const [event, setEvent] = useState<FamilyEvent>(initialEvent);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const photos = event.photos && event.photos.length > 0 ? event.photos : (event.photo ? [event.photo] : []);

  const eventDate = new Date(event.event_date);
  const formattedDate = eventDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const getCategoryBadge = (category: EventCategory) => {
    switch (category) {
      case 'reunion':
        return { label: 'Rassemblement Familial', bg: 'bg-[#173124] text-white', icon: Users };
      case 'commemoration':
        return { label: 'Commémoration & Hommage', bg: 'bg-[#7a5739] text-white', icon: Award };
      case 'celebration':
        return { label: 'Célébration & Fête', bg: 'bg-[#c69214] text-white', icon: Sparkles };
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
      const res = await fetch(`/api/events/${event.id}`, { method: 'DELETE' });
      if (res.ok) {
        removeLocalStoredEvent(event.id);
        router.push('/events');
      }
    } catch (err) {
      console.error('Failed to delete event:', err);
      setDeleting(false);
    }
  };

  const currentMainPhoto = photos.length > 0 ? photos[activePhotoIndex % photos.length] : null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* 1. Top Navigation & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#727973]">
          <Link href="/" className="hover:text-[#173124] transition-colors">
            Accueil
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/events" className="hover:text-[#173124] transition-colors">
            Événements
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-[#1f1b17] truncate max-w-xs">{event.title}</span>
        </nav>

        {/* Edit & Delete Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#173124] text-white hover:bg-[#2d4739] shadow-xs transition-all active:scale-95"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Modifier l&apos;événement</span>
          </button>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#ba1a1a] bg-[#ffdad6]/40 hover:bg-[#ffdad6] transition-all"
            title="Supprimer l'événement"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Supprimer</span>
          </button>
        </div>
      </div>

      {/* 2. Main Hero Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#eae1da] vintage-shadow space-y-6">
        {/* Category & Date Metadata */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className={`inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-2xs ${badge.bg}`}>
            <BadgeIcon className="w-3.5 h-3.5" />
            <span>{badge.label}</span>
          </span>

          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#f5ece5] text-[#173124] border border-[#eae1da]">
            <Calendar className="w-3.5 h-3.5 text-[#7a5739]" />
            <span className="capitalize">{formattedDate}</span>
          </span>

          {event.location && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#fff8f4] text-[#7a5739] border border-[#eae1da]">
              <MapPin className="w-3.5 h-3.5" />
              <span>{event.location}</span>
            </span>
          )}

          {!event.is_past && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#ccead6] text-[#062014]">
              {event.days_until === 0 ? "Aujourd'hui !" : `Dans ${event.days_until} jours`}
            </span>
          )}
        </div>

        {/* Featured Photo Viewer Frame (Inline, responsive, no full-screen overlays) */}
        {currentMainPhoto && (
          <div className="relative w-full h-72 sm:h-96 md:h-[420px] rounded-3xl overflow-hidden bg-[#0e0e0e] border-2 border-[#eae1da] shadow-lg vintage-photo-frame group">
            {/* Ambient blurred atmosphere background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <Image
                src={currentMainPhoto}
                alt=""
                fill
                className="object-cover object-center blur-xl scale-110 opacity-35 brightness-75"
              />
            </div>

            {/* Crisp centered main image */}
            <Image
              src={currentMainPhoto}
              alt={event.title}
              fill
              className="object-contain object-center transition-all duration-300"
              priority
              sizes="(max-width: 1024px) 100vw, 1000px"
            />

            {/* Previous & Next Navigation Controls for Multi-photos */}
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActivePhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all opacity-80 group-hover:opacity-100"
                  aria-label="Photo précédente"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => setActivePhotoIndex((prev) => (prev + 1) % photos.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all opacity-80 group-hover:opacity-100"
                  aria-label="Photo suivante"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        )}

        {/* Event Title */}
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#173124] tracking-tight leading-tight">
          {event.title}
        </h1>

        {/* Narrative Description with Drop-Cap Styling */}
        <div className="pt-2 text-base sm:text-lg text-[#424844] leading-relaxed whitespace-pre-line border-t border-[#f5ece5]">
          <p className="drop-cap">{event.description}</p>
        </div>
      </div>

      {/* 3. Rich Photo Gallery Section (thumbnails that switch the photo directly in-place) */}
      {photos.length > 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#eae1da] vintage-shadow space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#f5ece5]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#f5ece5] flex items-center justify-center text-[#7a5739]">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-2xl text-[#173124]">
                  Galerie de photographies d&apos;archive
                </h2>
                <p className="text-xs text-[#727973] mt-0.5">
                  Cliquez sur une photographie pour l&apos;afficher dans le cadre ci-dessus.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="text-xs font-semibold text-[#173124] hover:underline"
            >
              + Gérer les photos
            </button>
          </div>

          {/* Photos Grid Thumbnails */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((photoUrl, idx) => {
              const isSelected = idx === activePhotoIndex;
              return (
                <div
                  key={`gallery-photo-${idx}`}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`group relative rounded-2xl overflow-hidden aspect-4/3 bg-[#0e0e0e] border-2 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 ${
                    isSelected
                      ? 'border-[#173124] ring-2 ring-[#173124]/30 scale-102'
                      : 'border-[#eae1da] hover:border-[#7a5739]/50'
                  }`}
                >
                  <Image
                    src={photoUrl}
                    alt={event.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#173124]/15 pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Edit Modal */}
      <EventFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialEvent={event}
        onSuccess={refreshEvent}
      />

      {/* 5. Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-fade-in"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl sm:rounded-3xl border border-[#eae1da] shadow-2xl max-w-md w-full p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-[#ba1a1a]">
              <div className="w-12 h-12 rounded-2xl bg-[#ffdad6] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#1f1b17]">
                  Supprimer l&apos;événement
                </h3>
                <p className="text-xs text-[#727973]">
                  Cette action supprimera définitivement le récit.
                </p>
              </div>
            </div>

            <p className="text-xs text-[#727973] leading-relaxed">
              Êtes-vous sûr de vouloir supprimer l&apos;événement <strong>« {event.title} »</strong> de l&apos;archive familiale ?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#eae1da] text-xs font-semibold text-[#424844] hover:bg-[#f5ece5]"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-2 rounded-xl bg-[#ba1a1a] text-white text-xs font-bold hover:bg-[#93000a] shadow-md transition-all flex items-center gap-2"
              >
                {deleting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Confirmer la suppression</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
