# Architecture - Server (Express Backend)

Generated: 2026-01-10

## Executive Summary

Node.js Express API server providing RESTful endpoints for the NYC Apartment Review Platform. Uses Drizzle ORM with PostgreSQL for data persistence and Passport.js with Replit OpenID Connect for authentication.

## Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| Runtime | Node.js | - |
| Framework | Express | 4.21.2 |
| Language | TypeScript | 5.6.3 |
| ORM | Drizzle ORM | 0.39.3 |
| Database | PostgreSQL | - |
| Auth | Passport.js | 0.7.0 |
| Sessions | express-session | 1.18.2 |
| Validation | Zod | 3.24.2 |

## Architecture Pattern

**Pattern**: Layered Architecture with Repository Pattern

```
┌─────────────────────────────────────────┐
│              HTTP Request               │
└─────────────────┬───────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│           Express Middleware            │
│  (JSON parsing, logging, auth, etc.)    │
└─────────────────┬───────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│            Routes Layer                 │
│         (routes.ts)                     │
│   Request validation, response format   │
└─────────────────┬───────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│           Storage Layer                 │
│         (storage.ts)                    │
│   IStorage interface, business logic    │
└─────────────────┬───────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│          Database Layer                 │
│      (db.ts + Drizzle ORM)              │
│   PostgreSQL queries, transactions      │
└─────────────────────────────────────────┘
```

## Directory Structure

```
server/
├── index.ts              # Entry point
├── routes.ts             # API endpoints
├── storage.ts            # Data access layer
├── db.ts                 # Database connection
├── static.ts             # Production file serving
├── vite.ts               # Dev server integration
└── replit_integrations/
    └── auth/             # Authentication module
```

## Key Components

### 1. Entry Point (index.ts)

**Responsibilities**:
- Express app initialization
- Middleware setup (JSON, URL-encoded, logging)
- Route registration
- Error handling
- Server startup

**Middleware Pipeline**:
```typescript
app.use(express.json())           // Parse JSON bodies
app.use(express.urlencoded())     // Parse form data
app.use(requestLogger)            // Log API requests
await registerRoutes(app)         // Mount API routes
app.use(errorHandler)             // Global error handler
```

### 2. Routes Layer (routes.ts)

**Responsibilities**:
- Define REST API endpoints
- Request validation with Zod
- Authentication checks
- Delegate to storage layer

**Route Groups**:
| Prefix | Purpose | Auth |
|--------|---------|------|
| `/api/buildings` | Building CRUD | Mixed |
| `/api/buildings/:id/reviews` | Review CRUD | Mixed |
| `/api/admin/*` | Moderation | Required |
| `/api/auth/*` | Authentication | Public |

### 3. Storage Layer (storage.ts)

**Responsibilities**:
- Abstract database operations
- Implement business logic
- Aggregate data (ratings, counts)
- Handle relationships

**Interface Pattern**:
```typescript
export interface IStorage {
  getBuildings(filters?): Promise<BuildingWithRatings[]>;
  getBuilding(id): Promise<BuildingWithRatings | undefined>;
  createBuilding(data): Promise<Building>;
  // ... more methods
}

export class DatabaseStorage implements IStorage {
  // Implementation with Drizzle ORM
}

export const storage = new DatabaseStorage();
```

**Benefits**:
- Testable (can mock interface)
- Swappable implementations
- Centralized data access

### 4. Database Layer (db.ts)

**Configuration**:
```typescript
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });
```

**Drizzle ORM Features Used**:
- Type-safe queries
- Relation definitions
- Aggregate functions (count, avg)
- Conditional filters (and, or, ilike)

## Authentication Flow

### Replit OpenID Connect

```
┌────────┐     ┌─────────┐     ┌──────────┐
│ Client │────▶│ /login  │────▶│  Replit  │
└────────┘     └─────────┘     │   OAuth  │
                               └────┬─────┘
                                    │
┌────────┐     ┌─────────┐          │
│ Client │◀────│ Callback│◀─────────┘
└────────┘     └─────────┘
                    │
                    ▼
          ┌─────────────────┐
          │ Create Session  │
          │ Upsert User     │
          └─────────────────┘
```

### Session Management

- **Store**: PostgreSQL via connect-pg-simple
- **Table**: `sessions` (sid, sess, expire)
- **Cookie**: httpOnly, secure in production

### Middleware

```typescript
export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized" });
};
```

## Request Lifecycle

### Example: Create Review

```
POST /api/buildings/:id/reviews
         │
         ▼
┌─────────────────────────────────────┐
│ 1. Express parses JSON body         │
└─────────────────┬───────────────────┘
                  ▼
┌─────────────────────────────────────┐
│ 2. isAuthenticated middleware       │
│    - Check session                  │
│    - Return 401 if not logged in    │
└─────────────────┬───────────────────┘
                  ▼
┌─────────────────────────────────────┐
│ 3. Route handler                    │
│    - Extract userId from session    │
│    - Validate with Zod schema       │
│    - Return 400 if invalid          │
└─────────────────┬───────────────────┘
                  ▼
┌─────────────────────────────────────┐
│ 4. storage.createReview()           │
│    - Insert into database           │
│    - Return created review          │
└─────────────────┬───────────────────┘
                  ▼
┌─────────────────────────────────────┐
│ 5. Return 201 with review JSON      │
└─────────────────────────────────────┘
```

## Error Handling

### Validation Errors (Zod)

```typescript
if (error instanceof z.ZodError) {
  return res.status(400).json({
    message: error.errors[0].message
  });
}
```

### Global Error Handler

```typescript
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});
```

## Development vs Production

### Development Mode

```typescript
if (process.env.NODE_ENV !== "production") {
  const { setupVite } = await import("./vite");
  await setupVite(httpServer, app);
}
```

- Vite dev server middleware
- HMR support
- No static file serving

### Production Mode

```typescript
if (process.env.NODE_ENV === "production") {
  serveStatic(app);
}
```

- Serve from `dist/public/`
- Bundled server code

## Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| DATABASE_URL | PostgreSQL connection string | Yes |
| SESSION_SECRET | Session encryption key | Yes |
| ISSUER_URL | Replit OAuth issuer | Yes |
| REPL_ID | Replit app identifier | Yes |
| PORT | Server port (default: 5000) | No |
| NODE_ENV | Environment mode | No |

## Scalability Considerations

### Current Design

- Single-process Node.js
- Direct database queries
- In-memory session fallback

### Potential Improvements

1. **Connection Pooling**: Already using pg Pool
2. **Caching**: Add Redis for session/query caching
3. **Rate Limiting**: Add express-rate-limit
4. **Clustering**: Use PM2 or similar for multi-process
