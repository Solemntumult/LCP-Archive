import { NextRequest, NextResponse } from 'next/server';

const memoryCache = new Map<string, string>();

function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&eacute;/g, 'é')
    .replace(/&egrave;/g, 'è')
    .replace(/&agrave;/g, 'à')
    .replace(/&ccedil;/g, 'ç')
    .replace(/&ocirc;/g, 'ô')
    .replace(/&ecirc;/g, 'ê')
    .replace(/&icirc;/g, 'î')
    .replace(/&iuml;/g, 'ï')
    .replace(/&ucirc;/g, 'û')
    .replace(/&ugrave;/g, 'ù')
    .replace(/&nbsp;/g, ' ');
}

async function translateWithGoogleGtx(text: string, from = 'fr', to = 'en'): Promise<string | null> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      next: { revalidate: 86400 },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translated = data[0].map((item: any) => (item && item[0] ? item[0] : '')).join('');
        if (translated && translated.trim().length > 0) {
          return decodeHtmlEntities(translated.trim());
        }
      }
    }
  } catch (err) {
    console.warn('Google GTX Translate error:', err);
  }
  return null;
}

async function translateWithMyMemory(text: string, from = 'fr', to = 'en'): Promise<string | null> {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      next: { revalidate: 86400 },
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.responseData?.translatedText) {
        const decoded = decodeHtmlEntities(data.responseData.translatedText);
        if (!decoded.toLowerCase().includes('is an invalid target language') &&
            !decoded.toLowerCase().includes('quota exceeded') &&
            !decoded.toLowerCase().includes('query error') &&
            !decoded.toLowerCase().includes('limit reached')) {
          return decoded.trim();
        }
      }
    }
  } catch (err) {
    console.warn('MyMemory Translate error:', err);
  }
  return null;
}

async function translateSingleChunk(text: string, from = 'fr', to = 'en'): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return text;

  const cacheKey = `${from}:${to}:${trimmed}`;
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey)!;
  }

  // 1. Google GTX (highest accuracy for full paragraphs & sentence structures)
  const gtxRes = await translateWithGoogleGtx(trimmed, from, to);
  if (gtxRes) {
    memoryCache.set(cacheKey, gtxRes);
    return gtxRes;
  }

  // 2. MyMemory (reliable backup)
  const myMemRes = await translateWithMyMemory(trimmed, from, to);
  if (myMemRes) {
    memoryCache.set(cacheKey, myMemRes);
    return myMemRes;
  }

  return text;
}

async function translateLongText(text: string, from = 'fr', to = 'en'): Promise<string> {
  if (!text || typeof text !== 'string') return '';
  if (from === to) return text;

  const trimmed = text.trim();
  if (!trimmed) return text;

  // Split into paragraphs to preserve line breaks
  const paragraphs = text.split(/\r?\n\r?\n/);
  const translatedParagraphs: string[] = [];

  for (const para of paragraphs) {
    if (!para.trim()) {
      translatedParagraphs.push('');
      continue;
    }

    if (para.length <= 800) {
      const trans = await translateSingleChunk(para, from, to);
      translatedParagraphs.push(trans);
    } else {
      // Split paragraph by sentences
      const sentences = para.split(/(?<=[.!?])\s+/);
      const translatedSentences: string[] = [];
      for (const sentence of sentences) {
        if (!sentence.trim()) continue;
        const trans = await translateSingleChunk(sentence, from, to);
        translatedSentences.push(trans);
      }
      translatedParagraphs.push(translatedSentences.join(' '));
    }
  }

  return translatedParagraphs.join('\n\n');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const from = body.from || 'fr';
    const to = body.to || 'en';

    if (body.texts && Array.isArray(body.texts)) {
      const results = await Promise.all(
        body.texts.map((t: string) => translateLongText(t, from, to))
      );
      return NextResponse.json({ translations: results });
    }

    if (typeof body.text === 'string') {
      const result = await translateLongText(body.text, from, to);
      return NextResponse.json({ translatedText: result });
    }

    return NextResponse.json({ error: 'Missing text or texts in request body' }, { status: 400 });
  } catch (err: any) {
    console.error('Translation API error:', err);
    return NextResponse.json({ error: err.message || 'Translation failed' }, { status: 500 });
  }
}

