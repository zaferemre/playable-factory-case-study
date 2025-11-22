import { Request, Response } from "express";
import { authService } from "../services/authService";

export const syncFirebaseUser = async (req: Request, res: Response) => {
  try {
    const { uid, email, name, photoUrl, sessionId } = req.body;

    if (!uid || !email || !name) {
      return res
        .status(400)
        .json({ message: "uid, email and name are required" });
    }

    const { user, cart } = await authService.syncFirebaseUser({
      uid,
      email,
      name,
      photoUrl,
      sessionId,
    });

    res.json({ user, cart });
  } catch (err) {
    console.error("syncFirebaseUser error", err);
    res.status(500).json({ message: "Failed to sync user" });
  }
};
