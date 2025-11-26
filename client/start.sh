# Railway specific start script
echo "=== Railway Debug Info ==="
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "PORT environment: $PORT"
echo "Current directory: $(pwd)"
echo "Files in current directory: $(ls -la | head -10)"
echo "=== Starting Application ==="
echo "Starting Next.js on port $PORT"
node server.js