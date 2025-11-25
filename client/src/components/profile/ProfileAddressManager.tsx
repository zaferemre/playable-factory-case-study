import { motion, AnimatePresence } from "framer-motion";
import {
  IconPlus,
  IconX,
  IconMapPin,
  IconStar,
  IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";
import type { User, UserAddress } from "@/lib/types/types";
import ErrorAlert from "@/components/shared/ErrorAlert";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface ProfileAddressManagerProps {
  userProfile: User | null;
  newAddress: UserAddress;
  addressesLoading: boolean;
  error: string;
  onAddressFieldChange: (
    field: keyof UserAddress,
    value: string | boolean
  ) => void;
  onAddAddress: () => Promise<void>;
  onDeleteAddress: (index: number) => Promise<void>;
  onSetDefaultAddress: (index: number) => Promise<void>;
  onClearError: () => void;
}

export function ProfileAddressManager({
  userProfile,
  newAddress,
  addressesLoading,
  error,
  onAddressFieldChange,
  onAddAddress,
  onDeleteAddress,
  onSetDefaultAddress,
  onClearError,
}: ProfileAddressManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddAddress();
    setShowAddForm(false);
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
          <IconMapPin className="w-5 h-5 mr-2" />
          Addresses
        </h2>

        <motion.button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <IconPlus className="w-4 h-4" />
          <span>Add Address</span>
        </motion.button>
      </div>

      {error && <ErrorAlert message={error} onDismiss={onClearError} />}

      {addressesLoading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" />
        </div>
      )}

      <AnimatePresence>
        {showAddForm && (
          <motion.form
            onSubmit={handleSubmit}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Add New Address
              </h3>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newAddress.fullName}
                  onChange={(e) =>
                    onAddressFieldChange("fullName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Label
                </label>
                <input
                  type="text"
                  value={newAddress.label}
                  onChange={(e) =>
                    onAddressFieldChange("label", e.target.value)
                  }
                  placeholder="Home, Work, etc."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  value={newAddress.line1}
                  onChange={(e) =>
                    onAddressFieldChange("line1", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={newAddress.line2}
                  onChange={(e) =>
                    onAddressFieldChange("line2", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={newAddress.city}
                  onChange={(e) => onAddressFieldChange("city", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  State/Province
                </label>
                <input
                  type="text"
                  value={newAddress.state}
                  onChange={(e) =>
                    onAddressFieldChange("state", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Postal Code *
                </label>
                <input
                  type="text"
                  value={newAddress.postalCode}
                  onChange={(e) =>
                    onAddressFieldChange("postalCode", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  value={newAddress.country}
                  onChange={(e) =>
                    onAddressFieldChange("country", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={newAddress.phone}
                  onChange={(e) =>
                    onAddressFieldChange("phone", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={newAddress.isDefault}
                  onChange={(e) =>
                    onAddressFieldChange("isDefault", e.target.checked)
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="isDefault"
                  className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Set as default address
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addressesLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addressesLoading ? "Adding..." : "Add Address"}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Address List */}
      <div className="space-y-4">
        {userProfile?.addresses?.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <IconMapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No addresses saved yet</p>
            <p className="text-sm">Add your first address to get started</p>
          </div>
        ) : (
          userProfile?.addresses?.map((address, index) => (
            <motion.div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {address.isDefault && (
                <div className="absolute top-2 right-2">
                  <div className="flex items-center space-x-1 text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20 px-2 py-1 rounded">
                    <IconStar className="w-3 h-3 fill-current" />
                    <span>Default</span>
                  </div>
                </div>
              )}

              <div className="mb-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {address.fullName}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {!address.isDefault && (
                      <button
                        onClick={() => onSetDefaultAddress(index)}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        disabled={addressesLoading}
                      >
                        Set as default
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteAddress(index)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      disabled={addressesLoading}
                    >
                      <IconTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {address.label && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {address.label}
                  </span>
                )}
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>{address.line1}</p>
                {address.line2 && <p>{address.line2}</p>}
                <p>
                  {address.city}
                  {address.state && `, ${address.state}`} {address.postalCode}
                </p>
                <p>{address.country}</p>
                {address.phone && <p>Phone: {address.phone}</p>}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
