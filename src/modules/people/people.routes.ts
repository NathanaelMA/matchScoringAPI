import { Router } from 'express';
import { validate } from '../../core/middleware/validate';
import { SearchQuerySchema } from './people.schema';
import { searchController } from './people.controller';

const router = Router();

router.get('/search', validate(SearchQuerySchema, 'query'), searchController);

export default router;
