import { Request, Response } from 'express';

export function healthController(_req: Request, res: Response): void {
  console.log("Health check endpoint called");
  res.json({ status: 'ok' });
}
