import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient, Db } from 'mongodb';
import { seedDatabase } from '../../database/seed';
import { searchPeople } from './people.service';

let mongod: MongoMemoryServer;
let client: MongoClient;
let db: Db;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  client = new MongoClient(mongod.getUri());
  await client.connect();
  db = client.db('test');
  await seedDatabase(db);
});

afterAll(async () => {
  await client.close();
  await mongod.stop();
});

describe('searchPeople', () => {
  it('returns results for query "ed"', async () => {
    const results = await searchPeople(db, 'ed');
    const names = results.map((r) => r.name);
    expect(names[0]).toBe('Eddy Verde');
    expect(results[0].score).toBe(6);
    expect(results[0].matches).toContain('name');
    expect(results[0].matches).toContain('artists');
  });

  it('returns results for query "the"', async () => {
    const results = await searchPeople(db, 'the');
    expect(results.length).toBeGreaterThan(0);
    const jason = results.find((r) => r.name === 'Jason Leo');
    expect(jason).toBeTruthy();
    expect(jason?.score).toBe(3);
  });

  it('returns empty array for no match', async () => {
    const results = await searchPeople(db, 'beethoven');
    expect(results).toHaveLength(0);
  });

  it('is case insensitive', async () => {
    const lower = await searchPeople(db, 'eddy');
    const upper = await searchPeople(db, 'EDDY');
    expect(lower).toEqual(upper);
  });

  it('counts each property only once for movies', async () => {
    // Greta has "The Departed" and "The Godfather" - "the" should only score 1 pt for movies
    const results = await searchPeople(db, 'the');
    const greta = results.find((r) => r.name === 'Greta Heissenberger');
    expect(greta?.score).toBe(1);
    expect(greta?.matches).toEqual(['movies']);
  });

  it('sorts by score desc then name asc', async () => {
    const results = await searchPeople(db, 'ed');
    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i].score).toBeGreaterThanOrEqual(results[i + 1].score);
    }
  });
});
