import { PersonRecord } from '../../src/database/parser';
import { ArtistRecord } from '../../src/database/parser';

export const FIXTURE_PEOPLE: PersonRecord[] = [
  {
    name: 'Eddy Verde',
    genres: ['Rock', 'Country'],
    movies: ['Avatar', 'The Good, the Bad and the Ugly'],
    location: 'Florida',
  },
  {
    name: 'Bonnie Wang',
    genres: ['Classical'],
    movies: ['Lilo & Stitch', 'Die Hard'],
    location: 'Maryland',
  },
  {
    name: 'Greta Heissenberger',
    genres: ['Jazz', 'Rock'],
    movies: ['The Departed', 'M*A*S*H', 'The Godfather'],
    location: 'Massachusetts',
  },
  {
    name: 'Justin Coker',
    genres: ['Country'],
    movies: ['Raiders of the Lost Ark', 'Apollo 13'],
    location: 'South Carolina',
  },
  {
    name: 'Jason Leo',
    genres: ['Rock', 'Ska'],
    movies: ['The Dark Knight', 'Top Gun'],
    location: 'Maine',
  },
  {
    name: 'Doug Akridge',
    genres: ['Rock', 'Blues'],
    movies: ['Jurassic Park', 'Cast Away', 'Romeo + Juliet'],
    location: 'Washington, D.C.',
  },
];

export const FIXTURE_ARTISTS: ArtistRecord[] = [
  { genre: 'Rock', artists: ['Led Zeppelin', 'AC/DC', 'Rolling Stones'] },
  { genre: 'Country', artists: ['Alabama', 'Rascal Flatts'] },
  { genre: 'Classical', artists: ['Mozart', 'Bach', 'Chopin'] },
  { genre: 'Jazz', artists: ['Miles Davis Quintet', 'Duke Ellington', 'Louis Armstrong'] },
  { genre: 'Ska', artists: ['Sublime', 'Reel Big Fish', 'The Mighty Mighty Bosstones'] },
  { genre: 'Blues', artists: ['John Mayer Trio', 'B.B. King', 'Eric Clapton'] },
];
