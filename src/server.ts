import { createApp } from './app';
import { connectDatabase } from './core/database';
import { seedDatabase } from './database/seed';
import { env } from './config/env';

async function main() {
  const db = await connectDatabase();
  await seedDatabase(db);

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
    console.log(`API docs: http://localhost:${env.port}/api-docs`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
