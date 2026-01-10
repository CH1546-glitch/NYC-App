import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { StarRating } from "@/components/star-rating";
import { RatingBar } from "@/components/rating-bar";
import { ReviewCard } from "@/components/review-card";
import { FloorInsightsChart } from "@/components/floor-insights-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Building2, User, PenLine, ArrowLeft, MessageSquare } from "lucide-react";
import { useState } from "react";
import type { BuildingWithRatings, ReviewWithDetails, Review } from "@shared/schema";

export default function BuildingDetail() {
  const { id } = useParams<{ id: string }>();
  const [sortBy, setSortBy] = useState("newest");

  const { data: building, isLoading: buildingLoading } = useQuery<BuildingWithRatings>({
    queryKey: ["/api/buildings", id],
    queryFn: async () => {
      const res = await fetch(`/api/buildings/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
      return res.json();
    },
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery<ReviewWithDetails[]>({
    queryKey: ["/api/buildings", id, "reviews", sortBy],
    queryFn: async () => {
      const url = sortBy ? `/api/buildings/${id}/reviews?sortBy=${sortBy}` : `/api/buildings/${id}/reviews`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
      return res.json();
    },
  });

  if (buildingLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <Skeleton className="h-8 w-48 mb-8" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-48 rounded-xl" />
                <Skeleton className="h-64 rounded-xl" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-64 rounded-xl" />
                <Skeleton className="h-48 rounded-xl" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!building) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8 text-center py-20">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Building2 className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Building Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The building you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/search">
              <Button className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Search
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const reviewsList = reviews || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <Link href="/search" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to search
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {building.buildingType && (
                          <Badge variant="secondary">{building.buildingType}</Badge>
                        )}
                        {building.neighborhood && (
                          <Badge variant="outline">{building.neighborhood}</Badge>
                        )}
                      </div>
                      <h1 className="text-2xl md:text-3xl font-bold mb-2" data-testid="text-building-name">
                        {building.name}
                      </h1>
                      <div className="flex items-center gap-2 text-muted-foreground mb-4">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span>{building.address}, {building.city} {building.zipCode}</span>
                      </div>
                      {building.landlordName && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4 shrink-0" />
                          <span>Managed by: {building.landlordName}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <StarRating rating={building.overallRating || 0} size="lg" />
                          <span className="text-2xl font-bold">
                            {(building.overallRating || 0).toFixed(1)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {building.reviewCount || 0} review{(building.reviewCount || 0) !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <Link href={`/building/${building.id}/review`}>
                        <Button className="gap-2" data-testid="button-write-review">
                          <PenLine className="h-4 w-4" />
                          Write a Review
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Reviews
                </h2>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]" data-testid="select-review-sort">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="highest">Highest Rated</SelectItem>
                    <SelectItem value="lowest">Lowest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {reviewsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-40 rounded-xl" />
                  ))}
                </div>
              ) : reviewsList.length > 0 ? (
                <div className="space-y-4">
                  {reviewsList.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Be the first to share your experience!
                    </p>
                    <Link href={`/building/${building.id}/review`}>
                      <Button className="gap-2" data-testid="button-be-first-review">
                        <PenLine className="h-4 w-4" />
                        Write the First Review
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Category Ratings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RatingBar label="Noise" rating={building.noiseRating || 0} />
                  <RatingBar label="Cleanliness" rating={building.cleanlinessRating || 0} />
                  <RatingBar label="Maintenance" rating={building.maintenanceRating || 0} />
                  <RatingBar label="Safety" rating={building.safetyRating || 0} />
                  <RatingBar label="Pests" rating={building.pestRating || 0} />
                </CardContent>
              </Card>

              <FloorInsightsChart reviews={reviewsList as Review[]} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
