#!/bin/bash
# Railway build script

echo "Installing dependencies..."
npm ci --verbose

echo "Building Next.js application..."
npx next build

echo "Build complete!"