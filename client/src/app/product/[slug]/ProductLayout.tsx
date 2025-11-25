"use client";

import { motion } from "motion/react";
import { Package } from "lucide-react";
import { useState } from "react";
import { useProductDetails } from "./useProductDetails";
import { LoadingSpinner, EmptyState, Breadcrumb } from "@/components/shared";
import {
  ProductImageGallery,
  ProductHeader,
  ProductInfo,
  ProductPurchaseSection,
  ProductFeatures,
  ProductReviews,
} from "@/components/product";

interface ProductLayoutProps {
  slug: string;
  backendUserId?: string | null;
  firebaseUser?: {
    displayName?: string | null;
    email?: string | null;
  } | null;
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("tr-TR").format(amount);
}

export default function ProductLayout({
  slug,
  backendUserId,
  firebaseUser,
}: ProductLayoutProps) {
  const {
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
    // hasAggregateReviews,
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
  } = useProductDetails({ slug, backendUserId, firebaseUser });

  const [showReviews, setShowReviews] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const safeReviews = Array.isArray(reviews) ? reviews : [];
  const displayedReviews = showAllReviews
    ? safeReviews
    : safeReviews.slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner message="Loading product..." size="lg" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30 flex items-center justify-center py-8">
        <EmptyState
          icon={Package}
          title="Product Not Found"
          description={
            error ||
            "We could not find this product. It may have been removed or is temporarily unavailable."
          }
          action={
            <a
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-2xl font-semibold hover:bg-red-400 transition-colors"
            >
              Browse Products
            </a>
          }
        />
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Products", href: "/shop" },
    { label: categoryName },
    { label: product.name },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-red-50/30">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Product Image Gallery */}
          <ProductImageGallery
            images={images}
            productName={product.name}
            activeImageIndex={activeImageIndex}
            onPrevImage={handlePrevImage}
            onNextImage={handleNextImage}
            onSelectImage={handleSelectImage}
          />

          {/* Product Details */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ProductHeader
              name={product.name}
              categoryName={categoryName}
              averageRating={averageRating}
              reviewCount={reviewCount}
              price={product.price}
              currency={product.currency}
              onShowReviews={() => setShowReviews(!showReviews)}
            />

            <ProductInfo description={product.description} inStock={inStock} />

            <ProductPurchaseSection
              quantity={quantity}
              stockQuantity={product.stockQuantity}
              inStock={inStock}
              adding={adding}
              added={added}
              onQuantityChange={handleQuantityChange}
              onAddToCart={handleAddToCart}
            />

            <ProductFeatures />
          </motion.div>
        </div>

        {/* Product Reviews Section */}
        <ProductReviews
          reviews={reviews}
          reviewsLoading={reviewsLoading}
          averageRating={averageRating}
          reviewCount={reviewCount}
          onSubmitReview={handleSubmitReview}
          reviewSubmitting={reviewSubmitting}
          reviewError={reviewError}
          reviewRating={reviewRating}
          setReviewRating={setReviewRating}
          reviewTitle={reviewTitle}
          setReviewTitle={setReviewTitle}
          reviewComment={reviewComment}
          setReviewComment={setReviewComment}
          reviewAuthorName={reviewAuthorName}
          setReviewAuthorName={setReviewAuthorName}
          getReviewAuthorName={getReviewAuthorName}
        />
      </div>
    </div>
  );
}
