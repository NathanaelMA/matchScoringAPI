import { describe, expect, it, vi } from 'vitest';
import { errorHandler } from './error.handler';
import { AppError } from '../errors/app.error';

function makeResponse() {
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));
  return { status, json };
}

describe('errorHandler', () => {
  it('returns app error status and message', () => {
    const res = makeResponse();

    errorHandler(new AppError(401, 'Unauthorized'), {} as never, res as never, vi.fn() as never);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  it('returns 500 for unknown errors', () => {
    const res = makeResponse();
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    errorHandler(new Error('boom'), {} as never, res as never, vi.fn() as never);

    expect(consoleSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });

    consoleSpy.mockRestore();
  });
});
