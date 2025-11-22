import { Schema, model, type Document, type Types } from "mongoose";

export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "completed"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface IOrderItem {
  product: Types.ObjectId;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface IOrderAddress {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  clientOrderId?: string; // temporary id from client, used in /order/:id route
  items: IOrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  currency: string;
  shippingAddress: IOrderAddress;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    lineTotal: { type: Number, required: true },
  },
  { _id: false }
);

const OrderAddressSchema = new Schema<IOrderAddress>(
  {
    fullName: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },

    clientOrderId: {
      type: String,
      required: false,
      index: true,
      unique: true,
      sparse: true,
    },

    items: { type: [OrderItemSchema], default: [] },

    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "completed", "cancelled"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    totalAmount: { type: Number, required: true },
    currency: { type: String, default: "TRY" },

    shippingAddress: { type: OrderAddressSchema, required: true },
  },
  { timestamps: true }
);

export const OrderModel = model<IOrder>("Order", OrderSchema);
