import { motion } from "framer-motion";
import {
  IconUser,
  IconMail,
  IconCalendar,
  IconPackage,
  IconStar,
  IconMapPin,
} from "@tabler/icons-react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import type { User, Order, Review } from "@/lib/types/types";

interface ProfileHeaderProps {
  userProfile: User | null;
  orders?: Order[];
  reviews?: Review[];
}

export function ProfileHeader({
  userProfile,
  orders = [],
  reviews = [],
}: ProfileHeaderProps) {
  const { firebaseUser } = useAuth();

  const totalSpent = orders.reduce(
    (sum, order) => sum + (order.totalAmount || 0),
    0
  );
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;
  const defaultAddress = userProfile?.addresses?.find((addr) => addr.isDefault);

  if (!userProfile && !firebaseUser) {
    return (
      <motion.div
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="animate-pulse">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="flex-1">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const displayName = userProfile?.name || firebaseUser?.displayName || "User";
  const displayEmail = userProfile?.email || firebaseUser?.email || "";
  const profilePhotoURL = userProfile?.photoUrl || firebaseUser?.photoURL;

  return (
    <motion.div
      className="bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600 p-8 mb-6 overflow-hidden relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
        <IconUser className="w-full h-full" />
      </div>

      <div className="relative">
        <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8 space-y-6 lg:space-y-0">
          {/* Profile Picture and Basic Info */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              {profilePhotoURL ? (
                <Image
                  src={profilePhotoURL}
                  alt={displayName}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-100 dark:ring-blue-900"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center ring-4 ring-blue-100 dark:ring-blue-900">
                  <span className="text-2xl font-bold text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 border-4 border-white dark:border-gray-800 rounded-full"></div>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {displayName}
              </h1>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <IconMail className="w-4 h-4" />
                  <span className="text-sm">{displayEmail}</span>
                </div>

                {userProfile?.createdAt && (
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <IconCalendar className="w-4 h-4" />
                    <span className="text-sm">
                      Member since{" "}
                      {new Date(userProfile.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {defaultAddress && (
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <IconMapPin className="w-4 h-4" />
                    <span className="text-sm">
                      {defaultAddress.city}, {defaultAddress.country}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="flex-1">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg mx-auto mb-2">
                  <IconPackage className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {orders.length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Orders
                </div>
              </div>

              <div className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg mx-auto mb-2">
                  <span className="text-green-600 dark:text-green-400 font-bold text-sm">
                    $
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${totalSpent.toFixed(0)}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Total Spent
                </div>
              </div>

              <div className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-xl p-4 text-center col-span-2 lg:col-span-1">
                <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg mx-auto mb-2">
                  <IconStar className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {averageRating > 0 ? averageRating.toFixed(1) : "—"}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Avg Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
