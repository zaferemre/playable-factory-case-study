#!/bin/sh
echo "=== Railway Startup Debug ==="
echo "PORT: $PORT"
echo "HOSTNAME: $HOSTNAME"
echo "NODE_ENV: $NODE_ENV"

echo "=== Firebase Environment Check ==="
echo "NEXT_PUBLIC_FIREBASE_API_KEY: ${NEXT_PUBLIC_FIREBASE_API_KEY:0:15}..."
echo "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: $NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
echo "NEXT_PUBLIC_FIREBASE_PROJECT_ID: $NEXT_PUBLIC_FIREBASE_PROJECT_ID"
echo "NEXT_PUBLIC_API_URL: $NEXT_PUBLIC_API_URL"

echo "=== File System Check ==="
echo "Current directory: $(pwd)"
echo "Contents:"
ls -la

echo "=== Starting Next.js Server ==="
# Next.js standalone server automatically uses PORT env var
node server.js