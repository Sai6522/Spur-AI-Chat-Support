# Deployment Guide

## Render Deployment

### Backend (Node.js Service)
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Configure:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `OPENAI_API_KEY`: Your OpenAI API key
     - `NODE_ENV`: `production`

### Frontend (Static Site)
The frontend is built and served by the backend, so no separate deployment needed.

## Vercel Deployment (Alternative)

### Full-Stack Deployment
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project root
3. Configure environment variables in Vercel dashboard
4. The `vercel.json` configuration will handle routing

## Environment Variables Required

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `DATABASE_URL`: SQLite file path (defaults to `./database.sqlite`)
- `PORT`: Server port (defaults to 3000)
- `NODE_ENV`: Environment (development/production)

## Database

For production, consider upgrading to PostgreSQL:
1. Update `DATABASE_URL` to PostgreSQL connection string
2. Replace sqlite3 with pg in package.json
3. Update database.ts to use PostgreSQL client
