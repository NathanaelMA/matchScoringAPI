import { Db } from 'mongodb';
import { getAllPeople } from './people.repository';
import { getAllArtistsMap } from '../artists/artists.repository';
import { scorePersonForQuery, sortResults, SearchResult } from './scoring';

export async function searchPeople(db: Db, query: string): Promise<SearchResult[]> {
  const [people, artistsMap] = await Promise.all([
    getAllPeople(db),
    getAllArtistsMap(db),
  ]);

  const results: SearchResult[] = [];

  for (const person of people) {
    const personArtists: string[] = person.genres.flatMap(
      (genre) => artistsMap.get(genre.toLowerCase()) ?? [],
    );

    const result = scorePersonForQuery(
      {
        name: person.name,
        genres: person.genres,
        movies: person.movies,
        location: person.location,
        artists: personArtists,
      },
      query,
    );

    if (result !== null) {
      results.push(result);
    }
  }

  return sortResults(results);
}
