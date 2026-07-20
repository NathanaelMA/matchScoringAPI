import { describe, it, expect } from 'vitest';
import { scorePersonForQuery, sortResults, PersonData } from './scoring';

const eddy: PersonData = {
  name: 'Eddy Verde',
  genres: ['Rock', 'Country'],
  movies: ['Avatar', 'The Good, the Bad and the Ugly'],
  location: 'Florida',
  artists: ['Led Zeppelin', 'AC/DC', 'Rolling Stones', 'Alabama', 'Rascal Flatts'],
};

const greta: PersonData = {
  name: 'Greta Heissenberger',
  genres: ['Jazz', 'Rock'],
  movies: ['The Departed', 'M*A*S*H', 'The Godfather'],
  location: 'Massachusetts',
  artists: ['Miles Davis Quintet', 'Duke Ellington', 'Louis Armstrong', 'Led Zeppelin', 'AC/DC', 'Rolling Stones'],
};

const bonnie: PersonData = {
  name: 'Bonnie Wang',
  genres: ['Classical'],
  movies: ['Lilo & Stitch', 'Die Hard'],
  location: 'Maryland',
  artists: ['Mozart', 'Bach', 'Chopin'],
};

describe('scorePersonForQuery', () => {
  it('scores name match at 4 pts', () => {
    const result = scorePersonForQuery(eddy, 'eddy');
    expect(result?.score).toBe(4);
    expect(result?.matches).toContain('name');
  });

  it('scores artist match at 2 pts', () => {
    const result = scorePersonForQuery(eddy, 'zeppelin');
    expect(result?.score).toBe(2);
    expect(result?.matches).toContain('artists');
  });

  it('scores genre match at 1 pt', () => {
    const result = scorePersonForQuery(eddy, 'rock');
    expect(result?.score).toBe(1);
    expect(result?.matches).toContain('genres');
  });

  it('scores movie match at 1 pt', () => {
    const result = scorePersonForQuery(eddy, 'avatar');
    expect(result?.score).toBe(1);
    expect(result?.matches).toContain('movies');
  });

  it('scores location match at 1 pt', () => {
    const result = scorePersonForQuery(eddy, 'florida');
    expect(result?.score).toBe(1);
    expect(result?.matches).toContain('location');
  });

  it('counts each property only once even if multiple values match', () => {
    const result = scorePersonForQuery(greta, 'the');
    expect(result?.matches).toContain('movies');
    expect(result?.score).toBe(1); 
  });

  it('is case insensitive', () => {
    const result = scorePersonForQuery(eddy, 'EDDY');
    expect(result?.score).toBe(4);
  });

  it('matches substrings (nni → Bonnie Wang)', () => {
    const result = scorePersonForQuery(bonnie, 'nni');
    expect(result?.score).toBe(4);
    expect(result?.matches).toContain('name');
  });

  it('returns null when no match', () => {
    const result = scorePersonForQuery(eddy, 'beethoven');
    expect(result).toBeNull();
  });

  it('accumulates multiple matching fields', () => {
    const result = scorePersonForQuery(eddy, 'ed');
    expect(result?.score).toBe(6);
    expect(result?.matches).toContain('name');
    expect(result?.matches).toContain('artists');
  });
});

describe('sortResults', () => {
  it('sorts by score descending then name ascending', () => {
    const results = [
      { name: 'Zara', score: 2, matches: [] as any },
      { name: 'Alice', score: 5, matches: [] as any },
      { name: 'Bob', score: 5, matches: [] as any },
    ];
    const sorted = sortResults(results);
    expect(sorted[0].name).toBe('Alice');
    expect(sorted[1].name).toBe('Bob');
    expect(sorted[2].name).toBe('Zara');
  });
});
