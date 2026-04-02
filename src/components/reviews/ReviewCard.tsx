"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ShieldCheck } from "lucide-react";
import { StarRating } from "./StarRating";
import { Review } from "@/types";
import { reviewService } from "@/services/reviewService";
import { cn } from "@/lib/utils";
import Image from "next/image";
import ImageLightbox from "@/components/ImageLightbox";
import { toast } from "react-toastify";
import { useStore } from "@/context/storeContext";
interface ReviewCardProps {
  review: Review;
  userId: string;
  token: string;
  onHelpfulUpdate?: (reviewId: string) => void;
}

export function ReviewCard({
  review,
  onHelpfulUpdate,
  userId,
  token,
}: ReviewCardProps) {
  const { setIsAuthModalOpen } = useStore();
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);
  const [isMarkingHelpful, setIsMarkingHelpful] = useState(false);
  const [isHelpful, setIsHelpful] = useState(review.helpfulBy.includes(userId));
  const [isOpen, setIsOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const handleMarkHelpful = async () => {
    if (!token) {
      toast.info("Please login to mark helpful");
      setIsAuthModalOpen(true);
      return;
    }
    if (isMarkingHelpful) return;

    setIsMarkingHelpful(true);
    try {
      const response = await reviewService.markHelpful(review._id, userId);
      setHelpfulCount(response.helpfulCount);
      setIsHelpful(response.helpfulBy.includes(userId));
      onHelpfulUpdate?.(review._id);
    } catch (error) {
      console.error("Failed to update helpful status", error);
      toast.error("Failed to update helpful status");
      setIsAuthModalOpen(true);
      return;
    } finally {
      setIsMarkingHelpful(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getUserInitials = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4 sm:p-6">
        {/* Mobile-first layout */}
        <div className="space-y-3">
          {/* Header - Avatar and User Info */}
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs sm:text-sm">
                {getUserInitials(review.userId.username)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0 space-y-2">
              {/* User info and date - stack on mobile */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-medium text-foreground text-sm sm:text-base truncate">
                    {review.userId.username}
                  </h4>
                  {!review.isVerifiedPurchase && (
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                      <span className="hidden xs:inline">Verified Purchase</span>
                      <span className="xs:hidden">Verified</span>
                    </Badge>
                  )}
                </div>
                <time className="text-xs sm:text-sm text-muted-foreground">
                  {formatDate(review.createdAt)}
                </time>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <StarRating rating={review.rating} size="sm" />
                <span className="text-xs sm:text-sm font-medium">
                  {review.rating}/5
                </span>
              </div>
            </div>
          </div>

          {/* Review Description */}
          <div className="ml-0 sm:ml-13">
            <p className="text-foreground leading-relaxed text-sm sm:text-base">
              {review.description}
            </p>
          </div>

          {/* Images - Responsive grid */}
          {review.images && review.images.length > 0 && (
            <div className="ml-0 sm:ml-13">
              <div className="grid grid-cols-3 md:grid-cols-6 xl:grid-cols-10 gap-2">
                {review.images.map((url, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setStartIndex(index);
                      setIsOpen(true);
                    }}
                    className="cursor-pointer group"
                  >
                    <Image
                      height={80}
                      width={80}
                      src={url}
                      alt={`Review image ${index + 1}`}
                      className="rounded-md hover:opacity-80  aspect-square object-cover w-full h-full group-hover:scale-105 transform transition-transform duration-200"
                    />
                  </div>
                ))}
              </div>

              {isOpen && (
                <ImageLightbox
                  images={review.images}
                  initialIndex={startIndex}
                  onClose={() => setIsOpen(false)}
                />
              )}
            </div>
          )}

          {/* Footer - Helpful button */}
          <div className="flex items-center justify-between pt-2 ml-0 sm:ml-13">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkHelpful}
              disabled={isMarkingHelpful}
              className={cn(
                "text-muted-foreground hover:text-foreground text-xs sm:text-sm h-8 px-2 sm:px-3",
                isHelpful && "text-primary"
              )}
            >
              <ThumbsUp className={cn("w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2", isHelpful && "fill-current")} />
              <span className="hidden xs:inline">Helpful</span>
              <span className="ml-1">({helpfulCount})</span>
            </Button>

            {/* Uncomment if needed */}
            {/* {review.status === 'pending' && (
              <Badge variant="outline" className="text-xs">
                Pending Approval
              </Badge>
            )} */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}