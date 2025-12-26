#!/bin/bash

echo "🚀 Quick Deploy to Render"
echo "========================"

echo "📋 Prerequisites:"
echo "1. You need a Render account: https://render.com"
echo "2. Get your API key from: https://dashboard.render.com/account/api-keys"
echo ""

echo "🔧 Manual Deployment Steps:"
echo "1. Go to https://dashboard.render.com"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect GitHub repo: https://github.com/Sai6522/Spur-AI-Chat-Support"
echo "4. Configure:"
echo "   - Name: spur-ai-chat-support"
echo "   - Build Command: ./render-build.sh"
echo "   - Start Command: npm start"
echo "   - Environment Variables:"
echo "     * GOOGLE_AI_API_KEY = AIzaSyCgCmIDIMEGNK-CYdAd7dVGNeghQGSEhg0"
echo "     * NODE_ENV = production"
echo "5. Click 'Create Web Service'"
echo ""

echo "⚡ Automated Deployment:"
echo "If you have RENDER_API_KEY set, run:"
echo "   export RENDER_API_KEY=your_render_api_key"
echo "   export GOOGLE_AI_API_KEY=AIzaSyCgCmIDIMEGNK-CYdAd7dVGNeghQGSEhg0"
echo "   ./deploy-render.sh"
echo ""

echo "🎯 Your app will be live at: https://spur-ai-chat-support.onrender.com"
echo "📊 Monitor at: https://dashboard.render.com"
