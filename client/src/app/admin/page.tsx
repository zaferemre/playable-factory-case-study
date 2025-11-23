"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { Product, Order, User } from "@/lib/types/types";
import {
  getAdminOverview,
  getAdminProducts,
  updateAdminProduct,
  createAdminProduct,
  deleteAdminProduct,
  getAdminOrdersForUser,
  searchAdminUsers,
  type AdminOverview,
  type AdminCreateProductInput,
} from "@/lib/api/adminApi";

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

export default function AdminDashboardPage() {
  const { backendUser, loading: authLoading } = useAuth();

  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [error, setError] = useState("");

  const [newProduct, setNewProduct] = useState<NewProductFormState>({
    name: "",
    slug: "",
    price: "",
    currency: "TRY",
    category: "",
    stockQuantity: "",
    description: "",
    imageUrls: "",
  });

  const [savingProduct, setSavingProduct] = useState(false);
  const [updatingProductId, setUpdatingProductId] = useState<string | null>(
    null
  );

  const [userQuery, setUserQuery] = useState("");
  const [userSearchResults, setUserSearchResults] = useState<User[]>([]);
  const [userSearchLoading, setUserSearchLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserOrders, setSelectedUserOrders] = useState<Order[]>([]);
  const [selectedUserOrdersLoading, setSelectedUserOrdersLoading] =
    useState(false);

  useEffect(() => {
    if (!backendUser || backendUser.role !== "admin") return;

    const load = async () => {
      setError("");

      try {
        setOverviewLoading(true);
        const ov = await getAdminOverview();
        setOverview(ov);
      } catch (err: any) {
        console.error("getAdminOverview error", err);
        setError(err?.message || "Failed to load admin overview");
      } finally {
        setOverviewLoading(false);
      }

      try {
        setProductsLoading(true);
        const list = await getAdminProducts();
        setProducts(list);
      } catch (err: any) {
        console.error("getAdminProducts error", err);
        setError((prev) => prev || "Failed to load products");
      } finally {
        setProductsLoading(false);
      }
    };

    void load();
  }, [backendUser]);

  const handleProductFieldChange = (
    productId: string,
    field: keyof Product,
    value: string | number | boolean
  ) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === productId ? { ...p, [field]: value } : p))
    );
  };

  const handleToggleProductActive = async (productId: string) => {
    const target = products.find((p) => p._id === productId);
    if (!target) return;

    const newActive = !target.isActive;

    setUpdatingProductId(productId);
    setError("");
    try {
      const updated = await updateAdminProduct(productId, {
        isActive: newActive,
      });
      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? updated : p))
      );
    } catch (err: any) {
      console.error("updateAdminProduct active error", err);
      setError(err?.message || "Failed to update product");
    } finally {
      setUpdatingProductId(null);
    }
  };

  const handleUpdateProductStock = async (productId: string) => {
    const target = products.find((p) => p._id === productId);
    if (!target) return;

    setUpdatingProductId(productId);
    setError("");
    try {
      const updated = await updateAdminProduct(productId, {
        stockQuantity: target.stockQuantity,
      });
      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? updated : p))
      );
    } catch (err: any) {
      console.error("updateAdminProduct stock error", err);
      setError(err?.message || "Failed to update stock");
    } finally {
      setUpdatingProductId(null);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Delete this product permanently")) return;

    setUpdatingProductId(productId);
    setError("");
    try {
      await deleteAdminProduct(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err: any) {
      console.error("deleteAdminProduct error", err);
      setError(err?.message || "Failed to delete product");
    } finally {
      setUpdatingProductId(null);
    }
  };

  const handleNewProductChange = (
    field: keyof NewProductFormState,
    value: string
  ) => {
    setNewProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateProduct = async () => {
    if (
      !newProduct.name ||
      !newProduct.slug ||
      !newProduct.price ||
      !newProduct.category ||
      !newProduct.stockQuantity
    ) {
      setError("Please fill required product fields");
      return;
    }

    const payload: AdminCreateProductInput = {
      name: newProduct.name,
      slug: newProduct.slug,
      price: Number(newProduct.price),
      currency: newProduct.currency || "TRY",
      category: newProduct.category,
      stockQuantity: Number(newProduct.stockQuantity),
      description: newProduct.description || undefined,
      imageUrls: newProduct.imageUrls
        ? newProduct.imageUrls
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      isActive: true,
    };

    setSavingProduct(true);
    setError("");
    try {
      const created = await createAdminProduct(payload);
      setProducts((prev) => [created, ...prev]);
      setNewProduct({
        name: "",
        slug: "",
        price: "",
        currency: "TRY",
        category: "",
        stockQuantity: "",
        description: "",
        imageUrls: "",
      });
    } catch (err: any) {
      console.error("createAdminProduct error", err);
      setError(err?.message || "Failed to create product");
    } finally {
      setSavingProduct(false);
    }
  };

  const handleSearchUsers = async () => {
    if (!userQuery.trim()) {
      setUserSearchResults([]);
      setSelectedUser(null);
      setSelectedUserOrders([]);
      return;
    }

    setUserSearchLoading(true);
    setError("");

    try {
      const res = await searchAdminUsers(userQuery.trim());

      // Normalize result
      const users = Array.isArray(res)
        ? res
        : Array.isArray(res?.users)
        ? res.users
        : [];

      // Force array, no matter what
      setUserSearchResults([...users]);
    } catch (err: any) {
      console.error("searchAdminUsers error", err);
      setError(err?.message || "Failed to search users");
      setUserSearchResults([]); // fallback
    } finally {
      setUserSearchLoading(false);
    }
  };

  const handleSelectUser = async (user: User) => {
    setSelectedUser(user);
    setSelectedUserOrders([]);
    setSelectedUserOrdersLoading(true);
    setError("");

    try {
      const orders = await getAdminOrdersForUser(user._id);
      setSelectedUserOrders(orders);
    } catch (err: any) {
      console.error("getAdminOrdersForUser error", err);
      setError(err?.message || "Failed to load user orders");
    } finally {
      setSelectedUserOrdersLoading(false);
    }
  };

  if (authLoading) {
    return (
      <section className="p-6">
        <p className="text-sm text-slate-600">Checking admin access...</p>
      </section>
    );
  }

  if (!backendUser || backendUser.role !== "admin") {
    return (
      <section className="p-6">
        <h1 className="text-xl font-semibold mb-2">Admin access required</h1>
        <p className="text-sm text-slate-600">
          You must be logged in as an admin to view this page.
        </p>
      </section>
    );
  }

  return (
    <section className="p-6 flex flex-col gap-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Admin dashboard</h1>
          <p className="text-sm text-slate-600">
            Manage products, view orders and inspect customer activity.
          </p>
        </div>

        <div className="rounded border bg-white px-3 py-2 text-[11px] space-y-1 max-w-xs">
          <p className="font-semibold">Signed in</p>
          <p className="text-slate-700">
            {backendUser.name} ({backendUser.email})
          </p>
          <p className="text-slate-500">Role admin</p>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* top overview cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">Products</p>
          <p className="text-xl font-semibold">
            {overview?.totals.products ?? 0}
          </p>
          <p className="text-[11px] text-green-700 mt-1">
            Active {overview?.totals.activeProducts ?? 0}
          </p>
          {overviewLoading && (
            <p className="text-[10px] text-slate-400 mt-1">Loading...</p>
          )}
        </div>

        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">Customers</p>
          <p className="text-xl font-semibold">{overview?.totals.users ?? 0}</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Orders {overview?.totals.orders ?? 0}
          </p>
        </div>

        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">Revenue</p>
          <p className="text-sm">
            Paid{" "}
            <span className="font-semibold">
              {overview?.totals.revenuePaid ?? 0} TRY
            </span>
          </p>
          <p className="text-[11px] text-slate-500">
            Pending {overview?.totals.revenuePending ?? 0} TRY
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        {/* products panel */}
        <div className="space-y-4">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold">Products</h2>
              {productsLoading && (
                <span className="text-[11px] text-slate-500">Loading...</span>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto text-[11px]">
              {products.length === 0 ? (
                <p className="text-slate-500">No products yet.</p>
              ) : (
                <table className="w-full border-collapse text-[11px]">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="px-2 py-1 text-left font-semibold">
                        Name
                      </th>
                      <th className="px-2 py-1 text-left font-semibold">
                        Price
                      </th>
                      <th className="px-2 py-1 text-left font-semibold">
                        Stock
                      </th>
                      <th className="px-2 py-1 text-left font-semibold">
                        Active
                      </th>
                      <th className="px-2 py-1 text-right font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p._id} className="border-b last:border-b-0">
                        <td className="px-2 py-1 align-top">
                          <div className="flex flex-col">
                            <span className="font-semibold">{p.name}</span>
                            <span className="text-[10px] text-slate-500">
                              {p.slug}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-1 align-top">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={p.price}
                              onChange={(e) =>
                                handleProductFieldChange(
                                  p._id,
                                  "price",
                                  Number(e.target.value)
                                )
                              }
                              className="w-16 rounded border px-1 py-[2px]"
                            />
                            <span className="text-[10px] text-slate-500">
                              {p.currency}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-1 align-top">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={p.stockQuantity}
                              onChange={(e) =>
                                handleProductFieldChange(
                                  p._id,
                                  "stockQuantity",
                                  Number(e.target.value)
                                )
                              }
                              className="w-16 rounded border px-1 py-[2px]"
                            />
                            <button
                              onClick={() => handleUpdateProductStock(p._id)}
                              className="text-[10px] text-slate-600 hover:underline"
                              disabled={updatingProductId === p._id}
                            >
                              {updatingProductId === p._id
                                ? "Saving..."
                                : "Save"}
                            </button>
                          </div>
                        </td>
                        <td className="px-2 py-1 align-top">
                          <button
                            onClick={() => handleToggleProductActive(p._id)}
                            className={`text-[10px] px-2 py-[2px] rounded ${
                              p.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                            disabled={updatingProductId === p._id}
                          >
                            {p.isActive ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="px-2 py-1 text-right align-top">
                          <button
                            onClick={() => handleDeleteProduct(p._id)}
                            className="text-[10px] text-red-500 hover:underline"
                            disabled={updatingProductId === p._id}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold mb-2">Create product</h3>
            <div className="grid gap-2 md:grid-cols-2 text-[11px]">
              <div>
                <label className="block mb-1 text-slate-600">Name</label>
                <input
                  value={newProduct.name}
                  onChange={(e) =>
                    handleNewProductChange("name", e.target.value)
                  }
                  className="w-full rounded border px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1 text-slate-600">Slug</label>
                <input
                  value={newProduct.slug}
                  onChange={(e) =>
                    handleNewProductChange("slug", e.target.value)
                  }
                  className="w-full rounded border px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1 text-slate-600">Price</label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) =>
                    handleNewProductChange("price", e.target.value)
                  }
                  className="w-full rounded border px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1 text-slate-600">Currency</label>
                <input
                  value={newProduct.currency}
                  onChange={(e) =>
                    handleNewProductChange("currency", e.target.value)
                  }
                  className="w-full rounded border px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1 text-slate-600">Category id</label>
                <input
                  value={newProduct.category}
                  onChange={(e) =>
                    handleNewProductChange("category", e.target.value)
                  }
                  className="w-full rounded border px-2 py-1"
                  placeholder="Mongo id of category"
                />
              </div>
              <div>
                <label className="block mb-1 text-slate-600">
                  Stock quantity
                </label>
                <input
                  type="number"
                  value={newProduct.stockQuantity}
                  onChange={(e) =>
                    handleNewProductChange("stockQuantity", e.target.value)
                  }
                  className="w-full rounded border px-2 py-1"
                />
              </div>
            </div>

            <div className="mt-2 space-y-2 text-[11px]">
              <div>
                <label className="block mb-1 text-slate-600">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) =>
                    handleNewProductChange("description", e.target.value)
                  }
                  className="w-full rounded border px-2 py-1"
                  rows={2}
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-600">
                  Image urls (comma separated)
                </label>
                <input
                  value={newProduct.imageUrls}
                  onChange={(e) =>
                    handleNewProductChange("imageUrls", e.target.value)
                  }
                  className="w-full rounded border px-2 py-1"
                />
              </div>

              <button
                onClick={handleCreateProduct}
                disabled={savingProduct}
                className="mt-1 rounded bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white hover:bg-slate-800 disabled:bg-slate-400"
              >
                {savingProduct ? "Creating..." : "Create product"}
              </button>
            </div>
          </div>
        </div>

        {/* right side: recent orders and user search */}
        <div className="space-y-4">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold">Recent orders</h2>
              {overviewLoading && (
                <span className="text-[11px] text-slate-500">Loading...</span>
              )}
            </div>
            <div className="space-y-2 text-[11px] max-h-64 overflow-y-auto">
              {overview?.recentOrders && overview.recentOrders.length > 0 ? (
                overview.recentOrders.map((o) => (
                  <div
                    key={o._id}
                    className="border rounded p-2 flex flex-col gap-1"
                  >
                    <div className="flex justify-between">
                      <span className="font-semibold">
                        Order {o._id.slice(-8)}
                      </span>
                      <span className="text-slate-500">
                        {new Date(o.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-600">
                      Status {o.status} · Payment {o.paymentStatus}
                    </p>
                    <p className="font-semibold">
                      {o.totalAmount} {o.currency}
                    </p>
                    <p className="text-slate-500">Items {o.items.length}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">No orders yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold mb-2">Search users</h2>
            <div className="flex gap-2 text-[11px] mb-3">
              <input
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Search by email or name"
                className="flex-1 rounded border px-2 py-1"
              />
              <button
                onClick={handleSearchUsers}
                className="rounded bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white hover:bg-slate-800"
              >
                Search
              </button>
            </div>

            {userSearchLoading && (
              <p className="text-[11px] text-slate-500 mb-2">Searching...</p>
            )}

            <div className="space-y-2 text-[11px] max-h-32 overflow-y-auto mb-3">
              {userSearchResults.map((u) => (
                <button
                  key={u._id}
                  onClick={() => handleSelectUser(u)}
                  className={`w-full text-left border rounded p-2 hover:bg-slate-50 ${
                    selectedUser?._id === u._id ? "border-slate-600" : ""
                  }`}
                >
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-slate-600">{u.email}</p>
                  <p className="text-slate-500 text-[10px]">
                    Role {u.role} · Addresses {u.addresses?.length ?? 0}
                  </p>
                </button>
              ))}
              {userSearchResults.length === 0 &&
                userQuery &&
                !userSearchLoading && (
                  <p className="text-slate-500 text-[11px]">No users found.</p>
                )}
            </div>

            {selectedUser && (
              <div className="border-t pt-3 mt-2 text-[11px]">
                <p className="font-semibold mb-1">
                  Orders for {selectedUser.name}
                </p>
                {selectedUserOrdersLoading ? (
                  <p className="text-slate-500">Loading orders...</p>
                ) : selectedUserOrders.length === 0 ? (
                  <p className="text-slate-500">No orders.</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedUserOrders.map((o) => (
                      <div
                        key={o._id}
                        className="border rounded p-2 flex flex-col gap-1"
                      >
                        <div className="flex justify-between">
                          <span className="font-semibold">
                            Order {o._id.slice(-8)}
                          </span>
                          <span className="text-slate-500">
                            {new Date(o.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-600">
                          Status {o.status} · Payment {o.paymentStatus}
                        </p>
                        <p className="font-semibold">
                          {o.totalAmount} {o.currency}
                        </p>
                        <p className="text-slate-500">Items {o.items.length}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
