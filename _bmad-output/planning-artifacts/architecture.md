---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7]
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - design_guidelines.md
  - docs/project-overview.md
  - docs/integration-architecture.md
  - docs/architecture-client.md
  - docs/architecture-server.md
  - docs/api-contracts-server.md
  - docs/data-models.md
workflowType: 'architecture'
project_name: 'NYC Apartment Review Platform'
user_name: 'Runner'
date: '2026-01-10'
field_type: 'brownfield'
---

# Architecture Decision Document

**NYC Apartment Review Platform**

_This architecture document captures existing decisions from the brownfield codebase and establishes standards for new feature development._

---

## 1. Project Context Analysis

### 1.1 Project Type & Scale

| Attribute | Value |
|-----------|-------|
| **Project Type** | Full-stack web application |
| **Field Type** | Brownfield (existing codebase) |
| **Repository Structure** | Multi-part monorepo (client/server/shared) |
| **Primary Language** | TypeScript |
| **Target Scale** | 100,000+ buildings, 1M+ reviews (per PRD) |
| **User Types** | Apartment Seekers, Current Renters, Administrators |

### 1.2 Existing Technical Constraints

The brownfield codebase establishes these constraints that must be respected:

- **React 18 + Vite 7** for frontend (already implemented)
- **Express 4 + Node.js** for backend (already implemented)
- **PostgreSQL + Drizzle ORM** for data persistence (already implemented)
- **Replit OAuth** for authentication (differs from PRD email/password spec)
- **shadcn/ui + Tailwind CSS** for UI components (already implemented)

### 1.3 PRD Gap Analysis

| PRD Requirement | Current Status | Gap |
|-----------------|----------------|-----|
| Email/password authentication | Replit OAuth implemented | Need to add email/password option |
| Google Geocoding API | Not implemented | Need integration for address validation |
| Postmark email delivery | Not implemented | Need for password reset, notifications |
| Duplicate building detection | Not implemented | Need similarity scoring system |
| Photo upload storage | Schema exists, storage undefined | Need file upload integration |
| Admin user management | Partial | Missing suspend/delete users |
| Password reset flow | Not applicable (OAuth) | Needed if email auth added |

---

## 2. Starter Template Evaluation

### 2.1 Existing Technology Stack (Brownfield)

Since this is a brownfield project, the starter template decisions are already made by the existing codebase.

**Frontend Stack (Already Established)**:
- React 18.3.1 with TypeScript
- Vite 7.3.0 for build tooling
- Tailwind CSS 3.4.17 for styling
- shadcn/ui (Radix UI primitives) for components
- React Query 5.60.5 for server state
- Wouter 3.3.5 for routing
- React Hook Form 7.55.0 + Zod 3.24.2 for forms
- Recharts 2.15.2 for data visualization

**Backend Stack (Already Established)**:
- Express 4.21.2 with TypeScript 5.6.3
- Drizzle ORM 0.39.3 with PostgreSQL
- Passport.js 0.7.0 with Replit OpenID Connect
- express-session 1.18.2 with PostgreSQL store

**Shared Code (Already Established)**:
- Drizzle schema definitions
- Zod validation schemas
- TypeScript type exports via path alias `@shared/*`

### 2.2 Rationale for Existing Choices

The existing stack represents modern, production-ready choices:
- **React Query** eliminates need for global state store (no Redux)
- **Drizzle ORM** provides type-safe database queries
- **shadcn/ui** offers accessible, customizable components
- **Zod** enables dual client/server validation with shared schemas

---

## 3. Core Architectural Decisions

### 3.1 Critical Decisions (Already Made)

| Decision | Choice | Version | Rationale |
|----------|--------|---------|-----------|
| UI Framework | React | 18.3.1 | Modern hooks-based architecture |
| Build Tool | Vite | 7.3.0 | Fast HMR, ESM-native |
| CSS Framework | Tailwind CSS | 3.4.17 | Utility-first, design system ready |
| Server Framework | Express | 4.21.2 | Mature, extensive ecosystem |
| ORM | Drizzle | 0.39.3 | Type-safe, PostgreSQL optimized |
| Database | PostgreSQL | Latest | Relational, JSONB support |
| Validation | Zod | 3.24.2 | Runtime + compile-time safety |
| State Management | React Query | 5.60.5 | Server state caching |

### 3.2 Data Architecture

**Database**: PostgreSQL with Drizzle ORM

**Tables**:
| Table | Purpose | Relationships |
|-------|---------|---------------|
| `users` | User accounts (OAuth) | - |
| `sessions` | Server-side sessions | - |
| `buildings` | Apartment buildings | Has many reviews |
| `reviews` | User reviews | Belongs to building, has many photos |
| `review_photos` | Review images | Belongs to review |

