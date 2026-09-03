import React from 'react';
import { getAllEvents } from '@/lib/db';
import EventsClientView from '@/components/events/EventsClientView';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const events = await getAllEvents();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <EventsClientView initialEvents={events} />
    </div>
  );
}
