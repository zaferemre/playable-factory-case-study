"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ProductLayout from "./ProductLayout";

export default function ProductDetailsPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const { firebaseUser, backendUserId } = useAuth();

  return (
    <ProductLayout
      slug={slug}
      backendUserId={backendUserId}
      firebaseUser={firebaseUser}
    />
  );
}
