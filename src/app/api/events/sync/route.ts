import { NextRequest, NextResponse } from 'next/server';
import { syncEvents } from '@/lib/db';
import { FamilyEvent } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const clientEvents: FamilyEvent[] = Array.isArray(body.events) ? body.events : [];
    const updated = await syncEvents(clientEvents);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error syncing events:', error);
    return NextResponse.json({ error: 'Failed to sync events' }, { status: 500 });
  }
}
