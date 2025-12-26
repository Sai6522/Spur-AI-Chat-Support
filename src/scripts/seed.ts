import { db } from '../models/database';

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with sample data...');
    
    // Ensure database is initialized
    await db.init();
    
    // Create sample conversation 1
    const conv1Id = 'sample-conv-1';
    await db.createConversation(conv1Id);
    await db.addMessage(conv1Id, 'user', 'What are your store hours?');
    await db.addMessage(conv1Id, 'ai', 'Our store hours are Monday-Friday 9AM-6PM EST. We\'re here to help during those times!');
    
    // Create sample conversation 2
    const conv2Id = 'sample-conv-2';
    await db.createConversation(conv2Id);
    await db.addMessage(conv2Id, 'user', 'What is your return policy?');
    await db.addMessage(conv2Id, 'ai', 'We offer a 30-day return policy. Items must be in original condition with tags attached.');
    
    console.log('✅ Database seeded successfully!');
    console.log('📊 Sample data created:');
    console.log('   - 2 sample conversations');
    console.log('   - 4 sample messages');
    console.log('');
    console.log('🔍 Test with:');
    console.log(`   curl http://localhost:3000/api/chat/history/${conv1Id}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
