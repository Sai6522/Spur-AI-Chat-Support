import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  
  return res.json({
    hasApiKey: !!apiKey,
    keyLength: apiKey?.length || 0,
    keyStart: apiKey?.substring(0, 10) || 'none',
    env: process.env.NODE_ENV || 'unknown'
  });
}
