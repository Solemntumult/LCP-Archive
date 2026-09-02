import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Camera, Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { FamilyEvent } from '@/types';

export default function RecentGallery({ events }: { events: FamilyEvent[] }) {
  // Extract all event archive photos
  const archivePhotos: { url: string; title: string; eventId: number; date: string }[] = [];
  events.forEach((ev) => {
    const photos = ev.photos && ev.photos.length > 0 ? ev.photos : ev.photo ? [ev.photo] : [];
    photos.forEach((url) => {
      if (url) {
        archivePhotos.push({
          url,
          title: ev.title,
          eventId: ev.id,
          date: ev.event_date,
        });
      }
    });
  });

  return (
    <div className="bg-[#ffffff] p-6 rounded-2xl border border-[#eae1da] vintage-shadow">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#f5ece5]">
        <div className="flex items-center gap-2.5">
          <Camera className="w-5 h-5 text-[#7a5739]" />
          <h3 className="font-serif font-bold text-lg text-[#1f1b17]">
            Galerie des Archives & Récits Historiques
          </h3>
        </div>
        <Link
          href="/events"
          className="text-xs text-[#7a5739] hover:text-[#173124] font-semibold flex items-center gap-1 transition-colors"
        >
          <span>Voir les récits</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {archivePhotos.length === 0 ? (
        <div className="py-12 text-center text-[#727973]">
          <Camera className="w-10 h-10 mx-auto text-[#c2c8c2] mb-2" />
          <p className="font-serif text-[#1f1b17] font-medium">Aucun document archivé</p>
          <p className="text-xs mt-1">Les photographies d&apos;événements historiques et documents s&apos;afficheront ici.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {archivePhotos.slice(0, 8).map((item, idx) => (
            <Link
              key={`archive-photo-${idx}`}
              href={`/events/${item.eventId}`}
              className="group flex flex-col items-center text-center"
            >
              {/* Photo Frame with Vintage styling */}
              <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden bg-[#eae1da] vintage-photo-frame mb-2.5 group-hover:scale-105 transition-all">
                <Image
                  src={item.url}
                  alt={item.title}
                  fill
                  className="object-cover transition-all duration-300 group-hover:contrast-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-2">
                  <span className="text-[10px] text-white font-medium flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> Lire le récit
                  </span>
                </div>
              </div>

              <p className="font-serif font-bold text-xs text-[#1f1b17] group-hover:text-[#173124] line-clamp-1 w-full">
                {item.title}
              </p>
              {item.date && (
                <p className="text-[11px] text-[#727973] line-clamp-1 w-full">
                  {new Date(item.date).getFullYear()}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
