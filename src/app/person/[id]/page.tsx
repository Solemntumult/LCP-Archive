import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getAllPersons } from '@/lib/db';
import { getPersonDetail } from '@/lib/genealogy';
import PersonBio from '@/components/person/PersonBio';
import PersonTimeline from '@/components/person/PersonTimeline';
import FamilyRelationships from '@/components/person/FamilyRelationships';
import PersonDetailClientActions from '@/components/person/PersonDetailClientActions';

export const dynamic = 'force-dynamic';

export default async function PersonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  if (isNaN(id)) notFound();

  const allPersons = getAllPersons();
  const person = getPersonDetail(id, allPersons);
  if (!person) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#727973]">
        <Link href="/" className="hover:text-[#173124] transition-colors">
          Accueil
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/tree" className="hover:text-[#173124] transition-colors">
          Arbre Généalogique
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-[#1f1b17]">{person.full_name}</span>
      </nav>

      {/* Main Hero Component with Client Actions */}
      <PersonDetailClientActions person={person} />

      {/* 2-Column Editorial Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Biography & Historical Timeline (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          <PersonBio person={person} />
          <PersonTimeline timeline={person.timeline} />
        </div>

        {/* Right Column: Family Links & Tree Connections (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          <FamilyRelationships person={person} />

          {/* Archive Metadata Box */}
          <div className="bg-[#fbf2eb] rounded-3xl p-6 border border-[#eae1da] text-xs text-[#727973] space-y-2">
            <h4 className="font-serif font-bold text-sm text-[#1f1b17]">
              Notice d&apos;archive
            </h4>
            <p>Identifiant de registre : <span className="font-mono text-[#1f1b17]">#{person.id}</span></p>
            <p>Lignée : <span className="font-medium text-[#1f1b17]">{person.is_blood_family ? 'Lignée sanguine directe' : 'Membre rattaché par alliance'}</span></p>
            <p>Génération relative : <span className="font-medium text-[#1f1b17]">Génération {person.generation + 1}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
