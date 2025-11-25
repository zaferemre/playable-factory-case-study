"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import OrderLayout from "@/components/order/OrderLayout";

export default function OrderPage() {
  const params = useParams<{ clientOrderId: string }>();
  const clientOrderId = params.clientOrderId;

  const {
    backendUserId,
    backendUser,
    firebaseUser,
    loading: authLoading,
  } = useAuth();

  return (
    <OrderLayout
      clientOrderId={clientOrderId}
      backendUserId={backendUserId}
      backendUser={backendUser}
      firebaseUser={firebaseUser}
      authLoading={authLoading}
    />
  );
}
