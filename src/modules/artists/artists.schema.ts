import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const AddArtistBodySchema = z.object({
  genre: z
    .string()
    .min(1, 'Genre must not be empty')
    .openapi({ description: 'Music genre to add the artist to', example: 'Classical' }),
  artist: z
    .string()
    .min(1, 'Artist must not be empty')
    .openapi({ description: 'Artist name to add', example: 'Beethoven' }),
});

export type AddArtistBody = z.infer<typeof AddArtistBodySchema>;
