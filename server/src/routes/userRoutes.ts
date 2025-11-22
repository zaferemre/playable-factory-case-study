import { Router } from "express";
import {
  createUser,
  getUserById,
  addUserAddress,
  removeUserAddress,
} from "../controllers/userController";

const router = Router();

router.post("/", createUser);
router.get("/:id", getUserById);

// user addresses
router.post("/:id/addresses", addUserAddress);
router.delete("/:id/addresses/:index", removeUserAddress);

export default router;
