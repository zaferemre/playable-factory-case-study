import { Schema, model, type Document } from "mongoose";

export type UserRole = "customer" | "admin";

export interface IUserAddress {
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

export interface IUser extends Document {
  uid?: string; // Firebase UID (optional for now)
  email: string;
  name: string;
  photoUrl?: string;
  role: UserRole;
  passwordHash?: string; // Only used if email/password auth is added
  addresses: IUserAddress[];
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
    },

    passwordHash: { type: String },

    addresses: {
      type: [UserAddressSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export const UserModel = model<IUser>("User", UserSchema);
