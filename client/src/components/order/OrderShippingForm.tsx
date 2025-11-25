"use client";

import type { OrderAddress, UserAddress } from "@/lib/types/types";

interface OrderShippingFormProps {
  backendUserId?: string | null;
  userEmail: string;
  address: OrderAddress & { email?: string };
  savedAddresses: UserAddress[];
  onChangeAddress: (field: keyof OrderAddress | "email", value: string) => void;
  onUseSavedAddress: (addr: UserAddress) => void;
}

export default function OrderShippingForm({
  backendUserId,
  userEmail,
  address,
  savedAddresses,
  onChangeAddress,
  onUseSavedAddress,
}: OrderShippingFormProps) {
  const showSaved = !!backendUserId && savedAddresses.length > 0;

  return (
    <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 md:text-base">
            Shipping details
          </h2>
          <p className="text-xs text-slate-500 md:text-[13px]">
            Enter the address where you want us to send your treats.
          </p>
        </div>
        <span className="rounded-full bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-700">
          Step 1 of 2
        </span>
      </div>

      {/* Saved addresses */}
      {showSaved && (
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 md:p-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
            Saved addresses
          </p>
          <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
            {savedAddresses.map((addr, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onUseSavedAddress(addr)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-[11px] transition hover:border-red-300 hover:bg-red-50"
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-900">
                    {addr.label || "Address"}
                  </span>
                  {addr.isDefault && (
                    <span className="rounded-full bg-emerald-100 px-2 py-[1px] text-[10px] font-semibold text-emerald-700">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-700">{addr.fullName}</p>
                <p className="text-[11px] text-slate-700">{addr.line1}</p>
                {addr.line2 && (
                  <p className="text-[11px] text-slate-700">{addr.line2}</p>
                )}
                <p className="text-[11px] text-slate-700">
                  {addr.postalCode} {addr.city}
                  {addr.state ? `, ${addr.state}` : ""}
                </p>
                <p className="text-[11px] text-slate-700">{addr.country}</p>
                {addr.phone && (
                  <p className="text-[11px] text-slate-600">
                    Phone {addr.phone}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Form fields */}
      <div className="grid gap-3 text-xs md:grid-cols-2 md:text-[13px]">
        <div className="md:col-span-2">
          <label className="mb-1 block text-slate-600">
            Full name<span className="text-red-500"> *</span>
          </label>
          <input
            value={address.fullName}
            onChange={(e) => onChangeAddress("fullName", e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 md:text-sm"
            placeholder="Name and surname"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-slate-600">
            Email address<span className="text-red-500"> *</span>
          </label>
          <input
            value={address.email || userEmail || ""}
            onChange={(e) => onChangeAddress("email", e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 md:text-sm"
            type="email"
            placeholder="you@example.com"
          />
          <p className="mt-1 text-[10px] text-slate-500 md:text-[11px]">
            We use this email for order updates only.
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-slate-600">
            Address line 1<span className="text-red-500"> *</span>
          </label>
          <input
            value={address.line1}
            onChange={(e) => onChangeAddress("line1", e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 md:text-sm"
            placeholder="Street, building, apartment"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-slate-600">Address line 2</label>
          <input
            value={address.line2 || ""}
            onChange={(e) => onChangeAddress("line2", e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 md:text-sm"
            placeholder="Floor, block, extra details"
          />
        </div>

        <div>
          <label className="mb-1 block text-slate-600">
            City<span className="text-red-500"> *</span>
          </label>
          <input
            value={address.city}
            onChange={(e) => onChangeAddress("city", e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 md:text-sm"
            placeholder="City"
          />
        </div>

        <div>
          <label className="mb-1 block text-slate-600">State / region</label>
          <input
            value={address.state || ""}
            onChange={(e) => onChangeAddress("state", e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 md:text-sm"
            placeholder="Province or state"
          />
        </div>

        <div>
          <label className="mb-1 block text-slate-600">
            Postal code<span className="text-red-500"> *</span>
          </label>
          <input
            value={address.postalCode}
            onChange={(e) => onChangeAddress("postalCode", e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 md:text-sm"
            placeholder="Postal code"
          />
        </div>

        <div>
          <label className="mb-1 block text-slate-600">
            Country<span className="text-red-500"> *</span>
          </label>
          <input
            value={address.country}
            onChange={(e) => onChangeAddress("country", e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 md:text-sm"
            placeholder="Country"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-slate-600">Phone</label>
          <input
            value={address.phone || ""}
            onChange={(e) => onChangeAddress("phone", e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 md:text-sm"
            placeholder="For delivery updates"
          />
        </div>
      </div>

      <p className="pt-1 text-[11px] text-slate-500 md:text-xs">
        Fields marked with <span className="text-red-500">*</span> are required.
      </p>
      <p className="text-[10px] text-slate-400 md:text-[11px]">
        Your details stay on this case study project and are not shared with any
        real courier or payment provider.
      </p>
    </div>
  );
}
