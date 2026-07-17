import { Db } from 'mongodb';
import { loadDataset } from './parser';

export const PEOPLE_COLLECTION = 'people';
export const ARTISTS_COLLECTION = 'artists';

export async function seedDatabase(db: Db): Promise<void> {
  const { people, artists } = loadDataset();

  const peopleCol = db.collection(PEOPLE_COLLECTION);
  const artistsCol = db.collection(ARTISTS_COLLECTION);

  await peopleCol.deleteMany({});
  await artistsCol.deleteMany({});

  if (people.length > 0) {
    await peopleCol.insertMany(people);
  }

  if (artists.length > 0) {
    await artistsCol.insertMany(artists);
  }
}
