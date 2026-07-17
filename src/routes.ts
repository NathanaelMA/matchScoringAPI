import { Router } from 'express';
import healthRoutes from './modules/health/health.routes';
import peopleRoutes from './modules/people/people.routes';
import artistsRoutes from './modules/artists/artists.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/people', peopleRoutes);
router.use('/artists', artistsRoutes);

export default router;
