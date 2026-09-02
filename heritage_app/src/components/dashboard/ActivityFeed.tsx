import React from 'react';
import Link from 'next/link';
import { Clock, PlusCircle, Edit3, Image as ImageIcon, Sparkles, User } from 'lucide-react';
import { ActivityEvent } from '@/types';

export default function ActivityFeed({ activities }: { activities: ActivityEvent[] }) {
  const getIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'addition':
        return <PlusCircle className="w-4 h-4 text-[#173124]" />;
      case 'photo':
        return <ImageIcon className="w-4 h-4 text-[#7a5739]" />;
      case 'edit':
        return <Edit3 className="w-4 h-4 text-[#2980b9]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#c69214]" />;
    }
  };

  const formatTimestamp = (ts: string) => {
    try {
      const d = new Date(ts);
      return d.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return ts;
    }
  };

  return (
    <div className="bg-[#ffffff] p-6 rounded-2xl border border-[#eae1da] vintage-shadow">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#f5ece5]">
        <div className="flex items-center gap-2.5">
          <Clock className="w-5 h-5 text-[#7a5739]" />
          <h3 className="font-serif font-bold text-lg text-[#1f1b17]">
            Activité & Archives récentes
          </h3>
        </div>
        <span className="text-xs bg-[#f5ece5] text-[#795638] px-2.5 py-1 rounded-full font-medium">
          Historique
        </span>
      </div>

      {activities.length === 0 ? (
        <div className="py-6 text-center text-[#727973]">
          <p className="text-sm">Aucune activité récente enregistrée.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.slice(0, 5).map((act) => (
            <div
              key={act.id}
              className="flex items-start gap-3.5 p-3 rounded-xl bg-[#fff8f4] border border-[#f5ece5] hover:bg-[#fbf2eb] transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-white border border-[#eae1da] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                {getIcon(act.type)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#1f1b17] font-medium leading-snug">
                  {act.description}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-[#727973]">
                  <span>{act.user}</span>
                  <span>•</span>
                  <span>{formatTimestamp(act.timestamp)}</span>
                  {act.person_id && (
                    <>
                      <span>•</span>
                      <Link
                        href={`/person/${act.person_id}`}
                        className="text-[#173124] hover:underline font-medium inline-flex items-center gap-0.5"
                      >
                        <User className="w-3 h-3" /> Fiche
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
