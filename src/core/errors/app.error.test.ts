import { describe, expect, it } from 'vitest';
import { AppError } from './app.error';

describe('AppError', () => {
  it('sets status code and message', () => {
    const err = new AppError(400, 'Bad request');

    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('Bad request');
    expect(err.name).toBe('AppError');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(AppError);
  });
});
