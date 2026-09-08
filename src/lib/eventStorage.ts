'use client';

import { FamilyEvent } from '@/types';

const STORAGE_KEY = 'lcp_family_events_v2';

export function getLocalStoredEvents(): FamilyEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalStoredEvent(event: FamilyEvent) {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalStoredEvents();
    const filtered = current.filter((e) => e.id !== event.id);
    const updated = [event, ...filtered];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save event to localStorage:', e);
  }
}

export function removeLocalStoredEvent(id: number) {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalStoredEvents();
    const updated = current.filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to remove event from localStorage:', e);
  }
}

export async function syncClientAndServerEvents(serverEvents: FamilyEvent[]): Promise<FamilyEvent[]> {
  if (typeof window === 'undefined') return serverEvents || [];

  try {
    if (serverEvents && Array.isArray(serverEvents)) {
      // Server is the authoritative source of truth.
      // Cache the fresh server events into localStorage.
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serverEvents));
      return serverEvents;
    }

    const local = getLocalStoredEvents();
    return local;
  } catch (e) {
    console.error('Error syncing client and server events:', e);
    return serverEvents || [];
  }
}
