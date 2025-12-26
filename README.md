# Spur AI Live Chat Agent

A mini AI support agent for live chat widget built with Node.js, TypeScript, and Svelte.

## Quick Start

1. **Clone and setup:**
```bash
git clone <your-repo-url>
cd spur-chat-agent
npm install
cp .env.example .env
```

2. **Add your Google AI API key to `.env`:**
```
GOOGLE_AI_API_KEY=your-google-ai-api-key-here
```

3. **Initialize database:**
```bash
npm run db:setup
```

4. **Start development servers:**
```bash
# Terminal 1 - Backend (port 3000)
npm run dev:backend

# Terminal 2 - Frontend (port 5173)
npm run dev:frontend
```

5. **Visit http://localhost:5173**

## Production Build & Start

```bash
npm run build
npm start
# Or use the convenience script:
./start.sh
```

## Architecture Overview

### Backend Structure
- **Routes**: Express.js routes handling chat endpoints
- **Services**: LLM integration and business logic
- **Models**: Database models and queries
- **Middleware**: Error handling and validation

### Frontend Structure
- **Svelte**: Reactive chat UI components
- **API Client**: HTTP client for backend communication
- **State Management**: Simple reactive stores

### Database Schema
- `conversations`: Session management
- `messages`: Chat history with user/AI distinction

## Tech Stack

- **Backend**: Node.js + TypeScript + Express
- **Frontend**: Svelte + Vite
- **Database**: SQLite (for simplicity)
- **LLM**: Google Gemini 2.5 Flash

## API Endpoints

### POST /api/chat/message
Send a chat message and get AI response.

**Request:**
```json
{
  "message": "What's your return policy?",
  "sessionId": "optional-session-id"
}
```

**Response:**
```json
{
  "reply": "Our return policy allows...",
  "sessionId": "generated-or-existing-session-id"
}
```

### GET /api/chat/history/:sessionId
Get conversation history for a session.

## LLM Integration

### Provider: Google Gemini 2.5 Flash
- **System Prompt**: Configured as helpful e-commerce support agent
- **Context**: Includes conversation history and store knowledge
- **Error Handling**: Graceful fallbacks for API failures
- **Cost Control**: Max 150 tokens per response

### Store Knowledge Base
- Shipping: Free shipping over $50, 3-5 business days
- Returns: 30-day return policy, original condition required
- Support: Available Mon-Fri 9AM-6PM EST
- Payment: Accept all major credit cards and PayPal

## Features

✅ **Real-time Chat Interface**
- Clean, responsive design
- Auto-scroll to latest messages
- Typing indicators
- Message timestamps

✅ **AI Integration**
- OpenAI GPT-3.5-turbo integration
- Context-aware responses
- Store knowledge base
- Error handling with fallbacks

✅ **Data Persistence**
- SQLite database
- Session management
- Conversation history
- Message persistence

✅ **Robust Error Handling**
- Input validation
- API error handling
- Graceful degradation
- User-friendly error messages

✅ **Production Ready**
- TypeScript throughout
- Rate limiting
- Security headers
- Environment configuration

## Design Decisions

1. **SQLite**: Simple setup, no external dependencies
2. **Session-based**: Conversations persist across page reloads
3. **Minimal UI**: Focus on functionality over aesthetics
4. **Error Boundaries**: Comprehensive error handling at all layers

## Trade-offs & Future Improvements

### If I had more time:
- **Redis Caching**: Cache frequent responses
- **WebSocket**: Real-time messaging instead of polling
- **Authentication**: User accounts and conversation ownership
- **Advanced Prompting**: RAG with vector database for better knowledge retrieval
- **Rate Limiting**: Prevent API abuse
- **Message Streaming**: Stream LLM responses for better UX
- **Rich Media**: Support for images, files, quick replies
- **Analytics**: Conversation metrics and insights

### Current Limitations:
- No real-time updates (requires page refresh for new sessions)
- Basic error messages (could be more user-friendly)
- Simple prompt engineering (could be more sophisticated)
- No conversation branching or context management

## Deployment

### Render (Recommended)
1. Connect GitHub repository
2. Create Web Service
3. Set environment variables:
   - `GOOGLE_AI_API_KEY`
   - `NODE_ENV=production`

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project root
3. Configure environment variables

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## Scripts

```bash
npm run dev:backend     # Start backend in development
npm run dev:frontend    # Start frontend in development
npm run build          # Build both frontend and backend
npm run start          # Start production server
npm run db:setup       # Initialize database
./start.sh             # Build and start (convenience script)
```

## Environment Variables

- `GOOGLE_AI_API_KEY`: Your Google AI API key (required)
- `DATABASE_URL`: SQLite file path (defaults to `./database.sqlite`)
- `PORT`: Server port (defaults to 3000)
- `NODE_ENV`: Environment (development/production)
