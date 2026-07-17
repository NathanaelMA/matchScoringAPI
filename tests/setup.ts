import { vi } from 'vitest';
import { MongoClient, Db } from 'mongodb';
import { connectDatabase, closeDatabase, getDb } from '../src/core/database';
import { seedDatabase } from '../src/database/seed';

export async function setupTestDatabase(): Promise<Db> {
  const db = await connectDatabase();
  await seedDatabase(db);
  return db;
}

export async function teardownTestDatabase(): Promise<void> {
  await closeDatabase();
}

export async function resetDatabase(): Promise<void> {
  const db = getDb();
  await seedDatabase(db);
}

export { getDb };
