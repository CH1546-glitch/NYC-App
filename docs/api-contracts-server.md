# API Contracts - Server

Generated: 2026-01-10

## Overview

RESTful JSON API served by Express.js at `/api/*` endpoints. All endpoints return JSON responses and use standard HTTP status codes.

## Authentication

- **Method**: Replit OpenID Connect via Passport.js
- **Sessions**: PostgreSQL-backed via connect-pg-simple
- **Protected Routes**: Use `isAuthenticated` middleware

### Auth Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/login` | Public | Initiates OAuth login flow |
| GET | `/api/logout` | Public | Ends session, redirects to home |
| GET | `/api/auth/user` | Public | Returns current user or 401 |

---

## Buildings API

### GET /api/buildings

**Description**: Fetch list of buildings with filters and sorting.

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| q | string | Search by name, address, or neighborhood |
| neighborhood | string | Filter by neighborhood (or "all") |
| buildingType | string | Filter by building type (or "all") |
| sortBy | string | Sort order: "reviews", "newest", or default (rating) |

**Response**: `BuildingWithRatings[]`

```typescript
interface BuildingWithRatings {
  id: string;
  name: string;
  address: string;
  city: string;
  zipCode: string;
  neighborhood: string | null;
  buildingType: string | null;
  landlordName: string | null;
  status: string;
  createdAt: Date | null;
  createdBy: string | null;
  overallRating: number;
  reviewCount: number;
  noiseRating: number;
  cleanlinessRating: number;
  maintenanceRating: number;
  safetyRating: number;
  pestRating: number;
}
```

---

### GET /api/buildings/:id

**Description**: Fetch single building by ID with aggregated ratings.

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Building UUID |

**Response**: `BuildingWithRatings` or 404

---

### POST /api/buildings

**Description**: Create new building (requires authentication).

**Auth**: Required

**Request Body**: `InsertBuilding`
```typescript
{
  name: string;
  address: string;
  city?: string; // defaults to "New York"
  zipCode: string; // must be 5 digits
  neighborhood?: string;
  buildingType?: string;
  landlordName?: string;
}
```

**Response**: `Building` (status 201)

**Validation**: Zod schema with 5-digit ZIP code regex

---

## Reviews API

### GET /api/buildings/:id/reviews

**Description**: Fetch reviews for a building.

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| sortBy | string | "newest" (default), "highest", or "lowest" |

**Response**: `ReviewWithDetails[]`

```typescript
interface ReviewWithDetails {
  id: string;
  buildingId: string;
  userId: string;
  overallRating: number;
  floorNumber: number;
  noiseRating: number | null;
  cleanlinessRating: number | null;
  maintenanceRating: number | null;
  safetyRating: number | null;
  pestRating: number | null;
  reviewText: string;
  isAnonymous: boolean;
  status: string;
  createdAt: Date | null;
  photos: ReviewPhoto[];
  userName?: string;
  userProfileImage?: string;
}
```

---

### POST /api/buildings/:id/reviews

**Description**: Submit a review for a building (requires authentication).

**Auth**: Required

**Request Body**: `InsertReview`
```typescript
{
  overallRating: number; // 1-5
  floorNumber: number; // 1-100
  noiseRating?: number; // 1-5
  cleanlinessRating?: number; // 1-5
  maintenanceRating?: number; // 1-5
  safetyRating?: number; // 1-5
  pestRating?: number; // 1-5
  reviewText: string; // min 50 characters
  isAnonymous?: boolean; // defaults to true
}
```

**Response**: `Review` (status 201)

---

## Admin API

All admin endpoints require authentication.

### GET /api/admin/stats

**Description**: Fetch admin dashboard statistics.

**Response**:
```typescript
{
  totalUsers: number;
  totalBuildings: number;
  pendingBuildings: number;
  totalReviews: number;
  pendingReviews: number;
}
```

---

### GET /api/admin/buildings/pending

**Description**: Fetch buildings awaiting moderation.

**Response**: `Building[]`

---

### POST /api/admin/buildings/:id/approve

**Description**: Approve a pending building.

**Response**: `Building` or 404

---

### POST /api/admin/buildings/:id/deny

**Description**: Deny a pending building.

**Response**: `Building` or 404

---

### GET /api/admin/reviews/pending

**Description**: Fetch reviews awaiting moderation.

**Response**: `Review[]`

---

### POST /api/admin/reviews/:id/approve

**Description**: Approve a pending review.

**Response**: `Review` or 404

---

### POST /api/admin/reviews/:id/deny

**Description**: Deny a pending review.

**Response**: `Review` or 404

---

## Error Handling

All endpoints return errors in this format:
```json
{
  "message": "Error description"
}
```

| Status | Meaning |
|--------|---------|
| 400 | Validation error (Zod) |
| 401 | Authentication required |
| 404 | Resource not found |
| 500 | Internal server error |
