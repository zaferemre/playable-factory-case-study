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
import type { OrderAddress } from "@/lib/types/types";

export default function OrderPage() {
  const params = useParams<{ clientOrderId: string }>();
  const clientOrderId = params.clientOrderId;
  const router = useRouter();
  const { user } = useAuth();

  const [draft, setDraft] = useState<OrderDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [address, setAddress] = useState<OrderAddress>({
    fullName: "",
    line1: "",
    city: "",
    postalCode: "",
    country: "",
    line2: "",
    state: "",
    phone: "",
  });

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

  const handleAddressChange = (field: keyof OrderAddress, value: string) => {
    setAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePlaceOrder = async () => {
    if (!draft) return;

    setError("");
    setSuccessMessage("");

    if (!user) {
      setError("You need to be logged in to place an order.");
      return;
    }

    const backendUserId = (() => {
      const bytes = crypto.getRandomValues(new Uint8Array(12));
      return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    })();

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

    setPlacing(true);
    try {
      const order = await createOrder({
        user: backendUserId,
        items,
        totalAmount: draft.totalAmount,
        currency: draft.currency,
        shippingAddress: {
          fullName: address.fullName,
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
          phone: address.phone,
        },
        clientOrderId,
      });

      deleteOrderDraft(clientOrderId);
      setSuccessMessage("Order created successfully.");
      // you can redirect to a confirmation page if you like
      console.log("Created order", order);
    } catch (err: any) {
      console.error("createOrder error", err);
      setError(err?.message || "Failed to place order.");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
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
