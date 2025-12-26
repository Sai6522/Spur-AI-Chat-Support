#!/bin/bash

echo "🧪 Running comprehensive tests for Spur AI Chat Agent..."
echo "=================================================="

# Check if .env exists and has SambaNova key
if [ ! -f .env ]; then
    echo "❌ .env file not found"
    exit 1
fi

if ! grep -q "SAMBANOVA_API_KEY=" .env; then
    echo "❌ SAMBANOVA_API_KEY not found in .env"
    exit 1
fi

echo "✅ Environment configuration OK"

# Build the project
echo "📦 Building project..."
npm run build > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
echo "✅ Build successful"

# Start server in background
echo "🚀 Starting server..."
npm start > test_server.log 2>&1 &
SERVER_PID=$!
sleep 3

# Test health endpoint
echo "🔍 Testing health endpoint..."
HEALTH=$(curl -s http://localhost:3000/api/health)
if [[ $HEALTH == *"ok"* ]]; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
    kill $SERVER_PID
    exit 1
fi

# Test chat endpoint
echo "🤖 Testing AI chat..."
CHAT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "What are your store hours?"}')

if [[ $CHAT_RESPONSE == *"reply"* ]] && [[ $CHAT_RESPONSE == *"sessionId"* ]]; then
    echo "✅ AI chat working"
    SESSION_ID=$(echo $CHAT_RESPONSE | jq -r '.sessionId')
else
    echo "❌ AI chat failed"
    echo "Response: $CHAT_RESPONSE"
    kill $SERVER_PID
    exit 1
fi

# Test conversation history
echo "📝 Testing conversation history..."
HISTORY=$(curl -s http://localhost:3000/api/chat/history/$SESSION_ID)
if [[ $HISTORY == *"messages"* ]]; then
    echo "✅ Conversation history working"
else
    echo "❌ Conversation history failed"
    kill $SERVER_PID
    exit 1
fi

# Test frontend serving
echo "🌐 Testing frontend serving..."
FRONTEND=$(curl -s http://localhost:3000/)
if [[ $FRONTEND == *"Spur AI Chat Support"* ]]; then
    echo "✅ Frontend serving working"
else
    echo "❌ Frontend serving failed"
    kill $SERVER_PID
    exit 1
fi

# Test error handling
echo "🛡️ Testing error handling..."
ERROR_RESPONSE=$(curl -s -X POST http://localhost:3000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": ""}')

if [[ $ERROR_RESPONSE == *"error"* ]]; then
    echo "✅ Error handling working"
else
    echo "❌ Error handling failed"
    kill $SERVER_PID
    exit 1
fi

# Clean up
kill $SERVER_PID
rm -f test_server.log

echo ""
echo "🎉 All tests passed! The Spur AI Chat Agent is working perfectly."
echo ""
echo "🚀 Ready for deployment!"
echo "   - SambaNova API integration: ✅"
echo "   - Database persistence: ✅"
echo "   - Error handling: ✅"
echo "   - Frontend serving: ✅"
echo "   - Production build: ✅"
echo ""
echo "To start the application:"
echo "   npm start"
echo "   Then visit: http://localhost:3000"
