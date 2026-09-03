import { NextRequest, NextResponse } from 'next/server';
import { getPersonById, updatePerson, deletePerson, getAllPersons } from '@/lib/db';
import { getPersonDetail } from '@/lib/genealogy';
import { PersonFormData } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    const allPersons = await getAllPersons();
    const detail = getPersonDetail(id, allPersons);
    if (!detail) {
      return NextResponse.json({ error: 'Personne non trouvée' }, { status: 404 });
    }

    return NextResponse.json(detail);
  } catch (error) {
    console.error('Error fetching person detail:', error);
    return NextResponse.json({ error: 'Failed to fetch person' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    const body = (await req.json()) as Partial<PersonFormData>;
    const updated = await updatePerson(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Personne non trouvée' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating person:', error);
    return NextResponse.json({ error: 'Failed to update person' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    const success = await deletePerson(id);
    if (!success) {
      return NextResponse.json({ error: 'Personne non trouvée' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Personne supprimée' });
  } catch (error) {
    console.error('Error deleting person:', error);
    return NextResponse.json({ error: 'Failed to delete person' }, { status: 500 });
  }
}
