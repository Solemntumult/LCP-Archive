import { NextResponse } from 'next/server';
import { getAllPersons, getAllEvents } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const hasDbUrl = Boolean(
    (process.env.DATABASE_URL && process.env.DATABASE_URL.trim().length > 0) ||
    (process.env.POSTGRES_URL && process.env.POSTGRES_URL.trim().length > 0)
  );

  try {
    const persons = await getAllPersons();
    const events = await getAllEvents();

    return NextResponse.json({
      status: 'ok',
      database_configured: hasDbUrl,
      database_type: hasDbUrl ? 'PostgreSQL (Neon Cloud)' : 'SQLite / Fallback',
      persons_count: persons.length,
      events_count: events.length,
      persistence: hasDbUrl ? '100% Permanente (Cloud PostgreSQL)' : 'Non persistante (DATABASE_URL manquante sur Vercel)',
      instructions: hasDbUrl
        ? 'Base PostgreSQL connectée et active ! Vos modifications sont persistantes.'
        : 'Ajoutez DATABASE_URL dans les variables d’environnement Vercel pour activer la persistance PostgreSQL.',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        database_configured: hasDbUrl,
        error: error?.message || 'Erreur inconnue',
      },
      { status: 500 }
    );
  }
}
