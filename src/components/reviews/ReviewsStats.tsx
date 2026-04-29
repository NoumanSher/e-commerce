import { Card, CardContent } from '@/components/ui/card';
import { StarRating } from './StarRating';
import { ReviewsStats as ReviewsStatsType } from '@/types';

interface ReviewsStatsProps {
  stats: ReviewsStatsType;
}

export function ReviewsStats({ stats }: ReviewsStatsProps) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        {/* Mobile: Stack vertically, Desktop: Side by side */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
          
          {/* Left Section - Main Info */}
          <div className="space-y-2 sm:space-y-2 flex-1">
            <h3 className="text-lg sm:text-2xl font-bold">Customer Reviews</h3>
            
            {/* Rating and Stars */}
            <div className="flex items-center gap-2 sm:gap-3">
              <StarRating rating={stats.averageRating} size="md" />
              <span className="text-sm sm:text-lg font-medium">
                {stats.averageRating.toFixed(1)} out of 5
              </span>
            </div>
            
            {/* Review Count */}
            <p className="text-xs sm:text-sm text-muted-foreground">
              Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
            </p>
          </div>
          
          {/* Right Section - Average Rating Display */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center sm:text-right">
            {/* Mobile: Show inline, Desktop: Stack */}
            <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
              <div className="text-2xl sm:text-3xl font-bold text-primary">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                Average Rating
              </div>
            </div>
            
            {/* Mobile only: Show total reviews count prominently */}
            <div className="sm:hidden text-right">
              <div className="text-lg font-semibold text-foreground">
                {stats.totalReviews}
              </div>
              <div className="text-xs text-muted-foreground">
                Review{stats.totalReviews !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
