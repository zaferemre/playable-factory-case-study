"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { User, UserAddress, Order } from "@/lib/types/types";
import {
  getUserById,
  addUserAddress,
  deleteUserAddress,
} from "@/lib/api/userApi";
import { getOrdersForUser } from "@/lib/api/orderApi";

interface PaymentMethod {
  id: string;
  label: string;
  brand: string;
  last4: string;
  expiry: string;
  isDefault?: boolean;
}

function generateId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

export default function ProfilePage() {
  const {
    firebaseUser,
    backendUser,
    backendUserId,
    loading: authLoading,
    loginWithGoogle,
  } = useAuth();

  const [userProfile, setUserProfile] = useState<User | null>(backendUser);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState("");

  const [newAddress, setNewAddress] = useState<UserAddress>({
    fullName: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
    label: "",
    isDefault: false,
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [newPayment, setNewPayment] = useState<PaymentMethod>({
    id: "",
    label: "",
    brand: "",
    last4: "",
    expiry: "",
    isDefault: false,
  });

  useEffect(() => {
    if (backendUser) {
      setUserProfile(backendUser);
    }
  }, [backendUser]);

  useEffect(() => {
    if (!backendUserId) return;

    const loadProfileAndOrders = async () => {
      setError("");

      try {
        setAddressesLoading(true);
        const u = await getUserById(backendUserId);
        setUserProfile(u);
      } catch (err: any) {
        console.error("getUserById error", err);
        setError(err?.message || "Failed to load user profile");
      } finally {
        setAddressesLoading(false);
      }

      try {
        setOrdersLoading(true);
        const list = await getOrdersForUser(backendUserId);
        setOrders(list);
      } catch (err: any) {
        console.error("getOrdersForUser error", err);
        setError((prev) => prev || "Failed to load order history");
      } finally {
        setOrdersLoading(false);
      }
    };

    loadProfileAndOrders();
  }, [backendUserId]);

  const handleAddressFieldChange = (
    field: keyof UserAddress,
    value: string | boolean
  ) => {
    setNewAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddAddress = async () => {
    if (!backendUserId) {
      setError("You need to be logged in to add an address.");
      return;
    }

    if (
      !newAddress.fullName ||
      !newAddress.line1 ||
      !newAddress.city ||
      !newAddress.postalCode ||
      !newAddress.country
    ) {
      setError("Please fill out required address fields.");
      return;
    }

    setError("");
    try {
      setAddressesLoading(true);
      const updated = await addUserAddress(backendUserId, newAddress);
      setUserProfile(updated);
      setNewAddress({
        fullName: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        phone: "",
        label: "",
        isDefault: false,
      });
    } catch (err: any) {
      console.error("addUserAddress error", err);
      setError(err?.message || "Failed to add address");
    } finally {
      setAddressesLoading(false);
    }
  };

  const handleDeleteAddress = async (index: number) => {
    if (!backendUserId) return;
    setError("");

    try {
      setAddressesLoading(true);
      const updated = await deleteUserAddress(backendUserId, index);
      setUserProfile(updated);
    } catch (err: any) {
      console.error("deleteUserAddress error", err);
      setError(err?.message || "Failed to delete address");
    } finally {
      setAddressesLoading(false);
    }
  };

  const handleAddPayment = () => {
    if (!newPayment.brand || !newPayment.last4 || !newPayment.expiry) {
      setError("Please fill payment brand, last 4 digits and expiry.");
      return;
    }

    setError("");
    const id = generateId();

    setPaymentMethods((prev) => {
      const base = newPayment.isDefault
        ? prev.map((m) => ({ ...m, isDefault: false }))
        : prev;

      return [
        ...base,
        {
          ...newPayment,
          id,
        },
      ];
    });

    setNewPayment({
      id: "",
      label: "",
      brand: "",
      last4: "",
      expiry: "",
      isDefault: false,
    });
  };

  const handleDeletePayment = (id: string) => {
    setPaymentMethods((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSetDefaultPayment = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((m) => ({
        ...m,
        isDefault: m.id === id,
      }))
    );
  };

  if (authLoading) {
    return (
      <section className="p-6">
        <p className="text-sm text-slate-600">Checking login...</p>
      </section>
    );
  }

  if (!firebaseUser) {
    return (
      <section className="p-6 flex flex-col gap-4">
        <h1 className="text-xl font-semibold">Login required</h1>
        <p className="text-sm text-slate-600">
          Please log in to access your profile, addresses and order history.
        </p>

        <button
          onClick={loginWithGoogle}
          className="rounded bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
        >
          Login with Google
        </button>
      </section>
    );
  }

  if (!backendUserId) {
    return (
      <section className="p-6">
        <p className="text-sm text-slate-600">
          Connecting your account, please wait a moment.
        </p>
      </section>
    );
  }

  return (
    <section className="p-6 flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="text-sm text-slate-600">
            Manage your addresses, payment methods and view your order history.
          </p>
        </div>

        <div className="rounded border bg-white px-3 py-2 text-[11px] space-y-1 max-w-xs">
          <p className="font-semibold">Status</p>
          <p className="text-slate-700">Logged in as {firebaseUser.email}</p>
          <p className="text-slate-500">Backend user connected.</p>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-4 shadow-sm md:col-span-2">
          <h2 className="text-sm font-semibold mb-2">Account</h2>
          <p className="text-xs text-slate-700">
            <span className="font-semibold">Name </span>
            {firebaseUser.displayName ||
              userProfile?.name ||
              "(no name on file)"}
          </p>
          <p className="text-xs text-slate-700">
            <span className="font-semibold">Email </span>
            {firebaseUser.email}
          </p>
          {userProfile && (
            <p className="text-xs text-slate-500 mt-1">
              Role {userProfile.role}
            </p>
          )}
        </div>

        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold mb-2">Summary</h2>
          <p className="text-xs text-slate-700">
            Addresses {userProfile?.addresses?.length ?? 0}
          </p>
          <p className="text-xs text-slate-700">Orders {orders.length}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* addresses */}
        <div className="space-y-4">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold">Addresses</h2>
              {addressesLoading && (
                <span className="text-[11px] text-slate-500">Saving...</span>
              )}
            </div>

            <div className="space-y-2">
              {userProfile?.addresses && userProfile.addresses.length > 0 ? (
                userProfile.addresses.map((addr, index) => (
                  <div
                    key={index}
                    className="border rounded p-2 text-[11px] flex justify-between gap-2"
                  >
                    <div>
                      <p className="font-semibold">
                        {addr.label || "Address"}{" "}
                        {addr.isDefault && (
                          <span className="ml-1 rounded bg-green-100 px-2 py-[1px] text-[10px] font-semibold text-green-700">
                            Default
                          </span>
                        )}
                      </p>
                      <p>{addr.fullName}</p>
                      <p>{addr.line1}</p>
                      {addr.line2 && <p>{addr.line2}</p>}
                      <p>
                        {addr.postalCode} {addr.city}
                        {addr.state ? `, ${addr.state}` : ""}
                      </p>
                      <p>{addr.country}</p>
                      {addr.phone && <p>Phone {addr.phone}</p>}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <button
                        onClick={() => handleDeleteAddress(index)}
                        className="text-[10px] text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-slate-500">
                  No addresses yet. Add one below.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <h3 className="text-xs font-semibold mb-2">Add address</h3>
            <div className="space-y-2 text-[11px]">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 text-slate-600">Label</label>
                  <input
                    value={newAddress.label || ""}
                    onChange={(e) =>
                      handleAddressFieldChange("label", e.target.value)
                    }
                    className="w-full rounded border px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-600">Full name</label>
                  <input
                    value={newAddress.fullName}
                    onChange={(e) =>
                      handleAddressFieldChange("fullName", e.target.value)
                    }
                    className="w-full rounded border px-2 py-1"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-600">
                  Address line 1
                </label>
                <input
                  value={newAddress.line1}
                  onChange={(e) =>
                    handleAddressFieldChange("line1", e.target.value)
                  }
                  className="w-full rounded border px-2 py-1"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-600">
                  Address line 2
                </label>
                <input
                  value={newAddress.line2 || ""}
                  onChange={(e) =>
                    handleAddressFieldChange("line2", e.target.value)
                  }
                  className="w-full rounded border px-2 py-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 text-slate-600">City</label>
                  <input
                    value={newAddress.city}
                    onChange={(e) =>
                      handleAddressFieldChange("city", e.target.value)
                    }
                    className="w-full rounded border px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-600">State</label>
                  <input
                    value={newAddress.state || ""}
                    onChange={(e) =>
                      handleAddressFieldChange("state", e.target.value)
                    }
                    className="w-full rounded border px-2 py-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 text-slate-600">
                    Postal code
                  </label>
                  <input
                    value={newAddress.postalCode}
                    onChange={(e) =>
                      handleAddressFieldChange("postalCode", e.target.value)
                    }
                    className="w-full rounded border px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-600">Country</label>
                  <input
                    value={newAddress.country}
                    onChange={(e) =>
                      handleAddressFieldChange("country", e.target.value)
                    }
                    className="w-full rounded border px-2 py-1"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-600">Phone</label>
                <input
                  value={newAddress.phone || ""}
                  onChange={(e) =>
                    handleAddressFieldChange("phone", e.target.value)
                  }
                  className="w-full rounded border px-2 py-1"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="default-address"
                  type="checkbox"
                  checked={newAddress.isDefault ?? false}
                  onChange={(e) =>
                    handleAddressFieldChange("isDefault", e.target.checked)
                  }
                  className="h-3 w-3"
                />
                <label
                  htmlFor="default-address"
                  className="text-[11px] text-slate-700"
                >
                  Set as default address
                </label>
              </div>

              <button
                onClick={handleAddAddress}
                className="mt-2 w-full rounded bg-slate-900 py-2 text-[11px] font-semibold text-white hover:bg-slate-800"
              >
                Add address
              </button>
            </div>
          </div>
        </div>

        {/* payment methods and order history */}
        <div className="space-y-4">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold mb-2">
              Saved payment methods (mock)
            </h2>

            <div className="space-y-2 text-[11px] mb-3">
              {paymentMethods.length === 0 ? (
                <p className="text-slate-500">
                  No payment methods yet. These are stored only in your browser
                  for demo purposes.
                </p>
              ) : (
                paymentMethods.map((pm) => (
                  <div
                    key={pm.id}
                    className="border rounded p-2 flex justify-between gap-2"
                  >
                    <div>
                      <p className="font-semibold">
                        {pm.label || pm.brand} ending in {pm.last4}{" "}
                        {pm.isDefault && (
                          <span className="ml-1 rounded bg-green-100 px-2 py-[1px] text-[10px] font-semibold text-green-700">
                            Default
                          </span>
                        )}
                      </p>
                      <p className="text-slate-500">
                        {pm.brand} · Expires {pm.expiry}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {!pm.isDefault && (
                        <button
                          onClick={() => handleSetDefaultPayment(pm.id)}
                          className="text-[10px] text-slate-500 hover:underline"
                        >
                          Set default
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePayment(pm.id)}
                        className="text-[10px] text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t pt-3 mt-2 text-[11px] space-y-2">
              <p className="font-semibold">Add payment method (mock)</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 text-slate-600">Label</label>
                  <input
                    value={newPayment.label}
                    onChange={(e) =>
                      setNewPayment((prev) => ({
                        ...prev,
                        label: e.target.value,
                      }))
                    }
                    className="w-full rounded border px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-600">Brand</label>
                  <input
                    value={newPayment.brand}
                    onChange={(e) =>
                      setNewPayment((prev) => ({
                        ...prev,
                        brand: e.target.value,
                      }))
                    }
                    className="w-full rounded border px-2 py-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 text-slate-600">
                    Last 4 digits
                  </label>
                  <input
                    value={newPayment.last4}
                    onChange={(e) =>
                      setNewPayment((prev) => ({
                        ...prev,
                        last4: e.target.value,
                      }))
                    }
                    className="w-full rounded border px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-600">Expiry</label>
                  <input
                    value={newPayment.expiry}
                    onChange={(e) =>
                      setNewPayment((prev) => ({
                        ...prev,
                        expiry: e.target.value,
                      }))
                    }
                    placeholder="08/27"
                    className="w-full rounded border px-2 py-1"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="default-payment"
                  type="checkbox"
                  checked={newPayment.isDefault ?? false}
                  onChange={(e) =>
                    setNewPayment((prev) => ({
                      ...prev,
                      isDefault: e.target.checked,
                    }))
                  }
                  className="h-3 w-3"
                />
                <label
                  htmlFor="default-payment"
                  className="text-[11px] text-slate-700"
                >
                  Set as default payment method
                </label>
              </div>

              <button
                onClick={handleAddPayment}
                className="mt-2 w-full rounded bg-slate-900 py-2 text-[11px] font-semibold text-white hover:bg-slate-800"
              >
                Add payment method
              </button>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold">Order history</h2>
              {ordersLoading && (
                <span className="text-[11px] text-slate-500">Loading...</span>
              )}
            </div>

            <div className="space-y-2 text-[11px]">
              {orders.length === 0 ? (
                <p className="text-slate-500">No orders yet.</p>
              ) : (
                orders.map((order) => (
                  <div key={order._id} className="border rounded p-2 space-y-1">
                    <div className="flex justify-between">
                      <p className="font-semibold">
                        Order {order._id.slice(-8)}
                      </p>
                      <p className="text-slate-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-slate-600">
                      Status {order.status} · Payment {order.paymentStatus}
                    </p>
                    <p className="font-semibold">
                      Total {order.totalAmount} {order.currency}
                    </p>
                    <p className="text-slate-500">Items {order.items.length}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
