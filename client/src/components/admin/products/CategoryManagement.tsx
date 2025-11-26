"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Save, X, Folder } from "lucide-react";
import type { Category } from "@/lib/types/types";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategoriesAdmin,
  type CreateCategoryInput,
  type UpdateCategoryInput,
} from "@/lib/api/categoryApi";

interface CategoryManagementProps {
  categories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
}

export default function CategoryManagement({
  categories,
  onCategoriesChange,
}: CategoryManagementProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [createForm, setCreateForm] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const [editForm, setEditForm] = useState<UpdateCategoryInput>({});

  const refreshCategories = async () => {
    try {
      const updated = await getAllCategoriesAdmin(true);
      onCategoriesChange(updated);
    } catch (err) {}
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name.trim()) return;

    setLoading(true);
    setError("");

    try {
      const input: CreateCategoryInput = {
        name: createForm.name.trim(),
        slug:
          createForm.slug.trim() ||
          createForm.name.toLowerCase().replace(/\s+/g, "-"),
        description: createForm.description.trim() || undefined,
      };

      await createCategory(input);
      await refreshCategories();

      setCreateForm({ name: "", slug: "", description: "" });
      setShowCreateForm(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create category"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editForm.name?.trim()) return;

    setLoading(true);
    setError("");

    try {
      await updateCategory(id, editForm);
      await refreshCategories();

      setEditingId(null);
      setEditForm({});
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update category"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    setLoading(true);
    setError("");

    try {
      await deleteCategory(id);
      await refreshCategories();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete category"
      );
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category._id);
    setEditForm({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      isActive: category.isActive,
    });
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Category Management
        </h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm dark:bg-red-900/30 dark:border-red-800 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Create Form */}
      {showCreateForm && (
        <form
          onSubmit={handleCreate}
          className="mb-6 p-4 bg-gray-50 rounded-lg dark:bg-gray-800"
        >
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
            Create New Category
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Category name"
              value={createForm.name}
              onChange={(e) =>
                setCreateForm((prev) => ({ ...prev, name: e.target.value }))
              }
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              required
            />
            <input
              type="text"
              placeholder="Slug (optional)"
              value={createForm.slug}
              onChange={(e) =>
                setCreateForm((prev) => ({ ...prev, slug: e.target.value }))
              }
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <textarea
            placeholder="Description (optional)"
            value={createForm.description}
            onChange={(e) =>
              setCreateForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            rows={2}
            className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />
          <div className="flex gap-2 mt-3">
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create"}
            </button>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-3 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Categories List */}
      <div className="space-y-3">
        {categories.map((category) => (
          <div
            key={category._id}
            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg dark:border-gray-700"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Folder className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>

            <div className="flex-1 min-w-0">
              {editingId === category._id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editForm.name || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  />
                  <input
                    type="text"
                    value={editForm.slug || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Slug"
                  />
                </div>
              ) : (
                <>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {category.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    /{category.slug}
                  </p>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  category.isActive
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                }`}
              >
                {category.isActive ? "Active" : "Inactive"}
              </span>

              {editingId === category._id ? (
                <>
                  <button
                    onClick={() => handleUpdate(category._id)}
                    disabled={loading}
                    className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditForm({});
                    }}
                    className="p-1 text-gray-600 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(category)}
                    className="p-1 text-gray-600 hover:text-gray-700"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    disabled={loading}
                    className="p-1 text-red-600 hover:text-red-700 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No categories found. Create your first category above.
          </div>
        )}
      </div>
    </div>
  );
}
