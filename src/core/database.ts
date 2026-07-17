import { MongoClient, Db } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AppError } from './errors/app.error';

let client: MongoClient | null = null;
let db: Db | null = null;
let mongod: MongoMemoryServer | null = null;

export async function connectDatabase(): Promise<Db> {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  client = new MongoClient(uri);
  await client.connect();

  db = client.db('match-scoring');
  return db;
}

export function getDb(): Db {
  if (!db) {
    throw new AppError(503, 'Database not initialized.');
  }
  return db;
}

export async function closeDatabase(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
  }
  
  if (mongod) {
    await mongod.stop();
    mongod = null;
  }
  
  db = null;
}
