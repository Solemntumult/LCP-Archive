'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users,
  Heart,
  PlusCircle,
  Baby,
  ArrowRight,
} from 'lucide-react';
import { Person, PersonDetail } from '@/types';
import { getFullName } from '@/lib/genealogy';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { translatePersonData } from '@/lib/i18n/dbTranslation';

export default function FamilyRelationships({ person: rawPerson }: { person: PersonDetail }) {
  const { t, language } = useLanguage();
  const person = translatePersonData(rawPerson, language);

  const renderMemberMiniCard = (memberRaw: Person, relationLabel: string) => {
    const member = translatePersonData(memberRaw, language);
    const isMale = member.gender === 'M';
    const initials = `${member.first_name[0] || ''}${member.last_name[0] || ''}`;
    const name = getFullName(member);

    return (
      <Link
        key={`rel-${member.id}`}
        href={`/person/${member.id}`}
        className="flex items-center gap-3 p-3 rounded-2xl bg-[#fff8f4] border border-[#eae1da] hover:border-[#7a5739]/40 hover:bg-[#fbf2eb] transition-all group"
      >
        <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 border-white ring-2 ring-[#173124]/10">
          {member.photo || (member as any).photo_url ? (
            <Image
              src={(member.photo || (member as any).photo_url)!}
              alt={name}
              fill
              className="object-cover"
              sizes="44px"
            />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center font-serif font-bold text-xs text-white ${
                isMale ? 'bg-[#2980b9]' : 'bg-[#c0392b]'
              }`}
            >
              {initials}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#7a5739]">
            {relationLabel}
          </p>
          <h4 className="font-serif font-bold text-sm text-[#1f1b17] truncate group-hover:text-[#173124]">
            {name}
          </h4>
          {member.birth_date && (
            <p className="text-[11px] text-[#727973]">
              {new Date(member.birth_date).getFullYear()}
            </p>
          )}
        </div>

        <ArrowRight className="w-4 h-4 text-[#c2c8c2] group-hover:text-[#173124] group-hover:translate-x-0.5 transition-all shrink-0" />
      </Link>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#eae1da] vintage-shadow space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-[#f5ece5]">
        <div className="flex items-center gap-2.5">
          <Users className="w-5 h-5 text-[#7a5739]" />
          <h2 className="font-serif font-bold text-xl text-[#173124]">
            {t('person_family_tab')}
          </h2>
        </div>
      </div>

      {/* Parents Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#727973]">
          {t('person_parents')}
        </h3>

        {!person.father && !person.mother ? (
          <p className="text-xs text-[#727973] italic p-3 bg-[#fff8f4] rounded-xl border border-[#eae1da]">
            {language === 'fr' ? 'Aucun parent direct renseigné (génération racine).' : 'No direct parents recorded (Root generation).'}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {person.father && renderMemberMiniCard(person.father, t('person_father'))}
            {person.mother && renderMemberMiniCard(person.mother, t('person_mother'))}
          </div>
        )}
      </div>

      {/* Siblings Section */}
      {person.siblings.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#727973]">
            {t('person_siblings')} ({person.siblings.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {person.siblings.map((sib) =>
              renderMemberMiniCard(
                sib,
                language === 'fr' ? (sib.gender === 'M' ? 'Frère' : 'Sœur') : (sib.gender === 'M' ? 'Brother' : 'Sister')
              )
            )}
          </div>
        </div>
      )}

      {/* Spouses Section */}
      {person.spouses.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#727973] flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-[#c69214]" />
            {t('person_spouses')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {person.spouses.map((spouse) =>
              renderMemberMiniCard(spouse, language === 'fr' ? 'Conjoint(e)' : 'Spouse')
            )}
          </div>
        </div>
      )}

      {/* Children Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#727973] flex items-center gap-1.5">
            <Baby className="w-3.5 h-3.5 text-[#173124]" />
            {t('person_children')} ({person.children.length})
          </h3>
          <Link
            href={`/person/add?parent_id=${person.id}&parent_gender=${person.gender}`}
            className="text-xs font-semibold text-[#7a5739] hover:text-[#5f4024] flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{t('add_child')}</span>
          </Link>
        </div>

        {person.children_by_spouse.length === 0 ? (
          <div className="p-6 text-center bg-[#fff8f4] rounded-2xl border border-[#eae1da]">
            <p className="text-xs text-[#727973]">
              {language === 'fr' ? 'Aucun enfant enregistré pour cette personne.' : 'No children recorded for this person.'}
            </p>
            <Link
              href={`/person/add?parent_id=${person.id}&parent_gender=${person.gender}`}
              className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-xl text-xs font-semibold bg-[#173124] text-white hover:bg-[#2d4739] transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t('add_child')}</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {person.children_by_spouse.map((group, idx) => (
              <div
                key={`children-group-${idx}`}
                className="p-4 rounded-2xl bg-[#fff8f4] border border-[#eae1da] space-y-3"
              >
                <div className="flex items-center gap-2 text-xs text-[#7a5739]">
                  <Heart className="w-3.5 h-3.5 text-[#c69214]" />
                  <span>
                    {group.spouse ? (
                      <>
                        {language === 'fr' ? 'Enfants avec ' : 'Children with '}
                        <Link
                          href={`/person/${group.spouse.id}`}
                          className="font-bold underline text-[#173124]"
                        >
                          {getFullName(group.spouse)}
                        </Link>
                      </>
                    ) : (
                      <span className="italic">{language === 'fr' ? 'Autre union' : 'Other union'}</span>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.children.map((child) =>
                    renderMemberMiniCard(
                      child,
                      language === 'fr' ? (child.gender === 'M' ? 'Fils' : 'Fille') : (child.gender === 'M' ? 'Son' : 'Daughter')
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
