#!/bin/bash

echo "🔧 Railway Environment Variables Setup"

# Debug: Show what Railway provides
echo "=== Railway Build Environment ==="
echo "Available environment variables:"
env | grep -E "(NEXT_PUBLIC_|FIREBASE_)" | sort

# Create environment file for build time
echo "Creating .env.production file for build..."
cat > .env.production << EOF
NEXT_PUBLIC_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}
NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}
NEXT_PUBLIC_FIREBASE_APP_ID=${NEXT_PUBLIC_FIREBASE_APP_ID}
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=${NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}
NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
EOF

echo "✅ .env.production created"
echo "Contents:"
cat .env.production

# Also create .env.local as backup
cp .env.production .env.local

echo "🚀 Starting build process..."