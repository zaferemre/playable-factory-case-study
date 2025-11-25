"use client";

import { motion } from "motion/react";
import {
  IconMapPin,
  IconUser,
  IconMail,
  IconPhone,
  IconCheck,
  IconArrowRight,
} from "@tabler/icons-react";
import type { UserAddress, OrderAddress } from "@/lib/types/types";

interface AddressFormProps {
  addressData: OrderAddress;
  savedAddresses: UserAddress[];
  onAddressChange: (field: keyof OrderAddress, value: string) => void;
  onSelectSavedAddress: (address: UserAddress) => void;
}

export default function AddressForm({
  addressData,
  savedAddresses,
  onAddressChange,
  onSelectSavedAddress,
}: AddressFormProps) {
  const handleInputChange = (field: keyof OrderAddress, value: string) => {
    onAddressChange(field, value);
  };

  const handleSelectAddress = (addr: UserAddress) => {
    onSelectSavedAddress(addr);
  };

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <div className="bg-blue-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <IconUser size={20} className="text-blue-600" />
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <IconUser
                size={18}
                className="absolute left-3 top-3 text-slate-400"
              />
              <input
                type="text"
                value={addressData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <IconMail
                size={18}
                className="absolute left-3 top-3 text-slate-400"
              />
              <input
                type="email"
                value={addressData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                placeholder="email@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <IconPhone
                size={18}
                className="absolute left-3 top-3 text-slate-400"
              />
              <input
                type="tel"
                value={addressData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                placeholder="+90 5XX XXX XX XX"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Saved Addresses */}
      {savedAddresses.length > 0 && (
        <div className="bg-blue-50 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <IconUser size={20} className="text-blue-600" />
            Your Saved Addresses
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {savedAddresses.map((addr, index) => (
              <motion.button
                key={index}
                onClick={() => handleSelectAddress(addr)}
                className="group p-4 text-left bg-white rounded-xl border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-slate-900">
                        {addr.label || "Address"}
                      </p>
                      {addr.isDefault && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          <IconCheck size={12} />
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 mb-1">
                      {addr.fullName}
                    </p>
                    <p className="text-sm text-slate-600">{addr.line1}</p>
                    <p className="text-sm text-slate-600">
                      {addr.city}, {addr.postalCode}
                    </p>
                  </div>
                  <IconArrowRight
                    size={16}
                    className="text-blue-500 group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Address Information */}
      <div className="bg-slate-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <IconMapPin size={20} className="text-red-600" />
          {savedAddresses.length > 0
            ? "Or Enter New Address"
            : "Delivery Address"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Address Line 1 */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Address Line 1
            </label>
            <input
              type="text"
              value={addressData.line1}
              onChange={(e) => handleInputChange("line1", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              placeholder="Street address, P.O. box, company name"
              required
            />
          </div>

          {/* Address Line 2 */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Address Line 2 (Optional)
            </label>
            <input
              type="text"
              value={addressData.line2}
              onChange={(e) => handleInputChange("line2", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              placeholder="Apartment, suite, unit, building, floor, etc."
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              City
            </label>
            <input
              type="text"
              value={addressData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              placeholder="City"
              required
            />
          </div>

          {/* State/Province */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              State/Province (Optional)
            </label>
            <input
              type="text"
              value={addressData.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              placeholder="State or Province"
            />
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Postal Code
            </label>
            <input
              type="text"
              value={addressData.postalCode}
              onChange={(e) => handleInputChange("postalCode", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              placeholder="Postal Code"
              required
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Country
            </label>
            <input
              type="text"
              value={addressData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              placeholder="Country"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
}
