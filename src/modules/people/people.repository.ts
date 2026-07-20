import { Collection, Db } from 'mongodb';
import { PersonRecord } from '../../database/parser';
import { PEOPLE_COLLECTION } from '../../database/seed';

export function getPeopleCollection(db: Db): Collection<PersonRecord> {
  return db.collection<PersonRecord>(PEOPLE_COLLECTION);
}

export async function getAllPeople(db: Db): Promise<PersonRecord[]> {
  return getPeopleCollection(db).find({}, { projection: { _id: 0 } }).toArray();
}
