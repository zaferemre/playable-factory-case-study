import { Schema, model, type Document, type Types } from "mongoose";
import next from "next/dist/server/next";

export interface ICartItem {
  product: Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  user?: Types.ObjectId;
  sessionId?: string; // for guests
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const CartSchema = new Schema<ICart>(
  {
    // Logged in users
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },

    // Guest session identifier
    sessionId: {
      type: String,
      required: false,
      index: true,
    },

    items: { type: [CartItemSchema], default: [] },
  },
  { timestamps: true }
);

// Ensure that at least one of user or sessionId exists
CartSchema.pre("save", function (this: ICart) {
  if (!this.user && !this.sessionId) {
    throw new Error("Cart must have a user or a sessionId");
  }
});

export const CartModel = model<ICart>("Cart", CartSchema);
