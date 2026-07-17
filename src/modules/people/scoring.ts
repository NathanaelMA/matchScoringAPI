import { SCORING_WEIGHTS, MatchableField } from '../../config/constants';

export interface PersonData {
  name: string;
  genres: string[];
  movies: string[];
  location: string;
  artists: string[];
}

export interface SearchResult {
  name: string;
  score: number;
  matches: MatchableField[];
}

export function scorePersonForQuery(person: PersonData, query: string): SearchResult | null {
  const q = query.toLowerCase();

  let score = 0;
  const matches: MatchableField[] = [];

  if (containsSubstring(person.name, q)) {
    score += SCORING_WEIGHTS.name;
    matches.push('name');
  }

  if (person.genres.some((g) => containsSubstring(g, q))) {
    score += SCORING_WEIGHTS.genres;
    matches.push('genres');
  }

  // Movies: count only once even if multiple movies match
  if (person.movies.some((m) => containsSubstring(m, q))) {
    score += SCORING_WEIGHTS.movies;
    matches.push('movies');
  }

  if (containsSubstring(person.location, q)) {
    score += SCORING_WEIGHTS.location;
    matches.push('location');
  }

  if (person.artists.some((a) => containsSubstring(a, q))) {
    score += SCORING_WEIGHTS.artists;
    matches.push('artists');
  }

  if (score === 0) return null;

  return { name: person.name, score, matches };
}

export function sortResults(results: SearchResult[]): SearchResult[] {
  return [...results].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.name.localeCompare(b.name);
  });
}

function containsSubstring(value: string, query: string): boolean {
  return value.toLowerCase().includes(query);
}
