"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarRating } from "./StarRating";
import { ReviewsAPI } from "@/lib/api/reviews";
import { CreateReviewPayload } from "@/types";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
interface ReviewFormProps {
  productId: string;
  userId?: string;
  isAuthenticated?: boolean;
  canReview?: boolean;
  isReviewed?: boolean;
  onReviewSubmitted?: () => void;
}

export function ReviewForm({
  productId,
  userId,
  isAuthenticated = false,
  canReview = false,
  isReviewed = false,
  onReviewSubmitted,
}: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      setError("You must be logged in to submit a review");
      return;
    }

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (description.trim().length < 10) {
      setError("Review description must be at least 10 characters long");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const payload: CreateReviewPayload = {
        userId,
        productId,
        rating: rating.toString(),
        description: description.trim(),
      };

      await ReviewsAPI.createReview(payload);

      // Reset form
      setRating(0);
      setDescription("");

      // Notify parent component
      onReviewSubmitted?.();
    } catch (error) {
      debugger;
      setError(
        error instanceof Error ? error.message : "Failed to submit review"
      );
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClickLogin = () => {
    const callbackUrl = encodeURIComponent(`/product-detail/${productId}`);
    router.push(`/login?callbackUrl=${callbackUrl}`);
  };
  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground mb-4">
            Please log in to write a review
          </p>
          <Button variant="outline" onClick={handleClickLogin}>
            Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  // if (isReviewed) {
  //   return (
  //     <Card>
  //       <CardContent className="p-6 text-center">
  //         <p className="text-muted-foreground">
  //           You have already reviewed this product
  //         </p>
  //       </CardContent>
  //     </Card>
  //   );
  // }
  // if (!canReview) {
  //   return (
  //     <Card>
  //       <CardContent className="p-6 text-center">
  //         <p className="text-muted-foreground">
  //           You must purchase and receive this product before you can write a
  //           review
  //         </p>
  //       </CardContent>
  //     </Card>
  //   );
  // }

  return (
    <div>
      {!isReviewed && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Rating *</Label>
                <div className="flex items-center gap-2">
                  <StarRating
                    rating={rating}
                    interactive
                    onRatingChange={setRating}
                    size="lg"
                  />
                  <span className="text-sm text-muted-foreground ml-2">
                    {rating > 0 ? `${rating}/5` : "Select rating"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Review *</Label>
                <Textarea
                  id="description"
                  placeholder="Share your experience with this product..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 10 characters ({description.length}/10)
                </p>
              </div>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={
                  isSubmitting || rating === 0 || !canReview || description.trim().length < 10
                }
                className="w-full"
              >
                {isSubmitting && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
