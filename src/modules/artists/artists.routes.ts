import { Router } from 'express';
import { validate } from '../../core/middleware/validate';
import { AddArtistBodySchema } from './artists.schema';
import { addArtistController } from './artists.controller';

const router = Router();

router.post('/', validate(AddArtistBodySchema, 'body'), addArtistController);

export default router;
