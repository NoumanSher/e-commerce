import {
  ReviewsResponse,
  CreateReviewPayload,
  MarkHelpfulResponse,
} from "@/types";
import { BASE_URL_LIVE } from "@/appConst/appConst";

export class ReviewsAPI {
  static async getProductReviews(
    productId: string,
    page: number = 1,
    sort: string = "asc",
    sortBY: string = "rating",
    userId: string
  ): Promise<ReviewsResponse> {
if (sortBY === "recent") {
  sort = "asc";
  sortBY = "CreatedAt";
} else if (sortBY === "oldest") {
  sort = "desc";
  sortBY = "CreatedAt";
} else if (sortBY === "highest") {
  sortBY = "rating";
  sort = "asc";
} else if (sortBY === "lowest") {
  sortBY = "rating";
  sort = "desc";
} else if (sortBY === "helpful") {
  sortBY = "helpfulCount";
  sort = "asc";
}
    
    try {
      const response = await fetch(
        `${BASE_URL_LIVE}/reviews/product/${productId}?page=${page}&sortOrder=${sort}&sortBY=${sortBY}&userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);

      if (!response.ok) {
        
        throw new Error(`Failed to fetch reviews: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  }

  static async createReview(payload: CreateReviewPayload): Promise<any> {
    
    const response = await fetch(`${BASE_URL_LIVE}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json(); // Always parse JSON first

    if (!response.ok) {
      
      // Use the error message from server if available
      throw new Error(
        data.message || `Failed to create review: ${response.statusText}`
      );
    }

    return data;
  }

  static async markHelpful(
    reviewId: string,
    userId: string,
    token: string
  ): Promise<MarkHelpfulResponse> {
    

    try {
      const response = await fetch(`${BASE_URL_LIVE}/reviews/review/helpful`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userId,
          reviewId: reviewId,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to mark review as helpful: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error marking review as helpful:", error);
      throw error;
    }
  }
}
