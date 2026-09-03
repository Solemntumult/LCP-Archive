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
  if (typeof window === 'undefined') return serverEvents;

  try {
    const local = getLocalStoredEvents();
    const serverMap = new Map<number, FamilyEvent>((serverEvents || []).map((e) => [e.id, e]));

    // Check if client has events that the server lambda does not know about
    const missingOnServer: FamilyEvent[] = [];
    local.forEach((loc) => {
      if (!serverMap.has(loc.id)) {
        missingOnServer.push(loc);
      }
    });

    if (missingOnServer.length > 0) {
      const res = await fetch('/api/events/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: local }),
      });
      if (res.ok) {
        const synced: FamilyEvent[] = await res.json();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(synced));
        return synced;
      }
    }

    // Merge server events into localStorage
    const mergedMap = new Map<number, FamilyEvent>();
    local.forEach((e) => mergedMap.set(e.id, e));
    (serverEvents || []).forEach((e) => mergedMap.set(e.id, e));
    const merged = Array.from(mergedMap.values()).sort(
      (a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch (e) {
    console.error('Error syncing client and server events:', e);
    return serverEvents || [];
  }
}
