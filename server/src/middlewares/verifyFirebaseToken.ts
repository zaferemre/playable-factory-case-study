// src/middlewares/verifyFirebaseToken.ts
import type { Request, Response, NextFunction } from "express";
import { admin } from "../config/firebase";

interface DecodedToken {
  uid: string;
  email?: string | null;
  name?: string | null;
  displayName?: string | null;
  picture?: string | null;
  photoURL?: string | null;
  [key: string]: any;
}

export interface AuthenticatedUser {
  uid: string;
  email: string;
  name: string;
  photoURL: string;
  [key: string]: any;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
  userUid?: string;
  userEmail?: string;
}

export const verifyFirebaseToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "No or invalid auth header" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const decodedToken = (await admin
      .auth()
      .verifyIdToken(token)) as DecodedToken;

    const user: AuthenticatedUser = {
      ...decodedToken,
      uid: decodedToken.uid,
      email: decodedToken.email ?? "",
      name: decodedToken.name ?? decodedToken.displayName ?? "",
      photoURL: decodedToken.picture ?? decodedToken.photoURL ?? "",
    };

    req.user = user;
    req.userUid = user.uid;
    req.userEmail = user.email;

    next();
  } catch (err) {
    console.error("verifyFirebaseToken failed", err);
    res.status(403).json({ error: "Token invalid or expired" });
  }
};
