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
  Crop,
} from 'lucide-react';
import { Person, PersonFormData } from '@/types';
import { getFullName } from '@/lib/genealogy';
import ImageAdjusterModal from '@/components/ui/ImageAdjusterModal';
import { useLanguage } from '@/lib/i18n/LanguageContext';

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
  const { t, language } = useLanguage();
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

  // Photo Adjuster state
  const [adjusterImage, setAdjusterImage] = useState<string | null>(null);
  const [isAdjusterOpen, setIsAdjusterOpen] = useState(false);

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

  const handlePhotoSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      setAdjusterImage(rawDataUrl);
      setIsAdjusterOpen(true);
      setUploadingPhoto(false);
    };
    reader.onerror = () => {
      setErrorMsg(language === 'en' ? 'Failed to read image file.' : 'Échec de lecture du fichier image.');
      setUploadingPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAdjusterApply = (adjustedDataUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      photo: adjustedDataUrl,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // Basic validation
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setErrorMsg(language === 'en' ? 'First name and last name are required.' : 'Le prénom et le nom de famille sont obligatoires.');
      setLoading(false);
      return;
    }

    try {
      const url = isEditing ? `/api/persons/${personId}` : '/api/persons';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || (language === 'en' ? 'An error occurred while saving.' : "Une erreur est survenue lors de l'enregistrement."));
      }

      const savedPerson = await res.json();
      router.push(`/person/${savedPerson.id}`);
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || (language === 'en' ? 'Error during submission' : "Erreur lors de l'envoi"));
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-[#ffdad6] text-[#ba1a1a] flex items-center gap-3 border border-[#ffb4ab] text-sm font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. Identity & Vital Status */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#eae1da] vintage-shadow space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#f5ece5]">
          <User className="w-5 h-5 text-[#173124]" />
          <h2 className="font-serif font-bold text-xl text-[#173124]">
            {language === 'en' ? '1. Identity & Vital Records' : '1. Identité & État Civil'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Prénom */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1.5">
              {language === 'en' ? 'First Name *' : 'Prénom *'}
            </label>
            <input
              type="text"
              name="first_name"
              required
              value={formData.first_name}
              onChange={handleChange}
              placeholder={language === 'en' ? 'e.g. Paul' : 'Ex: Paul'}
              className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f4] border border-[#eae1da] focus:border-[#173124] focus:ring-1 focus:ring-[#173124] outline-hidden text-sm font-medium"
            />
          </div>

          {/* Nom de famille */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1.5">
              {language === 'en' ? 'Last Name *' : 'Nom de famille *'}
            </label>
            <input
              type="text"
              name="last_name"
              required
              value={formData.last_name}
              onChange={handleChange}
              placeholder={language === 'en' ? 'e.g. LISSANON' : 'Ex: LISSANON'}
              className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f4] border border-[#eae1da] focus:border-[#173124] focus:ring-1 focus:ring-[#173124] outline-hidden text-sm font-medium"
            />
          </div>

          {/* Genre */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1.5">
              {language === 'en' ? 'Gender *' : 'Genre *'}
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f4] border border-[#eae1da] focus:border-[#173124] outline-hidden text-sm font-medium"
            >
              <option value="M">{t('male')}</option>
              <option value="F">{t('female')}</option>
            </select>
          </div>

          {/* Nom de jeune fille (si femme) */}
          {formData.gender === 'F' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1.5">
                {language === 'en' ? 'Maiden Name (optional)' : 'Nom de jeune fille (optionnel)'}
              </label>
              <input
                type="text"
                name="maiden_name"
                value={formData.maiden_name || ''}
                onChange={handleChange}
                placeholder={language === 'en' ? 'e.g. DEGBO' : 'Ex: DEGBO'}
                className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f4] border border-[#eae1da] focus:border-[#173124] outline-hidden text-sm font-medium"
              />
            </div>
          )}

          {/* Profession */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1.5">
              {language === 'en' ? 'Profession / Occupation' : 'Profession'}
            </label>
            <input
              type="text"
              name="profession"
              value={formData.profession || ''}
              onChange={handleChange}
              placeholder={language === 'en' ? 'e.g. Teacher, Engineer...' : 'Ex: Enseignant, Ingénieur...'}
              className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f4] border border-[#eae1da] focus:border-[#173124] outline-hidden text-sm font-medium"
            />
          </div>
        </div>

        {/* Photo Upload Section */}
        <div className="pt-4 border-t border-[#f5ece5]">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-2">
            {language === 'en' ? 'Portrait / Archive Photograph' : "Portrait / Photo d'archive"}
          </label>
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-[#eae1da] border-2 border-[#173124]/20 shadow-xs shrink-0">
              {formData.photo ? (
                <Image
                  src={formData.photo}
                  alt="Portrait"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#727973] text-xs font-serif font-bold">
                  {formData.first_name?.[0] || '?'}{formData.last_name?.[0] || ''}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#173124] text-white hover:bg-[#2d4739] shadow-xs transition-all">
                  <Upload className="w-4 h-4 text-[#98b5a3]" />
                  <span>{formData.photo ? (language === 'en' ? 'Change photo' : 'Changer la photo') : (language === 'en' ? 'Select photo' : 'Sélectionner une photo')}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelected}
                    className="hidden"
                  />
                </label>

                {formData.photo && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setAdjusterImage(formData.photo || null);
                        setIsAdjusterOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#f5ece5] text-[#7a5739] hover:bg-[#eae1da] border border-[#eae1da] transition-all"
                    >
                      <Crop className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Crop / Adjust' : 'Ajuster / Recadrer'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, photo: '' }))}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-all"
                    >
                      <span>{t('delete')}</span>
                    </button>
                  </>
                )}
              </div>
              <p className="text-xs text-[#727973]">
                {language === 'en' ? 'You can zoom, pan and center the photo before saving.' : 'Vous pourrez zoomer, déplacer et cadrer la photo avant de valider.'}
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
            {language === 'en' ? '2. Notable Dates & Locations' : '2. Dates & Lieux Notables'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Naissance */}
          <div className="space-y-3 p-4.5 rounded-2xl bg-[#fff8f4] border border-[#eae1da]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7a5739]">
              {t('birth')}
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
              <label className="block text-xs text-[#727973] mb-1">{language === 'en' ? 'Place' : 'Lieu'}</label>
              <input
                type="text"
                name="birth_place"
                value={formData.birth_place || ''}
                onChange={handleChange}
                placeholder={language === 'en' ? 'e.g. Cotonou, Benin' : 'Ex: Cotonou, Bénin'}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#eae1da] text-sm"
              />
            </div>
          </div>

          {/* décès */}
          <div className="space-y-3 p-4.5 rounded-2xl bg-[#fff8f4] border border-[#eae1da]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7a5739]">
              {language === 'en' ? 'Death (leave empty if living)' : 'Décès (laisser vide si en vie)'}
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
              <label className="block text-xs text-[#727973] mb-1">{language === 'en' ? 'Place' : 'Lieu'}</label>
              <input
                type="text"
                name="death_place"
                value={formData.death_place || ''}
                onChange={handleChange}
                placeholder={language === 'en' ? 'e.g. Porto-Novo' : 'Ex: Porto-Novo'}
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
            {language === 'en' ? '3. Lineage & Family Connections' : '3. Filiation & Relations Familiales'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Père */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1.5">
              {language === 'en' ? 'Father (Men)' : 'Père (Hommes)'}
            </label>
            <select
              name="father_id"
              value={formData.father_id ?? ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f4] border border-[#eae1da] text-sm font-medium"
            >
              <option value="">-- {language === 'en' ? 'No father selected' : 'Aucun père sélectionné'} --</option>
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
              {language === 'en' ? 'Mother (Women)' : 'Mère (Femmes)'}
            </label>
            <select
              name="mother_id"
              value={formData.mother_id ?? ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f4] border border-[#eae1da] text-sm font-medium"
            >
              <option value="">-- {language === 'en' ? 'No mother selected' : 'Aucune mère sélectionnée'} --</option>
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
              {language === 'en' ? 'Spouse of (Union)' : 'Conjoint(e) de (Alliance)'}
            </label>
            <select
              name="spouse_of_id"
              value={formData.spouse_of_id ?? ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f4] border border-[#eae1da] text-sm font-medium"
            >
              <option value="">-- {language === 'en' ? 'Blood member / None' : 'Membre de sang / Aucun'} --</option>
              {bloodOptions.map((b) => (
                <option key={b.id} value={b.id}>
                  {getFullName(b)}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-[#727973] mt-1">
              {language === 'en'
                ? 'Fill only if this person married a direct bloodline member.'
                : 'Remplir uniquement si cette personne a épousé un membre de la lignée de sang.'}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Biography & Achievements */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#eae1da] vintage-shadow space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#f5ece5]">
          <BookOpen className="w-5 h-5 text-[#7a5739]" />
          <h2 className="font-serif font-bold text-xl text-[#173124]">
            {language === 'en' ? '4. Life Story, Accomplishments & Education' : '4. Histoire de Vie, Accomplissements & Éducation'}
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1.5">
              {t('person_bio_tab')}
            </label>
            <textarea
              name="biography"
              rows={6}
              value={formData.biography || ''}
              onChange={handleChange}
              placeholder={language === 'en' ? 'Share journey, anecdotes, notable memories...' : 'Racontez le parcours, anecdotes, souvenirs marquants...'}
              className="w-full p-4 rounded-2xl bg-[#fff8f4] border border-[#eae1da] focus:border-[#173124] outline-hidden text-sm leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1.5">
              {t('person_accomplishments_tab')}
            </label>
            <textarea
              name="accomplishments"
              rows={4}
              value={formData.accomplishments || ''}
              onChange={handleChange}
              placeholder={language === 'en' ? 'Honors, major contributions, key projects...' : 'Titres honorifiques, contributions majeures, réalisations...'}
              className="w-full p-4 rounded-2xl bg-[#fff8f4] border border-[#eae1da] focus:border-[#173124] outline-hidden text-sm leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1.5">
              {t('person_education_tab')}
            </label>
            <textarea
              name="education"
              rows={3}
              value={formData.education || ''}
              onChange={handleChange}
              placeholder={language === 'en' ? 'Degrees, universities, academic career...' : 'Diplômes, écoles, parcours académique...'}
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
          {t('cancel')}
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
              <span>{isEditing ? (language === 'en' ? 'Save Changes' : 'Enregistrer les modifications') : (language === 'en' ? 'Add this member' : 'Ajouter ce membre')}</span>
            </>
          )}
        </button>
      </div>

      {/* Interactive Photo Cropper & Adjuster Modal */}
      <ImageAdjusterModal
        isOpen={isAdjusterOpen}
        imageSrc={adjusterImage}
        cropShape="round"
        onClose={() => setIsAdjusterOpen(false)}
        onApply={handleAdjusterApply}
      />
    </form>
  );
}
