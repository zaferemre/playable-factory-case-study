export type UserRole = "customer" | "admin";

export interface UserAddress {
  label?: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
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
  averageRating: number;
  reviewCount: number;
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

export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "completed"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderItem {
  product: Product | string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderAddress {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface Order {
  _id: string;
  user: User | string;
  clientOrderId?: string; // temporary id stored on the order
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  currency: string;
  shippingAddress: OrderAddress;
  createdAt: string;
  updatedAt: string;
}
