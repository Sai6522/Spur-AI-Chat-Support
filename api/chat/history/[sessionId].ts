import { VercelRequest, VercelResponse } from '@vercel/node';

// Same in-memory storage as chat/message.ts
const messages = new Map();

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sessionId } = req.query;

  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ error: 'Session ID is required' });
  }

  const conversationMessages = messages.get(sessionId) || [];
  
  return res.json({ 
    messages: conversationMessages,
    note: 'In-memory storage - data resets on serverless cold starts'
  });
}
