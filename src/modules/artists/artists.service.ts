import { Db } from 'mongodb';
import { addArtistToGenre, getAllArtistsMap } from './artists.repository';

export async function addMusicArtist(db: Db, genre: string, artist: string): Promise<void> {
  await addArtistToGenre(db, genre, artist);
}

export async function getArtistsMap(db: Db): Promise<Map<string, string[]>> {
  return getAllArtistsMap(db);
}
