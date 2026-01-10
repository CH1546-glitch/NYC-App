import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface RatingBarProps {
  label: string;
  rating: number;
  maxRating?: number;
  className?: string;
}

export function RatingBar({
  label,
  rating,
  maxRating = 5,
  className,
}: RatingBarProps) {
  const percentage = (rating / maxRating) * 100;
  
  const getColorClass = (rating: number) => {
    if (rating >= 4) return "bg-green-500";
    if (rating >= 3) return "bg-yellow-500";
    if (rating >= 2) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{rating.toFixed(1)}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", getColorClass(rating))}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
