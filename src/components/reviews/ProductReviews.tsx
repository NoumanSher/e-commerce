"use client";

import { useState, useEffect, useCallback } from "react";
import { reviewService } from "@/services/reviewService";
import { ReviewsResponse, SortOption } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { ProductReviewsView } from "./ProductReviewsView";

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
  const { authToken } = useAuth();
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
    [productId, sortBy, userId]
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
    fetchReviews(1, sortBy);
    setCurrentPage(1);
  };

  return (
    <ProductReviewsView
      productId={productId}
      userId={userId}
      isAuthenticated={isAuthenticated}
      authToken={authToken}
      reviewsData={reviewsData}
      loading={loading}
      error={error}
      sortBy={sortBy}
      onSortChange={handleSortChange}
      onPageChange={handlePageChange}
      onReviewSubmitted={handleReviewSubmitted}
    />
  );
}
