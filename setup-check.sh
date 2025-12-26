#!/bin/bash

echo "🚀 Spur AI Chat Support - Quick Setup Verification"
echo "=================================================="

# Check Node.js version
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js: $NODE_VERSION"
else
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Check if dependencies are installed
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed"
else
    echo "⚠️  Dependencies not installed. Run: npm install"
fi

# Check environment file
if [ -f ".env" ]; then
    if grep -q "GOOGLE_AI_API_KEY=" .env; then
        echo "✅ Environment file configured"
    else
        echo "⚠️  Please add GOOGLE_AI_API_KEY to .env file"
    fi
else
    echo "⚠️  Please copy .env.example to .env and configure"
fi

# Check database
if [ -f "database.sqlite" ]; then
    echo "✅ Database initialized"
else
    echo "⚠️  Database not initialized. Run: npm run db:setup"
fi

# Check build
if [ -d "dist" ] && [ -d "frontend/dist" ]; then
    echo "✅ Project built"
else
    echo "⚠️  Project not built. Run: npm run build"
fi

echo ""
echo "🎯 Next steps:"
echo "1. Copy .env.example to .env"
echo "2. Add your GOOGLE_AI_API_KEY to .env"
echo "3. Run: npm install"
echo "4. Run: npm run db:setup"
echo "5. Run: npm start"
echo "6. Visit: http://localhost:3000"
