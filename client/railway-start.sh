#!/bin/sh
echo "=== Railway Startup Debug ==="
echo "PORT: $PORT"
echo "HOSTNAME: $HOSTNAME"
echo "NODE_ENV: $NODE_ENV"
echo "Current working directory: $(pwd)"
echo "Contents:"
ls -la
echo "=== Starting Server ==="

# Next.js standalone server should automatically use PORT env var
node server.js