import { ReviewsResponse, CreateReviewPayload } from '@/types';
import { BASE_URL } from '@/constants';

export class ReviewsAPI {
  static async getProductReviews(
    productId: string,
    page: number = 1,
    sort: string = 'recent'
  ): Promise<ReviewsResponse> {
    try {
      const response = await fetch(
        `${BASE_URL}/reviews/product/${productId}?page=${page}&sort=${sort}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }

static async createReview(payload: CreateReviewPayload): Promise<any> {
  const response = await fetch(`${BASE_URL}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json(); // Always parse JSON first

  if (!response.ok) {
    debugger
    // Use the error message from server if available
    throw new Error(data.message || `Failed to create review: ${response.statusText}`);
  }

  return data;
}

  static async markHelpful(reviewId: string): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to mark review as helpful: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error marking review as helpful:', error);
      throw error;
    }
  }
}