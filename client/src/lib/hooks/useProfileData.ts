import { useEffect, useState } from "react";
import type { User, UserAddress, Order, Review } from "@/lib/types/types";
import {
  getUserById,
  addUserAddress,
  deleteUserAddress,
  setDefaultUserAddress,
} from "@/lib/api/userApi";
import { getOrdersForUser } from "@/lib/api/orderApi";
import { listReviews } from "@/lib/api/reviewApi";

interface UseProfileDataProps {
  backendUser?: User | null;
  backendUserId?: string | null;
}

export function useProfileData({
  backendUser,
  backendUserId,
}: UseProfileDataProps) {
  const [userProfile, setUserProfile] = useState<User | null>(
    backendUser || null
  );
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [addressesLoading, setAddressesLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);

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

  useEffect(() => {
    if (backendUser) {
      setUserProfile(backendUser);
    }
  }, [backendUser]);

  useEffect(() => {
    if (!backendUserId) return;

    const loadProfileData = async () => {
      setError("");

      try {
        setAddressesLoading(true);
        const u = await getUserById(backendUserId);
        setUserProfile(u);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load user profile"
        );
      } finally {
        setAddressesLoading(false);
      }

      try {
        setOrdersLoading(true);
        const list = await getOrdersForUser(backendUserId);
        list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(list);
      } catch (err) {
        setError((prev) => prev || "Failed to load order history");
      } finally {
        setOrdersLoading(false);
      }

      try {
        setReviewsLoading(true);
        const data = await listReviews({ userId: backendUserId });
        const list = data.reviews || [];
        list.sort((a: Review, b: Review) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        setReviews(list);
      } catch (err) {
      } finally {
        setReviewsLoading(false);
      }
    };

    void loadProfileData();
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add address");
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete address");
    } finally {
      setAddressesLoading(false);
    }
  };

  const handleSetDefaultAddress = async (index: number) => {
    if (!backendUserId) return;
    setError("");

    try {
      setAddressesLoading(true);
      const updated = await setDefaultUserAddress(backendUserId, index);
      setUserProfile(updated);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to set default address"
      );
    } finally {
      setAddressesLoading(false);
    }
  };

  const clearError = () => setError("");

  return {
    userProfile,
    orders,
    reviews,
    addressesLoading,
    ordersLoading,
    reviewsLoading,
    error,
    newAddress,
    handleAddressFieldChange,
    handleAddAddress,
    handleDeleteAddress,
    handleSetDefaultAddress,
    clearError,
  };
}
