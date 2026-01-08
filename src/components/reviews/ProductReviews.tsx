"use client";

import { useState, useEffect, use, useCallback } from "react";
import { ReviewCard } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";
import { ReviewsStats } from "./ReviewsStats";
import { ReviewsFilter } from "./ReviewsFilter";
import { ReviewsPagination } from "./ReviewsPagination";
import { reviewService } from "@/services/reviewService";
import { ReviewsResponse, SortOption } from "@/types";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useStore } from "@/Context/storeContext";
interface ProductReviewsProps {
  productId: string;
  userId?: string;
  isAuthenticated?: boolean;
}

export function ProductReviews({
  productId,
  userId,
  isAuthenticated = false,
}: ProductReviewsProps) {
  const { authToken } = useStore();
  const [reviewsData, setReviewsData] = useState<ReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  const fetchReviews = useCallback(
    async (page: number = 1, sort = "asc") => {

      try {
        setLoading(true);
        setError(null);
        const data = await reviewService.getProductReviews(
          productId,
          page,
          sort,
          sortBy,
          userId as string
        );
        setReviewsData(data);
      } catch (err) {
        setError("Failed to load reviews. Please try again later.");
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    },
    [productId, sortBy, userId] // <- dependencies
  );

  useEffect(() => {
    let sort;
    if (sortBy === "recent") {
      sort = "asc";
    } else if (sortBy === "oldest") {
      sort = "dsc";
    }
    fetchReviews(currentPage, sort);
  }, [productId, currentPage, sortBy, fetchReviews]);

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleReviewSubmitted = () => {
    // Refresh reviews after submission
    fetchReviews(1, sortBy);
    setCurrentPage(1);
  };

  // const handleHelpfulUpdate = (reviewId: string) => {
  //   
  //   if (!reviewsData) return;

  //   const updatedReviews = reviewsData.reviews.map((review) =>
  //     review._id === reviewId ? { ...review, helpfulCount: newCount } : review
  //   );

  //   setReviewsData({
  //     ...reviewsData,
  //     reviews: updatedReviews,
  //   });
  // };

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
        onReviewSubmitted={handleReviewSubmitted}
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
            <ReviewsFilter
              currentSort={sortBy}
              onSortChange={handleSortChange}
            />
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviewsData.reviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                userId={userId as string}
                token={authToken}
              // onHelpfulUpdate={handleHelpfulUpdate}
              />
            ))}
          </div>

          {/* Pagination */}
          <ReviewsPagination
            pagination={reviewsData.pagination}
            onPageChange={handlePageChange}
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
