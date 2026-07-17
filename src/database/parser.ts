import fs from 'fs';
import path from 'path';

export interface PersonRecord {
  name: string;
  genres: string[];
  movies: string[];
  location: string;
}

export interface ArtistRecord {
  genre: string;
  artists: string[];
}

export interface ParsedDataset {
  people: PersonRecord[];
  artists: ArtistRecord[];
}

export function parseDataset(raw: string): ParsedDataset {
  const [peopleSection, artistsSection] = raw.split(/MUSIC ARTISTS\s*[-]+/);

  const people = parsePeople(peopleSection ?? '');
  const artists = parseArtists(artistsSection ?? '');

  return { people, artists };
}

function parsePeople(section: string): PersonRecord[] {
  const blocks = section
    .split(/(?=Name:)/)
    .map((b) => b.trim())
    .filter((b) => b.startsWith('Name:'));

  return blocks.map((block) => {
    const lines = block.split('\n').map((l) => l.trim());

    const name = extractField(lines, 'Name') ?? '';
    const genreRaw = extractField(lines, 'Music Genre') ?? '';
    const moviesRaw = extractField(lines, 'Movies') ?? '';
    const location = extractField(lines, 'Location') ?? '';

    const genres = splitSemicolon(genreRaw);
    const movies = splitSemicolon(moviesRaw);

    return { name, genres, movies, location };
  });
}

function parseArtists(section: string): ArtistRecord[] {
  const records: ArtistRecord[] = [];
  const lines = section.split('\n').map((l) => l.trim()).filter(Boolean);

  let currentGenre: string | null = null;
  let currentArtists: string[] = [];

  for (const line of lines) {
    if (line.endsWith(':')) {
      if (currentGenre && currentArtists.length > 0) {
        records.push({ genre: currentGenre, artists: currentArtists });
      }
      currentGenre = line.slice(0, -1).trim();
      currentArtists = [];
    } else if (currentGenre) {
      currentArtists.push(line);
    }
  }

  if (currentGenre && currentArtists.length > 0) {
    records.push({ genre: currentGenre, artists: currentArtists });
  }

  return records;
}

function extractField(lines: string[], field: string): string | undefined {
  const prefix = `${field}:`;
  const line = lines.find((l) => l.startsWith(prefix));
  return line?.slice(prefix.length).trim();
}

function splitSemicolon(value: string): string[] {
  return value
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function loadDataset(): ParsedDataset {
  const filePath = path.join(__dirname, 'dataset.txt');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return parseDataset(raw);
}
