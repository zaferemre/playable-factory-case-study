// src/lib/types/types.ts

export type UserRole = "customer" | "admin";

// Base address structure used across the application
export interface BaseAddress {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
}

// User address extends base with label and default flag
export interface UserAddress extends BaseAddress {
  label?: string;
  isDefault?: boolean;
}

export interface User {
  _id: string;
  uid?: string;
  email: string;
  name: string;
  photoUrl?: string;
  role: UserRole;
  addresses: UserAddress[];

  // denormalized stats from backend
  orderCount: number;
  totalSpent: number;
  lastOrderAt?: string;

  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  currency: string;
  category: Category | string;
  imageUrls: string[];
  isActive: boolean;
  stockQuantity: number;

  // review stats
  averageRating: number;
  reviewCount: number;

  // order denormalized stats
  orderCount: number;
  totalUnitsSold: number;
  totalRevenue: number;
  lastOrderedAt?: string;

  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  product: Product | string;
  user: User | string;
  rating: number;
  title?: string;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product | string;
  quantity: number;
}

export interface Cart {
  _id: string;
  user?: User | string; // optional for guest carts
  sessionId?: string; // used for guest carts
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

// we removed paymentStatus from backend for mock payments
export type OrderStatus = "draft" | "placed" | "fulfilled" | "cancelled";

export interface OrderItem {
  product: Product | string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

// Order address extends base with optional email for guest orders
export interface OrderAddress extends BaseAddress {
  email?: string; // useful for guests and contact
}

export interface Order {
  _id: string;
  user?: User | string; // optional for guest orders
  sessionId?: string; // links guest orders to a session
  clientOrderId?: string; // temporary id stored on the order
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  shippingAddress: OrderAddress;
  createdAt: string;
  updatedAt: string;
}
