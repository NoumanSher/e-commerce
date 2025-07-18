import { Card, CardContent } from '@/components/ui/card';
import { StarRating } from './StarRating';
import { ReviewsStats as ReviewsStatsType } from '@/types';

interface ReviewsStatsProps {
  stats: ReviewsStatsType;
}

export function ReviewsStats({ stats }: ReviewsStatsProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Customer Reviews</h3>
            <div className="flex items-center gap-3">
              <StarRating rating={stats.averageRating} size="md" />
              <span className="text-lg font-medium">
                {stats.averageRating.toFixed(1)} out of 5
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">
              {stats.averageRating.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">
              Average Rating
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}