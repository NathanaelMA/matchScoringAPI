import { Request, Response } from 'express';
import { getDb } from '../../core/database';
import { addMusicArtist } from './artists.service';
import { AddArtistBody } from './artists.schema';

export async function addArtistController(
  req: Request<{}, {}, AddArtistBody>,
  res: Response,
): Promise<void> {
const { genre, artist } = req.body;
  const db = getDb();
  
  await addMusicArtist(db, genre, artist);
  res.status(204).send();
}
