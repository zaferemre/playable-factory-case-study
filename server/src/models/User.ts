import { Schema, model, type Document } from "mongoose";

export type UserRole = "customer" | "admin";

// Base address structure
export interface IBaseAddress {
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
export interface IUserAddress extends IBaseAddress {
  label?: string;
  isDefault?: boolean;
}

export interface IUser extends Document {
  uid?: string; // Firebase uid
  email: string;
  name: string;
  photoUrl?: string;
  role: UserRole;
  addresses: IUserAddress[];

  // new denormalized stats
  orderCount: number;
  totalSpent: number;
  lastOrderAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const UserAddressSchema = new Schema<IUserAddress>(
  {
    label: { type: String },
    fullName: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    uid: { type: String, index: true },

    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    photoUrl: { type: String },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
      required: true,
      index: true,
    },

    addresses: {
      type: [UserAddressSchema],
      default: [],
    },
    orderCount: { type: Number, default: 0, index: true },
    totalSpent: { type: Number, default: 0, index: true },
    lastOrderAt: { type: Date, index: true },
  },
  { timestamps: true }
);

export const UserModel = model<IUser>("User", UserSchema);
