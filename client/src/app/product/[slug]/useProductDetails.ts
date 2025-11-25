"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Product, Review } from "@/lib/types/types";
import { useAppDispatch } from "@/lib/store/hooks";
import { addItemLocal } from "@/lib/store/cartSlice";
import { addItemToCart, getOrCreateCartSessionId } from "@/lib/api/cartApi";
import { getProductBySlug } from "@/lib/api/productApi";
import {
  listReviews,
  createReview,
  type CreateReviewInput,
} from "@/lib/api/reviewApi";

interface UseProductDetailsArgs {
  slug: string;
  backendUserId?: string | null;
  firebaseUser?: {
    displayName?: string | null;
    email?: string | null;
  } | null;
}

type ReviewWithMeta = Review & {
  authorName?: string;
  userName?: string;
  user?: {
    _id: string;
    name?: string;
    photoUrl?: string;
  };
};

function computeAverageRating(reviews: ReviewWithMeta[]) {
  if (!reviews.length) return 0;
  const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
  return sum / reviews.length;
}

export function useProductDetails({
  slug,
  backendUserId,
  firebaseUser,
}: UseProductDetailsArgs) {
  const dispatch = useAppDispatch();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // gallery
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // cart
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  // reviews
  const [reviews, setReviews] = useState<ReviewWithMeta[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  // review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewAuthorName, setReviewAuthorName] = useState(
    firebaseUser?.displayName || ""
  );

  // hydrate author name from firebase user when it changes
  useEffect(() => {
    if (firebaseUser?.displayName) {
      setReviewAuthorName(firebaseUser.displayName);
    }
  }, [firebaseUser?.displayName]);

  // load product by slug
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const p = await getProductBySlug(slug);
        if (!cancelled) {
          setProduct(p);
          setActiveImageIndex(0);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load product"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // load reviews once we know the product id
  useEffect(() => {
    if (!product) return;

    const productId =
      (product as any)._id || (product as any).id || (product as any).productId;

    if (!productId) return;

    let cancelled = false;

    const loadReviews = async () => {
      try {
        setReviewsLoading(true);
        setReviewError("");

        const data = await listReviews({ productId });

        // Backend returns { reviews: [...], total: number, page: number, limit: number }
        const normalized: ReviewWithMeta[] = (data.reviews ||
          []) as ReviewWithMeta[];

        if (!cancelled) {
          setReviews(normalized);
        }
      } catch (err: any) {
        if (!cancelled) {
          setReviewError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load reviews"
          );
          setReviews([]);
        }
      } finally {
        if (!cancelled) setReviewsLoading(false);
      }
    };

    void loadReviews();

    return () => {
      cancelled = true;
    };
  }, [product]);

  // clear added state after a short time
  useEffect(() => {
    if (!added) return;
    const id = window.setTimeout(() => setAdded(false), 1200);
    return () => window.clearTimeout(id);
  }, [added]);

  const images = useMemo(() => product?.imageUrls || [], [product?.imageUrls]);
  const activeImage = images.length > 0 ? images[activeImageIndex] : undefined;
  const inStock = (product?.stockQuantity || 0) > 0;

  // rating data
  const reviewCount = useMemo(
    () => reviews.length || product?.reviewCount || 0,
    [reviews.length, product?.reviewCount]
  );

  const averageRating = useMemo(() => {
    if (reviews.length) return computeAverageRating(reviews);
    if (product?.averageRating) return product.averageRating;
    return 0;
  }, [reviews, product?.averageRating]);

  const hasAggregateReviews = reviewCount > 0;

  const categoryName =
    typeof product?.category === "object" &&
    product?.category !== null &&
    "name" in product.category
      ? (product.category as any).name
      : "Sample Category";

  function handlePrevImage() {
    if (!images.length) return;
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }

  function handleNextImage() {
    if (!images.length) return;
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }

  function handleSelectImage(index: number) {
    if (!images.length) return;
    setActiveImageIndex(index);
  }

  function handleQuantityChange(delta: number) {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (product?.stockQuantity && next > product.stockQuantity) {
        return product.stockQuantity;
      }
      return next;
    });
  }

  const handleAddToCart = useCallback(async () => {
    if (!product || !inStock || adding || quantity <= 0) return;

    setAdding(true);

    // optimistic local update
    for (let i = 0; i < quantity; i += 1) {
      dispatch(addItemLocal(product));
    }

    const sessionId = getOrCreateCartSessionId();
    setAdded(true);

    try {
      await addItemToCart({
        userId: backendUserId ?? undefined,
        sessionId,
        productId: (product as any)._id,
        quantity,
      });
    } catch (err) {
      console.error("Failed to sync cart", err);
    } finally {
      setAdding(false);
    }
  }, [adding, backendUserId, dispatch, inStock, product, quantity]);

  function getReviewAuthorName(review: ReviewWithMeta) {
    return (
      review.authorName || review.userName || review.user?.name || "Anonymous"
    );
  }

  const handleSubmitReview = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!product) return;

      const productId =
        (product as any)._id ||
        (product as any).id ||
        (product as any).productId;
      if (!productId) return;

      if (!reviewRating || reviewRating < 1 || reviewRating > 5) {
        setReviewError("Please select a rating between 1 and 5");
        return;
      }

      try {
        setReviewSubmitting(true);
        setReviewError("");

        const input: CreateReviewInput = {
          product: productId,
          rating: reviewRating,
          title: reviewTitle || undefined,
          comment: reviewComment || undefined,
          authorName:
            reviewAuthorName || firebaseUser?.displayName || undefined,
        };

        if (backendUserId) {
          input.user = backendUserId;
        }

        const created = (await createReview(input)) as ReviewWithMeta;

        const enhanced: ReviewWithMeta = {
          ...created,
          authorName:
            reviewAuthorName ||
            firebaseUser?.displayName ||
            created.user?.name ||
            "Anonymous",
        };

        setReviews((prev) => [enhanced, ...prev]);

        setReviewTitle("");
        setReviewComment("");
      } catch (err: any) {
        setReviewError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to submit review"
        );
      } finally {
        setReviewSubmitting(false);
      }
    },
    [
      backendUserId,
      firebaseUser?.displayName,
      product,
      reviewComment,
      reviewRating,
      reviewTitle,
      reviewAuthorName,
    ]
  );

  return {
    product,
    loading,
    error,

    images,
    activeImage,
    activeImageIndex,
    handlePrevImage,
    handleNextImage,
    handleSelectImage,

    inStock,
    averageRating,
    reviewCount,
    hasAggregateReviews,
    categoryName,

    quantity,
    adding,
    added,
    handleQuantityChange,
    handleAddToCart,

    reviews,
    reviewsLoading,
    reviewSubmitting,
    reviewError,
    handleSubmitReview,
    getReviewAuthorName,

    reviewRating,
    setReviewRating,
    reviewTitle,
    setReviewTitle,
    reviewComment,
    setReviewComment,
    reviewAuthorName,
    setReviewAuthorName,
  };
}
