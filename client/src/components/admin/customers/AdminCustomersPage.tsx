"use client";

import { useState } from "react";
import type { User, Order } from "@/lib/types/types";
import { searchAdminUsers, getAdminOrdersForUser } from "@/lib/api/adminApi";
import {
  Search,
  Users,
  ShoppingCart,
  DollarSign,
  Calendar,
  MapPin,
  Mail,
  Package,
  TrendingUp,
} from "lucide-react";

interface CustomerCardProps {
  user: User;
  selected: boolean;
  onSelect: (user: User) => void;
}

function CustomerCard({ user, selected, onSelect }: CustomerCardProps) {
  return (
    <button
      onClick={() => onSelect(user)}
      className={`w-full p-4 text-left rounded-xl border transition-all hover:shadow-md ${
        selected
          ? "border-red-500 bg-red-50 dark:bg-red-900/30 shadow-sm"
          : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600"
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
            {user.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Mail className="h-3 w-3" />
            {user.email}
          </p>
        </div>
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            user.role === "admin"
              ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
              : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
          }`}
        >
          {user.role}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-1">
          <ShoppingCart className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600 dark:text-gray-400">
            {user.orderCount || 0} orders
          </span>
        </div>
        <div className="flex items-center gap-1">
          <DollarSign className="h-4 w-4 text-gray-400" />
          <span className="font-semibold text-gray-900 dark:text-white">
            {user.totalSpent?.toFixed(2) || "0.00"} TRY
          </span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600 dark:text-gray-400">
            {user.addresses?.length || 0} addresses
          </span>
        </div>
        {user.lastOrderAt && (
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400 text-xs">
              {new Date(user.lastOrderAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}

interface CustomerDetailsProps {
  user: User;
  orders: Order[];
  loading: boolean;
}

function CustomerDetails({ user, orders, loading }: CustomerDetailsProps) {
  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );
  const averageOrderValue =
    orders.length > 0 ? totalRevenue / orders.length : 0;
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      {/* Customer Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {user.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
            <Mail className="h-4 w-4" />
            {user.email}
          </p>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            user.role === "admin"
              ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
              : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
          }`}
        >
          {user.role}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Orders
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {user.orderCount || 0}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Spent
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {user.totalSpent?.toFixed(2) || "0.00"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">TRY</p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Avg Order
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {averageOrderValue.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">TRY</p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-red-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Addresses
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {user.addresses?.length || 0}
          </p>
        </div>
      </div>

      {/* Addresses */}
      {user.addresses && user.addresses.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Addresses
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {user.addresses.map((address, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <p className="font-medium text-gray-900 dark:text-white">
                  {address.fullName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {address.line1}
                  {address.line2 && (
                    <>
                      <br />
                      {address.line2}
                    </>
                  )}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {address.country}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Orders
          </h3>
          {orders.length > 5 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing 5 of {orders.length} orders
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              Loading orders...
            </span>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              This customer hasn&apos;t placed any orders yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order._id}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Order #{order._id.slice(-8)}
                      </h4>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === "fulfilled"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            : order.status === "placed"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {order.totalAmount} {order.currency}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {order.items.length} items
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {order.shippingAddress && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400 truncate">
                            {order.shippingAddress.city}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminCustomersPage() {
  const [userQuery, setUserQuery] = useState("");
  const [userSearchResults, setUserSearchResults] = useState<User[]>([]);
  const [userSearchLoading, setUserSearchLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserOrders, setSelectedUserOrders] = useState<Order[]>([]);
  const [selectedUserOrdersLoading, setSelectedUserOrdersLoading] =
    useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearchUsers = async () => {
    if (!userQuery.trim()) {
      setUserSearchResults([]);
      setSelectedUser(null);
      setSelectedUserOrders([]);
      setHasSearched(false);
      return;
    }

    setUserSearchLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const res = await searchAdminUsers(userQuery.trim());
      setUserSearchResults(res.users);
    } catch (err: any) {
      console.error("searchAdminUsers error", err);
      setError(err?.message || "Failed to search users");
      setUserSearchResults([]);
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

  // Handle Enter key for search
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchUsers();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Customer Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Search and manage customer information, order history, and spending
            patterns.
          </p>
        </div>

        {selectedUser && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/40 rounded-lg p-3">
            <p className="font-semibold text-red-800 dark:text-red-200">
              {selectedUser.name}
            </p>
            <p className="text-sm text-red-600 dark:text-red-300">
              {selectedUser.orderCount || 0} orders •{" "}
              {selectedUser.totalSpent?.toFixed(2) || "0.00"} TRY spent
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 dark:bg-red-900/30 dark:border-red-500/40">
          <p className="text-red-700 dark:text-red-100 text-sm">{error}</p>
        </div>
      )}

      {/* Search Panel */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Customer Search
          </h2>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search customers by name or email address..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <button
            onClick={handleSearchUsers}
            disabled={userSearchLoading}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {userSearchLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Search className="h-4 w-4" />
            )}
            Search
          </button>
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div className="mt-6">
            {userSearchLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  Searching customers...
                </span>
              </div>
            ) : userSearchResults.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No customers found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your search terms or check the spelling.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Found {userSearchResults.length} customer
                  {userSearchResults.length !== 1 ? "s" : ""}
                </h3>
                <div className="grid gap-3 max-h-96 overflow-y-auto">
                  {userSearchResults.map((user) => (
                    <CustomerCard
                      key={user._id}
                      user={user}
                      selected={selectedUser?._id === user._id}
                      onSelect={handleSelectUser}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Customer Details */}
      {selectedUser && (
        <CustomerDetails
          user={selectedUser}
          orders={selectedUserOrders}
          loading={selectedUserOrdersLoading}
        />
      )}
    </div>
  );
}
