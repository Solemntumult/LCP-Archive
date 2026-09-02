'use client';

import React, { useState } from 'react';
import {
  Calendar,
  PlusCircle,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { FamilyEvent } from '@/types';
import EventCarousel from './EventCarousel';
import UpcomingEventCarousel from './UpcomingEventCarousel';
import EventFormModal from './EventFormModal';

export default function EventsClientView({
  initialEvents,
}: {
  initialEvents: FamilyEvent[];
}) {
  const [events, setEvents] = useState<FamilyEvent[]>(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const refreshEvents = async () => {
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error('Failed to refresh events:', err);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* 1. Grande Section : Défilé des Récits des Événements Passés (du plus récent au plus lointain) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#173124]" />
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#173124]">
                Récits & Moments d&apos;Histoire
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#727973] mt-0.5">
              Revivez les moments marquants et rassemblements de la famille (du plus récent au plus lointain).
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#173124] text-white text-xs font-bold hover:bg-[#2d4739] shadow-xs transition-all active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-[#98b5a3]" />
            <span>Ajouter un événement</span>
          </button>
        </div>

        <EventCarousel events={events} />
      </div>

      {/* 2. Deuxième Section : Défilé des Événements « À venir » (du plus proche au plus lointain) */}
      <div className="space-y-4 pt-6 border-t border-[#eae1da]">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#7a5739]" />
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#173124]">
              À venir
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#727973] mt-0.5">
            Prochains rendez-vous et célébrations programmés (du plus proche au plus lointain).
          </p>
        </div>

        <UpcomingEventCarousel events={events} />
      </div>

      {/* Form Modal for Creating/Adding an Event */}
      <EventFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refreshEvents}
      />
    </div>
  );
}
