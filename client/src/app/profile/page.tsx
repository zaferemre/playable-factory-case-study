"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useProfileData } from "@/lib/hooks/useProfileData";
import {
  ProfileHeader,
  ProfileAddressManager,
  ProfileOrderHistory,
  ProfileReviewsList,
} from "@/components/profile";

export default function ProfilePage() {
  const { backendUser, backendUserId } = useAuth();

  const {
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
  } = useProfileData({
    backendUser,
    backendUserId,
  });

  if (!backendUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Please sign in to view your profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileHeader
          userProfile={userProfile}
          orders={orders}
          reviews={reviews}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <ProfileAddressManager
              userProfile={userProfile}
              newAddress={newAddress}
              addressesLoading={addressesLoading}
              error={error}
              onAddressFieldChange={handleAddressFieldChange}
              onAddAddress={handleAddAddress}
              onDeleteAddress={handleDeleteAddress}
              onSetDefaultAddress={handleSetDefaultAddress}
              onClearError={clearError}
            />
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            <ProfileOrderHistory
              orders={orders}
              ordersLoading={ordersLoading}
            />

            <ProfileReviewsList
              reviews={reviews}
              reviewsLoading={reviewsLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
