#!/bin/bash

echo "🚀 Starting Spur AI Chat Agent..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please copy .env.example to .env and add your OPENAI_API_KEY"
    exit 1
fi

# Check if OPENAI_API_KEY is set
if ! grep -q "OPENAI_API_KEY=sk-" .env; then
    echo "⚠️  Warning: OPENAI_API_KEY not set in .env file"
    echo "   Please add your OpenAI API key to test the AI functionality"
fi

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful!"
echo ""
echo "🌐 Starting server on http://localhost:3000"
echo "   Press Ctrl+C to stop"
echo ""

# Start the server
npm start
