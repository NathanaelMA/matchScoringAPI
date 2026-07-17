import { Collection, Db } from 'mongodb';
import { PersonRecord } from '../../database/parser';
import { PEOPLE_COLLECTION } from '../../database/seed';

export interface PersonDocument extends PersonRecord {
  _id?: unknown;
}

export function getPeopleCollection(db: Db): Collection<PersonDocument> {
  return db.collection<PersonDocument>(PEOPLE_COLLECTION);
}

export async function getAllPeople(db: Db): Promise<PersonDocument[]> {
  return getPeopleCollection(db).find({}, { projection: { _id: 0 } }).toArray();
}
