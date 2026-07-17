import { Express } from 'express';
import request from 'supertest';

export function getAgent(app: Express) {
  return request(app);
}
