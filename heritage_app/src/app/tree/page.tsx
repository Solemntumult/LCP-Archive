'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GitFork } from 'lucide-react';
import FoyerExplorer from '@/components/tree/FoyerExplorer';
import { TreeNodeData } from '@/types';

export default function TreePage() {
  const [treeData, setTreeData] = useState<TreeNodeData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/tree-data');
      const data = await res.json();
      const list: TreeNodeData[] = Array.isArray(data) ? data : [];
      setTreeData(list);
    } catch (err) {
      console.error('Failed to load tree data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5 animate-fade-in">
      {/* Heritage Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#eae1da]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#173124] text-white flex items-center justify-center shadow-xs">
              <GitFork className="w-4 h-4 text-[#98b5a3]" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#173124] tracking-tight">
              Arbre Généalogique Familial
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#727973] mt-0.5">
            Explorez la famille foyer par foyer. Cliquez sur Déployer pour découvrir la famille de chaque descendant.
          </p>
        </div>
      </div>

      {/* Main Foyer Explorer */}
      {loading ? (
        <div className="w-full h-[550px] rounded-3xl bg-white border border-[#eae1da] flex flex-col items-center justify-center text-[#727973]">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#173124] border-t-transparent mb-3" />
          <p className="font-serif text-base text-[#1f1b17]">Construction de l&apos;arbre généalogique...</p>
        </div>
      ) : treeData.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#eae1da] space-y-3">
          <GitFork className="w-14 h-14 mx-auto text-[#c2c8c2]" />
          <h2 className="font-serif text-2xl font-bold text-[#1f1b17]">Commencez votre arbre</h2>
          <p className="text-sm text-[#727973] max-w-md mx-auto">
            Aucun membre n&apos;est enregistré dans la base de données. Ajoutez vos premiers ancêtres pour commencer.
          </p>
        </div>
      ) : (
        <FoyerExplorer allPersons={treeData} onDataRefresh={loadData} />
      )}
    </div>
  );
}
