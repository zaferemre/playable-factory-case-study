"use client";

import { useEffect, useState } from "react";
import { Plus, Folder } from "lucide-react";
import type { Product, Category } from "@/lib/types/types";
import {
  getAdminProducts,
  updateAdminProduct,
  createAdminProduct,
  deleteAdminProduct,
  type AdminCreateProductInput,
} from "@/lib/api/adminApi";
import { getAllCategoriesAdmin } from "@/lib/api/categoryApi";
import ProductFilters from "./ProductFilters";
import ProductCard from "./ProductCard";
import CreateProductModal from "./CreateProductModal";
import CategoryManagement from "./CategoryManagement";

type ProductSortBy = "name" | "price" | "stock" | "orders" | "revenue";
type StatusFilter = "all" | "active" | "inactive";

export default function AdminProductsPage() {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<ProductSortBy>("name");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      
      try {
        const [productsData, categoriesData] = await Promise.all([
          getAdminProducts(),
          getAllCategoriesAdmin(true),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.slug.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((p) => {
        const categoryId = typeof p.category === "string" ? p.category : p.category?._id;
        return categoryId === categoryFilter;
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((p) =>
        statusFilter === "active" ? p.isActive : !p.isActive
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return b.price - a.price;
        case "stock":
          return b.stockQuantity - a.stockQuantity;
        case "orders":
          return (b.orderCount ?? 0) - (a.orderCount ?? 0);
        case "revenue":
          return (b.totalRevenue ?? 0) - (a.totalRevenue ?? 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter, statusFilter, sortBy]);

  // Product operations
  const handleFieldChange = (
    productId: string,
    field: keyof Product,
    value: string | number | boolean
  ) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === productId ? { ...p, [field]: value } : p))
    );
  };

  const handleToggleActive = async (productId: string) => {
    setUpdating(true);
    try {
      const product = products.find((p) => p._id === productId);
      if (!product) return;

      const updated = await updateAdminProduct(productId, {
        isActive: !product.isActive,
      });
      
      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? updated : p))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateCore = async (productId: string) => {
    setUpdating(true);
    try {
      const product = products.find((p) => p._id === productId);
      if (!product) return;

      const updated = await updateAdminProduct(productId, {
        price: product.price,
        stockQuantity: product.stockQuantity,
      });
      
      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? updated : p))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setUpdating(true);
    try {
      await deleteAdminProduct(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    } finally {
      setUpdating(false);
    }
  };

  const handleCreateProduct = async (data: AdminCreateProductInput) => {
    setUpdating(true);
    try {
      const created = await createAdminProduct(data);
      setProducts((prev) => [created, ...prev]);
      setShowCreateModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setUpdating(false);
    }
  };

  const handleCategoriesChange = (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Product Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your products and categories
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowCategoryManager(!showCategoryManager)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Folder className="h-4 w-4" />
            Categories
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg dark:bg-red-900/30 dark:border-red-800 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Category Management */}
      {showCategoryManager && (
        <CategoryManagement
          categories={categories}
          onCategoriesChange={handleCategoriesChange}
        />
      )}

      {/* Filters */}
      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        categories={categories}
      />

      {/* Products Grid */}
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            categories={categories}
            updating={updating}
            onFieldChange={handleFieldChange}
            onToggleActive={handleToggleActive}
            onUpdateCore={handleUpdateCore}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            {searchTerm || categoryFilter !== "all" || statusFilter !== "all"
              ? "No products match your filters"
              : "No products found"}
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      <CreateProductModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        categories={categories}
        onCreate={handleCreateProduct}
        loading={updating}
      />
    </div>
  );
}