**Data Validation Strategy**:
- Dual validation: Client-side (Zod + RHF) + Server-side (Zod)
- Shared schemas in `shared/schema.ts`
- Type inference from Drizzle for compile-time safety

**Migration Approach**:
- Drizzle Kit for schema migrations
- Command: `npm run db:push`
- Migration files in `./migrations`

### 3.3 Authentication & Security

**Current Implementation**: Replit OpenID Connect

**Session Management**:
- Server-side sessions in PostgreSQL (`sessions` table)
- `express-session` with `connect-pg-simple` store
- httpOnly cookies, secure in production

**Authorization Pattern**:
- `isAuthenticated` middleware for protected routes
- No role-based access (admin check by user ID or flag needed)

**Security Measures** (to maintain):
- HTTPS enforcement (via Replit)
- Session-based CSRF protection
- Input validation via Zod schemas
- SQL injection prevention via Drizzle ORM

**PRD Security Requirements** (gaps to address):
- [ ] Password hashing (bcrypt/Argon2) - if email auth added
- [ ] Rate limiting on auth endpoints
- [ ] API key storage in environment variables

### 3.4 API & Communication Patterns

**API Style**: REST over HTTP/HTTPS

**Response Format**: Direct JSON (no wrapper)
```typescript
// Success
{ id: "...", name: "...", ... }

// Error
{ message: "Error description" }
```

**Error Handling Standards**:
| Status | Usage |
|--------|-------|
| 200 | Success (GET, PUT) |
| 201 | Created (POST) |
| 400 | Validation error (Zod) |
| 401 | Unauthorized |
| 404 | Not found |
| 500 | Server error |

**API Documentation**: Not currently implemented - recommend adding OpenAPI/Swagger

### 3.5 Frontend Architecture

**Pattern**: Component-Based SPA with Server State Caching

**State Management**:
- **Server State**: React Query (all API data)
- **Client State**: useState (forms, UI state)
- **No Global Store**: React Query eliminates Redux need

**Component Architecture**:
- Page components in `pages/`
- Reusable components in `components/`
- shadcn/ui primitives in `components/ui/`

**Routing Strategy**:
- Client-side routing via Wouter
- Protected routes check `useAuth()` hook
- 404 fallback for unknown routes

### 3.6 Infrastructure & Deployment

**Hosting**: Replit (current)

**Build Process**:
1. Vite builds React → `dist/public/`
2. esbuild bundles server → `dist/index.cjs`
3. Single process serves both

**Environment Configuration**:
| Variable | Purpose |
|----------|---------|
| DATABASE_URL | PostgreSQL connection |
| SESSION_SECRET | Session encryption |
| ISSUER_URL | Replit OAuth issuer |
| REPL_ID | Replit app identifier |
| PORT | Server port (default: 5000) |

---

## 4. Implementation Patterns & Consistency Rules

### 4.1 Naming Patterns

**Database Naming**:
- Tables: `snake_case`, plural (`users`, `buildings`, `reviews`)
- Columns: `snake_case` in DB, `camelCase` in TypeScript
- Primary keys: `id` (UUID string)
- Foreign keys: `{entity}_id` in DB, `{entity}Id` in TypeScript

**API Naming**:
- Endpoints: `/api/{resource}` plural (`/api/buildings`)
- Route parameters: `:id` format
- Query parameters: `camelCase`
- HTTP methods follow REST conventions

**Code Naming**:
- Components: `PascalCase` (`BuildingCard.tsx`)
- Files: `kebab-case` for components (`building-card.tsx`)
- Functions: `camelCase` (`getBuildings`)
- Types/Interfaces: `PascalCase` (`BuildingWithRatings`)
- Constants: `UPPER_SNAKE_CASE` or `camelCase`

### 4.2 Structure Patterns

**Project Organization**:
```
project-root/
├── client/src/
│   ├── components/     # Reusable UI components
│   │   └── ui/         # shadcn/ui primitives
│   ├── pages/          # Route page components
│   ├── hooks/          # Custom React hooks
│   └── lib/            # Utilities and helpers
├── server/
│   ├── index.ts        # Entry point
│   ├── routes.ts       # API routes
│   ├── storage.ts      # Data access layer
│   └── db.ts           # Database connection
├── shared/
│   ├── schema.ts       # Drizzle tables + Zod schemas
│   └── models/         # Additional type definitions
└── docs/               # Generated documentation
```

**Test Organization** (to be implemented):
- Co-located tests: `*.test.ts` next to source files
- E2E tests: `tests/e2e/` directory
- Test utilities: `tests/helpers/`

