import { NextRequest, NextResponse } from 'next/server';
import { searchPersons } from '@/lib/db';
import { getFullName } from '@/lib/genealogy';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const persons = await searchPersons(query, limit);
    const formatted = persons.map(p => ({
      id: p.id,
      name: getFullName(p),
      first_name: p.first_name,
      last_name: p.last_name,
      gender: p.gender,
      birth_year: p.birth_date ? new Date(p.birth_date).getFullYear() : null,
      death_year: p.death_date ? new Date(p.death_date).getFullYear() : null,
      photo: p.photo,
      profession: p.profession,
      birth_place: p.birth_place,
      is_spouse: p.spouse_of_id !== null && p.spouse_of_id !== undefined,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error in search API:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
