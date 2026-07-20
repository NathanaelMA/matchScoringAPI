import { describe, it, expect, vi } from 'vitest';
import { seedDatabase, PEOPLE_COLLECTION, ARTISTS_COLLECTION } from './seed';
import { getDb } from '../core/database';

describe('seedDatabase', () => {
  it('seeds people and artists from dataset.txt', async () => {
    const db = getDb();
    await seedDatabase(db);

    const people = await db.collection(PEOPLE_COLLECTION).find().toArray();
    const artists = await db.collection(ARTISTS_COLLECTION).find().toArray();

    expect(people.length).toBe(6);
    expect(artists.length).toBe(6);
  });

  it('clears existing data before seeding', async () => {
    const db = getDb();
    await seedDatabase(db);
    await seedDatabase(db);

    const people = await db.collection(PEOPLE_COLLECTION).find().toArray();
    expect(people.length).toBe(6);
  });

  it('seeds correct people fields', async () => {
    const db = getDb();
    await seedDatabase(db);

    const eddy = await db.collection(PEOPLE_COLLECTION).findOne({ name: 'Eddy Verde' });
    expect(eddy).toBeTruthy();
    expect(eddy?.genres).toContain('Rock');
    expect(eddy?.genres).toContain('Country');
    expect(eddy?.location).toBe('Florida');
  });

  it('seeds correct artist fields', async () => {
    const db = getDb();
    await seedDatabase(db);

    const rock = await db.collection(ARTISTS_COLLECTION).findOne({ genre: 'Rock' });
    expect(rock?.artists).toContain('Led Zeppelin');
  });

  it('skips inserts when parsed dataset is empty', async () => {
    vi.resetModules();
    vi.doMock('./parser', () => ({
      loadDataset: () => ({ people: [], artists: [] }),
    }));

    const mockedSeedModule = await import('./seed.js');
    const db = getDb();

    await mockedSeedModule.seedDatabase(db);

    const people = await db.collection(mockedSeedModule.PEOPLE_COLLECTION).find().toArray();
    const artists = await db.collection(mockedSeedModule.ARTISTS_COLLECTION).find().toArray();

    expect(people).toEqual([]);
    expect(artists).toEqual([]);

    vi.doUnmock('./parser');
    vi.resetModules();
  });
});
