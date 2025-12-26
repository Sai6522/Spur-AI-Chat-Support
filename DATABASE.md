# Database Setup Guide

## Local Development

### SQLite Setup (Local)
```bash
# Initialize database
npm run db:setup

# This creates database.sqlite with tables:
# - conversations (id, created_at)
# - messages (id, conversation_id, sender, text, timestamp)
```

## Production Deployment

### ⚠️ Important: Vercel Limitations
Vercel serverless functions are **stateless** - SQLite files don't persist between requests.

### Options for Production:

#### Option 1: In-Memory Storage (Current)
- ✅ Works immediately
- ❌ Data lost between requests
- ❌ No conversation history

#### Option 2: PostgreSQL (Recommended)
```bash
# Add PostgreSQL support
npm install pg @types/pg

# Update DATABASE_URL in Vercel:
# postgresql://user:pass@host:port/dbname
```

#### Option 3: Vercel KV (Redis)
```bash
# Add Vercel KV
npm install @vercel/kv

# Enable in Vercel dashboard
```

#### Option 4: PlanetScale/Supabase
```bash
# Add MySQL/PostgreSQL client
npm install mysql2
# or
npm install @supabase/supabase-js
```

## Current Implementation

### For Vercel (Serverless)
The current Vercel deployment uses **in-memory storage** - conversations don't persist between requests.

### Database Schema
```sql
-- conversations table
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- messages table  
CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'ai')),
  text TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations (id)
);
```

## Migration Scripts

### Local SQLite Migration
```bash
npm run db:setup  # Creates tables
```

### PostgreSQL Migration (Production)
```sql
-- Run these commands in your PostgreSQL database:

CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'ai')),
  text TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations (id)
);
```

## Recommendation

For the **Spur assignment demo**, the current setup works fine since:
- ✅ Shows all required functionality
- ✅ AI responses work
- ✅ Chat interface works
- ✅ Error handling works

For **production use**, add PostgreSQL:
1. Create free PostgreSQL database (Supabase/PlanetScale)
2. Update `DATABASE_URL` environment variable
3. Replace SQLite code with PostgreSQL client
