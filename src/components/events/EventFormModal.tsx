'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, Calendar, MapPin, Sparkles, Image as ImageIcon, Upload, Trash2, Check, Loader2 } from 'lucide-react';
import { FamilyEvent, FamilyEventFormData, EventCategory } from '@/types';

export default function EventFormModal({
  isOpen,
  onClose,
  initialEvent,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialEvent?: FamilyEvent | null;
  onSuccess: () => void;
}) {
  const isEditing = !!initialEvent;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FamilyEventFormData>({
    title: '',
    description: '',
    event_date: new Date().toISOString().split('T')[0],
    category: 'reunion',
    location: '',
    photo: '',
    photos: [],
  });

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialEvent) {
      setFormData({
        title: initialEvent.title,
        description: initialEvent.description,
        event_date: initialEvent.event_date.split('T')[0],
        category: initialEvent.category,
        location: initialEvent.location || '',
        photo: initialEvent.photo || '',
        photos: initialEvent.photos || (initialEvent.photo ? [initialEvent.photo] : []),
      });
    } else {
      setFormData({
        title: '',
        description: '',
        event_date: new Date().toISOString().split('T')[0],
        category: 'reunion',
        location: '',
        photo: '',
        photos: [],
      });
    }
    setError(null);
  }, [initialEvent, isOpen]);

  if (!isOpen) return null;

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const data = new FormData();
      for (let i = 0; i < files.length; i++) {
        data.append('files', files[i]);
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) {
        throw new Error("Erreur lors de l'envoi des photos");
      }

      const result = await res.json();
      const uploadedUrls: string[] = result.urls || (result.url ? [result.url] : []);

      setFormData((prev) => ({
        ...prev,
        photos: [...(prev.photos || []), ...uploadedUrls],
      }));
    } catch (err: any) {
      setError(err.message || 'Échec du chargement des images');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: (prev.photos || []).filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const url = isEditing ? `/api/events/${initialEvent.id}` : '/api/events';
      const method = isEditing ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        photo: formData.photos && formData.photos.length > 0 ? formData.photos[0] : formData.photo,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de l'enregistrement");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl border border-[#eae1da] shadow-2xl max-w-2xl w-full p-5 sm:p-8 space-y-6 my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#f5ece5]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#7a5739]">
              {isEditing ? "Modifier l'événement" : 'Nouvel événement familial'}
            </span>
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#173124]">
              {isEditing ? initialEvent.title : 'Récit ou Événement à venir'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#727973] hover:bg-[#f5ece5] transition-all"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-[#ffdad6] text-[#93000a] text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1.5">
              Titre de l&apos;événement *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="ex: Grand Rassemblement des Descendants LISSANON"
              className="w-full px-4 py-3 rounded-2xl border border-[#eae1da] bg-[#fff8f4] text-sm text-[#1f1b17] focus:outline-hidden focus:ring-2 focus:ring-[#173124]"
            />
          </div>

          {/* Date & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1.5">
                Date de l&apos;événement *
              </label>
              <input
                type="date"
                required
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-[#eae1da] bg-[#fff8f4] text-sm text-[#1f1b17] focus:outline-hidden focus:ring-2 focus:ring-[#173124]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1.5">
                Catégorie *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as EventCategory })}
                className="w-full px-4 py-3 rounded-2xl border border-[#eae1da] bg-[#fff8f4] text-sm text-[#1f1b17] focus:outline-hidden focus:ring-2 focus:ring-[#173124] cursor-pointer"
              >
                <option value="reunion">Rassemblement familial</option>
                <option value="commemoration">Commémoration & Hommage</option>
                <option value="celebration">Célébration & Fête</option>
                <option value="birth">Naissance & Anniversaire</option>
                <option value="wedding">Mariage & Alliance</option>
                <option value="cultural">Pèlerinage & Racines</option>
                <option value="other">Autre moment marquant</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1.5">
              Lieu
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="ex: Cotonou, Bénin"
              className="w-full px-4 py-3 rounded-2xl border border-[#eae1da] bg-[#fff8f4] text-sm text-[#1f1b17] focus:outline-hidden focus:ring-2 focus:ring-[#173124]"
            />
          </div>

          {/* Photos Management / Native Device Gallery Picker */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#424844]">
              Photos & Galerie de l&apos;événement
            </label>

            {/* Existing photos preview list */}
            {formData.photos && formData.photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-[#fff8f4] rounded-2xl border border-[#eae1da]">
                {formData.photos.map((photoUrl, idx) => (
                  <div key={`photo-${idx}`} className="relative group rounded-xl overflow-hidden aspect-video bg-[#eae1da] border border-[#eae1da] shadow-xs">
                    <Image
                      src={photoUrl}
                      alt={`Photo ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute top-1 right-1 p-1 rounded-md bg-black/70 text-white hover:bg-[#ba1a1a] transition-all"
                      title="Supprimer cette photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-[#173124] text-white text-[9px] font-bold">
                        Principale
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Hidden Native File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesSelected}
              className="hidden"
              id="event-images-upload"
            />

            {/* Native Gallery Upload Dropzone Button */}
            <label
              htmlFor="event-images-upload"
              className={`flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#eae1da] rounded-2xl bg-[#fff8f4] hover:bg-[#fbf2eb] hover:border-[#7a5739] cursor-pointer transition-all ${
                uploading ? 'opacity-60 pointer-events-none' : ''
              }`}
            >
              {uploading ? (
                <div className="flex items-center gap-2 text-sm text-[#7a5739] font-medium">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Téléversement des photos en cours...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center space-y-1.5">
                  <div className="w-10 h-10 rounded-full bg-[#f5ece5] flex items-center justify-center text-[#7a5739]">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-[#173124]">
                    Sélectionner des images depuis votre galerie ou ordinateur
                  </p>
                  <p className="text-[11px] text-[#727973]">
                    Vous pouvez sélectionner plusieurs photos à la fois (JPEG, PNG, WEBP)
                  </p>
                </div>
              )}
            </label>
          </div>

          {/* Description / Storytelling */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1.5">
              Récit complet ou détails du programme *
            </label>
            <textarea
              required
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Racontez l'histoire, la portée historique, les moments forts ou les modalités pratiques pour la famille..."
              className="w-full px-4 py-3 rounded-2xl border border-[#eae1da] bg-[#fff8f4] text-sm text-[#1f1b17] focus:outline-hidden focus:ring-2 focus:ring-[#173124]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f5ece5]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#eae1da] text-xs font-semibold text-[#424844] hover:bg-[#f5ece5] transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="px-6 py-2.5 rounded-xl bg-[#173124] text-white text-xs font-bold hover:bg-[#2d4739] shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : "Créer l'événement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
