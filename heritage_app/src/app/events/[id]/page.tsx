import React from 'react';
import { notFound } from 'next/navigation';
import { getEventById } from '@/lib/db';
import EventDetailView from '@/components/events/EventDetailView';

export const dynamic = 'force-dynamic';

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  if (isNaN(id)) notFound();

  const event = getEventById(id);
  if (!event) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <EventDetailView initialEvent={event} />
    </div>
  );
}
