import { describe, it, expect } from 'vitest';
import { parseDataset } from './parser';

const SAMPLE = `PEOPLE
---------------------------------------------
Name: Eddy Verde
Music Genre: Rock; Country
Movies: Avatar; The Good, the Bad and the Ugly
Location: Florida

Name: Bonnie Wang
Music Genre: Classical
Movies: Lilo & Stitch; Die Hard
Location: Maryland


MUSIC ARTISTS
---------------------------------------------
Rock:
Led Zeppelin
AC/DC

Country:
Alabama
`;

describe('parseDataset', () => {
  it('parses people correctly', () => {
    const { people } = parseDataset(SAMPLE);
    expect(people).toHaveLength(2);

    expect(people[0]).toEqual({
      name: 'Eddy Verde',
      genres: ['Rock', 'Country'],
      movies: ['Avatar', 'The Good, the Bad and the Ugly'],
      location: 'Florida',
    });

    expect(people[1]).toEqual({
      name: 'Bonnie Wang',
      genres: ['Classical'],
      movies: ['Lilo & Stitch', 'Die Hard'],
      location: 'Maryland',
    });
  });

  it('parses artists correctly', () => {
    const { artists } = parseDataset(SAMPLE);
    expect(artists).toHaveLength(2);

    expect(artists[0]).toEqual({ genre: 'Rock', artists: ['Led Zeppelin', 'AC/DC'] });
    expect(artists[1]).toEqual({ genre: 'Country', artists: ['Alabama'] });
  });

  it('returns empty arrays for empty input', () => {
    const result = parseDataset('PEOPLE\n---\n\nMUSIC ARTISTS\n---\n');
    expect(result.people).toHaveLength(0);
    expect(result.artists).toHaveLength(0);
  });

  it('handles input without artists section delimiter', () => {
    const result = parseDataset('PEOPLE\n---\nName: Solo Person\n');
    expect(result.people).toHaveLength(1);
    expect(result.artists).toEqual([]);
  });

  it('fills missing person fields with defaults and ignores stray artist lines', () => {
    const input = `PEOPLE
---------------------------------------------
Name: Minimal User


MUSIC ARTISTS
---------------------------------------------
orphan line before genre
Rock:
Led Zeppelin
EmptyGenre:
`;

    const result = parseDataset(input);

    expect(result.people).toEqual([
      {
        name: 'Minimal User',
        genres: [],
        movies: [],
        location: '',
      },
    ]);

    expect(result.artists).toEqual([{ genre: 'Rock', artists: ['Led Zeppelin'] }]);
  });
});
