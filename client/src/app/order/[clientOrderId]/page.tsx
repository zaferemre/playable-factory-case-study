"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  loadOrderDraft,
  deleteOrderDraft,
  type OrderDraft,
} from "@/lib/orderDraftClient";
import { createOrder, type CreateOrderItemInput } from "@/lib/api/orderApi";
import type { OrderAddress, UserAddress } from "@/lib/types/types";

// cart clearing
import { useAppDispatch } from "@/lib/store/hooks";
import { clearCartLocal } from "@/lib/store/cartSlice";
import { clearCart, getOrCreateCartSessionId } from "@/lib/api/cartApi";

export default function OrderPage() {
  const params = useParams<{ clientOrderId: string }>();
  const clientOrderId = params.clientOrderId;
  const router = useRouter();

  const {
    backendUserId,
    backendUser,
    firebaseUser,
    loading: authLoading,
  } = useAuth();

  const dispatch = useAppDispatch();

  const [draft, setDraft] = useState<OrderDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [address, setAddress] = useState<OrderAddress>({
    fullName: "",
    // OrderAddress in types should have email?: string
    // if not, add it there to match backend IOrderAddress
    // email is useful for guest checkout
    email: "",
    line1: "",
    city: "",
    postalCode: "",
    country: "",
    line2: "",
    state: "",
    phone: "",
  });

  const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>([]);
  const [sessionId, setSessionId] = useState<string>("");

  // get or create guest session id on mount
  useEffect(() => {
    const id = getOrCreateCartSessionId();
    setSessionId(id);
  }, []);

  // load order draft
  useEffect(() => {
    if (!clientOrderId) return;

    const draftData = loadOrderDraft(clientOrderId);
    if (!draftData) {
      setError("Order draft not found. Please start checkout again.");
      setLoading(false);
      return;
    }

    setDraft(draftData);
    setLoading(false);
  }, [clientOrderId]);

  // prefill name and email from backendUser if available
  useEffect(() => {
    if (!backendUser) return;

    setAddress((prev) => ({
      ...prev,
      fullName: prev.fullName || backendUser.name,
      email: prev.email || backendUser.email,
    }));
  }, [backendUser]);

  // hydrate saved addresses and prefill from default address if exists
  useEffect(() => {
    if (!backendUser || !backendUserId) return;
    if (!backendUser.addresses || backendUser.addresses.length === 0) return;

    setSavedAddresses(backendUser.addresses);

    const defaultAddr =
      backendUser.addresses.find((a) => a.isDefault) ??
      backendUser.addresses[0];

    if (!defaultAddr) return;

    setAddress((prev) => ({
      ...prev,
      fullName: defaultAddr.fullName,
      line1: defaultAddr.line1,
      line2: defaultAddr.line2 || "",
      city: defaultAddr.city,
      state: defaultAddr.state || "",
      postalCode: defaultAddr.postalCode,
      country: defaultAddr.country,
      phone: defaultAddr.phone || "",
      // keep email from user if we already set it
    }));
  }, [backendUser, backendUserId]);

  const handleAddressChange = (
    field: keyof OrderAddress | "email",
    value: string
  ) => {
    setAddress((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUseSavedAddress = (addr: UserAddress) => {
    setAddress((prev: any) => ({
      ...prev,
      fullName: addr.fullName,
      line1: addr.line1,
      line2: addr.line2 || "",
      city: addr.city,
      state: addr.state || "",
      postalCode: addr.postalCode,
      country: addr.country,
      phone: addr.phone || "",
      // leave email as is, from user or manual input
    }));
  };

  const handlePlaceOrder = async () => {
    if (!draft) return;

    setError("");
    setSuccessMessage("");

    if (
      !address.fullName ||
      !address.line1 ||
      !address.city ||
      !address.postalCode ||
      !address.country
    ) {
      setError("Please fill out all required address fields.");
      return;
    }

    const items: CreateOrderItemInput[] = draft.items.map((it) => ({
      product: it.productId,
      name: it.name,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      lineTotal: it.unitPrice * it.quantity,
    }));

    const base: { user?: string; sessionId?: string } = backendUserId
      ? { user: backendUserId }
      : { sessionId };

    const resolvedEmail =
      address.email || backendUser?.email || firebaseUser?.email || undefined;

    const shippingAddress: any = {
      ...address,
      email: resolvedEmail,
    };

    setPlacing(true);
    try {
      const order = await createOrder({
        ...base,
        items,
        totalAmount: draft.totalAmount,
        currency: draft.currency,
        shippingAddress,
        clientOrderId,
      });

      // clear local Redux cart
      dispatch(clearCartLocal());

      // clear backend cart for user or guest
      void clearCart({
        userId: backendUserId ?? null,
        sessionId: backendUserId ? null : sessionId || null,
      }).catch((err) => {
        console.error("Failed to clear backend cart after order", err);
      });

      deleteOrderDraft(clientOrderId);
      setSuccessMessage("Order created successfully.");
      console.log("Created order", order);
      // optional redirect to an order detail page
      // router.push(`/orders/${order._id}`);
    } catch (err: any) {
      console.error("createOrder error", err);
      setError(err?.message || "Failed to place order.");
    } finally {
      setPlacing(false);
    }
  };

  if (loading || authLoading) {
    return (
      <section className="p-6">
        <p className="text-sm text-slate-600">Loading order...</p>
      </section>
    );
  }

  if (!draft) {
    return (
      <section className="p-6">
        <h1 className="text-xl font-semibold mb-2">Order not found</h1>
        <p className="text-sm text-slate-600">
          We could not find the order draft. Please go back to the cart and try
          again.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 rounded bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
        >
          Back to home
        </button>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p className="text-sm text-slate-600">
          Review your order and provide a shipping address.
        </p>
        {backendUserId ? (
          <p className="mt-1 text-[11px] text-slate-500">
            Logged in as {backendUser?.email || firebaseUser?.email}
          </p>
        ) : (
          <p className="mt-1 text-[11px] text-slate-500">
            You are checking out as a guest.
          </p>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {successMessage && (
        <p className="text-sm text-green-600">{successMessage}</p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* order summary */}
        <div className="space-y-3 rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold">Order summary</h2>
          <p className="text-[11px] text-slate-500">
            Temporary order id {clientOrderId}
          </p>

          <div className="divide-y">
            {draft.items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between py-2 text-xs"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-slate-500">Qty {item.quantity}</span>
                </div>
                <span className="font-semibold">
                  {item.unitPrice * item.quantity} {item.currency}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-sm border-t pt-3 mt-2">
            <span>Total</span>
            <span className="font-semibold">
              {draft.totalAmount} {draft.currency}
            </span>
          </div>
        </div>

        {/* shipping address form */}
        <div className="space-y-3 rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold">Shipping address</h2>

          {/* saved addresses for logged in users */}
          {backendUserId && savedAddresses.length > 0 && (
            <div className="mb-3 rounded border bg-slate-50 p-2 max-h-40 overflow-y-auto">
              <p className="text-[11px] font-semibold text-slate-700 mb-1">
                Saved addresses
              </p>
              <div className="space-y-2">
                {savedAddresses.map((addr, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleUseSavedAddress(addr)}
                    className="w-full text-left rounded border bg-white px-2 py-2 text-[11px] hover:border-slate-400"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">
                        {addr.label || "Address"}
                      </span>
                      {addr.isDefault && (
                        <span className="ml-2 rounded bg-green-100 px-2 py-[1px] text-[10px] font-semibold text-green-700">
                          Default
                        </span>
                      )}
                    </div>
                    <p>{addr.fullName}</p>
                    <p>{addr.line1}</p>
                    {addr.line2 && <p>{addr.line2}</p>}
                    <p>
                      {addr.postalCode} {addr.city}
                      {addr.state ? `, ${addr.state}` : ""}
                    </p>
                    <p>{addr.country}</p>
                    {addr.phone && <p>Phone {addr.phone}</p>}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2 text-xs">
            <div>
              <label className="mb-1 block text-slate-600">Full name</label>
              <input
                value={address.fullName}
                onChange={(e) =>
                  handleAddressChange("fullName", e.target.value)
                }
                className="w-full rounded border px-2 py-1 text-xs"
              />
            </div>

            <div>
              <label className="mb-1 block text-slate-600">Email</label>
              <input
                // @ts-expect-error email on address
                value={address.email || ""}
                onChange={(e) => handleAddressChange("email", e.target.value)}
                className="w-full rounded border px-2 py-1 text-xs"
              />
            </div>

            <div>
              <label className="mb-1 block text-slate-600">
                Address line 1
              </label>
              <input
                value={address.line1}
                onChange={(e) => handleAddressChange("line1", e.target.value)}
                className="w-full rounded border px-2 py-1 text-xs"
              />
            </div>

            <div>
              <label className="mb-1 block text-slate-600">
                Address line 2
              </label>
              <input
                value={address.line2 || ""}
                onChange={(e) => handleAddressChange("line2", e.target.value)}
                className="w-full rounded border px-2 py-1 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-slate-600">City</label>
                <input
                  value={address.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  className="w-full rounded border px-2 py-1 text-xs"
                />
              </div>
              <div>
                <label className="mb-1 block text-slate-600">State</label>
                <input
                  value={address.state || ""}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                  className="w-full rounded border px-2 py-1 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-slate-600">Postal code</label>
                <input
                  value={address.postalCode}
                  onChange={(e) =>
                    handleAddressChange("postalCode", e.target.value)
                  }
                  className="w-full rounded border px-2 py-1 text-xs"
                />
              </div>
              <div>
                <label className="mb-1 block text-slate-600">Country</label>
                <input
                  value={address.country}
                  onChange={(e) =>
                    handleAddressChange("country", e.target.value)
                  }
                  className="w-full rounded border px-2 py-1 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-slate-600">Phone</label>
              <input
                value={address.phone || ""}
                onChange={(e) => handleAddressChange("phone", e.target.value)}
                className="w-full rounded border px-2 py-1 text-xs"
              />
            </div>
          </div>

          <button
            disabled={placing}
            onClick={handlePlaceOrder}
            className="mt-3 w-full rounded bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:bg-slate-400"
          >
            {placing ? "Placing order..." : "Place order"}
          </button>
        </div>
      </div>
    </section>
  );
}
