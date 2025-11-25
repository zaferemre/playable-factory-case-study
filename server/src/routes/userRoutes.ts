// src/routes/userRoutes.ts
import { Router } from "express";
import {
  createUser,
  getUserById,
  updateUserProfile,
  addUserAddress,
  removeUserAddress,
  setDefaultAddress,
  listUsers,
  updateUserRole,
} from "../controllers/userController";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";
import { requireAdmin } from "../middlewares/requireAdmin";

const router = Router();

// admin list users with search and sorting
router.get("/", verifyFirebaseToken, requireAdmin, listUsers);

// admin update role
router.patch("/:id/role", verifyFirebaseToken, requireAdmin, updateUserRole);

// create user (called from auth sync)
router.post("/", createUser);

// get single user (could be used for profile, you might want auth here)
router.get("/:id", verifyFirebaseToken, getUserById);

// update profile (name, photo)
router.patch("/:id", verifyFirebaseToken, updateUserProfile);

// user addresses
router.post("/:id/addresses", verifyFirebaseToken, addUserAddress);
router.delete("/:id/addresses/:index", verifyFirebaseToken, removeUserAddress);

// set default address
router.patch("/:id/addresses/default", verifyFirebaseToken, setDefaultAddress);

export default router;
