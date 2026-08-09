"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ThumbsUp, ShieldCheck, ChevronLeft, ChevronRight, Star, Loader2, ImagePlus, X } from "lucide-react";
import GlassCard from "./GlassCard";
import { reviewService } from "@/services/reviewService";
import { productsService } from "@/services/productsService";
import { ReviewsResponse, SortOption, Review, CreateReviewPayload } from "@/types";
import { useAppUIContext } from "@/context/AppUIContext";
import { toast } from "react-toastify";
import ImageLightbox from "@/components/ImageLightbox";

// ── Aquamist Star ─────────────────────────────────────────────────────────────
function AqStar({ filled, interactive, onHover, onClick, size = 20 }: {
  filled: boolean;
  interactive?: boolean;
  onHover?: () => void;
  onClick?: () => void;
  size?: number;
}) {
  return (
    <button
      type="button"
      onMouseEnter={onHover}
      onClick={onClick}
      disabled={!interactive}
      className={interactive ? "cursor-pointer transition-transform hover:scale-110" : "cursor-default"}
    >
      <Star
        size={size}
        className={filled ? "fill-aq-primary text-aq-primary" : "fill-white/10 text-white/20"}
      />
    </button>
  );
}

// ── Interactive star row ───────────────────────────────────────────────────────
function AqStarRow({ rating, onChange, size = 20 }: {
  rating: number;
  onChange?: (r: number) => void;
  size?: number;
}) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || rating;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <AqStar
          key={i}
          filled={i <= display}
          interactive={!!onChange}
          size={size}
          onHover={() => onChange && setHovered(i)}
          onClick={() => onChange?.(i)}
        />
      ))}
    </div>
  );
}

// ── Stats banner ──────────────────────────────────────────────────────────────
function AqReviewStats({ stats }: { stats: ReviewsResponse["stats"] }) {
  return (
    <GlassCard className="rounded-[20px] p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      <div className="space-y-3">
        <h3 className="font-eb-garamond text-[28px] font-light text-aq-on-surface">
          Customer Reviews
        </h3>
        <div className="flex items-center gap-3">
          <AqStarRow rating={Math.round(stats.averageRating)} size={22} />
          <span className="font-inter text-base text-aq-on-surface-variant">
            {stats.averageRating.toFixed(1)} out of 5
          </span>
        </div>
        <p className="font-inter text-sm text-aq-on-surface-variant/70">
          Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex flex-col items-end">
        <span className="font-eb-garamond text-[56px] leading-none font-light text-aq-primary">
          {stats.averageRating.toFixed(1)}
        </span>
        <span className="font-inter text-sm text-aq-on-surface-variant/60 tracking-wider uppercase">
          Average Rating
        </span>
      </div>
    </GlassCard>
  );
}

