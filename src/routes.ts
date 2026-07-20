import { Router } from 'express';
import peopleRoutes from './modules/people/people.routes';
import artistsRoutes from './modules/artists/artists.routes';

const router = Router();

router.use('/people', peopleRoutes);
router.use('/artists', artistsRoutes);

export default router;
