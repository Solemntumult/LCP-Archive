import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Baby,
  GraduationCap,
  Briefcase,
  Heart,
  Clock,
  Sparkles,
} from 'lucide-react';
import { TimelineEvent } from '@/types';

export default function PersonTimeline({ timeline }: { timeline: TimelineEvent[] }) {
  const getIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'birth':
        return <Baby className="w-4 h-4 text-[#173124]" />;
      case 'child':
        return <Heart className="w-4 h-4 text-[#c0392b]" />;
      case 'education':
        return <GraduationCap className="w-4 h-4 text-[#7a5739]" />;
      case 'career':
        return <Briefcase className="w-4 h-4 text-[#2980b9]" />;
      case 'death':
        return <Clock className="w-4 h-4 text-[#727973]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#c69214]" />;
    }
  };

  const getMarkerBg = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'birth':
        return 'bg-[#173124] text-white';
      case 'child':
        return 'bg-[#c0392b] text-white';
      case 'education':
        return 'bg-[#7a5739] text-white';
      case 'career':
        return 'bg-[#2980b9] text-white';
      case 'death':
        return 'bg-[#34302b] text-white';
      default:
        return 'bg-[#c69214] text-white';
    }
  };

  if (timeline.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#eae1da] vintage-shadow">
      <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-[#f5ece5]">
        <Calendar className="w-5 h-5 text-[#7a5739]" />
        <h2 className="font-serif font-bold text-xl text-[#173124]">
          Chronologie des Événements Marquants
        </h2>
      </div>

      <div className="relative pl-6 sm:pl-8 border-l-2 border-[#eae1da] space-y-8 my-2">
        {timeline.map((event) => (
          <div key={event.id} className="relative group">
            {/* Timeline Marker Circle */}
            <div
              className={`absolute -left-[33px] sm:-left-[41px] top-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white flex items-center justify-center shadow-md transition-transform group-hover:scale-110 ${getMarkerBg(
                event.type
              )}`}
            >
              {getIcon(event.type)}
            </div>

            {/* Event Box */}
            <div className="bg-[#fff8f4] p-4.5 rounded-2xl border border-[#eae1da] hover:border-[#7a5739]/30 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold font-mono text-[#7a5739] bg-[#f5ece5] px-2.5 py-0.5 rounded-full">
                  {event.year || event.date}
                </span>

                {event.location && (
                  <span className="text-xs text-[#727973] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#7a5739]" />
                    {event.location}
                  </span>
                )}
              </div>

              <h4 className="font-serif font-bold text-base text-[#1f1b17] mt-1">
                {event.title}
              </h4>

              {event.description && (
                <p className="text-sm text-[#424844] mt-1 leading-relaxed">
                  {event.description}
                </p>
              )}

              {event.relatedPersonId && (
                <Link
                  href={`/person/${event.relatedPersonId}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#173124] hover:underline mt-2"
                >
                  <span>Voir la fiche de l&apos;enfant</span>
                  <span>→</span>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
