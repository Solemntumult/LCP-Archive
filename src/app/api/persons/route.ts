import { NextRequest, NextResponse } from 'next/server';
import { getAllPersons, createPerson } from '@/lib/db';
import { PersonFormData } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const persons = await getAllPersons();
    return NextResponse.json(persons);
  } catch (error) {
    console.error('Error fetching persons:', error);
    return NextResponse.json({ error: 'Failed to fetch persons' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PersonFormData;

    if (!body.first_name || !body.last_name || !body.gender) {
      return NextResponse.json(
        { error: 'Prénom, nom et genre sont requis' },
        { status: 400 }
      );
    }

    const created = await createPerson(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating person:', error);
    return NextResponse.json({ error: 'Failed to create person' }, { status: 500 });
  }
}
