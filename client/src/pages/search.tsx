import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { BuildingCard } from "@/components/building-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Building2, Plus, Filter } from "lucide-react";
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

export default function SearchPage() {
  const searchParams = useSearch();
  const urlParams = new URLSearchParams(searchParams);
  const initialQuery = urlParams.get("q") || "";
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [neighborhood, setNeighborhood] = useState<string>("all");
  const [buildingType, setBuildingType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("rating");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: buildings, isLoading } = useQuery<BuildingWithRatings[]>({
    queryKey: ["/api/buildings", debouncedQuery, neighborhood, buildingType, sortBy],
    queryFn: async ({ queryKey }) => {
      const [, q, hood, type, sort] = queryKey as string[];
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (hood && hood !== "all") params.set("neighborhood", hood);
      if (type && type !== "all") params.set("buildingType", type);
      if (sort) params.set("sortBy", sort);
      const queryString = params.toString();
      const url = queryString ? `/api/buildings?${queryString}` : "/api/buildings";
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
      return res.json();
    },
  });

  const filteredBuildings = buildings || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Search Buildings</h1>
              <p className="text-muted-foreground">
                {filteredBuildings.length} building{filteredBuildings.length !== 1 ? "s" : ""} found
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
          ) : filteredBuildings.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBuildings.map((building) => (
                <BuildingCard key={building.id} building={building} />
              ))}
            </div>
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
