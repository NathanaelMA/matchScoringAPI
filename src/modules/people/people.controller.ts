import { Request, Response, NextFunction } from 'express';
import { getDb } from '../../core/database';
import { searchPeople } from './people.service';
import { SearchQuery } from './people.schema';

export async function searchController(
  req: Request<{}, {}, {}, SearchQuery>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { q } = req.query;
    const db = getDb();
    const results = await searchPeople(db, q);
    res.json(results);
  } catch (err) {
    next(err);
  }
}
