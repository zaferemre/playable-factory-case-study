import { Router } from "express";
import { createCart, getCartByUserId } from "../controllers/cartController";

const router = Router();

router.post("/", createCart);
router.get("/user/:userId", getCartByUserId);

export default router;
