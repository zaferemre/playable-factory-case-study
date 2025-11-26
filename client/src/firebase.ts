// src/firebase.ts
import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  RecaptchaVerifier,
  type Auth,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

// Only initialize Firebase if we're in the browser and have valid config
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;
let appleProvider: OAuthProvider | null = null;

if (typeof window !== "undefined" && firebaseConfig.apiKey) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    appleProvider = new OAuthProvider("apple.com");
  } catch (error) {
    console.warn("Firebase initialization failed:", error);
  }
}

export { auth, googleProvider, appleProvider };

export function setupRecaptcha(containerId: string) {
  if (!auth) {
    throw new Error("Firebase auth is not initialized");
  }
  return new RecaptchaVerifier(auth, containerId, { size: "invisible" });
}
