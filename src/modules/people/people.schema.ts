import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const SearchQuerySchema = z.object({
  q: z
    .string().trim()
    .min(1, 'Query must not be empty')
    .openapi({ description: 'Search query string', example: 'ed' }),
});

export const SearchResultSchema = z.object({
  name: z.string().openapi({ example: 'Eddy Verde' }),
  score: z.number().openapi({ example: 6 }),
  matches: z
    .array(z.enum(['name', 'genres', 'movies', 'location', 'artists']))
    .openapi({ example: ['name', 'artists'] }),
});

export const SearchResponseSchema = z.array(SearchResultSchema);

export type SearchQuery = z.infer<typeof SearchQuerySchema>;
export type SearchResult = z.infer<typeof SearchResultSchema>;
