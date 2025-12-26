import { GoogleGenerativeAI } from '@google/generative-ai';
import { createError } from '../middleware/errorHandler';

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

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export async function generateReply(
  history: ChatMessage[],
  userMessage: string
): Promise<string> {
  try {
    const API_KEY = process.env.GOOGLE_AI_API_KEY;
    
    if (!API_KEY) {
      throw createError('Google AI API key not configured', 500);
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.7,
      }
    });

    // Build conversation context
    let conversationContext = SYSTEM_PROMPT + '\n\nConversation history:\n';
    history.slice(-5).forEach(msg => {
      conversationContext += `${msg.sender === 'user' ? 'Customer' : 'Agent'}: ${msg.text}\n`;
    });
    conversationContext += `Customer: ${userMessage}\nAgent:`;

    const result = await model.generateContent(conversationContext);
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error('No response from AI');
    }

    return text.trim();
  } catch (error: any) {
    console.error('LLM Error:', error);
    
    if (error.statusCode) {
      throw error;
    }

    // Handle Google AI specific errors
    if (error.message?.includes('API_KEY_INVALID')) {
      throw createError('AI service authentication failed. Please check API key.', 401);
    }
    
    if (error.message?.includes('RATE_LIMIT_EXCEEDED')) {
      throw createError('Too many requests. Please wait a moment and try again.', 429);
    }

    throw createError('I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.', 500);
  }
}
