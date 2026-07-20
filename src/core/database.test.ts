import { describe, expect, it } from 'vitest';
import { closeDatabase, connectDatabase, getDb } from './database';
import { AppError } from './errors/app.error';

describe('database', () => {
  it('getDb throws when database is not initialized', async () => {
    await closeDatabase();

    expect(() => getDb()).toThrow(AppError);
    expect(() => getDb()).toThrow('Database not initialized.');

    await connectDatabase();
  });

  it('closeDatabase is safe to call when already closed', async () => {
    await closeDatabase();
    await expect(closeDatabase()).resolves.toBeUndefined();

    await connectDatabase();
  });
});
