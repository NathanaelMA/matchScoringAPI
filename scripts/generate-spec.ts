import {
  OpenAPIRegistry,
  OpenApiGeneratorV31,
  extendZodWithOpenApi,
} from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

extendZodWithOpenApi(z);

import { SearchQuerySchema, SearchResponseSchema } from '../src/modules/people/people.schema';
import { AddArtistBodySchema } from '../src/modules/artists/artists.schema';

const registry = new OpenAPIRegistry();

const ValidationErrorSchema = registry.registerComponent('schemas', 'ValidationError', {
  component: z.object({
    error: z.string(),
    details: z.array(
      z.object({
        field: z.string(),
        message: z.string(),
      })
    ),
  }),
});

registry.registerPath({
  method: 'get',
  path: '/health',
  summary: 'Health check',
  tags: ['Health'],
  responses: {
    200: {
      description: 'Service is healthy',
      content: {
        'application/json': {
          schema: z.object({ status: z.literal('ok') }),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/people/search',
  operationId: 'searchPeople',
  summary: 'Search people',
  description:
    'Search for people by a query string. Scores each person based on substring matches across name, music genres, movies, location, and associated artists. Returns only matches with score > 0, sorted by score descending then name ascending.',
  tags: ['People'],
  request: {
    query: SearchQuerySchema,
  },
  responses: {
    200: {
      description: 'List of matching people with scores and matched fields',
      content: {
        'application/json': {
          schema: SearchResponseSchema,
        },
      },
    },
    400: {
      description: 'Invalid query parameters',
      content: {
        'application/json': {
          schema: ValidationErrorSchema
        },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/artists',
  operationId: 'addArtist',
  summary: 'Add a music artist to a genre',
  description:
    'Adds an artist to the specified genre in the in-memory dataset. Duplicates are ignored. Subsequent search calls will reflect this addition.',
  tags: ['Artists'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: AddArtistBodySchema,
        },
      },
    },
  },
  responses: {
    204: {
      description: 'Artist added successfully',
    },
    400: {
      description: 'Invalid request body',
      content: {
        'application/json': {
          schema: ValidationErrorSchema
        },
      },
    },
  },
});

const generator = new OpenApiGeneratorV31(registry.definitions);
const doc = generator.generateDocument({
  openapi: '3.1.0',
  info: {
    title: 'Match Tracker API',
    version: '1.0.0',
    description:
      'API for searching people by query and managing music artists. Spec auto-generated from Zod schemas.',
  },
  servers: [{ url: 'http://localhost:3000', description: 'Local development' }],
});

const plainDoc = JSON.parse(JSON.stringify(doc));

const docsDir = path.join(__dirname, '../docs');
const yamlOutputPath = path.join(docsDir, 'openapi.yaml');
const jsOutputPath = path.join(docsDir, 'openapi.js');

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(yamlOutputPath, yaml.dump(plainDoc, { lineWidth: 120 }), 'utf-8');
fs.writeFileSync(jsOutputPath, `window.OPENAPI_SPEC = ${JSON.stringify(plainDoc, null, 2)};\n`, 'utf-8');

console.log(`OpenAPI spec written to ${yamlOutputPath}`);
console.log(`OpenAPI browser bundle written to ${jsOutputPath}`);
