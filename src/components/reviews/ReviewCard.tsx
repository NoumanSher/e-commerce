"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, User, ShieldCheck, Divide } from "lucide-react";
import { StarRating } from "./StarRating";
import { Review } from "@/types";
import { ReviewsAPI } from "@/lib/api/reviews";
import { cn } from "@/lib/utils";
import Image from "next/image";
import ImageLightbox from "@/components/ImageLightbox";

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
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);
  const [isMarkingHelpful, setIsMarkingHelpful] = useState(false);
  const [hasMarkedHelpful, setHasMarkedHelpful] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const isAlreadyMarkedHelpful = review.helpfulBy.includes(userId);

  const handleMarkHelpful = async () => {
    if (hasMarkedHelpful || isMarkingHelpful) return;

    setIsMarkingHelpful(true);
    try {
      await ReviewsAPI.markHelpful(review._id, userId, token);
      // const newCount = helpfulCount + 1;
      // setHelpfulCount(newCount);
      setHasMarkedHelpful(true);
      onHelpfulUpdate?.(review._id);
    } catch (error) {
      console.error("Failed to mark review as helpful:", error);
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
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {getUserInitials(review.userId.username)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h4 className="font-medium text-foreground">
                  {review.userId.username}
                </h4>
                {review.isVerifiedPurchase && (
                  <Badge variant="secondary" className="text-xs">
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    Verified Purchase
                  </Badge>
                )}
              </div>
              <time className="text-sm text-muted-foreground">
                {formatDate(review.createdAt)}
              </time>
            </div>

            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} size="sm" />
              <span className="text-sm font-medium">{review.rating}/5</span>
            </div>

            <p className="text-foreground leading-relaxed">
              {review.description}
            </p>

          <>
      <div className="flex flex-wrap gap-2 mt-2">
        {review.images.map((url, index) => (
          <div
            key={index}
            onClick={() => {
              setStartIndex(index);
              setIsOpen(true);
            }}
            className="cursor-pointer"
          >
            <Image
              height={96}
              width={96}
              src={url}
              alt="Review image"
              className="rounded-md hover:opacity-80 transition aspect-square object-cover"
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
    </>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkHelpful}
                disabled={
                  hasMarkedHelpful || isMarkingHelpful || isAlreadyMarkedHelpful
                }
                className={cn(
                  "text-muted-foreground hover:text-foreground",
                  hasMarkedHelpful && "text-primary"
                )}
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                Helpful ({helpfulCount})
              </Button>

              {/* {review.status === 'pending' && (
                <Badge variant="outline" className="text-xs">
                  Pending Approval
                </Badge>
              )} */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