### 4.3 Format Patterns

**API Response Formats**:

Success response (single item):
```json
{ "id": "uuid", "name": "Building Name", ... }
```

Success response (list):
```json
[{ "id": "uuid", ... }, { "id": "uuid", ... }]
```

Error response:
```json
{ "message": "Error description" }
```

**Date Format**: ISO 8601 strings in JSON (`2026-01-10T12:00:00.000Z`)

**JSON Field Naming**: `camelCase` in API responses

### 4.4 Communication Patterns

**Client → Server**:
- React Query for all data fetching
- Query keys follow URL pattern: `["/api/buildings", id]`
- Mutations invalidate related queries

**Event Naming** (if real-time added):
- Pattern: `{entity}.{action}` (`review.created`)
- Payload: `{ type: string, data: object }`

### 4.5 Process Patterns

**Error Handling**:

Client-side:
```typescript
const { data, error, isLoading } = useQuery({...});
if (error) return <ErrorDisplay message={error.message} />;
```

Server-side:
```typescript
try {
  const result = await storage.method();
  res.json(result);
} catch (error) {
  if (error instanceof z.ZodError) {
    return res.status(400).json({ message: error.errors[0].message });
  }
  throw error;
}
```

**Loading State Patterns**:
- Use React Query's `isLoading` state
- Show skeleton loaders for content areas
- Disable form submission during mutations

**Form Handling Pattern**:
```typescript
const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: {...},
});

const mutation = useMutation({
  mutationFn: (data) => fetch(...),
  onSuccess: () => queryClient.invalidateQueries([...]),
});
```

---

## 5. Project Structure & Boundaries

### 5.1 Complete Directory Structure

```
nyc-apartment-review-platform/
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── drizzle.config.ts
├── components.json              # shadcn/ui config
├── .env                         # Environment variables (gitignored)
├── .env.example                 # Template for env vars
├── .gitignore
│
├── client/
│   ├── index.html
│   └── src/
│       ├── main.tsx             # React entry point
│       ├── App.tsx              # Root component with providers
│       ├── index.css            # Global styles + Tailwind
│       │
│       ├── components/
│       │   ├── ui/              # shadcn/ui primitives (40+ files)
│       │   ├── navigation.tsx   # Header navigation
│       │   ├── building-card.tsx
│       │   ├── star-rating.tsx
│       │   ├── rating-bar.tsx
│       │   ├── review-card.tsx
│       │   └── floor-insights-chart.tsx
│       │
│       ├── pages/
│       │   ├── home.tsx         # Landing page
│       │   ├── search.tsx       # Building search
│       │   ├── building-detail.tsx
│       │   ├── write-review.tsx
│       │   ├── add-building.tsx
│       │   └── admin.tsx        # Admin dashboard
│       │
│       ├── hooks/
│       │   └── use-auth.ts      # Authentication hook
│       │
│       └── lib/
│           ├── utils.ts         # cn() utility
│           ├── queryClient.ts   # React Query config
│           └── auth-utils.ts    # Auth helpers
│
├── server/
│   ├── index.ts                 # Express entry point
│   ├── routes.ts                # API route definitions
│   ├── storage.ts               # IStorage interface + DatabaseStorage
│   ├── db.ts                    # Drizzle + PostgreSQL connection
│   ├── static.ts                # Production static file serving
│   ├── vite.ts                  # Dev server integration
│   └── replit_integrations/
│       └── auth/                # Replit OAuth implementation
│
├── shared/
│   ├── schema.ts                # Drizzle tables + Zod schemas
│   └── models/
│       └── auth.ts              # User/session types
│
├── docs/                        # Generated documentation
│   ├── index.md
│   ├── project-overview.md
│   ├── architecture-client.md
│   ├── architecture-server.md
│   ├── api-contracts-server.md
│   ├── data-models.md
│   └── ...
│
├── _bmad-output/                # BMad workflow artifacts
│   └── planning-artifacts/
│       ├── prd.md
│       ├── architecture.md      # This document
│       └── bmm-workflow-status.yaml
│
└── dist/                        # Build output (gitignored)
    ├── public/                  # Vite-built frontend
    └── index.cjs                # Bundled server
```

### 5.2 Architectural Boundaries

**API Boundaries**:
| Boundary | Public | Protected |
|----------|--------|-----------|
| `/api/buildings` (GET) | Yes | - |
| `/api/buildings` (POST) | - | Yes |
| `/api/buildings/:id/reviews` (GET) | Yes | - |
| `/api/buildings/:id/reviews` (POST) | - | Yes |
| `/api/admin/*` | - | Yes (admin only) |
| `/api/auth/*` | Yes | - |

