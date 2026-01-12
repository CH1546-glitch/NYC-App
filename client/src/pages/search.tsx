import { useState, useEffect, useRef, useCallback } from "react";
import { useSearch } from "wouter";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { BuildingCard } from "@/components/building-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Building2, Plus, AlertCircle, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "wouter";
import type { BuildingWithRatings } from "@shared/schema";
import { NYC_NEIGHBORHOODS, BUILDING_TYPES } from "@shared/schema";

interface PaginatedResponse {
  buildings: BuildingWithRatings[];
  total: number;
  hasMore: boolean;
}

const ITEMS_PER_PAGE = 12;

export default function SearchPage() {
  const searchParams = useSearch();
  const urlParams = new URLSearchParams(searchParams);
  const initialQuery = urlParams.get("q") || "";
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [neighborhood, setNeighborhood] = useState<string>("all");
  const [buildingType, setBuildingType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("rating");

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<PaginatedResponse>({
    queryKey: ["/api/buildings", debouncedQuery, neighborhood, buildingType, sortBy],
    queryFn: async ({ queryKey, pageParam = 0 }) => {
      const [, q, hood, type, sort] = queryKey as string[];
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (hood && hood !== "all") params.set("neighborhood", hood);
      if (type && type !== "all") params.set("buildingType", type);
      if (sort) params.set("sortBy", sort);
      params.set("limit", String(ITEMS_PER_PAGE));
      params.set("offset", String(pageParam));
      const url = `/api/buildings?${params.toString()}`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
      return res.json();
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined;
      return allPages.length * ITEMS_PER_PAGE;
    },
    initialPageParam: 0,
  });

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: "100px",
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

  const allBuildings = data?.pages.flatMap((page) => page.buildings) || [];
  const totalCount = data?.pages[0]?.total || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Search Buildings</h1>
              <p className="text-muted-foreground">
                {totalCount} building{totalCount !== 1 ? "s" : ""} found
              </p>
            </div>
            <Link href="/add-building">
              <Button className="gap-2" data-testid="button-add-building">
                <Plus className="h-4 w-4" />
                Add Building
              </Button>
            </Link>
          </div>

          <div className="bg-card border border-card-border rounded-xl p-4 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name or address..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search"
                />
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Select value={neighborhood} onValueChange={setNeighborhood}>
                  <SelectTrigger className="w-[180px]" data-testid="select-neighborhood">
                    <SelectValue placeholder="Neighborhood" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Neighborhoods</SelectItem>
                    {NYC_NEIGHBORHOODS.map((n) => (
                      <SelectItem key={n} value={n}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={buildingType} onValueChange={setBuildingType}>
                  <SelectTrigger className="w-[150px]" data-testid="select-building-type">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {BUILDING_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]" data-testid="select-sort">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="reviews">Most Reviews</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-xl" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-10 w-10 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Unable to load buildings</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Something went wrong while fetching buildings. Please try again.
              </p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Retry
              </Button>
            </div>
          ) : allBuildings.length > 0 ? (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allBuildings.map((building) => (
                  <BuildingCard key={building.id} building={building} />
                ))}
              </div>

              {/* Infinite scroll sentinel */}
              <div ref={loadMoreRef} className="py-8 flex justify-center">
                {isFetchingNextPage && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading more buildings...</span>
                  </div>
                )}
                {!hasNextPage && allBuildings.length > ITEMS_PER_PAGE && (
                  <p className="text-muted-foreground text-sm">
                    You've seen all {totalCount} buildings
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Building2 className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No buildings found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchQuery
                  ? `No buildings match "${searchQuery}". Try a different search term.`
                  : "No buildings available yet. Be the first to add one!"}
              </p>
              <Link href="/add-building">
                <Button className="gap-2" data-testid="button-add-first-building">
                  <Plus className="h-4 w-4" />
                  Add a Building
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
