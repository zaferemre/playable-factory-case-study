import { Schema, model, type Document, type Types } from "mongoose";
import { IBaseAddress } from "./User";

export type OrderStatus = "draft" | "placed" | "fulfilled" | "cancelled";

export interface IOrderItem {
  product: Types.ObjectId;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

// Order address extends base address with optional email for guest orders
export interface IOrderAddress extends IBaseAddress {
  email?: string;
}

export interface IOrder extends Document {
  user?: Types.ObjectId;
  sessionId?: string;
  clientOrderId?: string;

  customerName?: string;
  customerEmail?: string;

  items: IOrderItem[];
  status: OrderStatus;
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
    email: { type: String },
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
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },

    sessionId: {
      type: String,
      required: false,
      index: true,
    },

    clientOrderId: {
      type: String,
      required: false,
      index: true,
      unique: true,
      sparse: true,
    },

    customerName: { type: String },
    customerEmail: { type: String, index: true },

    items: { type: [OrderItemSchema], default: [] },

    status: {
      type: String,
      enum: ["draft", "placed", "fulfilled", "cancelled"],
      default: "placed",
      index: true,
    },

    totalAmount: { type: Number, required: true },
    currency: { type: String, default: "TRY" },

    shippingAddress: { type: OrderAddressSchema, required: true },
  },
  { timestamps: true }
);

export const OrderModel = model<IOrder>("Order", OrderSchema);
