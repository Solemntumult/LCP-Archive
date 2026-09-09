'use client';

import { FamilyEvent, Person, PersonDetail, TreeNodeData } from '@/types';
import { Language } from './translations';
import { translateDbText, translatePersonData } from './dbTranslation';

const CLIENT_CACHE_KEY = 'lcp_translations_cache_v5';
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

  // 2. Call server translation API for clean, whole-sentence translation
  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: trimmed, from: 'fr', to: 'en' }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.translatedText && data.translatedText.trim().length > 0) {
        memoryCache.set(cacheKey, data.translatedText);
        saveToLocalStorage(cacheKey, data.translatedText);
        return data.translatedText;
      }
    }
  } catch (err) {
    console.warn('Error fetching translation:', err);
  }

  // 3. Fallback to dictionary translation
  const syncTrans = translateDbText(trimmed, 'en');
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
      results.push(trimmed);
      missingIndices.push(i);
      missingTexts.push(trimmed);
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
            if (trans && trans.trim().length > 0) {
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

  // Any remaining un-translated items get dictionary fallback
  for (let i = 0; i < results.length; i++) {
    if (results[i] === texts[i]) {
      const sync = translateDbText(texts[i], 'en');
      if (sync) results[i] = sync;
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

/**
 * Fully translates a Person / PersonDetail object asynchronously into English.
 */
export async function translatePersonAsync<T extends Person | PersonDetail | TreeNodeData>(
  person: T,
  lang: Language
): Promise<T> {
  if (!person || lang === 'fr') return person;

  // 1. Synchronous dictionary & biographical mapping (instant)
  const syncPerson = translatePersonData(person, lang);

  const isPaul = person.id === 1 || (person.first_name === 'Paul' && person.last_name === 'LISSANON');
  if (isPaul) {
    return syncPerson;
  }

  // 2. Dynamic batch translation for any newly uploaded / edited family member
  const p = person as any;
  const textsToTranslate: string[] = [];

  if (p.profession) textsToTranslate.push(p.profession);
  if (p.birth_place) textsToTranslate.push(p.birth_place);
  if (p.death_place) textsToTranslate.push(p.death_place);
  if (p.biography) textsToTranslate.push(p.biography);
  if (p.accomplishments) textsToTranslate.push(p.accomplishments);
  if (p.education) textsToTranslate.push(p.education);

  if (Array.isArray(p.timeline)) {
    p.timeline.forEach((ev: any) => {
      if (ev.title) textsToTranslate.push(ev.title);
      if (ev.description) textsToTranslate.push(ev.description);
      if (ev.location) textsToTranslate.push(ev.location);
    });
  }

  if (textsToTranslate.length > 0) {
    await translateBatchAsync(textsToTranslate, lang);
  }

  return translatePersonData(person, lang);
}
