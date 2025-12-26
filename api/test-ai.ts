import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    // Test simple Puter.js API call
    const response = await fetch('https://api.puter.com/v1/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-nano',
        messages: [
          { role: 'user', content: 'Say hello in one sentence' }
        ]
      })
    });

    if (!response.ok) {
      return res.json({ 
        error: `Puter API error: ${response.status}`,
        status: response.status
      });
    }

    const data = await response.json();
    
    return res.json({ 
      success: true, 
      response: data,
      model: "gpt-4.1-nano via Puter.js"
    });
    
  } catch (error: any) {
    return res.json({ 
      error: error.message,
      stack: error.stack?.split('\n')[0]
    });
  }
}
