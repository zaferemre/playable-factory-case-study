# Railway specific start script
echo "=== Railway Debug Info ==="
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Current directory: $(pwd)"
echo "Node modules exists: $(ls -la node_modules | head -5)"
echo "Next.js in node_modules: $(ls -la node_modules/.bin/next 2>/dev/null || echo 'NOT FOUND')"
echo "=== Starting Application ==="
npx next start