import React from 'react';
import { notFound } from 'next/navigation';
import { getPersonById } from '@/lib/db';
import EditPersonClientView from '@/components/person/EditPersonClientView';

export const dynamic = 'force-dynamic';

export default async function EditPersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  if (isNaN(id)) notFound();

  const person = await getPersonById(id);
  if (!person) notFound();

  return <EditPersonClientView person={person} />;
}
