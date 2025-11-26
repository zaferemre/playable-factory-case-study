// src/firebase.ts
import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  RecaptchaVerifier,
  type Auth,
} from "firebase/auth";

// Simple, direct Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

// Debug logging for Railway environment
console.log("🔧 Firebase Environment Debug:", {
  NODE_ENV: process.env.NODE_ENV,
  environment: typeof window !== "undefined" ? "browser" : "server",
  // Raw environment variables
  raw_NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  raw_NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  raw_NEXT_PUBLIC_FIREBASE_PROJECT_ID:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // Processed config
  config_apiKey: firebaseConfig.apiKey
    ? `${firebaseConfig.apiKey.substring(0, 10)}...`
    : "MISSING",
  config_authDomain: firebaseConfig.authDomain || "MISSING",
  config_projectId: firebaseConfig.projectId || "MISSING",
  // Length checks
  apiKeyLength: firebaseConfig.apiKey.length,
  authDomainLength: firebaseConfig.authDomain.length,
  projectIdLength: firebaseConfig.projectId.length,
});

// Initialize Firebase if we have valid configuration
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;
let appleProvider: OAuthProvider | null = null;

// Check if we have minimum required Firebase config
const hasValidConfig =
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId;

if (hasValidConfig) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    appleProvider = new OAuthProvider("apple.com");
    console.log("✅ Firebase initialized successfully");
  } catch (error) {
    console.error("❌ Firebase initialization failed:", error);
    // Initialize with null values to prevent crashes
    app = null;
    auth = null;
    googleProvider = null;
    appleProvider = null;
  }
} else {
  console.warn(
    "⚠️ Firebase not initialized - missing required environment variables:",
    {
      hasApiKey: !!firebaseConfig.apiKey,
      hasAuthDomain: !!firebaseConfig.authDomain,
      hasProjectId: !!firebaseConfig.projectId,
    }
  );
  // Set explicit null values
  app = null;
  auth = null;
  googleProvider = null;
  appleProvider = null;
}

export { auth, googleProvider, appleProvider };

export function setupRecaptcha(containerId: string) {
  if (!auth) {
    throw new Error("Firebase auth is not initialized");
  }
  return new RecaptchaVerifier(auth, containerId, { size: "invisible" });
}
