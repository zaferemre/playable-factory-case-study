import { userRepository } from "../dataAccess/userRepository";
import { cartRepository } from "../dataAccess/cartRepository";
import type { IUser } from "../models/User";
import type { ICart } from "../models/Cart";

interface SyncFirebaseUserInput {
  uid: string;
  email: string;
  name: string;
  photoUrl?: string;
  sessionId?: string;
}

/**
 * Finds or creates user by uid, merges session cart into user cart.
 */
export const authService = {
  async syncFirebaseUser(
    input: SyncFirebaseUserInput
  ): Promise<{ user: IUser; cart: ICart | null }> {
    const { uid, email, name, photoUrl, sessionId } = input;

    let user = await userRepository.findUserByUid(uid);

    if (!user) {
      // try email lookup first in case we created user record earlier without uid
      const byEmail = await userRepository.findUserByEmail(email);
      if (byEmail) {
        byEmail.uid = uid;
        if (!byEmail.name) byEmail.name = name;
        if (photoUrl) byEmail.photoUrl = photoUrl;
        user = await byEmail.save();
      } else {
        user = await userRepository.createUser({
          uid,
          email,
          name,
          photoUrl,
          role: "customer",
        });
      }
    } else {
      // update basic profile if needed
      let changed = false;
      if (user.name !== name) {
        user.name = name;
        changed = true;
      }
      if (photoUrl && user.photoUrl !== photoUrl) {
        user.photoUrl = photoUrl;
        changed = true;
      }
      if (changed) {
        await user.save();
      }
    }

    const userIdStr = user._id.toString();

    // load carts
    let userCart = await cartRepository.getCartByUserId(userIdStr);
    let sessionCart: ICart | null = null;

    if (sessionId) {
      sessionCart = await cartRepository.getCartBySessionId(sessionId);
    }

    if (sessionCart) {
      const existingItems = userCart?.items ?? [];
      const mergedItems = [...existingItems];

      for (const sItem of sessionCart.items) {
        const existing = mergedItems.find(
          (m) => m.product.toString() === sItem.product.toString()
        );
        if (existing) {
          existing.quantity += sItem.quantity;
        } else {
          mergedItems.push({
            product: sItem.product,
            quantity: sItem.quantity,
          } as any);
        }
      }

      if (userCart) {
        userCart.items = mergedItems;
        userCart = await cartRepository.saveCart(userCart);
      } else {
        userCart = await cartRepository.createCart({
          user: user._id,
          items: mergedItems,
        });
      }

      // remove guest cart for that session
      await cartRepository.clearCartBySessionId(sessionId);
    }

    // if user still has no cart, create an empty one
    if (!userCart) {
      userCart = await cartRepository.createCart({
        user: user._id,
        items: [],
      });
    }

    return { user, cart: userCart };
  },
};
