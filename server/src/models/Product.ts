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

  // new denormalized stats
  orderCount: number;
  totalUnitsSold: number;
  totalRevenue: number;
  lastOrderedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "TRY" },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    imageUrls: { type: [String], default: [] },

    isActive: { type: Boolean, default: true },
    stockQuantity: { type: Number, default: 0, min: 0 },

    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },

    // denormalized order stats
    orderCount: { type: Number, default: 0, index: true },
    totalUnitsSold: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    lastOrderedAt: { type: Date, index: true },
  },
  { timestamps: true }
);

ProductSchema.index({ category: 1, orderCount: -1 });

ProductSchema.index({ orderCount: -1, totalUnitsSold: -1 });

export const ProductModel = model<IProduct>("Product", ProductSchema);
