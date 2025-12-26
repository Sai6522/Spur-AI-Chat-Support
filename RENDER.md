# Render Deployment Configuration

## Environment Variables Required:
- `GOOGLE_AI_API_KEY`: Your Google AI API key
- `NODE_ENV`: production
- `DATABASE_URL`: ./database.sqlite (default)

## Build Command:
```
./render-build.sh
```

## Start Command:
```
npm start
```

## Deployment Steps:

1. **Connect Repository**:
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect GitHub: https://github.com/Sai6522/Spur-AI-Chat-Support

2. **Configure Service**:
   - **Name**: spur-ai-chat-support
   - **Environment**: Node
   - **Build Command**: `./render-build.sh`
   - **Start Command**: `npm start`

3. **Environment Variables**:
   - Add `GOOGLE_AI_API_KEY` with your API key
   - Add `NODE_ENV` = `production`

4. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete

## Auto-Deploy:
- Render will automatically redeploy when you push to the main branch

## Health Check:
- Your app will be available at: `https://your-app-name.onrender.com`
- Health endpoint: `https://your-app-name.onrender.com/api/health`
