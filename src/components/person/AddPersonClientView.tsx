'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, UserPlus, Sparkles, ChevronRight } from 'lucide-react';
import PersonForm from '@/components/person/PersonForm';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function AddPersonClientView({
  parentId,
  parentGender,
}: {
  parentId?: number;
  parentGender?: 'M' | 'F';
}) {
  const { t, language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-[#727973]">
        <Link href="/" className="hover:text-[#173124] transition-colors">
          {t('nav_dashboard')}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/tree" className="hover:text-[#173124] transition-colors">
          {t('nav_tree')}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-[#1f1b17]">{t('nav_add_member')}</span>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-[#173124] text-white flex items-center justify-center shadow-md">
          <UserPlus className="w-6 h-6 text-[#98b5a3]" />
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#173124] tracking-tight">
            {t('person_add_title')}
          </h1>
          <p className="text-sm text-[#727973] mt-0.5">
            {t('person_add_subtitle')}
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
