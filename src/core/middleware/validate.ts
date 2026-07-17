import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';

type ValidationTarget = 'body' | 'query' | 'params';

export function validate<T>(schema: ZodType<T>, target: ValidationTarget = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const errors = result.error.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      res.status(400).json({ error: 'Validation failed', details: errors });
      return;
    }

    if (target === 'body') {
      req.body = result.data;
    }

    next();
  };
}
