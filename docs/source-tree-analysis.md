# Source Tree Analysis

Generated: 2026-01-10

## Project Structure Overview

```
nyc-apartment-reviews/
├── client/                    # React Frontend (Part: client)
│   ├── index.html            # HTML entry point
│   ├── public/               # Static assets
│   └── src/
│       ├── App.tsx           # Root component with routing
│       ├── main.tsx          # React DOM entry point
│       ├── index.css         # Global styles + Tailwind
│       ├── components/       # Reusable UI components
│       │   ├── ui/           # shadcn/ui primitives (40+ components)
│       │   ├── navigation.tsx
│       │   ├── building-card.tsx
│       │   ├── star-rating.tsx
│       │   ├── rating-bar.tsx
│       │   ├── review-card.tsx
│       │   └── floor-insights-chart.tsx
│       ├── pages/            # Route-level page components
│       │   ├── home.tsx          # Landing page with search
│       │   ├── search.tsx        # Building search/list
│       │   ├── building-detail.tsx # Building + reviews view
│       │   ├── write-review.tsx  # Review submission form
│       │   ├── add-building.tsx  # Building submission form
│       │   ├── admin.tsx         # Admin moderation dashboard
│       │   └── not-found.tsx     # 404 page
│       ├── hooks/            # Custom React hooks
│       │   └── use-auth.ts   # Authentication state hook
│       └── lib/              # Utilities
│           ├── queryClient.ts    # React Query configuration
│           ├── auth-utils.ts     # Auth helpers
│           └── utils.ts          # cn() class name utility
│
├── server/                   # Express Backend (Part: server)
│   ├── index.ts              # Server entry point, Express setup
│   ├── routes.ts             # API route definitions
│   ├── storage.ts            # Database access layer (IStorage)
│   ├── db.ts                 # Drizzle ORM connection
│   ├── static.ts             # Production static file serving
│   ├── vite.ts               # Dev server Vite integration
│   └── replit_integrations/  # Replit-specific auth
│       └── auth/             # Passport.js + OpenID Connect
│
├── shared/                   # Shared Code (Part: shared)
│   ├── schema.ts             # Drizzle database schema
│   └── models/
│       └── auth.ts           # User & session models
│
├── attached_assets/          # Static assets
│   └── generated_images/     # Hero images, etc.
│
├── script/                   # Build scripts
│   └── build.ts              # Production build script
│
├── docs/                     # Generated documentation (this folder)
│
├── package.json              # Dependencies & scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite bundler config
├── tailwind.config.ts        # Tailwind CSS config
├── drizzle.config.ts         # Drizzle Kit config
├── postcss.config.js         # PostCSS config
├── design_guidelines.md      # UI/UX design spec
└── replit.md                 # Project overview doc
```

---

## Critical Directories

### `/client/src/`
**Purpose**: React frontend application

**Key Files**:
- `App.tsx`: Main component, sets up routing with Wouter, wraps with QueryClientProvider
- `main.tsx`: React 18 createRoot entry point
- `index.css`: Tailwind CSS imports + custom CSS variables for theming

**Entry Point**: `main.tsx` → renders `App.tsx`

---

### `/client/src/components/`
**Purpose**: Reusable UI components

**Subdirectories**:
- `ui/`: 40+ shadcn/ui primitives (Button, Card, Input, Select, etc.)

**Custom Components**:
| Component | Purpose |
|-----------|---------|
| `navigation.tsx` | Fixed header with auth-aware navigation |
| `building-card.tsx` | Building preview card with ratings |
| `star-rating.tsx` | Star display component |
| `rating-bar.tsx` | Horizontal rating progress bar |
| `review-card.tsx` | Review display with user info |
| `floor-insights-chart.tsx` | Recharts visualization |

---

### `/client/src/pages/`
**Purpose**: Route-level page components

| Page | Route | Description |
|------|-------|-------------|
| `home.tsx` | `/` | Landing page with hero, search, feature cards |
| `search.tsx` | `/search` | Building search with filters |
| `building-detail.tsx` | `/building/:id` | Building info + reviews list |
| `write-review.tsx` | `/building/:id/review` | Multi-step review form |
| `add-building.tsx` | `/add-building` | Building submission form |
| `admin.tsx` | `/admin` | Moderation dashboard (auth required) |
| `not-found.tsx` | `*` | 404 fallback |

---

### `/server/`
**Purpose**: Express.js API backend

**Key Files**:
| File | Purpose |
|------|---------|
| `index.ts` | Server bootstrap, middleware setup |
| `routes.ts` | All REST API endpoints |
| `storage.ts` | IStorage interface + DatabaseStorage class |
| `db.ts` | Drizzle ORM + pg Pool connection |
| `static.ts` | Production static file serving |
| `vite.ts` | Development Vite middleware |

**Entry Point**: `index.ts` → starts HTTP server on PORT

---

### `/shared/`
**Purpose**: Code shared between client and server

**Key Files**:
| File | Purpose |
|------|---------|
| `schema.ts` | Drizzle tables (buildings, reviews, reviewPhotos) |
| `models/auth.ts` | User and session tables |

**TypeScript Path Alias**: `@shared/*` → `shared/*`

---

## Integration Points

### Client → Server

1. **API Calls**: React Query fetches from `/api/*` endpoints
2. **Authentication**: OAuth redirects via `/api/login`, `/api/logout`
3. **Forms**: POST requests with Zod-validated JSON bodies

### Server → Database

1. **Connection**: pg Pool with DATABASE_URL env var
2. **ORM**: Drizzle with typed schema from shared
3. **Sessions**: connect-pg-simple stores in `sessions` table

### Shared Code Flow

```
shared/schema.ts
    ↓
    ├── server/storage.ts (imports types + tables)
    ├── server/routes.ts (imports validation schemas)
    └── client/*/pages/ (imports types for TypeScript)
```

---

## Path Aliases

Configured in `tsconfig.json` and `vite.config.ts`:

| Alias | Path |
|-------|------|
| `@/*` | `./client/src/*` |
| `@shared/*` | `./shared/*` |
| `@assets/*` | `./attached_assets/*` |
