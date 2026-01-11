# Project Overview - NYC Apartment Review Platform

Generated: 2026-01-10

## Executive Summary

The NYC Apartment Review Platform is a full-stack web application that enables NYC renters to anonymously share and discover honest reviews about apartment buildings across all five boroughs. Users can search buildings, read detailed reviews with category ratings, submit their own reviews, and add new buildings to the database.

## Purpose

- **Problem**: NYC renters lack reliable, unbiased information about apartment buildings before signing leases
- **Solution**: Community-driven platform for anonymous, honest apartment reviews
- **Value**: Help renters make informed decisions and avoid problem buildings

## Key Features

| Feature | Description |
|---------|-------------|
| Building Search | Search by name, address, or neighborhood with filters |
| Detailed Reviews | Multi-category ratings (noise, cleanliness, maintenance, safety, pests) |
| Anonymous Posting | Reviews can be posted anonymously for privacy |
| Building Submission | Users can add new buildings to the database |
| Admin Moderation | Review and building approval workflow |
| Floor Insights | Analytics showing ratings by floor level |

## Architecture Summary

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | React 18 + Vite | Single-page application |
| **Backend** | Express + Node.js | REST API server |
| **Database** | PostgreSQL + Drizzle | Data persistence |
| **Styling** | Tailwind + shadcn/ui | UI component system |
| **Auth** | Passport.js + Replit OAuth | User authentication |

## Repository Structure

```
├── client/         # React frontend (web)
├── server/         # Express backend (api)
├── shared/         # Shared types and schemas
└── docs/           # Generated documentation
```

**Type**: Multi-part monorepo
**Parts**: 3 (client, server, shared)

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for development and building
- Tailwind CSS for styling
- Radix UI primitives (via shadcn/ui)
- React Query for server state
- Wouter for routing
- React Hook Form + Zod for forms

### Backend
- Node.js with Express
- TypeScript with ESM modules
- Drizzle ORM for database
- Passport.js for authentication
- express-session with PostgreSQL store

### Shared
- Drizzle schema definitions
- Zod validation schemas
- TypeScript type exports

## Database Schema

| Table | Purpose |
|-------|---------|
| `users` | Registered user accounts |
| `sessions` | Server-side sessions |
| `buildings` | Apartment building records |
| `reviews` | User reviews with ratings |
| `review_photos` | Images attached to reviews |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/buildings` | List buildings with filters |
| GET | `/api/buildings/:id` | Get building details |
| POST | `/api/buildings` | Add new building |
| GET | `/api/buildings/:id/reviews` | Get reviews for building |
| POST | `/api/buildings/:id/reviews` | Submit review |
| GET | `/api/admin/stats` | Dashboard statistics |
| GET/POST | `/api/admin/buildings/*` | Moderation actions |
| GET/POST | `/api/admin/reviews/*` | Moderation actions |

## User Flows

### Searching Buildings
1. User enters search on home page
2. Redirects to search page with filters
3. Building cards display with ratings
4. Click card to view details

### Writing a Review
1. Navigate to building detail page
2. Click "Write a Review"
3. Fill multi-step form with ratings
4. Submit (requires authentication)
5. Review enters moderation queue

### Admin Moderation
1. Admin logs in
2. Views pending buildings/reviews
3. Approves or denies each item
4. Approved items become public

## Development

```bash
npm install          # Install dependencies
npm run db:push      # Set up database
npm run dev          # Start dev server
```

## Production

```bash
npm run build        # Build for production
npm start            # Run production server
```

## Related Documentation

- [Source Tree Analysis](./source-tree-analysis.md)
- [Architecture - Client](./architecture-client.md)
- [Architecture - Server](./architecture-server.md)
- [API Contracts](./api-contracts-server.md)
- [Data Models](./data-models.md)
- [Component Inventory](./component-inventory-client.md)
- [Development Guide](./development-guide.md)
- [Integration Architecture](./integration-architecture.md)

## Existing Documentation

- [Design Guidelines](../design_guidelines.md) - UI/UX specifications
- [Replit Overview](../replit.md) - System architecture overview
- [PRD](../_bmad-output/planning-artifacts/prd.md) - Product requirements
