import { NextRequest, NextResponse } from 'next/server';
import { getAllEvents, createEvent } from '@/lib/db';
import { FamilyEventFormData } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const filterType = searchParams.get('type'); // 'past' | 'upcoming'
    const category = searchParams.get('category');

    let events = getAllEvents();

    if (filterType === 'past') {
      events = events.filter((e) => e.is_past);
    } else if (filterType === 'upcoming') {
      events = events.filter((e) => !e.is_past);
    }

    if (category && category !== 'all') {
      events = events.filter((e) => e.category === category);
    }

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as FamilyEventFormData;

    if (!body.title || !body.description || !body.event_date) {
      return NextResponse.json(
        { error: 'Titre, description et date sont requis' },
        { status: 400 }
      );
    }

    const created = createEvent(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
