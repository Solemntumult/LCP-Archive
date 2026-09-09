'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { PersonDetail } from '@/types';
import PersonBio from '@/components/person/PersonBio';
import PersonTimeline from '@/components/person/PersonTimeline';
import FamilyRelationships from '@/components/person/FamilyRelationships';
import PersonDetailClientActions from '@/components/person/PersonDetailClientActions';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function PersonDetailViewClient({
  person,
}: {
  person: PersonDetail;
}) {
  const { t, language } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#727973]">
        <Link href="/" className="hover:text-[#173124] transition-colors">
          {t('nav_dashboard')}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/tree" className="hover:text-[#173124] transition-colors">
          {t('nav_tree')}
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
              {t('person_archive_notice')}
            </h4>
            <p>{t('person_register_id')} <span className="font-mono text-[#1f1b17]">#{person.id}</span></p>
            <p>{t('person_lineage')} <span className="font-medium text-[#1f1b17]">{person.is_blood_family ? t('person_direct_blood') : t('person_alliance_member')}</span></p>
            <p>{t('person_relative_generation')} <span className="font-medium text-[#1f1b17]">{t('generation')} {person.generation + 1}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
