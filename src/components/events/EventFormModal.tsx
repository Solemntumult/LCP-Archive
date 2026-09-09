'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import {
  X,
  Calendar,
  MapPin,
  Sparkles,
  Image as ImageIcon,
  Upload,
  Trash2,
  Check,
  Loader2,
  Crop,
  AlertCircle,
  Video,
  Film,
  Play
} from 'lucide-react';
import { FamilyEvent, FamilyEventFormData, EventCategory } from '@/types';
import ImageAdjusterModal from '@/components/ui/ImageAdjusterModal';
import { saveLocalStoredEvent } from '@/lib/eventStorage';
import { compressVideoForWeb } from '@/lib/videoCompression';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const MAX_PHOTOS = 20;
const MAX_VIDEOS = 5;

/**
 * Optimizes image on client
 */
async function autoOptimizeImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const maxDim = 1200;
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
          resolve(canvas.toDataURL('image/jpeg', 0.8));
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
  const { t, language } = useLanguage();
  const isEditing = !!initialEvent;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const [formData, setFormData] = useState<FamilyEventFormData>({
    title: '',
    description: '',
    event_date: new Date().toISOString().split('T')[0],
    category: 'reunion',
    location: '',
    photo: '',
    photos: [],
    video: '',
    videos: [],
  });

  const [uploading, setUploading] = useState(false);
  const [videoCompressing, setVideoCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
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
        video: initialEvent.video || '',
        videos: initialEvent.videos || (initialEvent.video ? [initialEvent.video] : []),
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
        video: '',
        videos: [],
      });
    }
    setError(null);
  }, [initialEvent, isOpen]);

  if (!isOpen) return null;

  const currentPhotosCount = formData.photos?.length || 0;
  const remainingPhotoSlots = MAX_PHOTOS - currentPhotosCount;

  const currentVideosCount = formData.videos?.length || 0;
  const remainingVideoSlots = MAX_VIDEOS - currentVideosCount;

  // Handle Photo selection
  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    if (remainingPhotoSlots <= 0) {
      setError(language === 'fr' ? `Limite maximale de ${MAX_PHOTOS} photos atteinte.` : `Maximum limit of ${MAX_PHOTOS} photos reached.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const selectedFiles = Array.from(fileList).slice(0, remainingPhotoSlots);
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
      setError(err.message || (language === 'en' ? 'Error loading photos' : '?chec du chargement des photos'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle Video selection & compression
  const handleVideosSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    if (remainingVideoSlots <= 0) {
      setError(language === 'fr' ? `Limite de ${MAX_VIDEOS} vidéos atteinte.` : `Maximum limit of ${MAX_VIDEOS} videos reached.`);
      if (videoInputRef.current) videoInputRef.current.value = '';
      return;
    }

    setVideoCompressing(true);
    setCompressionProgress(5);
    setError(null);

    try {
      const filesToProcess = Array.from(fileList).slice(0, remainingVideoSlots);
      const compressedVideos: string[] = [];

      for (let i = 0; i < filesToProcess.length; i++) {
        const file = filesToProcess[i];
        
        // Compress video
        const compressedBlob = await compressVideoForWeb(file, {
          maxWidth: 1280,
          maxHeight: 720,
          videoBitrate: 1_200_000,
          onProgress: (p) => {
            const overall = Math.round(((i + p / 100) / filesToProcess.length) * 100);
            setCompressionProgress(overall);
          },
        });

        // Upload compressed video to server
        const uploadData = new FormData();
        const compressedFile = new File(
          [compressedBlob],
          file.name.replace(/\.[^/.]+$/, '') + '.webm',
          { type: compressedBlob.type || 'video/webm' }
        );
        uploadData.append('file', compressedFile);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });

        if (res.ok) {
          const resJson = await res.json();
          if (resJson.url) {
            compressedVideos.push(resJson.url);
          }
        } else {
          // Fallback convert blob to object URL or data URL
          const reader = new FileReader();
          const dataUrl = await new Promise<string>((resRead) => {
            reader.onload = () => resRead(reader.result as string);
            reader.readAsDataURL(compressedBlob);
          });
          compressedVideos.push(dataUrl);
        }
      }

      setFormData((prev) => ({
        ...prev,
        videos: [...(prev.videos || []), ...compressedVideos].slice(0, MAX_VIDEOS),
        video: prev.video || compressedVideos[0] || '',
      }));
    } catch (err: any) {
      setError(err.message || (language === 'en' ? 'Error compressing video' : 'Erreur lors de la compression de la vidéo'));
    } finally {
      setVideoCompressing(false);
      setCompressionProgress(0);
      if (videoInputRef.current) {
        videoInputRef.current.value = '';
      }
    }
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: (prev.photos || []).filter((_, idx) => idx !== index),
    }));
  };

  const removeVideo = (index: number) => {
    setFormData((prev) => {
      const newVideos = (prev.videos || []).filter((_, idx) => idx !== index);
      return {
        ...prev,
        videos: newVideos,
        video: newVideos.length > 0 ? newVideos[0] : null,
      };
    });
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
        video: formData.videos && formData.videos.length > 0 ? formData.videos[0] : formData.video,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorMsg = language === 'fr' ? "Erreur lors de l'enregistrement" : "Error saving event";
        try {
          const json = await res.json();
          if (json.error) errorMsg = json.error;
        } catch {}
        throw new Error(errorMsg);
      }

      const savedData = await res.json();
      if (savedData) {
        saveLocalStoredEvent(savedData);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || (language === 'en' ? 'An error occurred' : 'Une erreur est survenue'));
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 bg-white rounded-3xl shadow-2xl border border-[#eae1da] p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#eae1da]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f5ece5] flex items-center justify-center text-[#7a5739]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#173124]">
                {isEditing ? t('evform_title_edit') : t('evform_title_create')}
              </h3>
              <p className="text-xs text-[#727973]">
                {language === 'fr' ? 'Partagez des récits, photos et courtes vidéos avec toute la famille' : 'Share stories, photos, and short videos with the family'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#727973] hover:bg-[#f5ece5] transition-all"
            aria-label={t('close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-[#ffdad6] text-[#ba1a1a] flex items-center gap-3 border border-[#ffb4ab] text-xs font-semibold animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1.5">
              {t('evform_field_title')}
            </label>
            <input
              type="text"
              required
              placeholder={language === 'fr' ? 'Ex: Grande R?union Familiale 2024...' : 'e.g. Grand Family Reunion 2024...'}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#eae1da] bg-[#fff8f4] text-sm text-[#1f1b17] focus:outline-hidden focus:ring-2 focus:ring-[#173124]"
            />
          </div>

          {/* Date & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1.5">
                {t('evform_field_date')}
              </label>
              <input
                type="date"
                required
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#eae1da] bg-[#fff8f4] text-sm text-[#1f1b17] focus:outline-hidden focus:ring-2 focus:ring-[#173124]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1.5">
                {t('evform_field_category')}
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as EventCategory })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#eae1da] bg-[#fff8f4] text-sm text-[#1f1b17] focus:outline-hidden focus:ring-2 focus:ring-[#173124]"
              >
                <option value="reunion">{t('evform_cat_reunion')}</option>
                <option value="commemoration">{t('evform_cat_commemoration')}</option>
                <option value="celebration">{t('evform_cat_celebration')}</option>
                <option value="birth">{t('evform_cat_birth')}</option>
                <option value="wedding">{t('evform_cat_wedding')}</option>
                <option value="cultural">{t('evform_cat_cultural')}</option>
                <option value="other">{t('evform_cat_other')}</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1.5">
              {t('evform_field_location')}
            </label>
            <input
              type="text"
              placeholder={language === 'fr' ? 'Ex: Cotonou, Ouidah, Paris, Abidjan...' : 'e.g. Cotonou, Ouidah, London, New York...'}
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#eae1da] bg-[#fff8f4] text-sm text-[#1f1b17] focus:outline-hidden focus:ring-2 focus:ring-[#173124]"
            />
          </div>

          {/* Photos Management */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#424844]">
                {t('evform_field_photos')} ({currentPhotosCount}/{MAX_PHOTOS})
              </label>
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
                    
                    <div className="absolute top-1 right-1 flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => openAdjuster(photoUrl, idx)}
                        className="p-1 rounded-md bg-black/75 text-white hover:bg-[#173124] transition-all shadow-xs"
                        title={language === 'fr' ? 'Ajuster le cadrage' : 'Adjust crop'}
                      >
                        <Crop className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        className="p-1 rounded-md bg-black/75 text-white hover:bg-[#ba1a1a] transition-all shadow-xs"
                        title={t('delete')}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-[#173124] text-white text-[9px] font-bold shadow-xs">
                        {language === 'fr' ? 'Couverture' : 'Cover'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              disabled={remainingPhotoSlots <= 0}
              onChange={handleFilesSelected}
              className="hidden"
              id="event-images-upload"
            />

            {remainingPhotoSlots > 0 ? (
              <label
                htmlFor="event-images-upload"
                className={`flex flex-col items-center justify-center p-5 border-2 border-dashed border-[#eae1da] rounded-2xl bg-[#fff8f4] hover:bg-[#fbf2eb] hover:border-[#7a5739] cursor-pointer transition-all ${
                  uploading ? 'opacity-60 pointer-events-none' : ''
                }`}
              >
                {uploading ? (
                  <div className="flex items-center gap-2 text-sm text-[#7a5739] font-medium">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{language === 'fr' ? 'Optimisation des photos...' : 'Optimizing photos...'}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center space-y-1">
                    <div className="w-8 h-8 rounded-full bg-[#f5ece5] flex items-center justify-center text-[#7a5739]">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#173124]">
                        {t('events_upload_photos')}
                      </p>
                      <p className="text-[10px] text-[#727973]">
                        {language === 'fr' ? "S?lection multiple jusqu'? 20 photos" : 'Multi-selection up to 20 photos'}
                      </p>
                    </div>
                  </div>
                )}
              </label>
            ) : null}
          </div>

          {/* Videos Management with Compression */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#424844]">
                {t('evform_field_videos')} ({currentVideosCount}/{MAX_VIDEOS})
              </label>
            </div>

            {/* Existing videos preview list */}
            {formData.videos && formData.videos.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#fff8f4] rounded-2xl border border-[#eae1da]">
                {formData.videos.map((videoUrl, idx) => (
                  <div key={`video-${idx}`} className="relative group rounded-xl overflow-hidden aspect-video bg-black border border-[#eae1da] shadow-xs flex items-center justify-center">
                    <video
                      src={videoUrl}
                      controls
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    
                    <button
                      type="button"
                      onClick={() => removeVideo(idx)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/80 text-white hover:bg-[#ba1a1a] transition-all shadow-md z-10"
                      title={t('delete')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/*"
              multiple
              disabled={remainingVideoSlots <= 0 || videoCompressing}
              onChange={handleVideosSelected}
              className="hidden"
              id="event-videos-upload"
            />

            {remainingVideoSlots > 0 ? (
              <label
                htmlFor="event-videos-upload"
                className={`flex flex-col items-center justify-center p-5 border-2 border-dashed border-[#eae1da] rounded-2xl bg-[#fff8f4] hover:bg-[#fbf2eb] hover:border-[#7a5739] cursor-pointer transition-all ${
                  videoCompressing ? 'opacity-80 pointer-events-none' : ''
                }`}
              >
                {videoCompressing ? (
                  <div className="flex flex-col items-center gap-2 text-xs text-[#7a5739] font-medium w-full max-w-xs text-center">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#7a5739]" />
                      <span>{t('events_compressing_video')} ({compressionProgress}%)</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-[#eae1da] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#173124] h-full transition-all duration-300 rounded-full"
                        style={{ width: `${compressionProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center space-y-1">
                    <div className="w-8 h-8 rounded-full bg-[#f5ece5] flex items-center justify-center text-[#7a5739]">
                      <Film className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#173124]">
                        {t('events_upload_videos')}
                      </p>
                      <p className="text-[10px] text-[#727973]">
                        {t('events_max_video_hint')}
                      </p>
                    </div>
                  </div>
                )}
              </label>
            ) : null}
          </div>

          {/* Description / Storytelling */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#424844] mb-1.5">
              {t('evform_field_desc')}
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={language === 'fr' ? 'Racontez les moments marquants, discours, souvenirs...' : 'Share memories, speeches, moments...'}
              className="w-full px-4 py-2.5 rounded-xl border border-[#eae1da] bg-[#fff8f4] text-sm text-[#1f1b17] focus:outline-hidden focus:ring-2 focus:ring-[#173124] leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f5ece5]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#eae1da] text-xs font-semibold text-[#424844] hover:bg-[#f5ece5] transition-all"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={submitting || uploading || videoCompressing}
              className="px-6 py-2.5 rounded-xl bg-[#173124] text-white text-xs font-bold hover:bg-[#2d4739] shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {submitting ? t('evform_submitting') : isEditing ? t('evform_submit_edit') : t('evform_submit_create')}
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
    </div>,
    document.body
  );
}
