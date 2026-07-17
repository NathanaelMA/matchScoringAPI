export const SCORING_WEIGHTS = {
  name: 4,
  artists: 2,
  genres: 1,
  movies: 1,
  location: 1,
} as const;

export type MatchableField = keyof typeof SCORING_WEIGHTS;
