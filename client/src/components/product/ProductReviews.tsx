import { motion } from "motion/react";
import {
  IconStarFilled,
  IconStar,
  IconUser,
  IconCalendar,
  IconEye,
} from "@tabler/icons-react";
import { useState } from "react";
import { Review } from "@/lib/types/types";

interface ProductReviewsProps {
  reviews: Review[];
  reviewsLoading: boolean;
  averageRating: number;
  reviewCount: number;
  onSubmitReview: (e: React.FormEvent) => void;
  reviewSubmitting: boolean;
  reviewError: string;
  reviewRating: number;
  setReviewRating: (rating: number) => void;
  reviewTitle: string;
  setReviewTitle: (title: string) => void;
  reviewComment: string;
  setReviewComment: (comment: string) => void;
  reviewAuthorName: string;
  setReviewAuthorName: (name: string) => void;
  getReviewAuthorName: (review: any) => string;
}

export default function ProductReviews({
  reviews,
  reviewsLoading,
  averageRating,
  reviewCount,
  onSubmitReview,
  reviewSubmitting,
  reviewError,
  reviewRating,
  setReviewRating,
  reviewTitle,
  setReviewTitle,
  reviewComment,
  setReviewComment,
  reviewAuthorName,
  setReviewAuthorName,
  getReviewAuthorName,
}: ProductReviewsProps) {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const safeReviews = Array.isArray(reviews) ? reviews : [];
  const displayedReviews = showAllReviews
    ? safeReviews
    : safeReviews.slice(0, 3);

  return (
    <motion.div
      className="mt-16"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200/50 shadow-xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full">
              <IconStarFilled size={20} className="text-yellow-600" />
              <span className="font-bold text-yellow-800">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-yellow-700">({reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Review Form */}
        <motion.div
          className="bg-slate-50 rounded-2xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Write a Review
          </h3>
          <form onSubmit={onSubmitReview} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Your Name
                </label>
                <input
                  value={reviewAuthorName}
                  onChange={(e) => setReviewAuthorName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Review Title
                </label>
                <input
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  placeholder="Summarize your review"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => {
                  const filled = i < reviewRating;
                  return (
                    <motion.button
                      key={i}
                      type="button"
                      onClick={() => setReviewRating(i + 1)}
                      className="p-1"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {filled ? (
                        <IconStarFilled size={24} className="text-yellow-400" />
                      ) : (
                        <IconStar
                          size={24}
                          className="text-slate-300 hover:text-yellow-400"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Your Review
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none"
                placeholder="Share your experience with this product..."
                required
              />
            </div>

            {reviewError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700">{reviewError}</p>
              </div>
            )}

            <motion.button
              type="submit"
              disabled={reviewSubmitting}
              className="w-full sm:w-auto px-8 py-3 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-400 disabled:opacity-50 transition-colors"
              whileHover={!reviewSubmitting ? { scale: 1.02 } : {}}
              whileTap={!reviewSubmitting ? { scale: 0.98 } : {}}
            >
              {reviewSubmitting ? "Submitting..." : "Submit Review"}
            </motion.button>
          </form>
        </motion.div>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviewsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
          ) : safeReviews.length === 0 ? (
            <div className="text-center py-8">
              <IconEye size={48} className="text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                No Reviews Yet
              </h3>
              <p className="text-slate-500">
                Be the first to review this product!
              </p>
            </div>
          ) : (
            <>
              {displayedReviews.map((review, index) => {
                const author = getReviewAuthorName(review);
                return (
                  <motion.div
                    key={review._id}
                    className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                        <IconUser size={20} className="text-red-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-slate-900">{author}</h4>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => {
                              const filled = i < (review.rating || 0);
                              const StarIcon = filled
                                ? IconStarFilled
                                : IconStar;
                              return (
                                <StarIcon
                                  key={i}
                                  size={16}
                                  className={
                                    filled
                                      ? "text-yellow-400"
                                      : "text-slate-300"
                                  }
                                />
                              );
                            })}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-slate-500">
                            <IconCalendar size={14} />
                            <span>
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        {review.title && (
                          <h5 className="font-semibold text-slate-800 mb-2">
                            {review.title}
                          </h5>
                        )}
                        {review.comment && (
                          <p className="text-slate-700 leading-relaxed">
                            {review.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {safeReviews.length > 3 && (
                <div className="text-center">
                  <motion.button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-red-200 text-red-600 rounded-2xl font-semibold hover:bg-red-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {showAllReviews
                      ? "Show Less"
                      : `Show All ${safeReviews.length} Reviews`}
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
