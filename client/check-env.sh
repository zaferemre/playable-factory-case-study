# Railway Environment Variables Checker
echo "=== Railway Environment Variables Check ==="

echo "🔐 Firebase Configuration:"
echo "NEXT_PUBLIC_FIREBASE_API_KEY: ${NEXT_PUBLIC_FIREBASE_API_KEY:0:10}..."
echo "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: $NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
echo "NEXT_PUBLIC_FIREBASE_PROJECT_ID: $NEXT_PUBLIC_FIREBASE_PROJECT_ID"
echo "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: $NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"

echo "🌐 API Configuration:"
echo "NEXT_PUBLIC_API_URL: $NEXT_PUBLIC_API_URL"

echo "🗺️ Other Services:"
echo "GOOGLE_MAPS_API_KEY: ${GOOGLE_MAPS_API_KEY:0:10}..."

echo "=== Environment Variables Check Complete ==="