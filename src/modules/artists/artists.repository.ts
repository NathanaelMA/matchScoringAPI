import { Collection, Db } from 'mongodb';
import { ArtistRecord } from '../../database/parser';
import { ARTISTS_COLLECTION } from '../../database/seed';

export interface ArtistDocument extends ArtistRecord {
  _id?: unknown;
}

export function getArtistsCollection(db: Db): Collection<ArtistDocument> {
  return db.collection<ArtistDocument>(ARTISTS_COLLECTION);
}

export async function getAllArtistsMap(db: Db): Promise<Map<string, string[]>> {
  const docs = await getArtistsCollection(db)
    .find({}, { projection: { _id: 0 } })
    .toArray();

  const map = new Map<string, string[]>();
  for (const doc of docs) {
    map.set(doc.genre.toLowerCase(), doc.artists);
  }
  return map;
}

export async function addArtistToGenre(
  db: Db,
  genre: string,
  artist: string,
): Promise<void> {
  await getArtistsCollection(db).updateOne(
    { genre: { $regex: new RegExp(`^${escapeRegex(genre)}$`, 'i') } },
    {
      $addToSet: { artists: artist },
      $setOnInsert: { genre },
    },
    { upsert: true },
  );
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
