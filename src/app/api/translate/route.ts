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
    .replace(/&nbsp;/g, ' ');
}

async function translateChunk(text: string, from = 'fr', to = 'en'): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return text;
  
  const cacheKey = `${from}:${to}:${trimmed}`;
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey)!;
  }

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=${from}|${to}`;
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
        // If response is not just an error message
        if (!decoded.toLowerCase().includes('is an invalid target language') &&
            !decoded.toLowerCase().includes('quota exceeded')) {
          memoryCache.set(cacheKey, decoded);
          return decoded;
        }
      }
    }
  } catch (err) {
    console.warn('Translate chunk error:', err);
  }

  return text;
}

async function translateLongText(text: string, from = 'fr', to = 'en'): Promise<string> {
  if (!text || typeof text !== 'string') return '';
  if (from === to) return text;

  const trimmed = text.trim();
  if (!trimmed) return text;

  // If text is short enough, translate directly
  if (trimmed.length <= 400) {
    return await translateChunk(trimmed, from, to);
  }

  // If long text (multi-sentence paragraph), split by sentences / paragraphs
  const paragraphs = text.split(/\r?\n\r?\n/);
  const translatedParagraphs: string[] = [];

  for (const para of paragraphs) {
    if (!para.trim()) {
      translatedParagraphs.push('');
      continue;
    }

    // Split paragraph by sentences
    const sentences = para.split(/(?<=[.!?])\s+/);
    const translatedSentences: string[] = [];

    for (const sentence of sentences) {
      if (!sentence.trim()) continue;
      const trans = await translateChunk(sentence, from, to);
      translatedSentences.push(trans);
    }

    translatedParagraphs.push(translatedSentences.join(' '));
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
