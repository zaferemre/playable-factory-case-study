import { useEffect, useState } from "react";
import type { Product } from "@/lib/types/types";
import { getAvailableProducts } from "@/lib/api/productApi";

export function useHomePageData() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setError("");
        const data = await getAvailableProducts();
        setProducts(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const clearError = () => setError("");

  return {
    products,
    loading,
    error,
    clearError,
  };
}
