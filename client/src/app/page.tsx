"use client";

import { useHomePageData } from "@/lib/hooks/useHomePageData";
import { ErrorAlert, SectionContainer } from "@/components/shared";
import { Hero, FeaturesSection, TestimonialsSection } from "@/components/home";
import { ProductsSection } from "@/components/product";

export default function HomePage() {
  const { products, loading, error, clearError } = useHomePageData();

  return (
    <main className="w-full bg-gradient-to-b from-white via-slate-50/50 to-white">
      {/* Error Alert */}
      {error && (
        <SectionContainer background="transparent" padding="sm">
          <ErrorAlert message={error} onDismiss={clearError} />
        </SectionContainer>
      )}

      {/* Hero Section */}
      <Hero />

      {/* Products Section */}
      <ProductsSection products={products} loading={loading} error={error} />

      {/* Features Section */}
      <FeaturesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />
    </main>
  );
}
