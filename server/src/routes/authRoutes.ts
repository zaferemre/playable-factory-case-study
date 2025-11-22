import { Router } from "express";
import { syncFirebaseUser } from "../controllers/authController";

const router = Router();

// called from frontend after Firebase login
router.post("/firebase", syncFirebaseUser);

export default router;
