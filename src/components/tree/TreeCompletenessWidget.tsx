'use client';

import React from 'react';
import { Sparkles, Camera, BookOpen, Calendar, CheckCircle2 } from 'lucide-react';
import { TreeNodeData } from '@/types';

export default function TreeCompletenessWidget({
  allPersons,
}: {
  allPersons: TreeNodeData[];
}) {
  const total = allPersons.length || 1;
  const withPhoto = allPersons.filter((p) => Boolean(p.photo_url)).length;
  const withBirth = allPersons.filter((p) => Boolean(p.birth_date)).length;
  const withBio = allPersons.filter((p) => Boolean(p.biography)).length;

  // Weighted Score: Photos (40%), Birthdates (30%), Biographies (30%)
  const completeness = Math.round(
    ((withPhoto / total) * 0.4 + (withBirth / total) * 0.3 + (withBio / total) * 0.3) * 100
  );

  return (
    <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#eae1da] vintage-shadow space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#c69214]" />
          <span className="font-serif font-bold text-sm text-[#1f1b17]">
            Complétude de la Mémoire Familiale
          </span>
        </div>
        <span className="font-mono font-bold text-xs bg-[#f5e7c8] text-[#8c6508] px-2.5 py-0.5 rounded-full">
          {completeness}% documenté
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-[#f5ece5] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#173124] to-[#7a5739] rounded-full transition-all duration-500"
          style={{ width: `${completeness}%` }}
        />
      </div>

      {/* Breakdown Pills */}
      <div className="flex items-center justify-between text-[11px] text-[#727973] pt-1">
        <span className="flex items-center gap-1">
          <Camera className="w-3 h-3 text-[#7a5739]" />
          <span>{withPhoto}/{total} portraits</span>
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-[#2980b9]" />
          <span>{withBirth}/{total} dates</span>
        </span>
        <span className="flex items-center gap-1">
          <BookOpen className="w-3 h-3 text-[#173124]" />
          <span>{withBio}/{total} récits</span>
        </span>
      </div>
    </div>
  );
}
