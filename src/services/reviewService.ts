import { get, post } from "@/lib/apiClient";
import type {
  ReviewsResponse,
  CreateReviewPayload,
  MarkHelpfulResponse,
  SortOption,
} from "@/types";

// ─── Sort option mapping ──────────────────────────────────────────────────────

interface SortParams {
  sortOrder: string;
  sortBy: string;
}

/** Maps user-facing sort labels to the API's expected query parameters. */
const SORT_MAP: Record<SortOption, SortParams> = {
  recent:  { sortOrder: "asc",  sortBy: "CreatedAt"    },
  oldest:  { sortOrder: "desc", sortBy: "CreatedAt"    },
  highest: { sortOrder: "asc",  sortBy: "rating"       },
  lowest:  { sortOrder: "desc", sortBy: "rating"       },
  helpful: { sortOrder: "asc",  sortBy: "helpfulCount" },
};

// ─── Service ──────────────────────────────────────────────────────────────────

export const reviewService = {
  getProductReviews: (
    productId: string,
    page: number = 1,
    sortOption: SortOption = "highest",
    userId: string
  ): Promise<ReviewsResponse> => {
    const { sortOrder, sortBy } = SORT_MAP[sortOption];
    return get<ReviewsResponse>(
      `/reviews/product/${productId}?page=${page}&sortOrder=${sortOrder}&sortBY=${sortBy}&userId=${userId}`
    );
  },

  createReview: (payload: CreateReviewPayload): Promise<{ message: string }> =>
    post<{ message: string }>("/reviews", payload),

  markHelpful: (
    reviewId: string,
    userId: string
  ): Promise<MarkHelpfulResponse> =>
    post<MarkHelpfulResponse>("/reviews/review/helpful", { userId, reviewId }),
};
