#!/bin/bash

echo "🚀 Deploying Spur AI Chat Support to Render..."

# Check if we have the required environment variables
if [ -z "$RENDER_API_KEY" ]; then
    echo "❌ RENDER_API_KEY environment variable is required"
    echo "   Get your API key from: https://dashboard.render.com/account/api-keys"
    echo "   Then run: export RENDER_API_KEY=your_api_key_here"
    exit 1
fi

if [ -z "$GOOGLE_AI_API_KEY" ]; then
    echo "❌ GOOGLE_AI_API_KEY environment variable is required"
    echo "   Run: export GOOGLE_AI_API_KEY=your_google_ai_key_here"
    exit 1
fi

echo "✅ Environment variables found"

# Create service via Render API
echo "📡 Creating Render service..."

RESPONSE=$(curl -s -X POST \
  https://api.render.com/v1/services \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "web_service",
    "name": "spur-ai-chat-support",
    "repo": "https://github.com/Sai6522/Spur-AI-Chat-Support",
    "branch": "main",
    "buildCommand": "./render-build.sh",
    "startCommand": "npm start",
    "plan": "free",
    "env": "node",
    "envVars": [
      {
        "key": "NODE_ENV",
        "value": "production"
      },
      {
        "key": "GOOGLE_AI_API_KEY", 
        "value": "'$GOOGLE_AI_API_KEY'"
      }
    ],
    "healthCheckPath": "/api/health"
  }')

echo "Response: $RESPONSE"

# Extract service URL from response
SERVICE_URL=$(echo $RESPONSE | grep -o '"url":"[^"]*"' | cut -d'"' -f4)

if [ ! -z "$SERVICE_URL" ]; then
    echo "✅ Deployment initiated successfully!"
    echo "🌐 Your app will be available at: $SERVICE_URL"
    echo "📊 Monitor deployment at: https://dashboard.render.com"
else
    echo "❌ Deployment failed. Check the response above for details."
    echo "💡 You can also deploy manually at: https://dashboard.render.com"
fi
