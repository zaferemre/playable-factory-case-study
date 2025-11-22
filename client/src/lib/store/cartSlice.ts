"use client";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Cart, CartItem, Product } from "@/lib/types/types";

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  loadedFromServer: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  loadedFromServer: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartFromServer(state, action: PayloadAction<Cart | null>) {
      if (action.payload) {
        state.items = action.payload.items ?? [];
      } else {
        state.items = [];
      }
      state.loadedFromServer = true;
    },
    openCart(state) {
      state.isOpen = true;
    },
    closeCart(state) {
      state.isOpen = false;
    },
    toggleCart(state) {
      state.isOpen = !state.isOpen;
    },
    addItemLocal(state, action: PayloadAction<Product>) {
      const product = action.payload;
      const existing = state.items.find((item) => {
        if (typeof item.product === "string")
          return item.product === product._id;
        return item.product._id === product._id;
      });

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          product,
          quantity: 1,
        });
      }
      state.isOpen = true;
    },
    removeItemLocal(state, action: PayloadAction<string>) {
      const productId = action.payload;
      state.items = state.items.filter((item) => {
        if (typeof item.product === "string") return item.product !== productId;
        return item.product._id !== productId;
      });
    },
    clearCartLocal(state) {
      state.items = [];
    },
  },
});

export const {
  setCartFromServer,
  openCart,
  closeCart,
  toggleCart,
  addItemLocal,
  removeItemLocal,
  clearCartLocal,
} = cartSlice.actions;

// selectors
export const selectCartState = (state: { cart: CartState }) => state.cart;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;

export const selectCartIsOpen = (state: { cart: CartState }) =>
  state.cart.isOpen;

export const selectCartLoadedFromServer = (state: { cart: CartState }) =>
  state.cart.loadedFromServer;

export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => {
    if (typeof item.product === "string") return sum;
    return sum + item.product.price * item.quantity;
  }, 0);

export default cartSlice.reducer;
