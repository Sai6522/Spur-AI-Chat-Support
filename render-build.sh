#!/bin/bash
# Render build script

echo "🔨 Building Spur AI Chat Support for Render..."

# Install dependencies
npm install

# Build frontend
echo "📦 Building frontend..."
npm run build:frontend

# Build backend
echo "🏗️ Building backend..."
npm run build:backend

# Setup database
echo "🗄️ Setting up database..."
npm run db:setup

echo "✅ Build complete!"
