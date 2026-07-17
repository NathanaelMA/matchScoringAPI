# Match Tracker API

A spec-driven REST API for searching people by query and managing music artists. Built with **TypeScript + Express + MongoDB (in-memory)**.

> **API Documentation (GitHub Pages):** [https://nathanaelma.github.io/matchScoringAPI/](https://nathanaelma.github.io/matchScoringAPI/)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Framework | Express |
| Database | MongoDB (via `mongodb-memory-server`) |
| Validation | Zod |
| API Spec | `@asteasolutions/zod-to-openapi` → OpenAPI 3.1 YAML |
| API Docs | Swagger UI on GitHub Pages |
| Testing | Vitest + Supertest |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Environment

Copy the example env file:

```bash
cp .env.example .env
```

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | HTTP port |
| `NODE_ENV` | `development` | Environment |

### Run (development)

```bash
npm run dev
```

Server starts at `http://localhost:3000`. The in-memory MongoDB is seeded automatically on startup.

### Build

```bash
npm run build
node dist/src/server.js
```

---

## API Reference

All routes are prefixed with `/api`.

### `GET /api/health`

Returns service status.

**Response `200`**
```json
{ "status": "ok" }
```

---

### `GET /api/people/search?q={query}`

Search for people by a query string. Scoring rules (case-insensitive substring match, each property counted at most once):

| Field | Points |
|---|---|
| Name | 4 |
| Musical artist | 2 |
| Music genre | 1 |
| Movie | 1 |
| Location | 1 |

Returns only results with `score > 0`, sorted by score descending then name ascending.

**Query Parameters**

| Param | Type | Required | Description |
|---|---|---|---|
| `q` | string | ✅ | Search query |

**Response `200`**
```json
[
  { "name": "Eddy Verde", "score": 6, "matches": ["name", "artists"] },
  { "name": "Greta Heissenberger", "score": 3, "matches": ["movies", "artists"] }
]
```

**Response `400`** — missing or empty `q`
```json
{
  "error": "Validation failed",
  "details": [{ "field": "q", "message": "Required" }]
}
```

**Examples**

```bash
curl "http://localhost:3000/api/people/search?q=ed"
curl "http://localhost:3000/api/people/search?q=the"
curl "http://localhost:3000/api/people/search?q=beethoven"
```

---

### `POST /api/artists`

Add a music artist to a genre. Duplicates are silently ignored. Subsequent search calls reflect the addition.

**Request Body**
```json
{ "genre": "Classical", "artist": "Beethoven" }
```

| Field | Type | Required | Description |
|---|---|---|---|
| `genre` | string | ✅ | Genre name |
| `artist` | string | ✅ | Artist name |

**Response `204`** — No Content

**Response `400`** — Validation error

**Example**

```bash
curl -X POST http://localhost:3000/api/artists \
  -H "Content-Type: application/json" \
  -d '{"genre": "Classical", "artist": "Beethoven"}'

# Now search reflects the addition:
curl "http://localhost:3000/api/people/search?q=beethoven"
# → [{ "name": "Bonnie Wang", "score": 2, "matches": ["artists"] }]
```

---

## npm Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled server |
| `npm test` | Run all tests (unit + integration) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run generate:spec` | Regenerate `docs/openapi.yaml` from Zod schemas |

---

## Project Structure

```
src/
├── server.ts                     # HTTP server entry point
├── app.ts                        # Express app setup
├── routes.ts                     # Mounts all feature routes
├── config/
│   ├── constants.ts              # Scoring weights
│   └── env.ts                    # Environment config
├── core/
│   ├── database.ts               # MongoDB connection (in-memory)
│   ├── errors/app.error.ts       # Custom errors
│   └── middleware/
│       ├── error.handler.ts      # Global error handler
│       └── validate.ts           # Zod validation middleware
├── database/
│   ├── dataset.txt               # Source dataset
│   ├── parser.ts                 # Parses dataset into typed objects
│   └── seed.ts                   # Seeds MongoDB on startup
└── modules/
    ├── health/                   # GET /api/health
    ├── artists/                  # POST /api/artists
    └── people/                   # GET /api/people/search + scoring algorithm

scripts/
└── generate-spec.ts              # Generates docs/openapi.yaml from Zod schemas

docs/
├── index.html                    # Swagger UI (GitHub Pages)
└── openapi.yaml                  # Auto-generated OpenAPI 3.1 spec

tests/
├── setup.ts                      # Test DB setup/teardown
├── helpers.ts                    # Shared test utilities
├── fixtures/dataset.ts           # Fixture data
├── people.api.test.ts            # Integration: GET /api/people/search
└── artists.api.test.ts           # Integration: POST /api/artists
```

---

## Updating the API Spec

The OpenAPI spec is **auto-generated** — do not edit `docs/openapi.yaml` directly. Instead:

1. Update the Zod schema in the relevant `*.schema.ts` file
2. Run `npm run generate:spec`
3. Commit `docs/openapi.yaml`

GitHub Pages will serve the updated spec at the docs URL above.

---

## GitHub Pages Setup

1. Push to `main`
2. Go to **Settings → Pages → Source** → select branch `main`, folder `/docs`
3. Your spec will be live at `https://nathanaelma.github.io/matchScoringAPI/`