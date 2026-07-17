import { MongoClient, Db } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

let client: MongoClient;
let db: Db;
let mongod: MongoMemoryServer;

export async function connectDatabase(): Promise<Db> {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  client = new MongoClient(uri);
  await client.connect();

  db = client.db('match-tracker');
  return db;
}

export function getDb(): Db {
  if (!db) {
    throw new Error('Database not initialized. Call connectDatabase() first.');
  }
  return db;
}

export async function closeDatabase(): Promise<void> {
  await client?.close();
  await mongod?.stop();
}
