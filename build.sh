#!/bin/bash
# Build script for Kalei Styleguide

# Ensure we exit if any command fails
set -e

echo "🚀 Starting Kalei Styleguide build process..."

# Copy assets to public directory
echo "📂 Copying CSS and configuration files..."
./copy-assets.sh

# Run linting
echo "🔍 Running linter checks..."
npm run lint

# Run tests
echo "🧪 Running tests..."
npm test

# Build for production
echo "🏗️ Building for production..."
npm run build

echo "✅ Build completed successfully!"
echo "📦 Production files are available in the 'dist' directory"
echo "🔍 To preview the production build, run: npm run preview"