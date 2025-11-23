import type { Request, Response, NextFunction } from "express";
import { userService } from "../services/userService";

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const anyReq = req as any;

    const uid: string | undefined =
      anyReq.userId ||
      anyReq.userUid ||
      anyReq.firebaseUid ||
      anyReq.uid ||
      anyReq.user?.uid;

    const email: string | undefined = anyReq.userEmail || anyReq.user?.email;

    if (!uid && !email) {
      return res.status(401).json({ message: "Authentication required" });
    }

    let user = uid ? await userService.getUserByUid(uid) : null;
    if (!user && email) {
      user = await userService.getUserByEmail(email);
    }

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Admin privileges required" });
    }

    anyReq.backendUserId = user._id.toString();

    next();
  } catch (err) {
    console.error("requireAdmin error", err);
    return res.status(500).json({ message: "Failed to verify admin access" });
  }
}
