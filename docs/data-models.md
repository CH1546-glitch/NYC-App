# Data Models

Generated: 2026-01-10

## Overview

Database schema defined using Drizzle ORM with PostgreSQL. Schema located at `shared/schema.ts` with auth models in `shared/models/auth.ts`.

## Entity Relationship Diagram

```
┌─────────────┐     ┌─────────────┐     ┌───────────────┐
│   users     │     │  buildings  │     │    reviews    │
├─────────────┤     ├─────────────┤     ├───────────────┤
│ id (PK)     │     │ id (PK)     │◄────│ buildingId    │
│ email       │     │ name        │     │ id (PK)       │
│ firstName   │     │ address     │     │ userId        │
│ lastName    │     │ city        │     │ overallRating │
│ profileImg  │     │ zipCode     │     │ floorNumber   │
│ createdAt   │     │ neighborhood│     │ noiseRating   │
│ updatedAt   │     │ buildingType│     │ ...ratings    │
└─────────────┘     │ landlordName│     │ reviewText    │
                    │ status      │     │ isAnonymous   │
┌─────────────┐     │ createdAt   │     │ status        │
│  sessions   │     │ createdBy   │     │ createdAt     │
├─────────────┤     └─────────────┘     └───────┬───────┘
│ sid (PK)    │                                 │
│ sess (JSONB)│     ┌───────────────┐           │
│ expire      │     │ review_photos │◄──────────┘
└─────────────┘     ├───────────────┤
                    │ id (PK)       │
                    │ reviewId (FK) │
                    │ imageUrl      │
                    │ createdAt     │
                    └───────────────┘
```

---

## Tables

### users

User accounts created via Replit OpenID Connect authentication.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar | PK, default: uuid | User identifier |
| email | varchar | unique | User email address |
| firstName | varchar | - | First name from OAuth |
| lastName | varchar | - | Last name from OAuth |
| profileImageUrl | varchar | - | Avatar URL from OAuth |
| createdAt | timestamp | default: now() | Account creation time |
| updatedAt | timestamp | default: now() | Last update time |

**Drizzle Schema**:
```typescript
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

---

### sessions

Server-side session storage for Passport.js (connect-pg-simple).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| sid | varchar | PK | Session ID |
| sess | jsonb | NOT NULL | Session data |
| expire | timestamp | NOT NULL, indexed | Expiration time |

---

### buildings

Apartment buildings in NYC with moderation workflow.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar | PK, default: uuid | Building identifier |
| name | text | NOT NULL | Building name |
| address | text | NOT NULL | Street address |
| city | text | NOT NULL, default: "New York" | City name |
| zipCode | text | NOT NULL | 5-digit ZIP code |
| neighborhood | text | - | NYC neighborhood |
| buildingType | text | - | Type (High-rise, Brownstone, etc.) |
| landlordName | text | - | Property manager name |
| status | text | NOT NULL, default: "pending" | Moderation status |
| createdAt | timestamp | default: now() | Submission time |
| createdBy | varchar | - | User who added building |

**Status Values**: `pending`, `approved`, `denied`

**Building Types** (constants):
- High-rise, Mid-rise, Walk-up, Brownstone
- Townhouse, Loft, Co-op, Condo

**Neighborhoods**: 26 predefined NYC neighborhoods across 5 boroughs

---

### reviews

User reviews for buildings with multi-category ratings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar | PK, default: uuid | Review identifier |
| buildingId | varchar | NOT NULL, FK → buildings | Building reference |
| userId | varchar | NOT NULL | Reviewer's user ID |
| overallRating | integer | NOT NULL | 1-5 stars |
| floorNumber | integer | NOT NULL | Reviewer's floor (1-100) |
| noiseRating | integer | - | 1-5 noise level |
| cleanlinessRating | integer | - | 1-5 cleanliness |
| maintenanceRating | integer | - | 1-5 maintenance response |
| safetyRating | integer | - | 1-5 safety/security |
| pestRating | integer | - | 1-5 pest control |
| reviewText | text | NOT NULL | Review content (min 50 chars) |
| isAnonymous | boolean | NOT NULL, default: true | Hide reviewer identity |
| status | text | NOT NULL, default: "pending" | Moderation status |
| createdAt | timestamp | default: now() | Submission time |

**Relations**:
- `building`: Many-to-one with buildings table
- `photos`: One-to-many with review_photos table

---

### review_photos

Images attached to reviews.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | varchar | PK, default: uuid | Photo identifier |
| reviewId | varchar | NOT NULL, FK → reviews | Parent review |
| imageUrl | text | NOT NULL | Image URL |
| createdAt | timestamp | default: now() | Upload time |

---

## Derived Types

### BuildingWithRatings

Extended building with aggregated review statistics:

```typescript
interface BuildingWithRatings extends Building {
  overallRating: number;  // Average of all review ratings
  reviewCount: number;    // Number of approved reviews
  noiseRating: number;
  cleanlinessRating: number;
  maintenanceRating: number;
  safetyRating: number;
  pestRating: number;
}
```

### ReviewWithDetails

Review with related data for display:

```typescript
interface ReviewWithDetails extends Review {
  photos: ReviewPhoto[];
  userName?: string;       // If not anonymous
  userProfileImage?: string;
}
```

---

## Validation Schemas

Zod schemas generated from Drizzle tables via `drizzle-zod`:

### insertBuildingSchema
- Omits: `id`, `createdAt`
- Adds: ZIP code regex validation (`/^\d{5}$/`)

### insertReviewSchema
- Omits: `id`, `createdAt`
- Adds:
  - `overallRating`: 1-5 range
  - `floorNumber`: 1-100 range
  - `reviewText`: minimum 50 characters
  - All category ratings: 1-5 range (optional)

---

## Migrations

Managed via Drizzle Kit:
- Config: `drizzle.config.ts`
- Output: `./migrations`
- Command: `npm run db:push`
