'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  User,
  Upload,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  BookOpen,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Person, PersonFormData } from '@/types';
import { getFullName } from '@/lib/genealogy';

export default function PersonForm({
  initialData,
  personId,
  prefillParentId,
  prefillParentGender,
}: {
  initialData?: Partial<PersonFormData>;
  personId?: number;
  prefillParentId?: number;
  prefillParentGender?: 'M' | 'F';
}) {
  const router = useRouter();
  const isEditing = Boolean(personId);

  // Form State
  const [formData, setFormData] = useState<PersonFormData>({
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    maiden_name: initialData?.maiden_name || '',
    gender: initialData?.gender || 'M',
    birth_date: initialData?.birth_date || '',
    birth_place: initialData?.birth_place || '',
    death_date: initialData?.death_date || '',
    death_place: initialData?.death_place || '',
    father_id: initialData?.father_id || (prefillParentGender === 'M' ? prefillParentId : null) || null,
    mother_id: initialData?.mother_id || (prefillParentGender === 'F' ? prefillParentId : null) || null,
    spouse_of_id: initialData?.spouse_of_id || null,
    biography: initialData?.biography || '',
    accomplishments: initialData?.accomplishments || '',
    profession: initialData?.profession || '',
    education: initialData?.education || '',
    photo: initialData?.photo || '',
  });

  const [allPersons, setAllPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch all persons to populate smart select options
  useEffect(() => {
    async function loadMembers() {
      try {
        const res = await fetch('/api/persons');
        const data = await res.json();
        if (Array.isArray(data)) {
          setAllPersons(data);
        }
      } catch (err) {
        console.error('Failed to load persons for form:', err);
      }
    }
    loadMembers();
  }, []);

  // Filtered dropdown lists matching Django logic
  const fatherOptions = allPersons.filter((p) => p.gender === 'M' && p.id !== personId);
  const motherOptions = allPersons.filter((p) => p.gender === 'F' && p.id !== personId);
  const bloodOptions = allPersons.filter((p) => !p.spouse_of_id && p.id !== personId);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'father_id' || name === 'mother_id' || name === 'spouse_of_id'
          ? value === ''
            ? null
            : parseInt(value, 10)
          : value,
    }));
  };

  // Photo Upload Handler
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        const result = await res.json();
        setFormData((prev) => ({ ...prev, photo: result.url }));
      } else {
        alert("Erreur lors de l'upload de la photo");
      }
    } catch (err) {
      console.error(err);
      alert('Erreur lors du téléchargement');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setErrorMsg('Veuillez renseigner le prénom et le nom de famille.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isEditing ? `/api/persons/${personId}` : '/api/persons';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const saved = await res.json();
        router.push(`/person/${saved.id}`);
        router.refresh();
      } else {
        const err = await res.json();
        setErrorMsg(err.error || "Erreur lors de l'enregistrement");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Erreur de connexion avec le serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#93000a] text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. Identity & Vital Status Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#eae1da] vintage-shadow space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#f5ece5]">
          <User className="w-5 h-5 text-[#7a5739]" />
          <h2 className="font-serif font-bold text-xl text-[#173124]">
            1. État Civil & Identité
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Prénom */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1.5">
              Prénom *
            </label>
            <input
              type="text"
              name="first_name"
              required
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Ex: Paul"
              className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f4] border border-[#eae1da] focus:border-[#173124] focus:ring-1 focus:ring-[#173124] outline-hidden text-sm font-medium"
            />
          </div>

          {/* Nom de famille */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1.5">
              Nom de famille *
            </label>
            <input
              type="text"
              name="last_name"
              required
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Ex: LISSANON"
              className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f4] border border-[#eae1da] focus:border-[#173124] focus:ring-1 focus:ring-[#173124] outline-hidden text-sm font-medium"
            />
          </div>

          {/* Genre */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1.5">
              Genre *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f4] border border-[#eae1da] focus:border-[#173124] outline-hidden text-sm font-medium"
            >
              <option value="M">Homme</option>
              <option value="F">Femme</option>
            </select>
          </div>

          {/* Nom de jeune fille (si femme) */}
          {formData.gender === 'F' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1.5">
                Nom de jeune fille (optionnel)
              </label>
              <input
                type="text"
                name="maiden_name"
                value={formData.maiden_name || ''}
                onChange={handleChange}
                placeholder="Ex: GBAGUIDI"
                className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f4] border border-[#eae1da] focus:border-[#173124] outline-hidden text-sm font-medium"
              />
            </div>
          )}

          {/* Profession */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1.5">
              Profession
            </label>
            <input
              type="text"
              name="profession"
              value={formData.profession || ''}
              onChange={handleChange}
              placeholder="Ex: Enseignant, Ingénieur..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f4] border border-[#eae1da] focus:border-[#173124] outline-hidden text-sm font-medium"
            />
          </div>
        </div>

        {/* Photo Upload Section */}
        <div className="pt-4 border-t border-[#f5ece5]">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-2">
            Portrait / Photo d&apos;archive
          </label>
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-[#eae1da] border border-[#eae1da] shrink-0">
              {formData.photo ? (
                <Image
                  src={formData.photo}
                  alt="Portrait"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#727973] text-xs">
                  Aucune
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#f5ece5] text-[#173124] hover:bg-[#eae1da] border border-[#eae1da] transition-all">
                <Upload className="w-4 h-4" />
                <span>{uploadingPhoto ? 'Téléchargement...' : 'Choisir une image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-[#727973]">
                Format JPG, PNG ou WEBP.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Important Dates & Locations */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#eae1da] vintage-shadow space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#f5ece5]">
          <Calendar className="w-5 h-5 text-[#7a5739]" />
          <h2 className="font-serif font-bold text-xl text-[#173124]">
            2. Dates & Lieux Notables
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Naissance */}
          <div className="space-y-3 p-4.5 rounded-2xl bg-[#fff8f4] border border-[#eae1da]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7a5739]">
              Naissance
            </h3>
            <div>
              <label className="block text-xs text-[#727973] mb-1">Date</label>
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae1da] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-[#727973] mb-1">Lieu</label>
              <input
                type="text"
                name="birth_place"
                value={formData.birth_place || ''}
                onChange={handleChange}
                placeholder="Ex: Cotonou, Bénin"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae1da] text-sm"
              />
            </div>
          </div>

          {/* Décès */}
          <div className="space-y-3 p-4.5 rounded-2xl bg-[#fff8f4] border border-[#eae1da]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7a5739]">
              Décès (laisser vide si en vie)
            </h3>
            <div>
              <label className="block text-xs text-[#727973] mb-1">Date</label>
              <input
                type="date"
                name="death_date"
                value={formData.death_date || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae1da] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-[#727973] mb-1">Lieu</label>
              <input
                type="text"
                name="death_place"
                value={formData.death_place || ''}
                onChange={handleChange}
                placeholder="Ex: Porto-Novo"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae1da] text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Family Relations (Smart Filtering) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#eae1da] vintage-shadow space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#f5ece5]">
          <User className="w-5 h-5 text-[#7a5739]" />
          <h2 className="font-serif font-bold text-xl text-[#173124]">
            3. Filiation & Relations Familiales
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Père */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1.5">
              Père (Hommes)
            </label>
            <select
              name="father_id"
              value={formData.father_id ?? ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f4] border border-[#eae1da] text-sm font-medium"
            >
              <option value="">-- Aucun père sélectionné --</option>
              {fatherOptions.map((f) => (
                <option key={f.id} value={f.id}>
                  {getFullName(f)} {f.birth_date ? `(${new Date(f.birth_date).getFullYear()})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Mère */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1.5">
              Mère (Femmes)
            </label>
            <select
              name="mother_id"
              value={formData.mother_id ?? ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f4] border border-[#eae1da] text-sm font-medium"
            >
              <option value="">-- Aucune mère sélectionnée --</option>
              {motherOptions.map((m) => (
                <option key={m.id} value={m.id}>
                  {getFullName(m)} {m.birth_date ? `(${new Date(m.birth_date).getFullYear()})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Conjoint(e) de (pour conjoints externes) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1.5">
              Conjoint(e) de (Alliance)
            </label>
            <select
              name="spouse_of_id"
              value={formData.spouse_of_id ?? ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f4] border border-[#eae1da] text-sm font-medium"
            >
              <option value="">-- Membre de sang / Aucun --</option>
              {bloodOptions.map((b) => (
                <option key={b.id} value={b.id}>
                  {getFullName(b)}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-[#727973] mt-1">
              Remplir uniquement si cette personne a épousé un membre de la lignée de sang.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Biography & Achievements */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#eae1da] vintage-shadow space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#f5ece5]">
          <BookOpen className="w-5 h-5 text-[#7a5739]" />
          <h2 className="font-serif font-bold text-xl text-[#173124]">
            4. Histoire de Vie, Accomplissements & Éducation
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1.5">
              Biographie & Récit de vie
            </label>
            <textarea
              name="biography"
              rows={6}
              value={formData.biography || ''}
              onChange={handleChange}
              placeholder="Racontez le parcours, anecdotes, souvenirs marquants..."
              className="w-full p-4 rounded-2xl bg-[#fff8f4] border border-[#eae1da] focus:border-[#173124] outline-hidden text-sm leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1.5">
              Accomplissements & Distinctions
            </label>
            <textarea
              name="accomplishments"
              rows={4}
              value={formData.accomplishments || ''}
              onChange={handleChange}
              placeholder="Titres honorifiques, contributions majeures, réalisations..."
              className="w-full p-4 rounded-2xl bg-[#fff8f4] border border-[#eae1da] focus:border-[#173124] outline-hidden text-sm leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1.5">
              Formation & Éducation
            </label>
            <textarea
              name="education"
              rows={3}
              value={formData.education || ''}
              onChange={handleChange}
              placeholder="Diplômes, écoles, parcours académique..."
              className="w-full p-4 rounded-2xl bg-[#fff8f4] border border-[#eae1da] focus:border-[#173124] outline-hidden text-sm leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Action Submit Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-xl border border-[#eae1da] text-sm font-semibold text-[#424844] hover:bg-[#f5ece5] transition-all"
        >
          Annuler
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 rounded-xl bg-[#173124] hover:bg-[#2d4739] text-white text-sm font-semibold shadow-md transition-all active:scale-95 flex items-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Enregistrer les modifications' : 'Ajouter ce membre'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
