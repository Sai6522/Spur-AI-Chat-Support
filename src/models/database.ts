import sqlite3 from 'sqlite3';
import { promisify } from 'util';

class Database {
  private db: sqlite3.Database;

  constructor(dbPath: string = './database.sqlite') {
    this.db = new sqlite3.Database(dbPath);
  }

  async init(): Promise<void> {
    const run = promisify(this.db.run.bind(this.db)) as (sql: string) => Promise<sqlite3.RunResult>;
    
    await run(`
      CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id TEXT NOT NULL,
        sender TEXT NOT NULL CHECK (sender IN ('user', 'ai')),
        text TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversations (id)
      )
    `);
  }

  async createConversation(id: string): Promise<void> {
    const run = promisify(this.db.run.bind(this.db)) as (sql: string, params: any[]) => Promise<sqlite3.RunResult>;
    await run('INSERT INTO conversations (id) VALUES (?)', [id]);
  }

  async addMessage(conversationId: string, sender: 'user' | 'ai', text: string): Promise<void> {
    const run = promisify(this.db.run.bind(this.db)) as (sql: string, params: any[]) => Promise<sqlite3.RunResult>;
    await run(
      'INSERT INTO messages (conversation_id, sender, text) VALUES (?, ?, ?)',
      [conversationId, sender, text]
    );
  }

  async getMessages(conversationId: string): Promise<Array<{
    id: number;
    sender: 'user' | 'ai';
    text: string;
    timestamp: string;
  }>> {
    const all = promisify(this.db.all.bind(this.db)) as (sql: string, params: any[]) => Promise<any[]>;
    const results = await all(
      'SELECT id, sender, text, timestamp FROM messages WHERE conversation_id = ? ORDER BY timestamp ASC',
      [conversationId]
    );
    return results as Array<{
      id: number;
      sender: 'user' | 'ai';
      text: string;
      timestamp: string;
    }>;
  }

  async conversationExists(id: string): Promise<boolean> {
    const get = promisify(this.db.get.bind(this.db)) as (sql: string, params: any[]) => Promise<any>;
    const result = await get('SELECT id FROM conversations WHERE id = ?', [id]);
    return !!result;
  }
}

export const db = new Database(process.env.DATABASE_URL);
