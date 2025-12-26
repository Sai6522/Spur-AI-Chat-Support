#!/bin/bash

echo "🚀 Deploying Spur AI Chat Support to Render..."
echo "=============================================="

export RENDERCLI_APIKEY=rnd_fZv1UXOslosHtPS9PTum7wPlUUuM

echo "✅ Using your Render API key"
echo "📋 Repository: https://github.com/Sai6522/Spur-AI-Chat-Support"

echo ""
echo "🔗 One-Click Deploy Link:"
echo "https://render.com/deploy?repo=https://github.com/Sai6522/Spur-AI-Chat-Support.git"
echo ""

echo "📝 Manual Configuration:"
echo "1. Click the link above"
echo "2. Sign in to Render"
echo "3. Configure environment variables:"
echo "   - GOOGLE_AI_API_KEY = AIzaSyCgCmIDIMEGNK-CYdAd7dVGNeghQGSEhg0"
echo "   - NODE_ENV = production"
echo "4. Select 'Free' plan"
echo "5. Click 'Deploy'"
echo ""

echo "⚡ Your app will be live at: https://spur-ai-chat-support.onrender.com"
echo "📊 Monitor deployment at: https://dashboard.render.com"

# Try to open the deploy link
if command -v xdg-open > /dev/null; then
    echo "🌐 Opening deployment page..."
    xdg-open "https://render.com/deploy?repo=https://github.com/Sai6522/Spur-AI-Chat-Support.git"
elif command -v open > /dev/null; then
    echo "🌐 Opening deployment page..."
    open "https://render.com/deploy?repo=https://github.com/Sai6522/Spur-AI-Chat-Support.git"
else
    echo "💡 Copy and paste the link above into your browser"
fi
