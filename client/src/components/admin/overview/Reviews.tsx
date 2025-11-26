"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare, User } from "lucide-react";
import { listAllReviews } from "@/lib/api/reviewApi";
import type { Review, Product, User as UserType } from "@/lib/types/types";

interface ReviewsProps {
  limit?: number;
}

export default function Reviews({ limit = 5 }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Use admin endpoint to get all reviews
        const data = await listAllReviews({ limit });
        if (data && data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews);
        } else {
          // Add mock data for testing
          const mockReviews: Review[] = [
            {
              _id: "mock1",
              product: { name: "Premium Cereal", _id: "p1" } as Product,
              user: { name: "John Doe", _id: "u1" } as UserType,
              rating: 5,
              comment: "Amazing product! Really satisfied with the quality.",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              _id: "mock2",
              product: { name: "Healthy Mix", _id: "p2" } as Product,
              user: { name: "Jane Smith", _id: "u2" } as UserType,
              rating: 4,
              comment: "Good quality, fast delivery. Recommended!",
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              updatedAt: new Date(Date.now() - 86400000).toISOString(),
            },
          ];
          setReviews(mockReviews);
        }
      } catch (error) {
        // Show mock data even on error for now
        const mockReviews: Review[] = [
          {
            _id: "mock1",
            product: { name: "Premium Cereal", _id: "p1" } as Product,
            user: { name: "John Doe", _id: "u1" } as UserType,
            rating: 5,
            comment: "Amazing product! Really satisfied with the quality.",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        setReviews(mockReviews);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [limit]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="rounded-2xl border-2 border-blue-300 bg-white p-4 shadow-lg dark:border-blue-500 dark:bg-gray-900">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
          Recent Reviews ({reviews.length} reviews loaded)
        </h2>
        {loading && (
          <span className="text-[11px] text-gray-500 dark:text-gray-400">
            Loading...
          </span>
        )}
      </div>

      <div className="space-y-3">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review._id}
              className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {typeof review.user === "object"
                        ? review.user.name
                        : "User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {typeof review.product === "object"
                        ? review.product.name
                        : "Product"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {renderStars(review.rating)}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
              {review.comment && (
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                  {review.comment}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              No reviews yet
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Customer reviews will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
