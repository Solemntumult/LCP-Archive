'use client';

import React, { useMemo } from 'react';
import { Home, ChevronRight, Star } from 'lucide-react';

export interface BreadcrumbProps {
  /** Array of person IDs representing the navigation path, from root to current */
  navigationHistory: number[];
  /** The currently active person ID */
  activePersonId: number;
  /** Map of person ID to their display name */
  personNames: Record<number, string>;
  /** Called when user clicks a breadcrumb segment to navigate */
  onNavigate: (personId: number) => void;
  /** Called when user clicks the root/home button */
  onGoHome: () => void;
}

/**
 * Breadcrumb navigation component for the family tree foyer explorer.
 * Displays the lineage/navigation path from the root ancestor to the active person.
 */
export default function Breadcrumb({
  navigationHistory,
  activePersonId,
  personNames,
  onNavigate,
  onGoHome,
}: BreadcrumbProps) {
  // Normalize navigation path: ensure activePersonId is present at the end
  const path = useMemo(() => {
    if (!navigationHistory || navigationHistory.length === 0) {
      return activePersonId ? [activePersonId] : [];
    }

    // If activePersonId is already the last item
    if (navigationHistory[navigationHistory.length - 1] === activePersonId) {
      return navigationHistory;
    }

    // If activePersonId is within the history, slice up to it
    const activeIndex = navigationHistory.indexOf(activePersonId);
    if (activeIndex !== -1) {
      return navigationHistory.slice(0, activeIndex + 1);
    }

    // Otherwise append activePersonId to the history path
    return [...navigationHistory, activePersonId];
  }, [navigationHistory, activePersonId]);

  const hasPath = path.length > 0;
  const isTruncatedOnMobile = path.length > 2;

  return (
    <nav
      aria-label="Fil d'Ariane généalogique"
      className="inline-flex max-w-full items-center bg-white border border-[#eae1da] rounded-2xl px-4 py-2.5 vintage-shadow overflow-x-auto scrollbar-none"
    >
      <ol className="flex items-center flex-nowrap sm:flex-wrap gap-1.5 sm:gap-2 list-none m-0 p-0 text-sm">
        {/* 1. Home / Root Segment */}
        <li className="inline-flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onGoHome}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#173124] hover:text-[#2d4739] hover:underline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#173124] rounded px-1 py-0.5"
            title="Retourner aux racines de l'arbre"
          >
            <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#173124] shrink-0" aria-hidden="true" />
            <span className="font-sans">Racines</span>
          </button>

          {hasPath && (
            <ChevronRight
              className="w-3.5 h-3.5 text-[#727973] shrink-0"
              aria-hidden="true"
            />
          )}
        </li>

        {/* Mobile ellipsis indicator when history has more than 2 items */}
        {isTruncatedOnMobile && (
          <li
            className="inline-flex items-center gap-1.5 sm:hidden shrink-0"
            aria-hidden="true"
          >
            <span className="text-xs text-[#727973] px-1 font-mono tracking-widest select-none">
              ...
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#727973] shrink-0" />
          </li>
        )}

        {/* 2. Path Segments */}
        {path.map((personId, index) => {
          const isLast = index === path.length - 1;
          const isHiddenOnMobile = isTruncatedOnMobile && index < path.length - 2;
          const displayName = personNames[personId] || `Personne #${personId}`;

          if (isLast) {
            // Current active person (bold, gold star, not clickable)
            return (
              <li
                key={`crumb-${personId}-${index}`}
                className="inline-flex items-center gap-1.5 shrink-0"
              >
                <span
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-serif font-bold text-[#7a5739] bg-[#f5ece5] px-2.5 py-1 rounded-xl shrink-0 cursor-default select-none border border-[#eae1da]/60"
                  aria-current="page"
                  title={`Personne actuelle : ${displayName}`}
                >
                  <Star
                    className="w-3.5 h-3.5 fill-[#c69214] text-[#c69214] shrink-0"
                    aria-hidden="true"
                  />
                  <span className="truncate max-w-[140px] sm:max-w-[200px] md:max-w-[260px]">
                    {displayName}
                  </span>
                </span>
              </li>
            );
          }

          // Middle clickable segments
          return (
            <li
              key={`crumb-${personId}-${index}`}
              className={`${
                isHiddenOnMobile ? 'hidden sm:inline-flex' : 'inline-flex'
              } items-center gap-1.5 shrink-0`}
            >
              <button
                type="button"
                onClick={() => onNavigate(personId)}
                className="inline-flex items-center text-xs sm:text-sm font-serif font-medium text-[#173124] hover:text-[#2d4739] hover:underline transition-colors truncate max-w-[120px] sm:max-w-[160px] md:max-w-[200px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#173124] rounded px-1 py-0.5"
                title={`Naviguer vers ${displayName}`}
              >
                <span className="truncate">{displayName}</span>
              </button>
              <ChevronRight
                className="w-3.5 h-3.5 text-[#727973] shrink-0"
                aria-hidden="true"
              />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export { Breadcrumb };
