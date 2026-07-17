import express from 'express';
import path from 'path';
import routes from './routes';
import healthRoutes from './modules/health/health.routes';
import { errorHandler } from './core/middleware/error.handler';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use('/api-docs', express.static(path.resolve(process.cwd(), 'docs')));
  app.use('/health', healthRoutes);

  app.use('/api', routes);

  app.use(errorHandler);

  return app;
}
