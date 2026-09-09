'use client';

import React from 'react';
import Link from 'next/link';
import { Lightbulb, ArrowRight, Camera, Calendar, BookOpen, UserPlus } from 'lucide-react';
import { DashboardStats } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { translateDbText } from '@/lib/i18n/dbTranslation';

export default function HintCard({ hints }: { hints: DashboardStats['missingDataHints'] }) {
  const { t, language } = useLanguage();

  const getIcon = (type: DashboardStats['missingDataHints'][0]['type']) => {
    switch (type) {
      case 'missing_photo':
        return <Camera className="w-4 h-4 text-[#7a5739]" />;
      case 'missing_birth':
        return <Calendar className="w-4 h-4 text-[#2980b9]" />;
      case 'missing_bio':
        return <BookOpen className="w-4 h-4 text-[#173124]" />;
      default:
        return <UserPlus className="w-4 h-4 text-[#c69214]" />;
    }
  };

  const getHintContent = (hint: DashboardStats['missingDataHints'][0]) => {
    if (language === 'fr') {
      return {
        title: hint.title,
        description: hint.description,
      };
    }
    // English mode translations
    const name = hint.personName || '';
    if (hint.type === 'missing_birth') {
      return {
        title: 'Unknown birth date',
        description: `Add the birth date of ${name} to enrich the timeline.`,
      };
    }
    if (hint.type === 'missing_photo') {
      return {
        title: 'Missing profile photo',
        description: `An archive photo for ${name} will enhance the family tree.`,
      };
    }
    if (hint.type === 'missing_bio') {
      return {
        title: 'Life story to complete',
        description: `Document the biography and achievements of ${name}.`,
      };
    }
    return {
      title: translateDbText(hint.title, language),
      description: translateDbText(hint.description, language),
    };
  };

  return (
    <div className="bg-[#ffffff] p-6 rounded-2xl border border-[#eae1da] vintage-shadow">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#f5ece5]">
        <div className="flex items-center gap-2.5">
          <Lightbulb className="w-5 h-5 text-[#c69214]" />
          <h3 className="font-serif font-bold text-lg text-[#1f1b17]">
            {t('dash_hints_title')}
          </h3>
        </div>
        <span className="text-xs bg-[#f5e7c8] text-[#8c6508] px-2.5 py-1 rounded-full font-medium">
          {hints.length} {language === 'fr' ? (hints.length > 1 ? 'pistes' : 'piste') : (hints.length > 1 ? 'hints' : 'hint')}
        </span>
      </div>

      {hints.length === 0 ? (
        <div className="py-6 text-center text-[#727973]">
          <p className="font-serif text-[#173124] font-medium">{t('dash_hints_completed')}</p>
          <p className="text-xs mt-1">{t('dash_hints_completed_desc')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {hints.map((hint) => {
            const { title, description } = getHintContent(hint);
            return (
              <div
                key={hint.id}
                className="p-3.5 rounded-xl bg-[#fff8f4] border border-[#eae1da] hover:border-[#7a5739]/30 transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#eae1da] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    {getIcon(hint.type)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#7a5739]">
                      {title}
                    </h4>
                    <p className="text-sm text-[#1f1b17] font-medium line-clamp-1 mt-0.5">
                      {description}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/person/${hint.personId}/edit`}
                  className="shrink-0 p-2 rounded-lg bg-white border border-[#eae1da] text-[#173124] hover:bg-[#173124] hover:text-white transition-all shadow-2xs group-hover:translate-x-0.5"
                  title={t('edit')}
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
