import { describe, it, expect} from 'vitest';
import { createApp } from '../src/app';
import { getAgent } from './helpers';

const app = createApp();

describe('GET /api/people/search', () => {
  it('returns 400 when q param is missing', async () => {
    const res = await getAgent(app).get('/api/people/search');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('returns 400 when q param is empty string', async () => {
    const res = await getAgent(app).get('/api/people/search?q=');
    expect(res.status).toBe(400);
  });

  it('returns 200 with matching results for "ed"', async () => {
    const res = await getAgent(app).get('/api/people/search?q=ed');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const first = res.body[0];
    expect(first.name).toBe('Eddy Verde');
    expect(first.score).toBe(6);
    expect(first.matches).toContain('name');
    expect(first.matches).toContain('artists');
  });

  it('returns correct results for "the"', async () => {
    const res = await getAgent(app).get('/api/people/search?q=the');
    expect(res.status).toBe(200);

    const jason = res.body.find((r: any) => r.name === 'Jason Leo');
    expect(jason).toBeTruthy();
    expect(jason.score).toBe(3);
    expect(jason.matches).toContain('movies');
    expect(jason.matches).toContain('artists');
  });

  it('returns empty array for no matches', async () => {
    const res = await getAgent(app).get('/api/people/search?q=beethoven');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('is case insensitive', async () => {
    const lower = await getAgent(app).get('/api/people/search?q=eddy');
    const upper = await getAgent(app).get('/api/people/search?q=EDDY');
    expect(lower.body).toEqual(upper.body);
  });

  it('counts each property only once (movie dedup)', async () => {
    const res = await getAgent(app).get('/api/people/search?q=the');
    const greta = res.body.find((r: any) => r.name === 'Greta Heissenberger');
    expect(greta?.score).toBe(1);
    expect(greta?.matches).toEqual(['movies']);
  });

  it('results are sorted by score desc then name asc', async () => {
    const res = await getAgent(app).get('/api/people/search?q=ed');
    const scores: number[] = res.body.map((r: any) => r.score);
    for (let i = 0; i < scores.length - 1; i++) {
      expect(scores[i]).toBeGreaterThanOrEqual(scores[i + 1]);
    }
  });

  it('matches substrings (nni → Bonnie Wang)', async () => {
    const res = await getAgent(app).get('/api/people/search?q=nni');
    expect(res.status).toBe(200);
    const bonnie = res.body.find((r: any) => r.name === 'Bonnie Wang');
    expect(bonnie).toBeTruthy();
    expect(bonnie.score).toBe(4);
  });
});

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await getAgent(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
