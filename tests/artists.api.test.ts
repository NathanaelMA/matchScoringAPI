import { describe, it, expect } from 'vitest';
import { createApp } from '../src/app';
import { getAgent } from './helpers';

const app = createApp();


describe('POST /api/artists', () => {
  it('returns 400 when body is missing', async () => {
    const res = await getAgent(app).post('/api/artists').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('returns 400 when genre is missing', async () => {
    const res = await getAgent(app).post('/api/artists').send({ artist: 'Beethoven' });
    expect(res.status).toBe(400);
  });

  it('returns 400 when artist is missing', async () => {
    const res = await getAgent(app).post('/api/artists').send({ genre: 'Classical' });
    expect(res.status).toBe(400);
  });

  it('returns 204 on success', async () => {
    const res = await getAgent(app)
      .post('/api/artists')
      .send({ genre: 'Classical', artist: 'Beethoven' });
    expect(res.status).toBe(204);
  });

  it('reflects addition in subsequent search', async () => {
    await getAgent(app)
      .post('/api/artists')
      .send({ genre: 'Classical', artist: 'Beethoven' });

    const searchRes = await getAgent(app).get('/api/people/search?q=beethoven');
    expect(searchRes.status).toBe(200);
    expect(searchRes.body.length).toBeGreaterThan(0);

    const bonnie = searchRes.body.find((r: any) => r.name === 'Bonnie Wang');
    expect(bonnie).toBeTruthy();
    expect(bonnie.score).toBe(2);
    expect(bonnie.matches).toContain('artists');
  });

  it('does not add duplicate artists', async () => {
    await getAgent(app).post('/api/artists').send({ genre: 'Classical', artist: 'Beethoven' });
    await getAgent(app).post('/api/artists').send({ genre: 'Classical', artist: 'Beethoven' });

    const searchRes = await getAgent(app).get('/api/people/search?q=beethoven');
    const bonnie = searchRes.body.find((r: any) => r.name === 'Bonnie Wang');
    expect(bonnie?.score).toBe(2); // still 2, not 4
  });
});
