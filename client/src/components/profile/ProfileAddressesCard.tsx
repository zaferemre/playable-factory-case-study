"use client";

import { motion } from "motion/react";
import type { UserAddress } from "@/lib/types/types";
import {
  IconMapPin,
  IconPlus,
  IconTrash,
  IconCheck,
} from "@tabler/icons-react";

interface ProfileAddressesCardProps {
  addresses: UserAddress[];
  newAddress: UserAddress;
  addressesLoading: boolean;
  onFieldChange: (field: keyof UserAddress, value: string | boolean) => void;
  onAddAddress: () => void;
  onDeleteAddress: (index: number) => void;
  onSetDefaultAddress: (index: number) => void;
}

export default function ProfileAddressesCard({
  addresses,
  newAddress,
  addressesLoading,
  onFieldChange,
  onAddAddress,
  onDeleteAddress,
  onSetDefaultAddress,
}: ProfileAddressesCardProps) {
  return (
    <motion.div
      className="rounded-3xl bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl overflow-hidden"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
    >
      <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 p-6 border-b border-slate-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-900">
              <IconMapPin size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Shipping Addresses
              </h2>
              <p className="text-sm text-slate-600">
                Manage your delivery locations
              </p>
            </div>
          </div>
          {addressesLoading && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
              Saving...
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-4">
          {addresses.length > 0 ? (
            addresses.map((addr, index) => (
              <motion.div
                key={`${addr.label || "addr"}-${index}`}
                className="group relative rounded-2xl border border-slate-200/50 bg-white/50 hover:bg-white/80 p-4 transition-all duration-200 hover:shadow-md"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.15 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="font-semibold text-slate-900">
                        {addr.label || "Address"}
                      </h4>
                      {addr.isDefault && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                          <IconCheck size={14} />
                          Default
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 text-sm text-slate-700">
                      <p className="font-medium text-slate-900">
                        {addr.fullName}
                      </p>
                      <p>{addr.line1}</p>
                      {addr.line2 && <p>{addr.line2}</p>}
                      <p>
                        {addr.postalCode} {addr.city}
                        {addr.state && `, ${addr.state}`}
                      </p>
                      <p>{addr.country}</p>
                      {addr.phone && (
                        <p className="text-slate-600">📞 {addr.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!addr.isDefault && (
                      <button
                        type="button"
                        onClick={() => onSetDefaultAddress(index)}
                        className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onDeleteAddress(index)}
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <IconTrash size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <IconMapPin size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No Addresses
              </h3>
              <p className="text-slate-600">
                Add your first shipping address below to get started.
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200/50 pt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100">
              <IconPlus size={16} className="text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Add New Address</h3>
              <p className="text-sm text-slate-600">
                Enter your shipping details
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Address Label
                </label>
                <input
                  value={newAddress.label || ""}
                  onChange={(e) => onFieldChange("label", e.target.value)}
                  placeholder="Home, Work, etc."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  value={newAddress.fullName}
                  onChange={(e) => onFieldChange("fullName", e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Address Line 1 *
              </label>
              <input
                value={newAddress.line1}
                onChange={(e) => onFieldChange("line1", e.target.value)}
                placeholder="Street address, P.O. box, company name"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Address Line 2
              </label>
              <input
                value={newAddress.line2 || ""}
                onChange={(e) => onFieldChange("line2", e.target.value)}
                placeholder="Apartment, suite, unit, building"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  City *
                </label>
                <input
                  value={newAddress.city}
                  onChange={(e) => onFieldChange("city", e.target.value)}
                  placeholder="Istanbul"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  State/Province
                </label>
                <input
                  value={newAddress.state || ""}
                  onChange={(e) => onFieldChange("state", e.target.value)}
                  placeholder="State or Province"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Postal Code *
                </label>
                <input
                  value={newAddress.postalCode}
                  onChange={(e) => onFieldChange("postalCode", e.target.value)}
                  placeholder="34000"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Country *
                </label>
                <input
                  value={newAddress.country}
                  onChange={(e) => onFieldChange("country", e.target.value)}
                  placeholder="Turkey"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number
              </label>
              <input
                value={newAddress.phone || ""}
                onChange={(e) => onFieldChange("phone", e.target.value)}
                placeholder="+90 555 123 4567"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-3 py-2">
              <input
                id="default-address"
                type="checkbox"
                checked={newAddress.isDefault ?? false}
                onChange={(e) => onFieldChange("isDefault", e.target.checked)}
                className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500 focus:ring-2"
              />
              <label
                htmlFor="default-address"
                className="text-sm text-slate-700 font-medium"
              >
                Set as default shipping address
              </label>
            </div>

            <motion.button
              type="button"
              onClick={onAddAddress}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <IconPlus size={20} />
              Save Address
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
