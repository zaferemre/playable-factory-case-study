import { Schema, model, type Document, type Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description?: string;
  price: number;
  currency: string;
  category: Types.ObjectId;
  imageUrls: string[];
  isActive: boolean;
  stockQuantity: number;
  averageRating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    imageUrls: { type: [String], default: [] },

    isActive: { type: Boolean, default: true },
    stockQuantity: { type: Number, default: 0, min: 0 },

    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ProductModel = model<IProduct>("Product", ProductSchema);
