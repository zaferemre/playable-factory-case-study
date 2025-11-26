// Environment variable test utility
// Use this to debug environment variables in Railway

export function testEnvironmentVariables() {
  const vars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
    'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
    'NEXT_PUBLIC_API_URL',
    'GOOGLE_MAPS_API_KEY'
  ];

  console.log('🧪 Environment Variables Test:');
  
  vars.forEach(varName => {
    const value = process.env[varName];
    console.log(`  ${varName}: ${value ? `${value.substring(0, 10)}...` : 'MISSING'}`);
  });

  const missing = vars.filter(varName => !process.env[varName]);
  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing);
  } else {
    console.log('✅ All environment variables are present');
  }

  return {
    total: vars.length,
    present: vars.length - missing.length,
    missing: missing.length,
    missingVars: missing,
  };
}

// Auto-run in development
if (process.env.NODE_ENV === 'development') {
  testEnvironmentVariables();
}