// ── Individual review card ────────────────────────────────────────────────────
function AqReviewCard({ review, userId, token }: {
  review: Review;
  userId: string;
  token: string;
}) {
  const { setIsAuthModalOpen } = useAppUIContext();
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);
  const [isHelpful, setIsHelpful] = useState(review.helpfulBy.includes(userId));
  const [marking, setMarking] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleHelpful = async () => {
    if (!token) {
      toast.info("Please login to mark helpful");
      setIsAuthModalOpen(true);
      return;
    }
    if (marking) return;
    setMarking(true);
    try {
      const res = await reviewService.markHelpful(review._id, userId);
      setHelpfulCount(res.helpfulCount);
      setIsHelpful(res.helpfulBy.includes(userId));
    } catch {
      toast.error("Failed to update helpful status");
    } finally {
      setMarking(false);
    }
  };

  const initials = review.userId.username.charAt(0).toUpperCase();
  const date = new Date(review.createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <GlassCard className="rounded-[16px] p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-aq-primary/20 border border-aq-primary/30 flex items-center justify-center shrink-0">
          <span className="font-inter font-semibold text-aq-primary text-sm">{initials}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-inter font-semibold text-aq-on-surface text-sm">
                {review.userId.username}
              </span>
              {review.isVerifiedPurchase && (
                <span className="flex items-center gap-1 text-[11px] font-inter text-aq-primary/80 bg-aq-primary/10 border border-aq-primary/20 rounded-full px-2 py-0.5">
                  <ShieldCheck size={11} />
                  Verified
                </span>
              )}
            </div>
            <time className="font-inter text-xs text-aq-on-surface-variant/60">{date}</time>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-2 mt-1">
            <AqStarRow rating={review.rating} size={16} />
            <span className="font-inter text-xs text-aq-on-surface-variant/70">{review.rating}/5</span>
          </div>
        </div>
      </div>

      {/* Review text */}
      <p className="font-inter text-sm text-aq-on-surface-variant leading-relaxed">
        {review.description}
      </p>

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {review.images.map((url, i) => (
            <div
              key={i}
              onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
              className="cursor-pointer rounded-lg overflow-hidden aspect-square group"
            >
              <Image
                src={url}
                alt={`Review image ${i + 1}`}
                width={80}
                height={80}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          ))}
        </div>
      )}
      {lightboxOpen && review.images && (
        <ImageLightbox
          images={review.images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {/* Helpful */}
      <div className="pt-2 border-t border-white/5 flex items-center">
        <button
          onClick={handleHelpful}
          disabled={marking}
          className={[
            "flex items-center gap-2 font-inter text-xs rounded-full px-3 py-1.5 border transition-all duration-300",
            isHelpful
              ? "border-aq-primary/50 bg-aq-primary/10 text-aq-primary"
              : "border-white/10 text-aq-on-surface-variant/60 hover:border-white/30 hover:text-aq-on-surface-variant",
          ].join(" ")}
        >
          <ThumbsUp size={13} className={isHelpful ? "fill-aq-primary" : ""} />
          Helpful ({helpfulCount})
        </button>
      </div>
    </GlassCard>
  );
}

// ── Write-a-review form ───────────────────────────────────────────────────────
function AqReviewForm({ productId, userId, isAuthenticated, canReview, isReviewed, onSubmitted }: {
  productId: string;
  userId?: string;
  isAuthenticated: boolean;
  canReview: boolean;
  isReviewed: boolean;
  onSubmitted: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...picked].slice(0, 5));
    setPreviews((prev) => [
      ...prev,
      ...picked.map((f) => URL.createObjectURL(f)),
    ].slice(0, 5));
  };

  const removeFile = (i: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) { setError("You must be logged in."); return; }
    if (rating === 0) { setError("Please select a rating."); return; }
    if (description.trim().length < 10) { setError("Review must be at least 10 characters."); return; }

    setSubmitting(true);
    setError("");
    try {
      let uploadedUrls: string[] = [];
      if (files.length > 0) uploadedUrls = await productsService.uploadImages(files);
      const payload: CreateReviewPayload = {
        userId,
        productId,
        rating: rating.toString(),
        description: description.trim(),
        images: uploadedUrls,
      };
      await reviewService.createReview(payload);
      setRating(0);
      setDescription("");
      setFiles([]);
      setPreviews([]);
      onSubmitted();
      toast.success("Review submitted!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!canReview) return null;

  if (!isAuthenticated) {
    return (
      <GlassCard className="rounded-[16px] p-6 text-center">
        <p className="font-inter text-aq-on-surface-variant mb-4">
          Please sign in to write a review.
        </p>
        <button className="px-6 py-2 rounded-full border border-aq-primary text-aq-primary font-inter text-sm hover:bg-aq-primary/10 transition-colors">
          Sign In
        </button>
      </GlassCard>
    );
  }

  if (isReviewed) return null;

  return (
    <GlassCard className="rounded-[20px] p-8">
      <h3 className="font-eb-garamond text-[24px] font-light text-aq-on-surface mb-6">
        Write a Review
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star picker */}
        <div className="space-y-2">
          <label className="font-inter text-xs text-aq-on-surface-variant tracking-wider uppercase font-semibold">
            Rating *
          </label>
          <div className="flex items-center gap-3">
            <AqStarRow rating={rating} onChange={setRating} size={28} />
            <span className="font-inter text-sm text-aq-on-surface-variant/70">
              {rating > 0 ? `${rating}/5` : "Select rating"}
            </span>
          </div>
        </div>

        {/* Textarea */}
        <div className="space-y-2">
          <label htmlFor="aq-review-text" className="font-inter text-xs text-aq-on-surface-variant tracking-wider uppercase font-semibold">
            Review *
          </label>
          <textarea
            id="aq-review-text"
            placeholder="Share your experience with this product…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-[12px] px-4 py-3 font-inter text-sm text-aq-on-surface placeholder-aq-on-surface-variant/40 focus:outline-none focus:border-aq-primary/50 resize-none transition-colors"
          />
          <p className="font-inter text-xs text-aq-on-surface-variant/50">
            Minimum 10 characters ({description.length}/10)
          </p>
        </div>

        {/* Image picker */}
        <div className="space-y-3">
          <label className="font-inter text-xs text-aq-on-surface-variant tracking-wider uppercase font-semibold">
            Photos (optional, up to 5)
          </label>
          <div className="flex flex-wrap gap-3">
            {previews.map((src, i) => (
              <div key={i} className="relative w-16 h-16 rounded-[10px] overflow-hidden group">
                <Image src={src} alt={`Preview ${i + 1}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
            ))}
            {previews.length < 5 && (
              <label className="w-16 h-16 rounded-[10px] border border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-aq-primary/50 transition-colors group">
                <ImagePlus size={20} className="text-aq-on-surface-variant/50 group-hover:text-aq-primary/70 transition-colors" />
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
              </label>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-[10px] px-4 py-3 font-inter text-sm text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || rating === 0 || description.trim().length < 10}
          className="w-full h-12 bg-aq-primary text-aq-on-primary font-inter text-sm font-semibold tracking-wider rounded-full hover:bg-aq-primary-fixed transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {submitting ? "Submitting…" : "Submit Review"}
        </button>
      </form>
    </GlassCard>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
function AqPagination({ pagination, onPageChange }: {
  pagination: ReviewsResponse["pagination"];
  onPageChange: (p: number) => void;
}) {
  const { currentPage, totalPages, hasPrev, hasNext } = pagination;
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const max = 5;
  let start = Math.max(1, currentPage - Math.floor(max / 2));
  let end = Math.min(totalPages, start + max - 1);
  if (end - start + 1 < max) start = Math.max(1, end - max + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        className="flex items-center gap-1 px-4 py-2 rounded-full border border-white/10 font-inter text-sm text-aq-on-surface-variant hover:border-aq-primary/50 hover:text-aq-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={16} /> Prev
      </button>
      <div className="flex items-center gap-1">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={[
              "w-9 h-9 rounded-full font-inter text-sm transition-all",
              p === currentPage
                ? "bg-aq-primary text-aq-on-primary font-semibold"
                : "border border-white/10 text-aq-on-surface-variant hover:border-aq-primary/50 hover:text-aq-primary",
            ].join(" ")}
          >
            {p}
          </button>
        ))}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className="flex items-center gap-1 px-4 py-2 rounded-full border border-white/10 font-inter text-sm text-aq-on-surface-variant hover:border-aq-primary/50 hover:text-aq-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────
interface AquaMistReviewsProps {
  productId: string;
  userId?: string;
  authToken?: string | null;
}

export default function AquaMistReviews({ productId, userId, authToken }: AquaMistReviewsProps) {
  const [reviewsData, setReviewsData] = useState<ReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  const fetchReviews = useCallback(async (page: number) => {
    try {
      setLoading(true);
      const data = await reviewService.getProductReviews(productId, page, sortBy, userId as string);
      setReviewsData(data);
    } catch {
      // silently fail — empty state shown
    } finally {
      setLoading(false);
    }
  }, [productId, sortBy, userId]);

  useEffect(() => { fetchReviews(currentPage); }, [fetchReviews, currentPage]);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "recent", label: "Most Recent" },
    { value: "oldest", label: "Oldest First" },
    { value: "highest", label: "Highest Rating" },
    { value: "lowest", label: "Lowest Rating" },
    { value: "helpful", label: "Most Helpful" },
  ];

  // Loading state
  if (loading && !reviewsData) {
    return (
      <div className="flex items-center justify-center py-16 gap-3 text-aq-on-surface-variant/60">
        <Loader2 size={24} className="animate-spin text-aq-primary" />
        <span className="font-inter text-sm">Loading reviews…</span>
      </div>
    );
  }

  if (!reviewsData) return null;

  return (
    <div className="space-y-8">
      {/* Stats banner */}
      <AqReviewStats stats={reviewsData.stats} />

      {/* Write a review */}
      <AqReviewForm
        productId={productId}
        userId={userId}
        isAuthenticated={!!authToken}
        canReview={reviewsData.canReview}
        isReviewed={reviewsData.isReviewed}
        onSubmitted={() => { fetchReviews(1); setCurrentPage(1); }}
      />

      {/* Reviews list */}
      {reviewsData.reviews.length > 0 ? (
        <div className="space-y-4">
          {/* Filter row */}
          <div className="flex items-center justify-between">
            <h3 className="font-inter font-semibold text-aq-on-surface">
              Reviews ({reviewsData.stats.totalReviews || reviewsData.pagination.totalReviews})
            </h3>
            <div className="flex items-center gap-2">
              <span className="font-inter text-xs text-aq-on-surface-variant/60 tracking-wider uppercase hidden sm:block">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value as SortOption); setCurrentPage(1); }}
                className="bg-white/5 border border-white/10 rounded-full px-4 py-1.5 font-inter text-sm text-aq-on-surface focus:outline-none focus:border-aq-primary/50 cursor-pointer"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value} className="bg-[#0d1f1c] text-aq-on-surface">
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cards */}
          {loading ? (
            <div className="flex items-center justify-center py-8 gap-2 text-aq-on-surface-variant/50">
              <Loader2 size={18} className="animate-spin text-aq-primary" />
              <span className="font-inter text-sm">Updating…</span>
            </div>
          ) : (
            <div className="space-y-4">
              {reviewsData.reviews.map((review) => (
                <AqReviewCard
                  key={review._id}
                  review={review}
                  userId={userId || ""}
                  token={authToken || ""}
                />
              ))}
            </div>
          )}

          <AqPagination
            pagination={reviewsData.pagination}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      ) : (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-5xl text-aq-primary/30 block mb-3">rate_review</span>
          <p className="font-inter text-aq-on-surface-variant/60">
            No reviews yet. Be the first to review this product!
          </p>
        </div>
      )}
    </div>
  );
}
