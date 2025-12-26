import { db } from '../models/database';

async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');
    
    // Initialize database (creates tables)
    await db.init();
    
    console.log('✅ Database migrations completed successfully!');
    console.log('📋 Tables created:');
    console.log('   - conversations (id, created_at)');
    console.log('   - messages (id, conversation_id, sender, text, timestamp)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
