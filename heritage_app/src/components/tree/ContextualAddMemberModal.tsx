'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, User, Heart, Baby, GitFork, Sparkles } from 'lucide-react';
import { TreeNodeData } from '@/types';

export type RelationType = 'child' | 'parent' | 'spouse' | 'sibling';

export default function ContextualAddMemberModal({
  isOpen,
  onClose,
  targetPerson,
  allPersons,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  targetPerson: TreeNodeData | null;
  allPersons: TreeNodeData[];
  onSuccess: () => void;
}) {
  const [relationType, setRelationType] = useState<RelationType>('child');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [birthDate, setBirthDate] = useState('');
  const [profession, setProfession] = useState('');
  const [selectedCoParentId, setSelectedCoParentId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (targetPerson) {
      setLastName(targetPerson.last_name);
      setFirstName('');
      setBirthDate('');
      setProfession('');
      setError(null);

      // Default co-parent if target has a spouse
      if (
        targetPerson.children_by_spouse &&
        targetPerson.children_by_spouse.length > 0 &&
        targetPerson.children_by_spouse[0].spouse
      ) {
        setSelectedCoParentId(String(targetPerson.children_by_spouse[0].spouse.id));
      } else {
        setSelectedCoParentId('');
      }
    }
  }, [targetPerson, isOpen]);

  if (!isOpen || !targetPerson) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      let fatherId: number | null = null;
      let motherId: number | null = null;
      let spouseOfId: number | null = null;

      if (relationType === 'child') {
        if (targetPerson.gender === 'M') {
          fatherId = targetPerson.id;
          motherId = selectedCoParentId ? parseInt(selectedCoParentId, 10) : null;
        } else {
          motherId = targetPerson.id;
          fatherId = selectedCoParentId ? parseInt(selectedCoParentId, 10) : null;
        }
      } else if (relationType === 'parent') {
        // Adding a parent to targetPerson
        // We will create the parent, then update targetPerson with father_id or mother_id
      } else if (relationType === 'spouse') {
        spouseOfId = targetPerson.id;
      } else if (relationType === 'sibling') {
        fatherId = targetPerson.father_id || null;
        motherId = targetPerson.mother_id || null;
      }

      const res = await fetch('/api/persons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          gender,
          birth_date: birthDate || null,
          profession: profession || null,
          father_id: fatherId,
          mother_id: motherId,
          spouse_of_id: spouseOfId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de l'enregistrement");
      }

      const created = await res.json();

      // If we added a parent to targetPerson, update targetPerson with the new parent
      if (relationType === 'parent') {
        const updatePayload =
          gender === 'M' ? { father_id: created.id } : { mother_id: created.id };
        await fetch(`/api/persons/${targetPerson.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatePayload),
        });
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl border border-[#eae1da] shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#f5ece5]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#7a5739]">
              Ajout Rapide Contextuel
            </span>
            <h3 className="font-serif font-bold text-xl text-[#173124]">
              Ajouter un proche de {targetPerson.first_name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#727973] hover:bg-[#f5ece5] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-[#ffdad6] text-[#93000a] text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Relation Choice Buttons */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-2">
              Lien de parenté avec {targetPerson.first_name} *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setRelationType('child')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  relationType === 'child'
                    ? 'bg-[#173124] text-white border-[#173124] shadow-xs'
                    : 'bg-[#fff8f4] text-[#424844] border-[#eae1da] hover:bg-[#f5ece5]'
                }`}
              >
                <Baby className="w-4 h-4" />
                <span>Enfant</span>
              </button>

              <button
                type="button"
                onClick={() => setRelationType('parent')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  relationType === 'parent'
                    ? 'bg-[#173124] text-white border-[#173124] shadow-xs'
                    : 'bg-[#fff8f4] text-[#424844] border-[#eae1da] hover:bg-[#f5ece5]'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Parent</span>
              </button>

              <button
                type="button"
                onClick={() => setRelationType('spouse')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  relationType === 'spouse'
                    ? 'bg-[#173124] text-white border-[#173124] shadow-xs'
                    : 'bg-[#fff8f4] text-[#424844] border-[#eae1da] hover:bg-[#f5ece5]'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Conjoint</span>
              </button>

              <button
                type="button"
                onClick={() => setRelationType('sibling')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  relationType === 'sibling'
                    ? 'bg-[#173124] text-white border-[#173124] shadow-xs'
                    : 'bg-[#fff8f4] text-[#424844] border-[#eae1da] hover:bg-[#f5ece5]'
                }`}
              >
                <GitFork className="w-4 h-4" />
                <span>Frère/Sœur</span>
              </button>
            </div>
          </div>

          {/* If adding a child and target has spouse(s), allow selecting the other parent */}
          {relationType === 'child' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1.5">
                Autre parent (conjoint co-parent)
              </label>
              <select
                value={selectedCoParentId}
                onChange={(e) => setSelectedCoParentId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae1da] bg-[#fff8f4] text-xs text-[#1f1b17] focus:outline-hidden focus:ring-2 focus:ring-[#173124]"
              >
                <option value="">-- Non spécifié / Parent unique --</option>
                {allPersons
                  .filter((p) => p.id !== targetPerson.id && p.gender !== targetPerson.gender)
                  .map((sp) => (
                    <option key={`coparent-${sp.id}`} value={sp.id}>
                      {sp.name} ({sp.gender === 'M' ? 'Père' : 'Mère'})
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1">
                Prénom *
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="ex: Paul"
                className="w-full px-3.5 py-2 rounded-xl border border-[#eae1da] bg-[#fff8f4] text-xs text-[#1f1b17] focus:outline-hidden focus:ring-2 focus:ring-[#173124]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1">
                Nom de famille *
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#eae1da] bg-[#fff8f4] text-xs text-[#1f1b17] focus:outline-hidden focus:ring-2 focus:ring-[#173124]"
              />
            </div>
          </div>

          {/* Gender & Birth Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1">
                Genre *
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setGender('M')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border ${
                    gender === 'M'
                      ? 'bg-[#2980b9] text-white border-[#2980b9]'
                      : 'bg-[#fff8f4] text-[#424844] border-[#eae1da]'
                  }`}
                >
                  Homme
                </button>
                <button
                  type="button"
                  onClick={() => setGender('F')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border ${
                    gender === 'F'
                      ? 'bg-[#c0392b] text-white border-[#c0392b]'
                      : 'bg-[#fff8f4] text-[#424844] border-[#eae1da]'
                  }`}
                >
                  Femme
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1">
                Date de naissance
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#eae1da] bg-[#fff8f4] text-xs text-[#1f1b17] focus:outline-hidden focus:ring-2 focus:ring-[#173124]"
              />
            </div>
          </div>

          {/* Profession */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1">
              Profession
            </label>
            <input
              type="text"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              placeholder="ex: Enseignant, Ingénieur..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#eae1da] bg-[#fff8f4] text-xs text-[#1f1b17] focus:outline-hidden focus:ring-2 focus:ring-[#173124]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f5ece5]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#eae1da] text-xs font-semibold text-[#424844] hover:bg-[#f5ece5]"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-[#173124] text-white text-xs font-bold hover:bg-[#2d4739] shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Enregistrement...' : 'Ajouter à la famille'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