**Component Boundaries**:
- Pages own their data fetching via React Query
- Components receive data via props (no direct fetching)
- Hooks encapsulate reusable logic (`useAuth`)

**Data Boundaries**:
- All database access through `storage.ts` IStorage interface
- No direct database queries in routes
- Shared types flow from `shared/schema.ts` to both client and server

### 5.3 Requirements to Structure Mapping

**PRD Section → Code Location**:

| PRD Feature | Frontend | Backend | Shared |
|-------------|----------|---------|--------|
| Home Page (4.1) | `pages/home.tsx` | - | - |
| Search Page (4.2) | `pages/search.tsx` | `routes.ts: GET /buildings` | `schema.ts: buildings` |
| Building Detail (4.3) | `pages/building-detail.tsx` | `routes.ts: GET /buildings/:id` | `BuildingWithRatings` |
| Write Review (4.4) | `pages/write-review.tsx` | `routes.ts: POST /reviews` | `insertReviewSchema` |
| Add Building (4.5) | `pages/add-building.tsx` | `routes.ts: POST /buildings` | `insertBuildingSchema` |
| Auth (4.6) | `hooks/use-auth.ts` | `replit_integrations/auth/` | `users` table |
| Admin (4.8-4.10) | `pages/admin.tsx` | `routes.ts: /api/admin/*` | - |

---

## 6. Architecture Validation Results

### 6.1 Coherence Validation

**Decision Compatibility**: PASS
- All technology choices work together without conflicts
- React Query + Zod + Drizzle provide end-to-end type safety
- shadcn/ui integrates seamlessly with Tailwind CSS

**Pattern Consistency**: PASS
- Naming conventions are consistent across codebase
- API patterns follow REST standards
- Error handling is uniform client and server

**Structure Alignment**: PASS
- Project structure supports all architectural decisions
- Clear separation between client, server, and shared code
- Type flow from database to UI is well-defined

### 6.2 Requirements Coverage

**PRD Features Covered**:
- [x] Home Page with hero search
- [x] Building search with filtering
- [x] Building detail with category ratings
- [x] Floor insights visualization
- [x] Review submission with ratings
- [x] Building submission
- [x] Admin dashboard with moderation
- [x] Anonymous posting

**PRD Features with Gaps**:
- [ ] Email/password authentication (Replit OAuth only)
- [ ] Password reset via Postmark
- [ ] Google Geocoding for address validation
- [ ] Duplicate building detection
- [ ] Photo upload storage (schema exists)
- [ ] User account settings page
- [ ] Email notifications

### 6.3 Implementation Readiness

**Ready for Implementation**:
- All core architectural decisions documented
- Project structure is complete and specific
- Patterns are comprehensive and enforceable
- Integration points clearly specified

**Recommended Pre-Implementation**:
1. Decide on email authentication strategy (add to existing OAuth or replace)
2. Choose photo storage solution (Cloudinary, S3, Replit Object Storage)
3. Plan Google Geocoding integration approach
4. Design duplicate detection algorithm

### 6.4 Architecture Completeness Checklist

**Requirements Analysis**:
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**Architectural Decisions**:
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations noted

**Implementation Patterns**:
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**Project Structure**:
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

---

## 7. Implementation Handoff

### 7.1 AI Agent Guidelines

All AI agents implementing features for this project MUST:

1. **Follow existing patterns** - Match the code style and architecture already in place
2. **Use shared schemas** - Import types from `@shared/schema`
3. **Follow naming conventions** - Components: PascalCase, files: kebab-case
4. **Use React Query** - No global state stores, use query/mutation patterns
5. **Validate with Zod** - Both client and server-side
6. **Respect boundaries** - All DB access through storage.ts interface

### 7.2 First Implementation Priority

For new features, the recommended implementation order:

1. **Schema changes** - Add to `shared/schema.ts`
2. **Storage methods** - Add to `server/storage.ts`
3. **API routes** - Add to `server/routes.ts`
4. **UI components** - Add to `client/src/components/`
5. **Page integration** - Update `client/src/pages/`

### 7.3 Architecture Readiness Assessment

**Overall Status**: READY FOR IMPLEMENTATION

**Confidence Level**: HIGH

**Key Strengths**:
- Well-documented existing codebase
- Modern, type-safe technology stack
- Clear separation of concerns
- Comprehensive pattern documentation

**Areas for Future Enhancement**:
- Add email authentication option
- Implement photo storage
- Add API documentation (OpenAPI)
- Implement rate limiting
- Add comprehensive test suite

---

_Document generated: 2026-01-10_
_Workflow: create-architecture (BMad Method)_
_Project type: Brownfield_
