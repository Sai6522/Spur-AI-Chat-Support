import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const API_KEY = process.env.GOOGLE_AI_API_KEY;
    if (!API_KEY) {
      return res.json({ error: 'No API key' });
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const result = await model.generateContent("Say hello");
    const response = await result.response;
    const text = response.text();
    
    return res.json({ 
      success: true, 
      response: text,
      model: "gemini-2.5-flash"
    });
    
  } catch (error: any) {
    return res.json({ 
      error: error.message,
      stack: error.stack?.split('\n')[0]
    });
  }
}
