"use client";

import { useState } from "react";
import {
  Image as ImageIcon,
  Edit,
  Trash2,
  Save,
  Eye,
  DollarSign,
  Package,
  ShoppingCart,
  Star,
} from "lucide-react";
import type { Product, Category } from "@/lib/types/types";

function getCategoryLabel(
  category: Product["category"],
  categories: Category[]
) {
  if (!category) return "Uncategorized";
  if (typeof category === "string") {
    const found = categories.find((c) => c._id === category);
    if (found) return found.name;
    return category;
  }
  return category.name;
}

interface ProductCardProps {
  product: Product;
  categories: Category[];
  updating: boolean;
  onFieldChange: (
    productId: string,
    field: keyof Product,
    value: string | number | boolean
  ) => void;
  onToggleActive: (productId: string) => void;
  onUpdateCore: (productId: string) => void;
  onDelete: (productId: string) => void;
}

export default function ProductCard({
  product: p,
  categories,
  updating,
  onFieldChange,
  onToggleActive,
  onUpdateCore,
  onDelete,
}: ProductCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const categoryLabel = getCategoryLabel(p.category, categories);
  const mainImage = p.imageUrls?.[0];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow dark:border-gray-800 dark:bg-gray-900">
      {/* Product Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
          {mainImage ? (
            <img
              src={mainImage}
              alt={p.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
            {p.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            /{p.slug}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                p.isActive
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
              }`}
            >
              {p.isActive ? "Active" : "Inactive"}
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              {categoryLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Eye className="h-4 w-4 text-gray-500" />
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Edit className="h-4 w-4 text-gray-500" />
          </button>
          <button
            onClick={() => onDelete(p._id)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <DollarSign className="h-4 w-4 text-green-500" />
            {isEditing ? (
              <input
                type="number"
                value={p.price}
                onChange={(e) =>
                  onFieldChange(p._id, "price", Number(e.target.value))
                }
                className="w-16 text-sm border border-gray-200 rounded px-1 dark:border-gray-700 dark:bg-gray-800"
              />
            ) : (
              <span className="font-bold text-gray-900 dark:text-white">
                {p.price}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {p.currency} Price
          </p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Package className="h-4 w-4 text-blue-500" />
            {isEditing ? (
              <input
                type="number"
                value={p.stockQuantity}
                onChange={(e) =>
                  onFieldChange(p._id, "stockQuantity", Number(e.target.value))
                }
                className="w-16 text-sm border border-gray-200 rounded px-1 dark:border-gray-700 dark:bg-gray-800"
              />
            ) : (
              <span className="font-bold text-gray-900 dark:text-white">
                {p.stockQuantity}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">In Stock</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <ShoppingCart className="h-4 w-4 text-purple-500" />
            <span className="font-bold text-gray-900 dark:text-white">
              {p.orderCount ?? 0}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Orders</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="font-bold text-gray-900 dark:text-white">
              {p.averageRating?.toFixed(1) ?? "0.0"}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Rating ({p.reviewCount ?? 0})
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onToggleActive(p._id)}
          disabled={updating}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
            p.isActive
              ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300"
              : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300"
          }`}
        >
          {updating ? "..." : p.isActive ? "Deactivate" : "Activate"}
        </button>

        {isEditing && (
          <button
            onClick={() => {
              onUpdateCore(p._id);
              setIsEditing(false);
            }}
            disabled={updating}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            Save
          </button>
        )}
      </div>

      {/* Detailed View */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium text-gray-900 dark:text-white mb-1">
                Description
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {p.description || "No description provided"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Sales
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {p.totalUnitsSold ?? 0} units sold
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Revenue
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {p.totalRevenue?.toLocaleString() ?? 0} {p.currency}
                </p>
              </div>
            </div>

            {p.imageUrls && p.imageUrls.length > 1 && (
              <div>
                <p className="font-medium text-gray-900 dark:text-white mb-1">
                  Images
                </p>
                <div className="flex gap-2">
                  {p.imageUrls.slice(1).map((url, index) => (
                    <div
                      key={index}
                      className="h-12 w-12 rounded border overflow-hidden"
                    >
                      <img
                        src={url}
                        alt={`${p.name} ${index + 2}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
