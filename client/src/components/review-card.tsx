import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/star-rating";
import { User, Building2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { ReviewWithDetails } from "@shared/schema";

interface ReviewCardProps {
  review: ReviewWithDetails;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const displayName = review.isAnonymous
    ? "Anonymous Renter"
    : review.userName || "Anonymous";

  return (
    <Card className="overflow-hidden" data-testid={`review-card-${review.id}`}>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {!review.isAnonymous && review.userProfileImage ? (
                <AvatarImage src={review.userProfileImage} alt={displayName} />
              ) : null}
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{displayName}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Building2 className="h-3 w-3" />
                <span>Floor {review.floorNumber}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <StarRating rating={review.overallRating} size="sm" />
            {review.createdAt && (
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
              </span>
            )}
          </div>
        </div>

        <p className="text-sm leading-relaxed">{review.reviewText}</p>

        {review.photos && review.photos.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {review.photos.map((photo) => (
              <div
                key={photo.id}
                className="w-20 h-20 rounded-lg overflow-hidden bg-muted"
              >
                <img
                  src={photo.imageUrl}
                  alt="Review photo"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {review.noiseRating && (
            <Badge variant="outline" className="text-xs">
              Noise: {review.noiseRating}/5
            </Badge>
          )}
          {review.cleanlinessRating && (
            <Badge variant="outline" className="text-xs">
              Clean: {review.cleanlinessRating}/5
            </Badge>
          )}
          {review.maintenanceRating && (
            <Badge variant="outline" className="text-xs">
              Maintenance: {review.maintenanceRating}/5
            </Badge>
          )}
          {review.safetyRating && (
            <Badge variant="outline" className="text-xs">
              Safety: {review.safetyRating}/5
            </Badge>
          )}
          {review.pestRating && (
            <Badge variant="outline" className="text-xs">
              Pests: {review.pestRating}/5
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
