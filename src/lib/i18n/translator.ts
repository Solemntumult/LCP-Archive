'use client';

import { FamilyEvent, Person, PersonDetail, TreeNodeData } from '@/types';
import { Language } from './translations';
import { translateDbText } from './dbTranslation';

const CLIENT_CACHE_KEY = 'lcp_translations_cache_v2';
const memoryCache = new Map<string, string>();

// Initialize memory cache from localStorage if on client
if (typeof window !== 'undefined') {
  try {
    const stored = localStorage.getItem(CLIENT_CACHE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      for (const [k, v] of Object.entries(parsed)) {
        if (typeof v === 'string') {
          memoryCache.set(k, v);
        }
      }
    }
  } catch (e) {
    console.warn('Failed to load translations cache from localStorage:', e);
  }
}

function saveToLocalStorage(key: string, value: string) {
  if (typeof window === 'undefined') return;
  try {
    const current = localStorage.getItem(CLIENT_CACHE_KEY);
    const parsed = current ? JSON.parse(current) : {};
    parsed[key] = value;
    // Limit cache size to 1000 items
    const keys = Object.keys(parsed);
    if (keys.length > 1000) {
      delete parsed[keys[0]];
    }
    localStorage.setItem(CLIENT_CACHE_KEY, JSON.stringify(parsed));
  } catch (e) {
    // Ignore storage quota exceeded
  }
}

/**
 * Translates any French text asynchronously via the server translation API.
 * Uses local and in-memory caches for instantaneous resolution.
 */
export async function translateAsync(text: string | null | undefined, lang: Language): Promise<string> {
  if (!text || typeof text !== 'string') return '';
  if (lang === 'fr') return text;

  const trimmed = text.trim();
  if (!trimmed) return text;

  // 1. Check in-memory cache
  const cacheKey = `fr:en:${trimmed}`;
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey)!;
  }

  // 2. Check synchronous DB translation
  const syncTrans = translateDbText(trimmed, 'en');
  if (syncTrans && syncTrans !== trimmed) {
    memoryCache.set(cacheKey, syncTrans);
    return syncTrans;
  }

  // 3. Call server translation API
  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: trimmed, from: 'fr', to: 'en' }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.translatedText) {
        memoryCache.set(cacheKey, data.translatedText);
        saveToLocalStorage(cacheKey, data.translatedText);
        return data.translatedText;
      }
    }
  } catch (err) {
    console.warn('Error fetching translation:', err);
  }

  return syncTrans || text;
}

/**
 * Translates multiple texts concurrently in a single batch.
 */
export async function translateBatchAsync(texts: string[], lang: Language): Promise<string[]> {
  if (!texts || texts.length === 0) return [];
  if (lang === 'fr') return texts;

  const results: string[] = [];
  const missingIndices: number[] = [];
  const missingTexts: string[] = [];

  for (let i = 0; i < texts.length; i++) {
    const t = texts[i];
    if (!t) {
      results.push('');
      continue;
    }
    const trimmed = t.trim();
    const cacheKey = `fr:en:${trimmed}`;
    if (memoryCache.has(cacheKey)) {
      results.push(memoryCache.get(cacheKey)!);
    } else {
      const syncTrans = translateDbText(trimmed, 'en');
      if (syncTrans && syncTrans !== trimmed) {
        memoryCache.set(cacheKey, syncTrans);
        results.push(syncTrans);
      } else {
        results.push(trimmed);
        missingIndices.push(i);
        missingTexts.push(trimmed);
      }
    }
  }

  if (missingTexts.length > 0) {
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: missingTexts, from: 'fr', to: 'en' }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.translations && Array.isArray(data.translations)) {
          data.translations.forEach((trans: string, idx: number) => {
            const originalIndex = missingIndices[idx];
            const originalText = missingTexts[idx];
            const cacheKey = `fr:en:${originalText}`;
            if (trans) {
              results[originalIndex] = trans;
              memoryCache.set(cacheKey, trans);
              saveToLocalStorage(cacheKey, trans);
            }
          });
        }
      }
    } catch (err) {
      console.warn('Batch translation error:', err);
    }
  }

  return results;
}

/**
 * Fully translates a FamilyEvent object into English.
 */
export async function translateEventAsync(event: FamilyEvent, lang: Language): Promise<FamilyEvent> {
  if (!event || lang === 'fr') return event;

  const [title, description, location] = await Promise.all([
    translateAsync(event.title, lang),
    translateAsync(event.description, lang),
    event.location ? translateAsync(event.location, lang) : Promise.resolve(event.location),
  ]);

  return {
    ...event,
    title: title || event.title,
    description: description || event.description,
    location: location ?? event.location,
  };
}

/**
 * Fully translates an array of FamilyEvent objects.
 */
export async function translateEventsAsync(events: FamilyEvent[], lang: Language): Promise<FamilyEvent[]> {
  if (!events || events.length === 0 || lang === 'fr') return events;

  // Extract all text fields to batch translate
  const allTexts: string[] = [];
  events.forEach((ev) => {
    allTexts.push(ev.title || '');
    allTexts.push(ev.description || '');
    allTexts.push(ev.location || '');
  });

  const translatedTexts = await translateBatchAsync(allTexts, lang);

  return events.map((ev, idx) => {
    const baseIdx = idx * 3;
    const title = translatedTexts[baseIdx] || ev.title;
    const description = translatedTexts[baseIdx + 1] || ev.description;
    const location = ev.location ? translatedTexts[baseIdx + 2] || ev.location : ev.location;

    return {
      ...ev,
      title,
      description,
      location,
    };
  });
}
