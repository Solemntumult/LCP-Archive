'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, User, Calendar, MapPin, Briefcase, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface SearchResult {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  gender: 'M' | 'F';
  birth_year: number | null;
  death_year: number | null;
  photo: string | null;
  profession: string | null;
  birth_place: string | null;
  is_spouse: boolean;
}

export default function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open
          setQuery('');
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      fetchResults('');
    }
  }, [isOpen]);

  // Fetch search results
  const fetchResults = async (q: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=10`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    fetchResults(val);
  };

  const handleSelect = (id: number) => {
    onClose();
    router.push(`/person/${id}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#1f1b17]/40 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl bg-[#fff8f4] rounded-2xl shadow-2xl border border-[#eae1da] overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#eae1da] bg-[#fbf2eb]">
          <Search className="w-5 h-5 text-[#7a5739] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Rechercher par prénom, nom, lieu ou profession..."
            className="w-full bg-transparent text-[#1f1b17] placeholder-[#727973] text-base focus:outline-hidden font-medium"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                fetchResults('');
              }}
              className="p-1 text-[#727973] hover:text-[#1f1b17]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 text-xs bg-[#eae1da] text-[#424844] px-2 py-1 rounded hover:bg-[#e1d8d2]"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 divide-y divide-[#f5ece5]">
          {loading ? (
            <div className="py-12 text-center text-[#727973]">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-[#7a5739] border-t-transparent mb-2"></div>
              <p className="text-sm">Recherche dans les archives...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-[#727973]">
              <User className="w-10 h-10 mx-auto text-[#c2c8c2] mb-2" />
              <p className="font-serif text-lg text-[#1f1b17]">Aucun membre trouvé</p>
              <p className="text-xs text-[#727973] mt-1">
                Essayez un autre mot-clé ou ajoutez ce membre à l&apos;arbre.
              </p>
            </div>
          ) : (
            results.map((person) => {
              const initials = `${person.first_name[0] || ''}${person.last_name[0] || ''}`;
              const isMale = person.gender === 'M';

              return (
                <div
                  key={person.id}
                  onClick={() => handleSelect(person.id)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f5ece5] cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Avatar */}
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#eae1da] bg-[#eae1da]">
                      {person.photo ? (
                        <Image
                          src={person.photo}
                          alt={person.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div
                          className={`w-full h-full flex items-center justify-center font-serif font-bold text-sm text-white ${
                            isMale ? 'bg-[#2980b9]' : 'bg-[#c0392b]'
                          }`}
                        >
                          {initials}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif font-bold text-[#1f1b17] text-base truncate group-hover:text-[#173124]">
                          {person.name}
                        </h4>
                        {person.is_spouse && (
                          <span className="text-[10px] bg-[#fdcea9] text-[#795638] font-medium px-2 py-0.5 rounded-full shrink-0">
                            Conjoint(e)
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#727973] mt-0.5">
                        {(person.birth_year || person.death_year) && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#7a5739]" />
                            {person.birth_year || '?'}
                            {person.death_year ? ` – ${person.death_year}` : ' – présent'}
                          </span>
                        )}

                        {person.profession && (
                          <span className="flex items-center gap-1 truncate">
                            <Briefcase className="w-3.5 h-3.5 text-[#7a5739]" />
                            {person.profession}
                          </span>
                        )}

                        {person.birth_place && (
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="w-3.5 h-3.5 text-[#7a5739]" />
                            {person.birth_place}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-[#c2c8c2] group-hover:text-[#173124] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-[#fbf2eb] border-t border-[#eae1da] text-xs text-[#727973] flex justify-between items-center">
          <span>{results.length} résultat{results.length > 1 ? 's' : ''}</span>
          <span>Appuyez sur Entrée pour sélectionner</span>
        </div>
      </div>
    </div>
  );
}
