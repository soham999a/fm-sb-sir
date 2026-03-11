import { useState, useEffect, useRef } from 'react';
import { Search, X, Radio, Loader2 } from 'lucide-react';
import { useSearchStations } from '@/hooks/useRadioStations';
import { usePlayer } from '@/contexts/PlayerContext';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: results, isLoading, error } = useSearchStations(query);
  const { play } = usePlayer();

  // Debug logging
  useEffect(() => {
    if (query.length >= 2) {
      console.log('🔍 Search Debug:');
      console.log('Query:', query);
      console.log('Results:', results);
      console.log('Loading:', isLoading);
      console.log('Error:', error);
      console.log('Is Open:', isOpen);
      console.log('Results length:', results?.length || 0);
    }
  }, [query, results, isLoading, error, isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (station: typeof results extends (infer T)[] ? T : never) => {
    console.log('🎵 Playing station:', station.name);
    play(station);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const showDropdown = isOpen && query.length >= 2;

  return (
    <div 
      ref={containerRef} 
      className={cn("relative search-bar-container", className)} 
      style={{ 
        zIndex: 50000,
        position: 'relative',
        isolation: 'isolate'
      }}
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            const newQuery = e.target.value;
            setQuery(newQuery);
            if (newQuery.length >= 2) {
              setIsOpen(true);
              console.log('✅ Opening dropdown, query:', newQuery);
            } else {
              setIsOpen(false);
            }
          }}
          onFocus={() => {
            if (query.length >= 2) {
              setIsOpen(true);
              console.log('✅ Focus: Opening dropdown');
            }
          }}
          placeholder="Search stations, genres, countries..."
          className="w-full h-12 pl-12 pr-10 rounded-full bg-secondary border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
          style={{ position: 'relative', zIndex: 50001 }}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            type="button"
            style={{ zIndex: 50002 }}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown - Always render when conditions are met */}
      {showDropdown && (
        <div
          className="absolute top-full mt-2 left-0 right-0 rounded-xl overflow-hidden max-h-80 overflow-y-auto"
          style={{ 
            zIndex: 50003,
            position: 'absolute',
            backgroundColor: '#1a1a1a',
            border: '2px solid hsl(var(--primary))',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)'
          }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
              <span className="ml-2 text-sm">Searching...</span>
            </div>
          ) : results && results.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-2 text-xs text-muted-foreground border-b border-border">
                Found {results.length} stations
              </div>
              {results.slice(0, 8).map((station) => (
                <button
                  key={station.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelect(station);
                  }}
                  type="button"
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors text-left cursor-pointer border-b border-border/50 last:border-0"
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                    {station.favicon ? (
                      <img
                        src={station.favicon}
                        alt={station.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                        <Radio className="w-5 h-5 text-primary/60" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate text-foreground">{station.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {station.country} {station.language && `• ${station.language}`}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Radio className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No stations found for "{query}"</p>
              <p className="text-xs mt-1">Try a different search term</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
