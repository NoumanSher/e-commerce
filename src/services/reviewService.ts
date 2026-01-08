import apiClient from "@/lib/apiClient";
import {
    ReviewsResponse,
    CreateReviewPayload,
    MarkHelpfulResponse,
} from "@/types";

export const reviewService = {
    getProductReviews: async (
        productId: string,
        page: number = 1,
        sort: string = "asc",
        sortBY: string = "rating",
        userId: string
    ): Promise<ReviewsResponse> => {
        let internalSort = sort;
        let internalSortBY = sortBY;

        if (sortBY === "recent") {
            internalSort = "asc";
            internalSortBY = "CreatedAt";
        } else if (sortBY === "oldest") {
            internalSort = "desc";
            internalSortBY = "CreatedAt";
        } else if (sortBY === "highest") {
            internalSortBY = "rating";
            internalSort = "asc";
        } else if (sortBY === "lowest") {
            internalSortBY = "rating";
            internalSort = "desc";
        } else if (sortBY === "helpful") {
            internalSortBY = "helpfulCount";
            internalSort = "asc";
        }

        const response = await apiClient.get<ReviewsResponse>(
            `/reviews/product/${productId}?page=${page}&sortOrder=${internalSort}&sortBY=${internalSortBY}&userId=${userId}`
        );
        return response.data;
    },

    createReview: async (payload: CreateReviewPayload): Promise<any> => {
        const response = await apiClient.post<any>("/reviews", payload);
        return response.data;
    },

    markHelpful: async (
        reviewId: string,
        userId: string
    ): Promise<MarkHelpfulResponse> => {
        const response = await apiClient.post<MarkHelpfulResponse>("/reviews/review/helpful", {
            userId,
            reviewId,
        });
        return response.data;
    },
};
