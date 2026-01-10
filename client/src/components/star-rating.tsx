import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showValue = false,
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleClick = (index: number) => {
    if (interactive && onChange) {
      onChange(index + 1);
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {Array.from({ length: maxRating }).map((_, index) => {
          const filled = index < Math.floor(rating);
          const partial = index === Math.floor(rating) && rating % 1 !== 0;
          const fillPercent = partial ? (rating % 1) * 100 : 0;

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleClick(index)}
              disabled={!interactive}
              className={cn(
                "relative",
                interactive && "cursor-pointer hover:scale-110 transition-transform",
                !interactive && "cursor-default"
              )}
              data-testid={`star-${index + 1}`}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  "transition-colors",
                  filled
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-muted text-muted"
                )}
              />
              {partial && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fillPercent}%` }}
                >
                  <Star
                    className={cn(
                      sizeClasses[size],
                      "fill-yellow-400 text-yellow-400"
                    )}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-muted-foreground ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
