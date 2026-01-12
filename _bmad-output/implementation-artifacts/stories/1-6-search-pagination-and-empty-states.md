# Story 1.6: Search Pagination & Empty States

Status: done

## Story

As a **user searching for buildings**,
I want **paginated results and helpful messaging when no results exist**,
So that **I can navigate large result sets and understand when searches have no matches**.

## Acceptance Criteria

1. **Given** a search returns more results than fit on one page
   **When** the user views the search results
   **Then** infinite scroll loads more results as user scrolls down

2. **Given** the user scrolls to the bottom of results
   **When** more results are available
   **Then** additional results load automatically

3. **Given** a search returns no matching buildings
   **When** the results area renders
   **Then** an empty state message is displayed (e.g., "No buildings found matching your search")

4. **Given** an empty state is displayed
   **When** the user views the message
   **Then** alternative actions are suggested (e.g., "Try a different search term or add a new building")

## Tasks / Subtasks

- [x] Task 1: Add pagination support to backend API (AC: #1, #2)
  - [x] Update `getBuildings` in storage.ts to accept limit/offset
  - [x] Return total count with results for pagination info
  - [x] Update routes.ts to pass pagination parameters

- [x] Task 2: Implement infinite scroll on frontend (AC: #1, #2)
  - [x] Replace `useQuery` with `useInfiniteQuery`
  - [x] Add intersection observer for scroll detection
  - [x] Show loading indicator when fetching more
  - [x] Handle "no more results" state

- [x] Task 3: Verify empty states (AC: #3, #4)
  - [x] Empty state message displays correctly
  - [x] Alternative actions (Add Building CTA) present

## Dev Notes

### Current Implementation Status

**BROWNFIELD CONTEXT**: Empty states are already implemented. Pagination/infinite scroll needs to be added.

**Existing Implementation**:
- `client/src/pages/search.tsx` - Has empty states, no pagination
- `server/routes.ts` - Returns all results, no limit/offset
- `server/storage.ts` - `getBuildings` fetches all matching buildings

### Key Files to Modify

| File | Purpose | Action |
|------|---------|--------|
| `server/storage.ts` | Database queries | Add limit/offset to getBuildings |
| `server/routes.ts` | API endpoints | Pass pagination params |
| `client/src/pages/search.tsx` | Search page | Implement infinite scroll |

### Architecture Compliance

**MUST FOLLOW**:
- React Query `useInfiniteQuery` for pagination
- Intersection Observer API for scroll detection
- Drizzle ORM for database queries
- Express for API endpoints

### Technical Approach

**Backend Changes**:
```typescript
// Add to getBuildings params
limit?: number;
offset?: number;

// Return format
{ buildings: BuildingWithRatings[], total: number, hasMore: boolean }
```

**Frontend Changes**:
- Use `useInfiniteQuery` with `getNextPageParam`
- IntersectionObserver on sentinel element
- Flatten pages for rendering

## Dev Agent Record

### Agent Model Used
claude-opus-4-5-20251101

### Change Log

| Date | Change | Files Modified |
|------|--------|----------------|
| 2026-01-12 | Added pagination to backend API, implemented infinite scroll on frontend | storage.ts, routes.ts, search.tsx |

### File List

_Files created or modified during implementation:_

- `server/storage.ts` - Added PaginatedBuildings interface, limit/offset support
- `server/routes.ts` - Pass limit/offset params to getBuildings
- `client/src/pages/search.tsx` - useInfiniteQuery, IntersectionObserver, loading states_

