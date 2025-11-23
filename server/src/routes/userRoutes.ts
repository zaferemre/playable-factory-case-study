import { Router } from "express";
import {
  createUser,
  getUserById,
  addUserAddress,
  removeUserAddress,
  listUsers,
  updateUserRole,
} from "../controllers/userController";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";
import { requireAdmin } from "../middlewares/requireAdmin";

const router = Router();

// admin list users
router.get("/", verifyFirebaseToken, requireAdmin, listUsers);

// admin update role
router.patch("/:id/role", verifyFirebaseToken, requireAdmin, updateUserRole);

// create user (used from auth sync, probably not admin only)
router.post("/", createUser);

// get single user
router.get("/:id", getUserById);

// user addresses
router.post("/:id/addresses", addUserAddress);
router.delete("/:id/addresses/:index", removeUserAddress);

export default router;
