import { describe, it, expect } from 'vitest';
import { getDb } from '../../core/database';
import { addMusicArtist, getArtistsMap } from './artists.service';

describe('addMusicArtist', () => {
  it('adds an artist to an existing genre', async () => {
    const db = getDb();
    await addMusicArtist(db, 'Classical', 'Beethoven');
    const map = await getArtistsMap(db);
    expect(map.get('classical')).toContain('Beethoven');
  });

  it('does not add duplicate artists', async () => {
    const db = getDb();
    await addMusicArtist(db, 'Classical', 'Beethoven');
    await addMusicArtist(db, 'Classical', 'Beethoven');
    const map = await getArtistsMap(db);
    const classicalArtists = map.get('classical') ?? [];
    const count = classicalArtists.filter((a) => a === 'Beethoven').length;
    expect(count).toBe(1);
  });

  it('upserts a new genre if it does not exist', async () => {
    const db = getDb();
    await addMusicArtist(db, 'Electronic', 'Daft Punk');
    const map = await getArtistsMap(db);
    expect(map.get('electronic')).toContain('Daft Punk');
  });

  it('is genre case-insensitive for lookups', async () => {
    const db = getDb();
    await addMusicArtist(db, 'classical', 'Beethoven');
    const map = await getArtistsMap(db);
    expect(map.get('classical')).toContain('Beethoven');
  });
});
