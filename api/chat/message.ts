import { VercelRequest, VercelResponse } from '@vercel/node';

const STORE_RESPONSES = {
  'store hours': 'Our store hours are Monday-Friday 9AM-6PM EST. We\'re here to help during those times!',
  'shipping': 'Yes! We offer free shipping on all orders over $50. Standard shipping takes 3-5 business days.',
  'return': 'We have a 30-day return policy. Items must be in original condition with tags attached.',
  'payment': 'We accept all major credit cards and PayPal for your convenience.',
  'support': 'Our customer support is available Monday-Friday 9AM-6PM EST. You can reach us anytime!',
  'location': 'We\'re based in New York, USA and ship nationwide.',
  'help': 'I\'m here to help! You can ask me about our shipping, returns, store hours, or any other questions.'
};

// Simple in-memory storage
const conversations = new Map();
const messages = new Map();

interface Message {
  id: number;
  conversationId: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

function addMessage(conversationId: string, sender: 'user' | 'ai', text: string): Message {
  const message: Message = {
    id: Date.now() + Math.random(),
    conversationId,
    sender,
    text,
    timestamp: new Date().toISOString()
  };
  
  if (!messages.has(conversationId)) {
    messages.set(conversationId, []);
  }
  messages.get(conversationId).push(message);
  
  return message;
}

function generateResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  // Check for keywords and return appropriate responses
  for (const [keyword, response] of Object.entries(STORE_RESPONSES)) {
    if (message.includes(keyword)) {
      return response;
    }
  }
  
  // Default responses for common greetings
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return 'Hello! Welcome to our store. How can I help you today? You can ask about shipping, returns, store hours, or anything else!';
  }
  
  if (message.includes('thank')) {
    return 'You\'re welcome! Is there anything else I can help you with today?';
  }
  
  // Default helpful response
  return 'I\'d be happy to help! You can ask me about our shipping policy, return policy, store hours, payment methods, or any other questions about our store.';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, sessionId } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required and must be a non-empty string' });
    }

    const conversationId = sessionId || `conv-${Date.now()}`;
    
    // Create conversation if it doesn't exist
    if (!conversations.has(conversationId)) {
      conversations.set(conversationId, {
        id: conversationId,
        createdAt: new Date().toISOString()
      });
    }

    // Add user message
    addMessage(conversationId, 'user', message.trim());

    // Generate AI response using keyword matching
    const reply = generateResponse(message.trim());

    // Add AI message
    addMessage(conversationId, 'ai', reply);

    return res.json({
      reply: reply,
      sessionId: conversationId
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.' 
    });
  }
}
