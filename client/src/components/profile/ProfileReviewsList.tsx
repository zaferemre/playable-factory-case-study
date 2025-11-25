import { motion } from "framer-motion";
import { IconStar, IconMessage, IconStarFilled } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Review } from "@/lib/types/types";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ProfileEmptyState from "./ProfileEmptyState";

interface ProfileReviewsListProps {
  reviews: Review[];
  reviewsLoading: boolean;
}

export function ProfileReviewsList({
  reviews,
  reviewsLoading,
}: ProfileReviewsListProps) {
  const router = useRouter();

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star}>
            {star <= rating ? (
              <IconStarFilled className="w-4 h-4 text-yellow-400" />
            ) : (
              <IconStar className="w-4 h-4 text-gray-300 dark:text-gray-600" />
            )}
          </div>
        ))}
      </div>
    );
  };

  if (reviewsLoading) {
    return (
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center mb-4">
          <IconMessage className="w-5 h-5 mr-2" />
          My Reviews
        </h2>
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center mb-4">
        <IconMessage className="w-5 h-5 mr-2" />
        My Reviews
      </h2>

      {reviews.length === 0 ? (
        <ProfileEmptyState
          icon={IconMessage}
          title="No Reviews Yet"
          description="You haven't written any product reviews yet. Purchase products and share your experience with others."
          actionLabel="Shop Products"
          onAction={() => router.push("/shop")}
        />
      ) : (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <motion.div
              key={review._id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => {
                if (
                  review.product &&
                  typeof review.product === "object" &&
                  "slug" in review.product
                ) {
                  router.push(`/product/${review.product.slug}`);
                }
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {review.createdAt &&
                        new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    {typeof review.product === "object" && review.product?.name
                      ? review.product.name
                      : "Product Review"}
                  </h3>

                  {review.title && (
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {review.title}
                    </h4>
                  )}
                </div>

                {typeof review.product === "object" &&
                  review.product?.imageUrls?.[0] && (
                    <Image
                      src={review.product.imageUrls[0]}
                      alt={review.product.name || "Product"}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded-lg ml-4"
                    />
                  )}
              </div>

              {review.comment && (
                <div className="mb-3">
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {review.comment.length > 200
                      ? `${review.comment.substring(0, 200)}...`
                      : review.comment}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <span>Rating: {review.rating}/5</span>
                </div>

                <span className="text-blue-600 dark:text-blue-400 hover:underline">
                  View Product →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
