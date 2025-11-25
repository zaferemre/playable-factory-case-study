// Address utilities and types for consistent address handling across the application

import type { UserAddress, OrderAddress } from "@/lib/types/types";

// Turkish address data structure used in checkout UI
export interface TurkishAddressData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  province: string;
  district: string;
  neighborhood: string;
  street: string;
  buildingNumber: string;
  apartmentNumber: string;
  postalCode: string;
}

/**
 * Convert Turkish address format (used in UI) to standard OrderAddress format
 */
export function convertTurkishToOrderAddress(
  turkishAddress: TurkishAddressData
): OrderAddress {
  const addressParts = [
    turkishAddress.street,
    turkishAddress.buildingNumber,
    turkishAddress.apartmentNumber &&
      `Daire: ${turkishAddress.apartmentNumber}`,
    turkishAddress.neighborhood && `${turkishAddress.neighborhood} Mahallesi`,
    turkishAddress.district,
  ].filter(Boolean);

  return {
    fullName: `${turkishAddress.firstName} ${turkishAddress.lastName}`.trim(),
    email: turkishAddress.email,
    line1: addressParts.join(", "),
    city: turkishAddress.province,
    state: turkishAddress.province,
    postalCode: turkishAddress.postalCode,
    country: "Turkey",
    phone: turkishAddress.phone,
  };
}

/**
 * Convert UserAddress to OrderAddress (for when user selects saved address)
 */
export function convertUserToOrderAddress(
  userAddress: UserAddress,
  email?: string
): OrderAddress {
  return {
    fullName: userAddress.fullName,
    email,
    line1: userAddress.line1,
    line2: userAddress.line2,
    city: userAddress.city,
    state: userAddress.state,
    postalCode: userAddress.postalCode,
    country: userAddress.country,
    phone: userAddress.phone,
  };
}

/**
 * Convert OrderAddress to UserAddress (for saving address to user profile)
 */
export function convertOrderToUserAddress(
  orderAddress: OrderAddress,
  label?: string,
  isDefault?: boolean
): UserAddress {
  return {
    fullName: orderAddress.fullName,
    line1: orderAddress.line1,
    line2: orderAddress.line2,
    city: orderAddress.city,
    state: orderAddress.state,
    postalCode: orderAddress.postalCode,
    country: orderAddress.country,
    phone: orderAddress.phone,
    label,
    isDefault,
  };
}

/**
 * Validate if address has required fields
 */
export function validateAddress(address: Partial<OrderAddress | UserAddress>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!address.fullName?.trim()) errors.push("Full name is required");
  if (!address.line1?.trim()) errors.push("Address line 1 is required");
  if (!address.city?.trim()) errors.push("City is required");
  if (!address.postalCode?.trim()) errors.push("Postal code is required");
  if (!address.country?.trim()) errors.push("Country is required");

  return {
    isValid: errors.length === 0,
    errors,
  };
}
