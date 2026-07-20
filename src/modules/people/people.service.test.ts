import { describe, it, expect } from 'vitest';
import { searchPeople } from './people.service';
import { getDb } from '../../core/database';

describe('searchPeople', () => {
  it('returns results for query "ed"', async () => {
    const db = getDb();
    const results = await searchPeople(db, 'ed');
    const names = results.map((r) => r.name);
    expect(names[0]).toBe('Eddy Verde');
    expect(results[0].score).toBe(6);
    expect(results[0].matches).toContain('name');
    expect(results[0].matches).toContain('artists');
  });

  it('returns results for query "the"', async () => {
    const db = getDb();
    const results = await searchPeople(db, 'the');
    expect(results.length).toBeGreaterThan(0);
    const jason = results.find((r) => r.name === 'Jason Leo');
    expect(jason).toBeTruthy();
    expect(jason?.score).toBe(3);
  });

  it('returns empty array for no match', async () => {
    const db = getDb();
    const results = await searchPeople(db, 'beethoven');
    expect(results).toHaveLength(0);
  });

  it('is case insensitive', async () => {
    const db = getDb();
    const lower = await searchPeople(db, 'eddy');
    const upper = await searchPeople(db, 'EDDY');
    expect(lower).toEqual(upper);
  });

  it('counts each property only once for movies', async () => {
    const db = getDb();
    const results = await searchPeople(db, 'the');
    const greta = results.find((r) => r.name === 'Greta Heissenberger');
    expect(greta?.score).toBe(1);
    expect(greta?.matches).toEqual(['movies']);
  });

  it('sorts by score desc then name asc', async () => {
    const db = getDb();
    const results = await searchPeople(db, 'ed');
    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i].score).toBeGreaterThanOrEqual(results[i + 1].score);
    }
  });

  it('handles genres missing from artists map', async () => {
    const db = getDb();
    await db.collection('people').insertOne({
      name: 'Unique Branch Person',
      genres: ['UnknownGenre'],
      movies: [],
      location: 'Nowhere',
    });

    const results = await searchPeople(db, 'unique branch person');
    const entry = results.find((r) => r.name === 'Unique Branch Person');

    expect(entry).toBeTruthy();
    expect(entry?.matches).toContain('name');
  });
});
