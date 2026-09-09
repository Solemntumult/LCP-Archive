'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Search,
  Plus,
  GitFork,
  Sparkles,
  TreeDeciduous,
} from 'lucide-react';
import { TreeNodeData, FoyerData } from '@/types';
import Breadcrumb from './Breadcrumb';
import FoyerTreeGraph from './FoyerTreeGraph';
import ContextualAddMemberModal from './ContextualAddMemberModal';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface FoyerExplorerProps {
  allPersons: TreeNodeData[];
  onDataRefresh?: () => void;
  initialFoyerId?: number;
  highlightPersonId?: number;
}

export default function FoyerExplorer({
  allPersons,
  onDataRefresh,
  initialFoyerId,
  highlightPersonId,
}: FoyerExplorerProps) {
  const { t, language } = useLanguage();

  const patriarchId = useMemo(() => {
    const patriarch = allPersons.find(
      (p) => !p.father_id && !p.mother_id && p.is_blood
    );
    return patriarch?.id ?? allPersons[0]?.id ?? 0;
  }, [allPersons]);

  const [activePersonId, setActivePersonId] = useState<number>(
    initialFoyerId && allPersons.some((p) => p.id === initialFoyerId)
      ? initialFoyerId
      : patriarchId
  );
  const [navigationHistory, setNavigationHistory] = useState<number[]>([]);
  const [foyerData, setFoyerData] = useState<FoyerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Add member modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Animation key
  const [animKey, setAnimKey] = useState(0);

  // Ref for search click-outside
  const searchRef = useRef<HTMLDivElement>(null);

  const fetchFoyer = useCallback(async (personId: number) => {
    try {
      const res = await fetch(`/api/foyer?personId=${personId}`);
      if (!res.ok) throw new Error('Failed to fetch foyer');
      const data: FoyerData = await res.json();
      return data;
    } catch (error) {
      console.error('Error fetching foyer:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchFoyer(activePersonId);
      setFoyerData(data);
      setLoading(false);
    };
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const deployToChild = useCallback(
    async (childId: number) => {
      setTransitioning(true);
      await new Promise((resolve) => setTimeout(resolve, 200));

      setNavigationHistory((prev) => {
        const idx = prev.indexOf(childId);
        if (idx !== -1) return prev.slice(0, idx);
        return [...prev, activePersonId];
      });

      setActivePersonId(childId);
      const data = await fetchFoyer(childId);
      setFoyerData(data);
      setAnimKey((k) => k + 1);
      setTransitioning(false);
    },
    [activePersonId, fetchFoyer]
  );

  const goBack = useCallback(async () => {
    if (navigationHistory.length === 0) return;

    setTransitioning(true);
    await new Promise((resolve) => setTimeout(resolve, 200));

    const prevId = navigationHistory[navigationHistory.length - 1];
    setNavigationHistory((prev) => prev.slice(0, -1));
    setActivePersonId(prevId);

    const data = await fetchFoyer(prevId);
    setFoyerData(data);
    setAnimKey((k) => k + 1);
    setTransitioning(false);
  }, [navigationHistory, fetchFoyer]);

  const navigateToPerson = useCallback(
    async (personId: number) => {
      setTransitioning(true);
      await new Promise((resolve) => setTimeout(resolve, 200));

      setNavigationHistory((prev) => {
        const idx = prev.indexOf(personId);
        if (idx !== -1) return prev.slice(0, idx);
        return prev;
      });

      setActivePersonId(personId);
      const data = await fetchFoyer(personId);
      setFoyerData(data);
      setAnimKey((k) => k + 1);
      setTransitioning(false);
    },
    [fetchFoyer]
  );

  const goHome = useCallback(async () => {
    if (activePersonId === patriarchId) return;
    setTransitioning(true);
    await new Promise((resolve) => setTimeout(resolve, 200));

    setNavigationHistory([]);
    setActivePersonId(patriarchId);

    const data = await fetchFoyer(patriarchId);
    setFoyerData(data);
    setAnimKey((k) => k + 1);
    setTransitioning(false);
  }, [activePersonId, patriarchId, fetchFoyer]);

  const personNames = useMemo(() => {
    const map: Record<number, string> = {};
    for (const p of allPersons) {
      map[p.id] = p.name || `${p.first_name} ${p.last_name}`;
    }
    return map;
  }, [allPersons]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return allPersons
      .filter((p) => {
        const name = `${p.first_name} ${p.last_name} ${p.maiden_name || ''}`.toLowerCase();
        return name.includes(q) || (p.profession && p.profession.toLowerCase().includes(q));
      })
      .slice(0, 8);
  }, [searchQuery, allPersons]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-[500px] rounded-3xl bg-white border border-[#eae1da] flex flex-col items-center justify-center text-[#727973] vintage-shadow">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#173124] border-t-transparent mb-3" />
        <p className="font-serif text-base text-[#1f1b17]">
          {t('loading')}
        </p>
      </div>
    );
  }

  if (!foyerData) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-[#eae1da] space-y-3 vintage-shadow">
        <GitFork className="w-14 h-14 mx-auto text-[#c2c8c2]" />
        <h2 className="font-serif text-2xl font-bold text-[#1f1b17]">
          {t('no_results')}
        </h2>
        <p className="text-sm text-[#727973] max-w-md mx-auto">
          {language === 'fr' ? 'Impossible de charger le graphe. V?rifiez que des membres sont enregistr?s.' : 'Unable to load graph. Ensure members are recorded in database.'}
        </p>
      </div>
    );
  }

  const { person } = foyerData;
  const canGoBack = navigationHistory.length > 0;
  const previousPersonId =
    navigationHistory.length > 0
      ? navigationHistory[navigationHistory.length - 1]
      : null;
  const previousPersonName = previousPersonId
    ? personNames[previousPersonId]
    : undefined;

  return (
    <div className="space-y-4">
      {/* ?? Top Navigation Bar: Breadcrumb + Search + Add ?? */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
          <Breadcrumb
            navigationHistory={navigationHistory}
            activePersonId={activePersonId}
            personNames={personNames}
            onNavigate={navigateToPerson}
            onGoHome={goHome}
          />
        </div>

        {/* Right side: Search & Add */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Member Search */}
          <div className="relative" ref={searchRef}>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#eae1da] rounded-2xl text-xs w-44 sm:w-52 vintage-shadow">
              <Search className="w-3.5 h-3.5 text-[#7a5739] shrink-0" />
              <input
                type="text"
                placeholder={t('tree_search_jump')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="bg-transparent w-full text-[#1f1b17] placeholder-[#727973] focus:outline-hidden text-xs"
              />
            </div>

            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full right-0 mt-1.5 bg-white rounded-2xl border border-[#eae1da] shadow-xl p-1.5 z-50 max-h-56 w-64 overflow-y-auto space-y-1 animate-fade-in">
                {searchResults.map((p) => (
                  <button
                    key={`search-${p.id}`}
                    onClick={() => {
                      deployToChild(p.id);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-[#fff8f4] transition-all flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-serif font-bold text-[#1f1b17] truncate">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-[#727973]">
                        {t('generation')} {p.generation + 1}
                      </p>
                    </div>
                    <span className="text-[10px] text-[#7a5739] font-medium shrink-0 ml-2">
                      {t('explore_foyer')} ?
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add member button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-2xl bg-[#173124] hover:bg-[#2d4739] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 shrink-0"
          >
            <Plus className="w-3.5 h-3.5 text-[#98b5a3]" />
            <span className="hidden sm:inline">{t('nav_add_member')}</span>
          </button>
        </div>
      </div>

      {/* ?? Foyer Header Banner ?? */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#173124] via-[#234332] to-[#2d4739] text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-[#fdcea9] border border-white/20 shadow-md shrink-0">
            <TreeDeciduous className="w-5 h-5" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[10px] font-bold text-[#b0cdbb] mb-0.5">
              <Sparkles className="w-3 h-3 text-[#fdcea9]" />
              <span>{language === 'fr' ? `Arbre G?n?alogique ? Foyer de G?n?ration ${person.generation + 1}` : `Family Tree ? Generation ${person.generation + 1} Household`}</span>
            </div>
            <h2 className="font-serif font-black text-lg sm:text-2xl tracking-tight text-white">
              {language === 'fr' ? `Arbre de la Famille ${person.last_name} (${person.first_name})` : `${person.last_name} Family Tree (${person.first_name})`}
            </h2>
          </div>
        </div>

        <div className="text-xs text-[#eae1da]/80 font-medium">
          {language === 'fr' ? (
            <>Cliquez sur <strong className="text-[#fdcea9]">D?ployer</strong> sous un enfant pour faire appara?tre son propre arbre.</>
          ) : (
            <>Click <strong className="text-[#fdcea9]">Expand</strong> below a child to open their family tree.</>
          )}
        </div>
      </div>

      {/* ?? Real Genealogical Tree Graph Canvas ?? */}
      <div
        key={`foyer-graph-${animKey}`}
        className={transitioning ? 'foyer-exit' : 'foyer-enter'}
      >
        <FoyerTreeGraph
          foyerData={foyerData}
          allPersons={allPersons}
          onDeployChild={deployToChild}
          onAddMemberClick={() => setIsAddModalOpen(true)}
          canGoBack={canGoBack}
          onGoBack={goBack}
          previousPersonName={previousPersonName}
          highlightPersonId={highlightPersonId}
        />
      </div>

      {/* ?? Contextual Add Member Modal ?? */}
      <ContextualAddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        targetPerson={
          allPersons.find((p) => p.id === activePersonId) || allPersons[0] || null
        }
        allPersons={allPersons}
        onSuccess={() => {
          if (onDataRefresh) onDataRefresh();
          fetchFoyer(activePersonId).then((data) => {
            if (data) setFoyerData(data);
          });
        }}
      />
    </div>
  );
}
