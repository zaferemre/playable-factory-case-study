// Simple environment variables for Railway
// This file contains the environment variables that will be injected at build time

export const railwayEnv = {
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  NEXT_PUBLIC_FIREBASE_PROJECT_ID:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "",
};

// Debug logging
console.log("🔧 Railway Environment Variables:", {
  hasApiKey: !!railwayEnv.NEXT_PUBLIC_FIREBASE_API_KEY,
  hasAuthDomain: !!railwayEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  hasProjectId: !!railwayEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  apiUrl: railwayEnv.NEXT_PUBLIC_API_URL,
  authDomain: railwayEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: railwayEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});

export default railwayEnv;
