import { IconStar, IconStarFilled } from "@tabler/icons-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 16,
  className = "",
}: StarRatingProps) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[...Array(maxRating)].map((_, index) =>
        index < rating ? (
          <IconStarFilled key={index} size={size} className="text-yellow-400" />
        ) : (
          <IconStar key={index} size={size} className="text-gray-300" />
        )
      )}
    </div>
  );
}
