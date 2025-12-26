import { Router, Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../models/database';
import { generateReply } from '../services/llm';
import { createError } from '../middleware/errorHandler';

const router = Router();

interface ChatRequest {
  message: string;
  sessionId?: string;
}

interface ChatResponse {
  reply: string;
  sessionId: string;
}

// Validation middleware
const validateChatMessage = (req: Request, res: Response, next: NextFunction) => {
  const { message, sessionId } = req.body as ChatRequest;

  if (!message || typeof message !== 'string') {
    return next(createError('Message is required and must be a string', 400));
  }

  if (message.trim().length === 0) {
    return next(createError('Message cannot be empty', 400));
  }

  if (message.length > 1000) {
    return next(createError('Message too long (max 1000 characters)', 400));
  }

  if (sessionId && typeof sessionId !== 'string') {
    return next(createError('SessionId must be a string', 400));
  }

  next();
};

router.post('/message', validateChatMessage, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message, sessionId } = req.body as ChatRequest;
    
    // Generate or validate session ID
    let conversationId = sessionId || uuidv4();
    
    // Create conversation if it doesn't exist
    if (!await db.conversationExists(conversationId)) {
      await db.createConversation(conversationId);
    }

    // Get conversation history
    const history = await db.getMessages(conversationId);
    
    // Add user message to database
    await db.addMessage(conversationId, 'user', message.trim());

    // Generate AI reply
    const reply = await generateReply(
      history.map(msg => ({ sender: msg.sender, text: msg.text })),
      message.trim()
    );

    // Add AI reply to database
    await db.addMessage(conversationId, 'ai', reply);

    const response: ChatResponse = {
      reply,
      sessionId: conversationId
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Get conversation history
router.get('/history/:sessionId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.params;
    
    if (!await db.conversationExists(sessionId)) {
      return next(createError('Conversation not found', 404));
    }

    const messages = await db.getMessages(sessionId);
    res.json({ messages });
  } catch (error) {
    next(error);
  }
});

export { router as chatRouter };
