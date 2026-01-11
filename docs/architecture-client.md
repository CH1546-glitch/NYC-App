# Architecture - Client (React Frontend)

Generated: 2026-01-10

## Executive Summary

Single-page React application serving as the frontend for the NYC Apartment Review Platform. Built with React 18, Vite, Tailwind CSS, and shadcn/ui component library. Uses React Query for server state management and Wouter for client-side routing.

## Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| UI Framework | React | 18.3.1 |
| Build Tool | Vite | 7.3.0 |
| Styling | Tailwind CSS | 3.4.17 |
| Components | shadcn/ui (Radix) | Various |
| Routing | Wouter | 3.3.5 |
| State | React Query | 5.60.5 |
| Forms | React Hook Form | 7.55.0 |
| Validation | Zod | 3.24.2 |
| Charts | Recharts | 2.15.2 |
| Icons | Lucide React | 0.453.0 |

## Architecture Pattern

**Pattern**: Component-Based SPA with Server State Caching

```
┌────────────────────────────────────────────┐
│                  App.tsx                    │
│  ┌──────────────────────────────────────┐  │
│  │     QueryClientProvider               │  │
│  │  ┌────────────────────────────────┐  │  │
│  │  │      TooltipProvider           │  │  │
│  │  │  ┌──────────────────────────┐  │  │  │
│  │  │  │    Router (Wouter)       │  │  │  │
│  │  │  │  ┌────────────────────┐  │  │  │  │
│  │  │  │  │     Page           │  │  │  │  │
│  │  │  │  │  ┌──────────────┐  │  │  │  │  │
│  │  │  │  │  │  Components  │  │  │  │  │  │
│  │  │  │  │  └──────────────┘  │  │  │  │  │
│  │  │  │  └────────────────────┘  │  │  │  │
│  │  │  └──────────────────────────┘  │  │  │
│  │  └────────────────────────────────┘  │  │
│  └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
```

## Directory Structure

```
client/src/
├── App.tsx           # Root component
├── main.tsx          # Entry point
├── index.css         # Global styles
├── components/
│   ├── ui/           # shadcn/ui primitives
│   └── *.tsx         # Domain components
├── pages/            # Route components
├── hooks/            # Custom hooks
└── lib/              # Utilities
```

## Key Design Patterns

### 1. Server State with React Query

All API data fetched via React Query with URL-based query keys:

```typescript
const { data: building } = useQuery<BuildingWithRatings>({
  queryKey: ["/api/buildings", id],
  queryFn: async () => {
    const res = await fetch(`/api/buildings/${id}`);
    return res.json();
  },
});
```

**Benefits**:
- Automatic caching and deduplication
- Background refetching
- Loading/error states

### 2. Shared Type Safety

Types imported from `@shared/schema`:

```typescript
import type { BuildingWithRatings, ReviewWithDetails } from "@shared/schema";
```

Ensures frontend types match backend database schema.

### 3. Form Handling

React Hook Form + Zod for validation:

```typescript
const form = useForm<InsertReview>({
  resolver: zodResolver(insertReviewSchema),
  defaultValues: { ... },
});
```

### 4. Authentication Hook

Centralized auth state via `useAuth()`:

```typescript
const { user, isAuthenticated, isLoading, logout } = useAuth();
```

## Routing Structure

| Route | Component | Auth | Description |
|-------|-----------|------|-------------|
| `/` | Home | - | Landing page |
| `/search` | SearchPage | - | Building search |
| `/building/:id` | BuildingDetail | - | Building view |
| `/building/:id/review` | WriteReview | Required | Review form |
| `/add-building` | AddBuilding | Required | Building form |
| `/admin` | Admin | Required | Moderation |
| `*` | NotFound | - | 404 page |

## Component Hierarchy

### Page Components

```
Home
├── Navigation (transparent)
├── Hero Section
│   └── Search Form
├── How It Works (3 cards)
├── Privacy Section
└── Footer

BuildingDetail
├── Navigation
├── Building Card
│   ├── BuildingType Badge
│   ├── Neighborhood Badge
│   ├── StarRating
│   └── Write Review Button
├── Reviews Section
│   ├── Sort Select
│   └── ReviewCard[] (mapped)
└── Sidebar
    ├── Category Ratings (RatingBar[])
    └── FloorInsightsChart
```

### Shared Components

| Component | Props | Purpose |
|-----------|-------|---------|
| Navigation | `transparent?: boolean` | Header with auth |
| BuildingCard | `building: BuildingWithRatings` | Building preview |
| StarRating | `rating: number, size?: string` | Star display |
| RatingBar | `label: string, rating: number` | Category bar |
| ReviewCard | `review: ReviewWithDetails` | Review display |
| FloorInsightsChart | `reviews: Review[]` | Floor analytics |

## State Management

### Server State (React Query)
- Buildings list and details
- Reviews by building
- Admin statistics
- User authentication

### Client State (useState)
- Form inputs
- UI state (mobile menu, modals)
- Filter selections

### No Global State Store
React Query handles most data needs; no Redux/Zustand required.

## Styling System

### Tailwind CSS

Custom theme in `tailwind.config.ts`:
- Custom color tokens (background, foreground, primary, etc.)
- CSS variable-based theming
- Dark mode support via class strategy

### shadcn/ui Components

40+ headless UI primitives from Radix:
- Fully accessible
- Styled with Tailwind
- Located in `components/ui/`

### Design Tokens

CSS variables defined in `index.css`:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... */
}
```

## Build Configuration

### Vite Config

```typescript
export default defineConfig({
  plugins: [react(), runtimeErrorOverlay()],
  resolve: {
    alias: {
      "@": "./client/src",
      "@shared": "./shared",
      "@assets": "./attached_assets",
    },
  },
  root: "./client",
  build: { outDir: "../dist/public" },
});
```

### Production Build

1. Vite builds frontend to `dist/public/`
2. esbuild bundles server to `dist/index.cjs`
3. Express serves static files from `dist/public/`

## Testing Considerations

- Components have `data-testid` attributes for E2E testing
- Zod schemas provide runtime validation
- TypeScript ensures type safety at build time
