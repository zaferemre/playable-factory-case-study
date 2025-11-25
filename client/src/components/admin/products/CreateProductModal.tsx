"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Category } from "@/lib/types/types";
import type { AdminCreateProductInput } from "@/lib/api/adminApi";

interface NewProductFormState {
  name: string;
  slug: string;
  price: string;
  currency: string;
  category: string;
  stockQuantity: string;
  description: string;
  imageUrls: string;
}

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onCreate: (data: AdminCreateProductInput) => void;
  loading: boolean;
}

export default function CreateProductModal({
  isOpen,
  onClose,
  categories,
  onCreate,
  loading,
}: CreateProductModalProps) {
  const [form, setForm] = useState<NewProductFormState>({
    name: "",
    slug: "",
    price: "",
    currency: "USD",
    category: "",
    stockQuantity: "",
    description: "",
    imageUrls: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      name: form.name,
      slug: form.slug,
      price: Number(form.price),
      currency: form.currency,
      category: form.category,
      stockQuantity: Number(form.stockQuantity),
      description: form.description,
      imageUrls: form.imageUrls
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Create New Product
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 dark:border-gray-700 dark:bg-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Slug
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 dark:border-gray-700 dark:bg-gray-800"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 dark:border-gray-700 dark:bg-gray-800"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Stock
              </label>
              <input
                type="number"
                value={form.stockQuantity}
                onChange={(e) =>
                  setForm({ ...form, stockQuantity: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 dark:border-gray-700 dark:bg-gray-800"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 dark:border-gray-700 dark:bg-gray-800"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 dark:border-gray-700 dark:bg-gray-800"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Image URLs (comma-separated)
            </label>
            <input
              type="text"
              value={form.imageUrls}
              onChange={(e) => setForm({ ...form, imageUrls: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 dark:border-gray-700 dark:bg-gray-800"
              placeholder="https://image1.jpg, https://image2.jpg"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
