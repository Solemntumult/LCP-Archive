'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, Calendar, MapPin, Sparkles, Image as ImageIcon, Upload, Trash2, Check, Loader2, Crop, AlertCircle } from 'lucide-react';
import { FamilyEvent, FamilyEventFormData, EventCategory } from '@/types';
import ImageAdjusterModal from '@/components/ui/ImageAdjusterModal';
import { saveLocalStoredEvent } from '@/lib/eventStorage';

const MAX_PHOTOS = 10;

/**
 * Redimensionne et optimise automatiquement une image côté client
 * pour un chargement instantané et un affichage net sans dépasser la mémoire.
 */
async function autoOptimizeImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const maxDim = 1000;
        let w = img.width;
        let h = img.height;

        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.78));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

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

  // Photo Adjuster state
  const [adjusterTarget, setAdjusterTarget] = useState<{ src: string; index: number } | null>(null);
  const [isAdjusterOpen, setIsAdjusterOpen] = useState(false);

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

  const currentPhotosCount = formData.photos?.length || 0;
  const remainingSlots = MAX_PHOTOS - currentPhotosCount;

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    if (remainingSlots <= 0) {
      setError(`Vous avez déjà atteint la limite maximale de ${MAX_PHOTOS} photos pour cet événement.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const selectedFiles = Array.from(fileList).slice(0, remainingSlots);
      if (fileList.length > remainingSlots) {
        setError(`Limite de ${MAX_PHOTOS} photos : seules les ${remainingSlots} premières ont été ajoutées.`);
      }

      // Optimiser et convertir directement les images
      const optimizedUrls: string[] = [];
      for (const file of selectedFiles) {
        const optimized = await autoOptimizeImage(file);
        if (optimized) {
          optimizedUrls.push(optimized);
        }
      }

      setFormData((prev) => ({
        ...prev,
        photos: [...(prev.photos || []), ...optimizedUrls].slice(0, MAX_PHOTOS),
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

  const openAdjuster = (photoUrl: string, index: number) => {
    setAdjusterTarget({ src: photoUrl, index });
    setIsAdjusterOpen(true);
  };

  const handleAdjusterApply = (adjustedDataUrl: string) => {
    if (adjusterTarget) {
      setFormData((prev) => {
        const photos = [...(prev.photos || [])];
        photos[adjusterTarget.index] = adjustedDataUrl;
        return { ...prev, photos };
      });
    }
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
        let errorMsg = "Erreur lors de l'enregistrement de l'événement";
        try {
          const data = await res.json();
          if (data.error) errorMsg = data.error;
        } catch {
          const text = await res.text();
          if (text.includes('Request Entity Too Large') || res.status === 413) {
            errorMsg = 'Les photos sélectionnées sont trop volumineuses. Veuillez réduire le nombre de photos ou leur résolution.';
          } else if (text) {
            errorMsg = `Erreur serveur (${res.status})`;
          }
        }
        throw new Error(errorMsg);
      }

      let saved: any;
      try {
        saved = await res.json();
      } catch {
        saved = payload;
      }

      // Persistent sync in localStorage to prevent production lambda loss
      saveLocalStoredEvent(saved);

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl sm:rounded-3xl border border-[#eae1da] shadow-2xl max-w-2xl w-full p-5 sm:p-7 space-y-5 my-auto max-h-[92vh] overflow-y-auto cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#f5ece5]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#173124] text-white flex items-center justify-center shadow-xs">
              <Calendar className="w-5 h-5 text-[#98b5a3]" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl text-[#173124]">
                {isEditing ? "Modifier l'événement" : "Créer un événement / récit d'histoire"}
              </h2>
              <p className="text-xs text-[#727973]">
                {isEditing
                  ? "Mettez à jour les détails, photos ou dates de l'archive"
                  : 'Immortalisez un rassemblement, mariage, hommage ou souvenir familial'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#727973] hover:text-[#173124] hover:bg-[#f5ece5] transition-all"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#93000a] text-xs font-medium flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#ba1a1a]" />
            <span>{error}</span>
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
              placeholder="ex: Rassemblement des Descendants LISSANON 2022"
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

          {/* Photos Management / Native Multi-selection (Up to 10 photos) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#424844]">
                Photos & Galerie de l&apos;événement ({currentPhotosCount}/{MAX_PHOTOS})
              </label>
              <span className="text-[11px] font-medium text-[#7a5739]">
                {remainingSlots > 0 ? `Jusqu'à ${remainingSlots} photo${remainingSlots > 1 ? 's' : ''} restante${remainingSlots > 1 ? 's' : ''}` : 'Limite atteinte'}
              </span>
            </div>

            {/* Existing photos preview list */}
            {formData.photos && formData.photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 p-3 bg-[#fff8f4] rounded-2xl border border-[#eae1da]">
                {formData.photos.map((photoUrl, idx) => (
                  <div key={`photo-${idx}`} className="relative group rounded-xl overflow-hidden aspect-video bg-[#eae1da] border border-[#eae1da] shadow-xs">
                    <Image
                      src={photoUrl}
                      alt={`Photo ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                    
                    {/* Action Buttons Overlay */}
                    <div className="absolute top-1 right-1 flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => openAdjuster(photoUrl, idx)}
                        className="p-1 rounded-md bg-black/75 text-white hover:bg-[#173124] transition-all shadow-xs"
                        title="Ajuster / Recadrer la photo"
                      >
                        <Crop className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        className="p-1 rounded-md bg-black/75 text-white hover:bg-[#ba1a1a] transition-all shadow-xs"
                        title="Supprimer cette photo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-[#173124] text-white text-[9px] font-bold shadow-xs">
                        Couverture
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
              disabled={remainingSlots <= 0}
              onChange={handleFilesSelected}
              className="hidden"
              id="event-images-upload"
            />

            {/* Native Gallery Upload Dropzone Button (Disabled when 10 photos reached) */}
            {remainingSlots > 0 ? (
              <label
                htmlFor="event-images-upload"
                className={`flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#eae1da] rounded-2xl bg-[#fff8f4] hover:bg-[#fbf2eb] hover:border-[#7a5739] cursor-pointer transition-all ${
                  uploading ? 'opacity-60 pointer-events-none' : ''
                }`}
              >
                {uploading ? (
                  <div className="flex items-center gap-2 text-sm text-[#7a5739] font-medium">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Optimisation et téléversement des photos en cours...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center space-y-1.5">
                    <div className="w-10 h-10 rounded-full bg-[#f5ece5] flex items-center justify-center text-[#7a5739]">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#173124]">
                        Sélectionner jusqu&apos;à 10 photos depuis votre galerie
                      </p>
                      <p className="text-[11px] text-[#727973] mt-0.5">
                        Sélection multiple disponible • Ajustement automatique du format
                      </p>
                    </div>
                  </div>
                )}
              </label>
            ) : (
              <div className="p-3 text-center rounded-2xl bg-[#f5ece5] border border-[#eae1da] text-xs font-semibold text-[#7a5739]">
                ✓ Limite maximale de 10 photos atteinte. Supprimez une photo pour en ajouter une nouvelle.
              </div>
            )}
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

      {/* Interactive Photo Cropper & Adjuster Modal */}
      <ImageAdjusterModal
        isOpen={isAdjusterOpen}
        imageSrc={adjusterTarget?.src || null}
        cropShape="rect"
        aspectRatio={16 / 9}
        onClose={() => {
          setIsAdjusterOpen(false);
          setAdjusterTarget(null);
        }}
        onApply={handleAdjusterApply}
      />
    </div>
  );
}
