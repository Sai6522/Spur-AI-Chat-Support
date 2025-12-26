import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

const STORE_KNOWLEDGE = `
Store Information:
- Shipping: Free shipping on orders over $50. Standard shipping takes 3-5 business days.
- Returns: 30-day return policy. Items must be in original condition with tags attached.
- Support Hours: Monday-Friday 9AM-6PM EST
- Payment: We accept all major credit cards and PayPal
- Location: Based in New York, USA
- Specialties: Quality products with excellent customer service
`;

const SYSTEM_PROMPT = `You are a helpful customer support agent for an e-commerce store. 
Answer questions clearly and concisely. Be friendly and professional.
Use the store information provided to answer questions accurately.

${STORE_KNOWLEDGE}

If you don't know something specific, politely say so and offer to connect them with a human agent.
Keep responses under 200 words and always complete your sentences.`;

// Simple in-memory storage (resets on each cold start)
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

function getMessages(conversationId: string): Message[] {
  return messages.get(conversationId) || [];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
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

    const API_KEY = process.env.GOOGLE_AI_API_KEY;
    console.log('API Key exists:', !!API_KEY);
    console.log('API Key length:', API_KEY?.length || 0);
    
    if (!API_KEY) {
      console.error('No API key found');
      return res.status(500).json({ error: 'AI service not configured' });
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.7,
      }
    });

    // Get conversation history for context
    const history = getMessages(conversationId);
    let conversationContext = SYSTEM_PROMPT + '\n\nConversation history:\n';
    history.slice(-5).forEach(msg => {
      conversationContext += `${msg.sender === 'user' ? 'Customer' : 'Agent'}: ${msg.text}\n`;
    });
    conversationContext += `Customer: ${message.trim()}\nAgent:`;
    
    const result = await model.generateContent(conversationContext);
    console.log('AI API call successful');
    const response = await result.response;
    const reply = response.text();
    console.log('Reply received:', reply?.substring(0, 50) + '...');

    if (!reply) {
      return res.status(500).json({ error: 'No response from AI' });
    }

    // Add AI message
    addMessage(conversationId, 'ai', reply.trim());

    return res.json({
      reply: reply.trim(),
      sessionId: conversationId
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.' 
    });
  }
}
