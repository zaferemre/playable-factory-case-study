"use client";

import { useEffect, useState } from "react";
import {
  loadOrderDraft,
  deleteOrderDraft,
  type OrderDraft,
} from "@/lib/orderDraftClient";
import { createOrder, type CreateOrderItemInput } from "@/lib/api/orderApi";
import { clearCart, getOrCreateCartSessionId } from "@/lib/api/cartApi";
import { useAppDispatch } from "@/lib/store/hooks";
import { clearCartLocal } from "@/lib/store/cartSlice";
import type { OrderAddress, UserAddress, User } from "@/lib/types/types";

interface FirebaseUserLike {
  email?: string | null;
}

export interface UseCheckoutParams {
  clientOrderId: string;
  backendUserId?: string | null;
  backendUser?: User | null;
  firebaseUser?: FirebaseUserLike | null;
  authLoading: boolean;
}

export interface UseCheckoutResult {
  loading: boolean;
  authLoading: boolean;
  placing: boolean;
  draft: OrderDraft | null;
  error: string;
  successMessage: string;
  address: OrderAddress;
  savedAddresses: UserAddress[];
  backendUserId?: string | null;
  userEmail: string;
  handleAddressChange: (field: keyof OrderAddress, value: string) => void;
  handleUseSavedAddress: (addr: UserAddress) => void;
  handlePlaceOrder: () => Promise<void>;
}

export function useCheckout({
  clientOrderId,
  backendUserId,
  backendUser,
  firebaseUser,
  authLoading,
}: UseCheckoutParams): UseCheckoutResult {
  const dispatch = useAppDispatch();

  const [draft, setDraft] = useState<OrderDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [sessionId, setSessionId] = useState<string>("");

  const [address, setAddress] = useState<OrderAddress>({
    fullName: "",
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

  const userEmail = backendUser?.email || firebaseUser?.email || "";

  // guest session id
  useEffect(() => {
    const id = getOrCreateCartSessionId();
    setSessionId(id);
  }, []);

  // load order draft from local storage
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

  // prefill name and email from backend user
  useEffect(() => {
    if (!backendUser) return;

    setAddress((prev) => ({
      ...prev,
      fullName: prev.fullName || backendUser.name,
      email: prev.email || backendUser.email,
    }));
  }, [backendUser]);

  // load and apply saved addresses
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
    }));
  }, [backendUser, backendUserId]);

  const handleAddressChange = (field: keyof OrderAddress, value: string) => {
    setAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUseSavedAddress = (addr: UserAddress) => {
    setAddress((prev) => ({
      ...prev,
      fullName: addr.fullName,
      line1: addr.line1,
      line2: addr.line2 || "",
      city: addr.city,
      state: addr.state || "",
      postalCode: addr.postalCode,
      country: addr.country,
      phone: addr.phone || "",
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

    const shippingAddress: OrderAddress = {
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

      dispatch(clearCartLocal());

      void clearCart({
        userId: backendUserId || undefined,
        sessionId: backendUserId ? undefined : sessionId || undefined,
      }).catch((err) => {
        console.error("Failed to clear backend cart after order", err);
      });

      deleteOrderDraft(clientOrderId);
      setSuccessMessage("Order created successfully.");
      console.log("Created order", order);
      // navigation is handled by the container if needed
    } catch (err: any) {
      console.error("createOrder error", err);
      setError(err?.message || "Failed to place order.");
    } finally {
      setPlacing(false);
    }
  };

  return {
    loading,
    authLoading,
    placing,
    draft,
    error,
    successMessage,
    address,
    savedAddresses,
    backendUserId,
    userEmail,
    handleAddressChange,
    handleUseSavedAddress,
    handlePlaceOrder,
  };
}
