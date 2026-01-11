# Development Guide

Generated: 2026-01-10

## Prerequisites

- **Node.js**: v18+ (v20 recommended)
- **npm**: v9+ or compatible package manager
- **PostgreSQL**: Database access (provided by Replit)
- **Git**: Version control

## Quick Start

```bash
# Install dependencies
npm install

# Set up database (push schema)
npm run db:push

# Start development server
npm run dev
```

The app will be available at the port specified in `PORT` (default: 5000).

## Environment Variables

Create a `.env` file or configure in Replit Secrets:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SESSION_SECRET` | Yes | Random string for session encryption |
| `ISSUER_URL` | Yes | Replit OAuth issuer URL |
| `REPL_ID` | Yes | Your Replit app ID |
| `PORT` | No | Server port (default: 5000) |
| `NODE_ENV` | No | `development` or `production` |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run check` | TypeScript type checking |
| `npm run db:push` | Push schema changes to database |

## Project Structure

```
├── client/           # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       └── lib/
├── server/           # Express backend
├── shared/           # Shared types/schemas
├── script/           # Build scripts
└── docs/             # Documentation
```

## Development Workflow

### Frontend Development

1. **Components**: Add to `client/src/components/`
2. **Pages**: Add to `client/src/pages/`, register in `App.tsx`
3. **Hooks**: Add to `client/src/hooks/`
4. **Styling**: Use Tailwind classes

**Adding a shadcn/ui component**:
```bash
npx shadcn-ui add [component-name]
```

### Backend Development

1. **Routes**: Add to `server/routes.ts`
2. **Storage**: Add methods to `server/storage.ts`
3. **Schema**: Modify `shared/schema.ts`, run `db:push`

### Database Changes

1. Edit `shared/schema.ts`
2. Run `npm run db:push`
3. Update storage methods if needed
4. Update TypeScript types

## Code Patterns

### API Fetching (Frontend)

```typescript
import { useQuery } from "@tanstack/react-query";

const { data, isLoading, error } = useQuery({
  queryKey: ["/api/endpoint", params],
  queryFn: async () => {
    const res = await fetch(`/api/endpoint?${params}`);
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  },
});
```

### Form Handling

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { ... },
});

const onSubmit = async (data) => {
  await apiRequest("POST", "/api/endpoint", data);
};
```

### API Endpoint (Backend)

```typescript
app.post("/api/resource", isAuthenticated, async (req, res) => {
  try {
    const data = schema.parse(req.body);
    const result = await storage.createResource(data);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: "Failed" });
  }
});
```

### Database Query (Storage)

```typescript
async getResource(id: string) {
  const [result] = await db
    .select()
    .from(resources)
    .where(eq(resources.id, id));
  return result;
}
```

## Type Safety

### Shared Types

Import from `@shared/schema`:
```typescript
import type { Building, Review, User } from "@shared/schema";
```

### Path Aliases

| Alias | Path |
|-------|------|
| `@/*` | `client/src/*` |
| `@shared/*` | `shared/*` |
| `@assets/*` | `attached_assets/*` |

## Styling Guide

### Tailwind Usage

```tsx
<div className="flex items-center gap-4 p-6 bg-card rounded-xl">
  <Button variant="primary" size="lg">
    Click Me
  </Button>
</div>
```

### Design Tokens

Use semantic color classes:
- `bg-background`, `text-foreground`
- `bg-primary`, `text-primary-foreground`
- `bg-muted`, `text-muted-foreground`
- `border-border`

### Component Variants

```tsx
import { cva } from "class-variance-authority";

const buttonVariants = cva("base-classes", {
  variants: {
    variant: { primary: "...", secondary: "..." },
    size: { sm: "...", lg: "..." },
  },
});
```

## Testing

### Test IDs

Components include `data-testid` attributes:
```tsx
<Button data-testid="button-submit">Submit</Button>
```

### Manual Testing Checklist

- [ ] Home page search works
- [ ] Building list loads and filters
- [ ] Building detail shows reviews
- [ ] Review form validates and submits
- [ ] Admin moderation works
- [ ] Login/logout flow works
- [ ] Mobile responsive layout

## Debugging

### Backend Logs

API requests are logged:
```
10:30:45 AM [express] POST /api/buildings 201 in 45ms
```

### Database Issues

Check connection:
```bash
echo $DATABASE_URL
npm run db:push
```

### Frontend Errors

- React Query devtools (add to App.tsx)
- Browser console for fetch errors
- Vite overlay for build errors

## Production Build

```bash
# Build both frontend and backend
npm run build

# Run production server
npm start
```

Build outputs:
- `dist/public/` - Frontend assets
- `dist/index.cjs` - Bundled server

## Contributing

1. Create feature branch
2. Follow existing code patterns
3. Add types for new data
4. Test manually
5. Submit PR
