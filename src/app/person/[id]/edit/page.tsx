import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Edit3, ChevronRight } from 'lucide-react';
import { getPersonById } from '@/lib/db';
import PersonForm from '@/components/person/PersonForm';

export const dynamic = 'force-dynamic';

export default async function EditPersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  if (isNaN(id)) notFound();

  const person = getPersonById(id);
  if (!person) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-[#727973]">
        <Link href="/" className="hover:text-[#173124] transition-colors">
          Accueil
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/tree" className="hover:text-[#173124] transition-colors">
          Arbre Généalogique
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/person/${person.id}`} className="hover:text-[#173124] transition-colors">
          {person.first_name} {person.last_name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-[#1f1b17]">Modifier</span>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-[#7a5739] text-white flex items-center justify-center shadow-md">
          <Edit3 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#173124] tracking-tight">
            Modifier la fiche : {person.first_name} {person.last_name}
          </h1>
          <p className="text-sm text-[#727973] mt-0.5">
            Mettez à jour l&apos;état civil, les relations, l&apos;histoire de vie ou la photo.
          </p>
        </div>
      </div>

      {/* Form */}
      <PersonForm
        personId={person.id}
        initialData={{
          first_name: person.first_name,
          last_name: person.last_name,
          maiden_name: person.maiden_name || '',
          gender: person.gender,
          birth_date: person.birth_date || '',
          birth_place: person.birth_place || '',
          death_date: person.death_date || '',
          death_place: person.death_place || '',
          father_id: person.father_id,
          mother_id: person.mother_id,
          spouse_of_id: person.spouse_of_id,
          biography: person.biography || '',
          accomplishments: person.accomplishments || '',
          profession: person.profession || '',
          education: person.education || '',
          photo: person.photo || '',
        }}
      />
    </div>
  );
}
