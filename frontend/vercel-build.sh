#!/bin/bash

# Exit on any error
set -e

echo "🔧 Setting up build environment..."

# Ensure we're in the right directory
cd /vercel/path0/frontend

# Clean install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Fix permissions for binaries
echo "🔐 Fixing permissions..."
chmod +x node_modules/.bin/* || true

# Run the build
echo "🏗️ Building the application..."
npm run build

echo "✅ Build completed successfully!" 