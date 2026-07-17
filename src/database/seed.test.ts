import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import { seedDatabase, PEOPLE_COLLECTION, ARTISTS_COLLECTION } from './seed';

let mongod: MongoMemoryServer;
let client: MongoClient;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  client = new MongoClient(mongod.getUri());
  await client.connect();
});

afterAll(async () => {
  await client.close();
  await mongod.stop();
});

describe('seedDatabase', () => {
  it('seeds people and artists from dataset.txt', async () => {
    const db = client.db('test');
    await seedDatabase(db);

    const people = await db.collection(PEOPLE_COLLECTION).find().toArray();
    const artists = await db.collection(ARTISTS_COLLECTION).find().toArray();

    expect(people.length).toBe(6);
    expect(artists.length).toBe(6);
  });

  it('clears existing data before seeding', async () => {
    const db = client.db('test');
    await seedDatabase(db);
    await seedDatabase(db);

    const people = await db.collection(PEOPLE_COLLECTION).find().toArray();
    expect(people.length).toBe(6);
  });

  it('seeds correct people fields', async () => {
    const db = client.db('test');
    await seedDatabase(db);

    const eddy = await db.collection(PEOPLE_COLLECTION).findOne({ name: 'Eddy Verde' });
    expect(eddy).toBeTruthy();
    expect(eddy?.genres).toContain('Rock');
    expect(eddy?.genres).toContain('Country');
    expect(eddy?.location).toBe('Florida');
  });

  it('seeds correct artist fields', async () => {
    const db = client.db('test');
    await seedDatabase(db);

    const rock = await db.collection(ARTISTS_COLLECTION).findOne({ genre: 'Rock' });
    expect(rock?.artists).toContain('Led Zeppelin');
  });
});
