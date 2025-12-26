import { db } from '../models/database';

async function setupDatabase() {
  try {
    console.log('Setting up database...');
    await db.init();
    console.log('Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
