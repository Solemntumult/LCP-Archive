import { NextResponse } from 'next/server';
import { getAllPersons } from '@/lib/db';
import { getTreeDataFormatted } from '@/lib/genealogy';

export async function GET() {
  try {
    const persons = getAllPersons();
    const data = getTreeDataFormatted(persons);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching tree data:', error);
    return NextResponse.json({ error: 'Failed to fetch tree data' }, { status: 500 });
  }
}
