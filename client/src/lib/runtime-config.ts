// Runtime environment configuration for Railway
// Next.js 16 compatible version without next/config

// Type for window environment variables
declare global {
  interface Window {
    __ENV?: Record<string, string>;
  }
}

const getRuntimeConfig = () => {
  // Multiple fallback strategies for Railway
  const getEnvVar = (key: string) => {
    // Strategy 1: Direct process.env access (works at build time)
    if (process.env[key]) {
      return process.env[key];
    }

    // Strategy 2: Window global (for runtime injection)
    if (typeof window !== "undefined" && window.__ENV?.[key]) {
      return window.__ENV[key];
    }

    return "";
  };

  return {
    NEXT_PUBLIC_FIREBASE_API_KEY: getEnvVar("NEXT_PUBLIC_FIREBASE_API_KEY"),
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: getEnvVar(
      "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
    ),
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: getEnvVar(
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
    ),
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: getEnvVar(
      "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
    ),
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: getEnvVar(
      "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
    ),
    NEXT_PUBLIC_FIREBASE_APP_ID: getEnvVar("NEXT_PUBLIC_FIREBASE_APP_ID"),
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: getEnvVar(
      "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID"
    ),
    NEXT_PUBLIC_API_URL: getEnvVar("NEXT_PUBLIC_API_URL"),
  };
};

declare global {
  interface Window {
    __ENV?: Record<string, string>;
  }
}

export default getRuntimeConfig;
