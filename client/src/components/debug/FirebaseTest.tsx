'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import railwayEnv from '@/lib/railway-env';
import getRuntimeConfig from '@/lib/runtime-config';

interface EnvData {
  processEnv: Record<string, string | undefined>;
  railwayEnv: Record<string, string>;
  runtimeConfig: Record<string, string | null>;
  windowEnv: Record<string, string> | null;
}

export default function FirebaseTest() {
  const [status, setStatus] = useState<{
    initialized: boolean;
    authReady: boolean;
    configValid: boolean;
    envData: EnvData | null;
    error?: string;
  }>({
    initialized: false,
    authReady: false,
    configValid: false,
    envData: null,
  });

  useEffect(() => {
    const checkFirebase = async () => {
      try {
        // Check if Firebase is initialized
        const initialized = !!auth;
        
        // Get environment data from all sources
        const runtimeConfig = getRuntimeConfig();
        const envData: EnvData = {
          processEnv: {
            NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          },
          railwayEnv,
          runtimeConfig,
          windowEnv: typeof window !== 'undefined' ? window.__ENV || null : null,
        };
        
        // Check if config values are present
        const configValid = !!(
          process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
          process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
        );

        // Check auth readiness
        const authReady = auth ? typeof auth.onAuthStateChanged === 'function' : false;

        setStatus({
          initialized,
          authReady,
          configValid,
          envData,
        });
      } catch (error) {
        setStatus({
          initialized: false,
          authReady: false,
          configValid: false,
          envData: null,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    };

    checkFirebase();
  }, []);

  const testGoogleSignIn = async () => {
    if (!auth) {
      alert('Firebase Auth is not initialized');
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log('✅ Google Sign-in Success:', result.user.email);
      alert(`Success! Signed in as: ${result.user.email}`);
    } catch (error) {
      console.error('❌ Google Sign-in Error:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">🔥 Firebase Connection Test</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-2">
          <span className={`w-3 h-3 rounded-full ${status.initialized ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>Firebase Initialized: {status.initialized ? '✅' : '❌'}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`w-3 h-3 rounded-full ${status.configValid ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>Config Valid: {status.configValid ? '✅' : '❌'}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`w-3 h-3 rounded-full ${status.authReady ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>Auth Ready: {status.authReady ? '✅' : '❌'}</span>
        </div>
      </div>

      {status.error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700">
          <strong>Error:</strong> {status.error}
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={testGoogleSignIn}
          disabled={!status.authReady}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Test Google Sign-in
        </button>
        
        <div className="text-sm text-gray-600">
          Current Domain: {typeof window !== 'undefined' ? window.location.hostname : 'Server'}
        </div>
      </div>
    </div>
  );
}