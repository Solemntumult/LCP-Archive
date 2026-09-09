import React from 'react';
import { notFound } from 'next/navigation';
import { getAllPersons } from '@/lib/db';
import { getPersonDetail } from '@/lib/genealogy';
import PersonDetailViewClient from '@/components/person/PersonDetailViewClient';

export const dynamic = 'force-dynamic';

export default async function PersonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  if (isNaN(id)) notFound();

  const allPersons = await getAllPersons();
  const person = getPersonDetail(id, allPersons);
  if (!person) notFound();

  return <PersonDetailViewClient person={person} />;
}
