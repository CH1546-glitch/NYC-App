import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface BuildingSuggestion {
  id: string;
  name: string;
  address: string;
}

interface SearchAutocompleteProps {
  onSelect?: (building: BuildingSuggestion) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function SearchAutocomplete({
  onSelect,
  onSearch,
  placeholder = "Search by building name or address",
  className,
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);
  const isDebouncing = query !== debouncedQuery;

  const { data: suggestions = [], isLoading, isFetching } = useQuery<BuildingSuggestion[]>({
    queryKey: [`/api/buildings/autocomplete?q=${encodeURIComponent(debouncedQuery)}`],
    enabled: debouncedQuery.length >= 2,
    staleTime: 30000,
  });

  // Show dropdown immediately when typing, but show loading during debounce
  const showDropdown = isOpen && query.length >= 2;
  const showLoading = (query.length >= 2 && debouncedQuery.length < 2) || isDebouncing || isLoading || isFetching;

  const handleSelect = useCallback(
    (building: BuildingSuggestion) => {
      setQuery("");
      setIsOpen(false);
      setActiveIndex(-1);
      onSelect?.(building);
    },
    [onSelect]
  );

  const handleSearch = useCallback(
    (searchQuery: string) => {
      setIsOpen(false);
      setActiveIndex(-1);
      onSearch?.(searchQuery);
    },
    [onSearch]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      handleSelect(suggestions[activeIndex]);
    } else if (query.trim()) {
      handleSearch(query.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset active index when suggestions change
  useEffect(() => {
    setActiveIndex(-1);
  }, [suggestions]);

  return (
    <div ref={containerRef} className={`relative ${className || ""}`}>
      <form onSubmit={handleSubmit} role="search">
        <div className="flex gap-0 bg-white p-0">
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder={placeholder}
              className="h-14 text-base border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 outline-none text-foreground rounded-none px-5 font-light"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              data-testid="input-hero-search"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={showDropdown}
              aria-controls="autocomplete-dropdown"
              aria-activedescendant={
                activeIndex >= 0 ? `autocomplete-suggestion-${activeIndex}` : undefined
              }
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="h-14 px-10 text-sm tracking-widest uppercase rounded-none font-medium bg-black hover:bg-black/90 text-white border-black"
            data-testid="button-hero-search"
          >
            Search
          </Button>
        </div>
      </form>

      {showDropdown && (
        <div
          id="autocomplete-dropdown"
          data-testid="autocomplete-dropdown"
          role="listbox"
          aria-label="Building suggestions"
          className="absolute top-full left-0 right-0 bg-white border border-border border-t-0 z-50"
        >
          {showLoading && (
            <div
              data-testid="autocomplete-loading"
              className="flex items-center gap-2 px-5 py-4 text-muted-foreground"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="font-light">Searching...</span>
            </div>
          )}

          {!showLoading && suggestions.length === 0 && (
            <div
              data-testid="autocomplete-empty"
              className="px-5 py-4 text-muted-foreground font-light"
            >
              No buildings found
            </div>
          )}

          {!showLoading &&
            suggestions.map((building, index) => (
              <div
                key={building.id}
                id={`autocomplete-suggestion-${index}`}
                data-testid={`autocomplete-suggestion-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                className={`px-5 py-3 cursor-pointer transition-colors ${
                  index === activeIndex ? "bg-muted" : "hover:bg-muted"
                }`}
                onClick={() => handleSelect(building)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <div className="font-medium text-foreground">{building.name}</div>
                <div className="text-sm text-muted-foreground font-light">
                  {building.address}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
