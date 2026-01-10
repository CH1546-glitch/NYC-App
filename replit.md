# NYC Apartment Reviews Platform

## Overview

This is a full-stack web application for NYC apartment reviews, allowing renters to anonymously share and discover honest reviews about apartment buildings across all five boroughs. The platform enables users to search buildings, read reviews, submit new reviews, add buildings, and includes an admin moderation system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state caching and synchronization
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Build Tool**: Vite with custom plugins for Replit integration
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful JSON API endpoints under `/api/*`
- **Authentication**: Replit OpenID Connect integration with Passport.js
- **Session Management**: Express sessions stored in PostgreSQL via connect-pg-simple

### Data Layer
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with Drizzle-Zod for schema validation
- **Schema Location**: `shared/schema.ts` defines all tables (buildings, reviews, reviewPhotos, users, sessions)
- **Migrations**: Managed via Drizzle Kit (`drizzle-kit push`)

### Project Structure
```
client/           # React frontend
  src/
    components/   # Reusable UI components
    pages/        # Route-level page components
    hooks/        # Custom React hooks
    lib/          # Utilities and query client
server/           # Express backend
  routes.ts       # API route definitions
  storage.ts      # Database access layer
  db.ts           # Database connection
  replit_integrations/auth/  # Authentication logic
shared/           # Shared types and schemas
  schema.ts       # Drizzle database schema
  models/auth.ts  # User and session models
```

### Key Design Patterns
- **Shared Schema Validation**: Zod schemas generated from Drizzle tables ensure type safety across frontend and backend
- **Storage Interface Pattern**: `IStorage` interface in `storage.ts` abstracts database operations
- **Authentication Middleware**: `isAuthenticated` middleware protects routes requiring login
- **Query Key Convention**: React Query uses URL-based query keys for automatic cache management

### Build System
- **Development**: Vite dev server with HMR proxied through Express
- **Production**: Vite builds frontend to `dist/public`, esbuild bundles server to `dist/index.cjs`
- **Build Script**: Custom `script/build.ts` handles both builds with dependency bundling optimization

## External Dependencies

### Database
- **PostgreSQL**: Primary data store accessed via `DATABASE_URL` environment variable
- **Tables**: users, sessions, buildings, reviews, reviewPhotos

### Authentication
- **Replit OpenID Connect**: OAuth2 authentication via Replit's identity provider
- **Required Environment Variables**: `ISSUER_URL`, `REPL_ID`, `SESSION_SECRET`

### Third-Party Services
- **Google Fonts**: Inter font family loaded via CDN for typography

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit`: Database ORM and migration tooling
- `@tanstack/react-query`: Async state management
- `@radix-ui/*`: Headless UI primitives for shadcn/ui
- `wouter`: Lightweight client-side routing
- `passport` / `openid-client`: Authentication middleware
- `zod`: Runtime type validation