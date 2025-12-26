#!/bin/bash
# Vercel build script

echo "🔨 Building for Vercel deployment..."

# Install dependencies
npm install

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Build backend
echo "🏗️ Building backend..."
npm run build:backend

# Setup database
echo "🗄️ Setting up database..."
npm run db:setup

echo "✅ Vercel build complete!"
