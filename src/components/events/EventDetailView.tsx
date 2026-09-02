'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  MapPin,
  Camera,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  BookOpen,
  Users,
  Award,
  Baby,
  Heart,
  Compass,
  Maximize2,
  AlertTriangle,
} from 'lucide-react';
import { FamilyEvent, EventCategory } from '@/types';
import EventFormModal from './EventFormModal';

export default function EventDetailView({
  initialEvent,
}: {
  initialEvent: FamilyEvent;
}) {
  const router = useRouter();
  const [event, setEvent] = useState<FamilyEvent>(initialEvent);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
        router.push('/events');
      }
    } catch (err) {
      console.error('Failed to delete event:', err);
      setDeleting(false);
    }
  };

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

        {/* Event Title */}
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#173124] tracking-tight leading-tight">
          {event.title}
        </h1>

        {/* Narrative Description with Drop-Cap Styling */}
        <div className="pt-2 text-base sm:text-lg text-[#424844] leading-relaxed whitespace-pre-line border-t border-[#f5ece5]">
          <p className="drop-cap">{event.description}</p>
        </div>
      </div>

      {/* 3. Rich Photo Gallery Section (Plus de photos) */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#eae1da] vintage-shadow space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#f5ece5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f5ece5] flex items-center justify-center text-[#7a5739]">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#173124]">
                Galerie de Photos & Archives
              </h2>
              <p className="text-xs text-[#727973]">
                {photos.length} photographie{photos.length > 1 ? 's' : ''} associée{photos.length > 1 ? 's' : ''} à cet événement.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-xs font-semibold text-[#7a5739] hover:text-[#173124] hover:underline"
          >
            + Gérer les photos
          </button>
        </div>

        {/* Photos Grid */}
        {photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {photos.map((photoUrl, idx) => (
              <div
                key={`gallery-photo-${idx}`}
                onClick={() => setLightboxIndex(idx)}
                className="group relative rounded-2xl overflow-hidden aspect-4/3 bg-[#eae1da] border-2 border-[#eae1da] cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 vintage-photo-frame"
              >
                <Image
                  src={photoUrl}
                  alt={`${event.title} - Photo ${idx + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Hover overlay icon */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center backdrop-blur-xs">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>

                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] text-white font-mono">
                  Photo #{idx + 1}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-[#fff8f4] rounded-2xl border border-dashed border-[#eae1da] space-y-2">
            <Camera className="w-10 h-10 text-[#727973] mx-auto opacity-50" />
            <p className="text-xs text-[#727973]">
              Aucune photo supplémentaire n&apos;est encore enregistrée pour cet événement.
            </p>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-1.5 rounded-xl bg-[#7a5739] text-white text-xs font-semibold hover:bg-[#5f4024] transition-all"
            >
              Ajouter des photos
            </button>
          </div>
        )}
      </div>

      {/* 4. Fullscreen Lightbox for Photos */}
      {lightboxIndex !== null && photos[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-fade-in"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Lightbox Header */}
          <div className="flex items-center justify-between text-white z-10" onClick={(e) => e.stopPropagation()}>
            <span className="text-xs sm:text-sm font-medium opacity-80">
              {event.title} — Photo {lightboxIndex + 1} sur {photos.length}
            </span>
            <button
              onClick={() => setLightboxIndex(null)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Photo Center */}
          <div
            className="relative flex-1 w-full max-w-5xl mx-auto my-4 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full max-h-[75vh]">
              <Image
                src={photos[lightboxIndex]}
                alt={`${event.title} - Photo plein écran`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            {/* Navigation Arrows */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setLightboxIndex((prev) =>
                      prev !== null ? (prev - 1 + photos.length) % photos.length : 0
                    )
                  }
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() =>
                    setLightboxIndex((prev) =>
                      prev !== null ? (prev + 1) % photos.length : 0
                    )
                  }
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Lightbox Footer */}
          <div className="text-center text-xs text-white/70">
            Utilisez les flèches ou cliquez à côté pour fermer
          </div>
        </div>
      )}

      {/* 5. Edit Modal */}
      <EventFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialEvent={event}
        onSuccess={refreshEvent}
      />

      {/* 6. Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl border border-[#eae1da] shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 text-[#ba1a1a]">
              <div className="w-12 h-12 rounded-2xl bg-[#ffdad6] flex items-center justify-center">
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

            <p className="text-xs sm:text-sm text-[#424844]">
              Êtes-vous certain de vouloir supprimer <strong className="text-[#1f1b17]">{event.title}</strong> des archives familiales ?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#eae1da] text-xs font-semibold text-[#424844] hover:bg-[#f5ece5]"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-2 rounded-xl bg-[#ba1a1a] text-white text-xs font-bold hover:bg-[#93000a] shadow-xs disabled:opacity-50"
              >
                {deleting ? 'Suppression...' : 'Supprimer définitivement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
