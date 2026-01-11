# NYC Apartment Review Platform - Documentation Index

**Generated**: 2026-01-10
**Scan Level**: Exhaustive
**Workflow Version**: 1.2.0

---

## Project Overview

- **Type**: Multi-part (client/server/shared)
- **Primary Language**: TypeScript
- **Architecture**: Full-stack React + Express with shared schema

### Quick Reference

#### Client (React Frontend)
- **Type**: Web Application
- **Tech Stack**: React 18, Vite 7, Tailwind CSS, React Query
- **Root**: `client/src`
- **Entry Point**: `main.tsx`

#### Server (Express Backend)
- **Type**: REST API
- **Tech Stack**: Express 4, Drizzle ORM, PostgreSQL, Passport.js
- **Root**: `server`
- **Entry Point**: `index.ts`

#### Shared (Library)
- **Type**: TypeScript Library
- **Tech Stack**: Drizzle schemas, Zod validation
- **Root**: `shared`

---

## Generated Documentation

### Core Documents

| Document | Description |
|----------|-------------|
| [Project Overview](./project-overview.md) | Executive summary and feature overview |
| [Source Tree Analysis](./source-tree-analysis.md) | Directory structure and critical paths |
| [Integration Architecture](./integration-architecture.md) | How parts communicate |

### Architecture

| Document | Part | Description |
|----------|------|-------------|
| [Architecture - Client](./architecture-client.md) | client | React frontend architecture |
| [Architecture - Server](./architecture-server.md) | server | Express backend architecture |

### Technical Reference

| Document | Description |
|----------|-------------|
| [API Contracts](./api-contracts-server.md) | REST API endpoints and schemas |
| [Data Models](./data-models.md) | Database schema and relationships |
| [Component Inventory](./component-inventory-client.md) | UI component catalog |

### Development

| Document | Description |
|----------|-------------|
| [Development Guide](./development-guide.md) | Setup, patterns, and workflows |

---

## Existing Documentation

Found in project root:

| Document | Type | Description |
|----------|------|-------------|
| [Design Guidelines](../design_guidelines.md) | Design | Material Design system, typography, components |
| [Replit Overview](../replit.md) | Architecture | System overview and dependencies |

### Planning Artifacts

| Document | Location |
|----------|----------|
| [PRD](../_bmad-output/planning-artifacts/prd.md) | Product requirements document |

---

## Getting Started

### For New Developers

1. Read [Project Overview](./project-overview.md)
2. Review [Source Tree Analysis](./source-tree-analysis.md)
3. Follow [Development Guide](./development-guide.md)

### For Feature Development

1. Check [PRD](../_bmad-output/planning-artifacts/prd.md) for requirements
2. Review relevant architecture doc:
   - UI features → [Architecture - Client](./architecture-client.md)
   - API features → [Architecture - Server](./architecture-server.md)
   - Full-stack → [Integration Architecture](./integration-architecture.md)
3. Reference [API Contracts](./api-contracts-server.md) for endpoints
4. Check [Component Inventory](./component-inventory-client.md) for UI

### For Understanding Data

1. Review [Data Models](./data-models.md)
2. Check [API Contracts](./api-contracts-server.md) for request/response schemas

---

## Commands Quick Reference

```bash
# Development
npm run dev              # Start dev server

# Database
npm run db:push          # Push schema changes

# Production
npm run build            # Build for production
npm start                # Run production server

# Type Checking
npm run check            # TypeScript check
```

---

## Document Metadata

| Attribute | Value |
|-----------|-------|
| Scan Date | 2026-01-10 |
| Scan Level | Exhaustive |
| Parts Documented | 3 |
| Files Generated | 10 |
| Project Type | Multi-part Web Application |
