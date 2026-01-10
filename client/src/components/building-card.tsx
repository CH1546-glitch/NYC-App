import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/star-rating";
import { MapPin, MessageSquare } from "lucide-react";
import type { BuildingWithRatings } from "@shared/schema";

interface BuildingCardProps {
  building: BuildingWithRatings;
}

export function BuildingCard({ building }: BuildingCardProps) {
  return (
    <Link href={`/building/${building.id}`}>
      <Card className="group hover-elevate cursor-pointer overflow-hidden h-full" data-testid={`building-card-${building.id}`}>
        <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl font-bold text-primary/20">
              {building.name.charAt(0)}
            </div>
          </div>
          {building.neighborhood && (
            <Badge variant="secondary" className="absolute top-3 left-3 text-xs">
              {building.neighborhood.split(' - ')[1] || building.neighborhood}
            </Badge>
          )}
        </div>
        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {building.name}
            </h3>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="line-clamp-1">{building.address}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StarRating rating={building.overallRating || 0} size="sm" />
              <span className="text-sm font-medium">
                {(building.overallRating || 0).toFixed(1)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{building.reviewCount || 0}</span>
            </div>
          </div>

          {building.buildingType && (
            <Badge variant="outline" className="text-xs">
              {building.buildingType}
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
