import React from 'react';
import { BookOpen, Award, GraduationCap, Quote } from 'lucide-react';
import { PersonDetail } from '@/types';

export default function PersonBio({ person }: { person: PersonDetail }) {
  const hasBio = Boolean(person.biography && person.biography.trim().length > 0);
  const hasAccomplishments = Boolean(person.accomplishments && person.accomplishments.trim().length > 0);
  const hasEducation = Boolean(person.education && person.education.trim().length > 0);

  if (!hasBio && !hasAccomplishments && !hasEducation) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-[#eae1da] vintage-shadow text-center text-[#727973]">
        <BookOpen className="w-12 h-12 mx-auto text-[#c2c8c2] mb-3" />
        <h3 className="font-serif font-bold text-lg text-[#1f1b17]">Histoire de vie à documenter</h3>
        <p className="text-sm text-[#727973] mt-1 max-w-md mx-auto">
          Aucun récit biographique n&apos;est encore rédigé pour {person.full_name}. Ajoutez son histoire, ses études et ses réalisations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Biography Section */}
      {hasBio && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#eae1da] vintage-shadow">
          <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-[#f5ece5]">
            <BookOpen className="w-5 h-5 text-[#7a5739]" />
            <h2 className="font-serif font-bold text-xl text-[#173124]">
              Récit Biographique & Histoire de Vie
            </h2>
          </div>

          <div className="font-serif text-base sm:text-lg leading-relaxed text-[#1f1b17] space-y-4 whitespace-pre-line drop-cap">
            {person.biography}
          </div>
        </div>
      )}

      {/* Accomplishments Section */}
      {hasAccomplishments && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#eae1da] vintage-shadow">
          <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-[#f5ece5]">
            <Award className="w-5 h-5 text-[#c69214]" />
            <h2 className="font-serif font-bold text-xl text-[#173124]">
              Accomplissements & Distinctions
            </h2>
          </div>

          <div className="text-sm sm:text-base leading-relaxed text-[#424844] space-y-3 whitespace-pre-line bg-[#fff8f4] p-5 rounded-2xl border border-[#eae1da]">
            {person.accomplishments}
          </div>
        </div>
      )}

      {/* Education Section */}
      {hasEducation && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#eae1da] vintage-shadow">
          <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-[#f5ece5]">
            <GraduationCap className="w-5 h-5 text-[#173124]" />
            <h2 className="font-serif font-bold text-xl text-[#173124]">
              Formation & Éducation
            </h2>
          </div>

          <div className="text-sm sm:text-base leading-relaxed text-[#424844] space-y-3 whitespace-pre-line bg-[#fff8f4] p-5 rounded-2xl border border-[#eae1da]">
            {person.education}
          </div>
        </div>
      )}
    </div>
  );
}
