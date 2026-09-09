'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PersonHero from './PersonHero';
import { PersonDetail } from '@/types';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function PersonDetailClientActions({
  person,
}: {
  person: PersonDetail;
}) {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/persons/${person.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.push('/tree');
        router.refresh();
      } else {
        alert(language === 'en' ? 'Error during deletion' : 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error(err);
      alert(language === 'en' ? 'Communication error with server' : 'Erreur de communication avec le serveur');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PersonHero
        person={person}
        onDelete={() => setDeleteModalOpen(true)}
      />

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1f1b17]/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 border border-[#eae1da] shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-serif font-bold text-xl text-[#1f1b17]">
                {language === 'en' ? `Delete ${person.full_name}?` : `Supprimer ${person.full_name} ?`}
              </h3>
              <p className="text-sm text-[#727973] leading-relaxed">
                {language === 'en'
                  ? 'This action will permanently remove this member from the family tree. Parent and child links will be adjusted.'
                  : "Cette action retirera d?finitivement ce membre de l'arbre g?n?alogique. Les liens avec ses parents et enfants seront r?ajust?s."}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl border border-[#eae1da] text-sm font-semibold text-[#424844] hover:bg-[#f5ece5] transition-all"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-[#ba1a1a] text-white text-sm font-semibold hover:bg-[#93000a] shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>{t('delete')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
