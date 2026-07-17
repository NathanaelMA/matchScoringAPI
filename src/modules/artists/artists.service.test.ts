import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient, Db } from 'mongodb';
import { seedDatabase } from '../../database/seed';
import { addMusicArtist, getArtistsMap } from './artists.service';

let mongod: MongoMemoryServer;
let client: MongoClient;
let db: Db;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  client = new MongoClient(mongod.getUri());
  await client.connect();
  db = client.db('test');
});

beforeEach(async () => {
  await seedDatabase(db);
});

afterAll(async () => {
  await client.close();
  await mongod.stop();
});

describe('addMusicArtist', () => {
  it('adds an artist to an existing genre', async () => {
    await addMusicArtist(db, 'Classical', 'Beethoven');
    const map = await getArtistsMap(db);
    expect(map.get('classical')).toContain('Beethoven');
  });

  it('does not add duplicate artists', async () => {
    await addMusicArtist(db, 'Classical', 'Beethoven');
    await addMusicArtist(db, 'Classical', 'Beethoven');
    const map = await getArtistsMap(db);
    const classicalArtists = map.get('classical') ?? [];
    const count = classicalArtists.filter((a) => a === 'Beethoven').length;
    expect(count).toBe(1);
  });

  it('upserts a new genre if it does not exist', async () => {
    await addMusicArtist(db, 'Electronic', 'Daft Punk');
    const map = await getArtistsMap(db);
    expect(map.get('electronic')).toContain('Daft Punk');
  });

  it('is genre case-insensitive for lookups', async () => {
    await addMusicArtist(db, 'classical', 'Beethoven');
    const map = await getArtistsMap(db);
    expect(map.get('classical')).toContain('Beethoven');
  });
});
