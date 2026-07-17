import { beforeAll, afterAll, beforeEach } from 'vitest';
import { connectDatabase, closeDatabase, getDb } from '../src/core/database';
import { seedDatabase } from '../src/database/seed';

beforeAll(async () => {
  await connectDatabase();
});

beforeEach(async () => {
  await seedDatabase(getDb());
});

afterAll(async () => {
  await closeDatabase();
});