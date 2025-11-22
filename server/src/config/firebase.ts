import admin from "firebase-admin";
import { config } from "dotenv";

config();

// Validate required env vars early
const projectId = process.env.FIREBASE_PROJECT_ID;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

if (!projectId || !privateKey || !clientEmail) {
  throw new Error(
    "Missing Firebase Admin environment variables. Make sure FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL are set."
  );
}

// Firebase private keys require newline fix
const formattedPrivateKey = privateKey.replace(/\\n/g, "\n");

// Initialize Firebase only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      privateKey: formattedPrivateKey,
      clientEmail,
    }),
  });
}

export { admin };
