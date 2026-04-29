import React from "react";
import { ReviewCard } from "@/components/Reviews/ReviewCard";
import { ReviewForm } from "@/components/Reviews/ReviewForm";
import { ReviewsStats } from "@/components/Reviews/ReviewsStats";
import { ReviewsFilter } from "@/components/Reviews/ReviewsFilter";
import { ReviewsPagination } from "@/components/Reviews/ReviewsPagination";
import { ReviewsResponse, SortOption } from "@/types";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProductReviewsViewProps {
  productId: string;
  userId?: string;
  isAuthenticated: boolean;
  authToken: string;
  reviewsData: ReviewsResponse | null;
  loading: boolean;
  error: string | null;
  sortBy: SortOption;
  onSortChange: (newSort: SortOption) => void;
  onPageChange: (page: number) => void;
  onReviewSubmitted: () => void;
}

export function ProductReviewsView({
  productId,
  userId,
  isAuthenticated,
  authToken,
  reviewsData,
  loading,
  error,
  sortBy,
  onSortChange,
  onPageChange,
  onReviewSubmitted,
}: ProductReviewsViewProps) {
  if (loading && !reviewsData) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading reviews...</span>
      </div>
    );
  }

  if (error && !reviewsData) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!reviewsData) return null;

  return (
    <div className="space-y-8">
      {/* Reviews Stats */}
      <ReviewsStats stats={reviewsData.stats} />

      {/* Review Form */}
      <ReviewForm
        productId={productId}
        userId={userId}
        isAuthenticated={isAuthenticated}
        canReview={reviewsData.canReview}
        isReviewed={reviewsData.isReviewed}
        onReviewSubmitted={onReviewSubmitted}
      />

      {/* Reviews Section */}
      {reviewsData.reviews.length > 0 ? (
        <div className="space-y-6">
          {/* Filter */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Reviews (
              {reviewsData.stats.totalReviews === 0
                ? reviewsData.pagination.totalReviews
                : reviewsData.stats.totalReviews}
              )
            </h3>
            <ReviewsFilter currentSort={sortBy} onSortChange={onSortChange} />
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviewsData.reviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                userId={userId as string}
                token={authToken}
              />
            ))}
          </div>

          {/* Pagination */}
          <ReviewsPagination
            pagination={reviewsData.pagination}
            onPageChange={onPageChange}
          />
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No reviews yet. Be the first to review this product!
          </p>
        </div>
      )}

      {loading && reviewsData && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading...</span>
        </div>
      )}
    </div>
  );
}
