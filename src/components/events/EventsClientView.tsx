'use client';

import React, { useState, useEffect } from 'react';
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
import { syncClientAndServerEvents } from '@/lib/eventStorage';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function EventsClientView({
  initialEvents,
}: {
  initialEvents: FamilyEvent[];
}) {
  const { t } = useLanguage();
  const [events, setEvents] = useState<FamilyEvent[]>(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    syncClientAndServerEvents(initialEvents).then((synced) => {
      setEvents(synced);
    });
  }, [initialEvents]);

  const refreshEvents = async () => {
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        const synced = await syncClientAndServerEvents(data);
        setEvents(synced);
      }
    } catch (err) {
      console.error('Failed to refresh events:', err);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* 1. Grande Section : D?fil? des R?cits des ?v?nements Pass?s */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#173124]" />
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#173124]">
                {t('events_title')}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#727973] mt-0.5">
              {t('events_subtitle')}
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#173124] text-white text-xs font-bold hover:bg-[#2d4739] shadow-xs transition-all active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-[#98b5a3]" />
            <span>{t('events_add_btn')}</span>
          </button>
        </div>

        <EventCarousel events={events} onOpenCreateModal={() => setIsModalOpen(true)} />
      </div>

      {/* 2. Deuxi?me Section : D?fil? des ?v?nements ? ? venir ? */}
      <div className="space-y-4 pt-6 border-t border-[#eae1da]">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#7a5739]" />
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#173124]">
              {t('events_upcoming_title')}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#727973] mt-0.5">
            {t('events_upcoming_subtitle')}
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
