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
Keep responses under 150 words.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.json({ status: 'ok', timestamp: new Date().toISOString() });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required and must be a non-empty string' });
    }

    const API_KEY = process.env.GOOGLE_AI_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ error: 'AI service not configured' });
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.7,
      }
    });

    const conversationContext = SYSTEM_PROMPT + '\n\nCustomer: ' + message.trim() + '\nAgent:';
    
    const result = await model.generateContent(conversationContext);
    const response = await result.response;
    const reply = response.text();

    if (!reply) {
      return res.status(500).json({ error: 'No response from AI' });
    }

    return res.json({
      reply: reply.trim(),
      sessionId: Date.now().toString()
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.' 
    });
  }
}
