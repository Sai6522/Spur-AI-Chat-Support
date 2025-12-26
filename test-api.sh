#!/bin/bash

echo "🔍 Testing Spur AI Chat Agent API..."

# Test health endpoint
echo "Testing health endpoint..."
curl -s http://localhost:3000/api/health | jq '.' || echo "Health check failed"

echo ""

# Test chat endpoint (without OpenAI key, should fail gracefully)
echo "Testing chat endpoint..."
curl -s -X POST http://localhost:3000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, what are your store hours?"}' | jq '.' || echo "Chat test failed"

echo ""
echo "✅ API tests completed"
