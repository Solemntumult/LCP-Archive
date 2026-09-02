import React from 'react';
import Link from 'next/link';
import { ArrowLeft, UserPlus, Sparkles, ChevronRight } from 'lucide-react';
import PersonForm from '@/components/person/PersonForm';

export default async function AddPersonPage({
  searchParams,
}: {
  searchParams: Promise<{ parent_id?: string; parent_gender?: 'M' | 'F' }>;
}) {
  const resolvedParams = await searchParams;
  const parentId = resolvedParams.parent_id ? parseInt(resolvedParams.parent_id, 10) : undefined;
  const parentGender = resolvedParams.parent_gender;

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
        <span className="font-semibold text-[#1f1b17]">Ajouter un membre</span>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-[#173124] text-white flex items-center justify-center shadow-md">
          <UserPlus className="w-6 h-6 text-[#98b5a3]" />
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#173124] tracking-tight">
            Ajouter un Membre de la Famille
          </h1>
          <p className="text-sm text-[#727973] mt-0.5">
            Enregistrez un ancêtre, un conjoint ou un nouvel enfant dans les registres familiaux.
          </p>
        </div>
      </div>

      {/* Form Component */}
      <PersonForm
        prefillParentId={parentId}
        prefillParentGender={parentGender}
      />
    </div>
  );
}
