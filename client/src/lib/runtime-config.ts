// Runtime environment configuration for Railway
// This helps ensure environment variables are available at runtime

import getConfig from 'next/config';

// Type for window environment variables
declare global {
  interface Window {
    __ENV?: Record<string, string>;
  }
}

const getRuntimeConfig = () => {
  // Get Next.js runtime config
  const { publicRuntimeConfig } = getConfig() || { publicRuntimeConfig: {} };
  
  // Multiple fallback strategies for Railway
  const getEnvVar = (key: string) => {
    // Strategy 1: Next.js publicRuntimeConfig
    if (publicRuntimeConfig?.[key]) {
      return publicRuntimeConfig[key];
    }
    
    // Strategy 2: Direct process.env access
    if (process.env[key]) {
      return process.env[key];
    }
    
    // Strategy 3: Window global (if we inject it)
    if (typeof window !== "undefined" && window.__ENV?.[key]) {
      return window.__ENV[key];
    }
    
    return null;
  };

  return {
    NEXT_PUBLIC_FIREBASE_API_KEY: getEnvVar('NEXT_PUBLIC_FIREBASE_API_KEY'),
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: getEnvVar('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: getEnvVar('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: getEnvVar('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: getEnvVar('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
    NEXT_PUBLIC_FIREBASE_APP_ID: getEnvVar('NEXT_PUBLIC_FIREBASE_APP_ID'),
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: getEnvVar('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'),
    NEXT_PUBLIC_API_URL: getEnvVar('NEXT_PUBLIC_API_URL'),
  };
};

declare global {
  interface Window {
    __ENV?: Record<string, string>;
  }
}

export default getRuntimeConfig;
