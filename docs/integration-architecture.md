# Integration Architecture

Generated: 2026-01-10

## Overview

The NYC Apartment Review Platform is a multi-part application with three tightly integrated components: React frontend (client), Express backend (server), and shared TypeScript code (shared).

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                           Browser                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    React SPA                             │    │
│  │  ┌──────────┐  ┌───────────┐  ┌─────────────────────┐   │    │
│  │  │  Pages   │  │Components │  │    React Query      │   │    │
│  │  └────┬─────┘  └─────┬─────┘  └──────────┬──────────┘   │    │
│  │       │              │                    │              │    │
│  │       └──────────────┴────────────────────┘              │    │
│  │                          │                               │    │
│  │                   Types from @shared                     │    │
│  └──────────────────────────┼───────────────────────────────┘    │
└─────────────────────────────┼────────────────────────────────────┘
                              │ HTTP (fetch)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Express Server                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Middleware                            │    │
│  │  ┌────────────┐  ┌───────────┐  ┌────────────────────┐  │    │
│  │  │   JSON     │  │  Session  │  │   Auth (Passport)  │  │    │
│  │  └────────────┘  └───────────┘  └────────────────────┘  │    │
│  └─────────────────────────┬───────────────────────────────┘    │
│                            │                                     │
│  ┌─────────────────────────┼───────────────────────────────┐    │
│  │         Routes          │                               │    │
│  │  ┌──────────────────────┴─────────────────────────────┐│    │
│  │  │ /api/buildings  /api/reviews  /api/admin  /api/auth││    │
│  │  └────────────────────────────────────────────────────┘│    │
│  │                         │                               │    │
│  │              Schemas from @shared                       │    │
│  └─────────────────────────┼───────────────────────────────┘    │
│                            │                                     │
│  ┌─────────────────────────┴───────────────────────────────┐    │
│  │                   Storage Layer                          │    │
│  │  ┌────────────────────────────────────────────────────┐ │    │
│  │  │           IStorage (DatabaseStorage)               │ │    │
│  │  └────────────────────────┬───────────────────────────┘ │    │
│  │                           │                              │    │
│  │                  Tables from @shared                     │    │
│  └───────────────────────────┼──────────────────────────────┘    │
└──────────────────────────────┼───────────────────────────────────┘
                               │ SQL (Drizzle)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        PostgreSQL                                │
│  ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌────────────────┐    │
│  │ users   │  │buildings│  │ reviews  │  │ review_photos  │    │
│  └─────────┘  └─────────┘  └──────────┘  └────────────────┘    │
│  ┌─────────┐                                                    │
│  │sessions │                                                    │
│  └─────────┘                                                    │
└─────────────────────────────────────────────────────────────────┘
```

## Integration Points

### 1. Client → Server (HTTP API)

**Protocol**: REST over HTTP/HTTPS
**Format**: JSON
**Authentication**: Session cookies

**API Calls**:
```typescript
// React Query fetch
const { data } = useQuery({
  queryKey: ["/api/buildings"],
  queryFn: () => fetch("/api/buildings").then(r => r.json()),
});

// Mutation
const mutation = useMutation({
  mutationFn: (data) =>
    fetch("/api/buildings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    }),
});
```

### 2. Server → Database (Drizzle ORM)

**Protocol**: PostgreSQL wire protocol
**Connection**: pg Pool with connection string
**ORM**: Drizzle with typed schema

**Query Pattern**:
```typescript
// Select with filters
const buildings = await db
  .select()
  .from(buildings)
  .where(and(
    eq(buildings.status, "approved"),
    ilike(buildings.name, `%${query}%`)
  ));

// Aggregate with joins
const stats = await db
  .select({
    count: count(),
    avgRating: avg(reviews.overallRating),
  })
  .from(reviews)
  .where(eq(reviews.buildingId, id));
```

### 3. Shared Code Distribution

**Location**: `shared/` directory
**Imports**: Via TypeScript path alias `@shared/*`

**What's Shared**:
| File | Contents | Used By |
|------|----------|---------|
| `schema.ts` | Drizzle tables, Zod schemas, types | Both |
| `models/auth.ts` | User/session tables | Server |

**Type Flow**:
```
shared/schema.ts
       │
       ├─────────────────────────────┐
       │                             │
       ▼                             ▼
  client/pages/*              server/storage.ts
  (import types)              (import tables + types)
       │                             │
       ▼                             ▼
  Type-safe UI               Type-safe queries
```

## Data Flow Examples

### Building Search Flow

```
1. User types in search box
           │
           ▼
2. SearchPage updates query state
           │
           ▼
3. React Query fetches /api/buildings?q=...
           │
           ▼
4. Express route handler validates params
           │
           ▼
5. storage.getBuildings(filters) called
           │
           ▼
6. Drizzle queries buildings + aggregates ratings
           │
           ▼
7. JSON array returned to client
           │
           ▼
8. BuildingCard components render results
```

### Authentication Flow

```
1. User clicks "Sign In"
           │
           ▼
2. Browser redirects to /api/login
           │
           ▼
3. Passport initiates Replit OAuth
           │
           ▼
4. User authenticates on Replit
           │
           ▼
5. Callback receives user profile
           │
           ▼
6. Session created in PostgreSQL
           │
           ▼
7. Cookie set, redirect to app
           │
           ▼
8. useAuth() hook detects user
           │
           ▼
9. Navigation shows user menu
```

### Review Submission Flow

```
1. User fills review form
           │
           ▼
2. React Hook Form validates with Zod
           │
           ▼
3. POST to /api/buildings/:id/reviews
           │
           ▼
4. isAuthenticated middleware checks session
           │
           ▼
5. Route validates body with insertReviewSchema
           │
           ▼
6. storage.createReview() inserts with status="pending"
           │
           ▼
7. 201 response with review data
           │
           ▼
8. React Query invalidates reviews cache
           │
           ▼
9. Toast shows success message
```

## Cross-Cutting Concerns

### Error Handling

**Client**:
- React Query error states
- Toast notifications
- Fallback UI

**Server**:
- Zod validation → 400
- Auth checks → 401
- Not found → 404
- Catch-all → 500

### Validation

**Dual Validation**:
1. Client-side (Zod + React Hook Form)
2. Server-side (Zod schemas from shared)

Same Zod schemas used on both sides ensure consistency.

### Session Handling

**Cookie Flow**:
```
Browser Cookie ──────▶ Express Session Middleware
                              │
                              ▼
                      PostgreSQL sessions table
                              │
                              ▼
                      req.user populated
```

## Development Integration

### Vite Dev Server

In development, Vite runs as Express middleware:

```
Browser Request
      │
      ├─── /api/* ────▶ Express routes
      │
      └─── /* ────────▶ Vite dev server
                              │
                              ▼
                        React HMR
```

### Production Build

```
npm run build
      │
      ├─── Vite builds React ──▶ dist/public/
      │
      └─── esbuild bundles server ──▶ dist/index.cjs
```

Single process serves both API and static files.
