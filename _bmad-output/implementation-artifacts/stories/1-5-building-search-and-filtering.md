# Story 1.5: Building Search & Filtering

Status: done

## Story

As a **prospective renter**,
I want **to search and filter buildings on a dedicated search page**,
So that **I can browse multiple buildings and compare options**.

## Acceptance Criteria

1. **Given** a user navigates to the Search page
   **When** they enter text in the search input field
   **Then** building results filter in real-time by building name

2. **Given** search results are displayed
   **When** the user views the results
   **Then** results display as building cards showing: name, address, overall rating (stars), review count

3. **Given** a user views a building card
   **When** they click on it
   **Then** they navigate to that building's detail page

## Tasks / Subtasks

- [x] Task 1: Verify search functionality exists (AC: #1)
  - [x] Search page exists at `/search` route
  - [x] Search input field with debounced filtering (300ms)
  - [x] Real-time filtering via React Query

- [x] Task 2: Verify BuildingCard displays required info (AC: #2)
  - [x] Building name displayed
  - [x] Address displayed with MapPin icon
  - [x] Overall rating with StarRating component
  - [x] Review count displayed

- [x] Task 3: Verify click-through navigation (AC: #3)
  - [x] BuildingCard wraps content in Link component
  - [x] Link navigates to `/building/{id}`

## Dev Notes

### Current Implementation Status

**BROWNFIELD CONTEXT**: This story is **ALREADY FULLY IMPLEMENTED** in the existing codebase. The search page exceeds the story requirements with additional features.

**Existing Implementation**:
- `client/src/pages/search.tsx` - Full search page with filters
- `client/src/components/building-card.tsx` - Card component with all required fields

### Key Files

| File | Purpose | Status |
|------|---------|--------|
| `client/src/pages/search.tsx` | Search page with filtering | EXISTS - Fully implemented |
| `client/src/components/building-card.tsx` | Building card display | EXISTS - Fully implemented |

### Architecture Compliance

**ALREADY FOLLOWS**:
- React 18 functional components with hooks
- React Query for server state management
- Tailwind CSS utility classes
- shadcn/ui components (Card, Input, Select, Badge)
- Wouter for routing

### Existing Features (Beyond Story Scope)

The current implementation includes additional features not required by this story:
- Neighborhood filtering (Select dropdown)
- Building type filtering (Select dropdown)
- Sort options (Highest Rated, Most Reviews, Newest)
- URL query parameter support (`?q=searchterm`)
- Loading skeletons during fetch
- Empty state with call-to-action

### Testing Requirements

**Manual Testing Checklist**:
- [x] Search page loads at `/search`
- [x] Typing in search filters results in real-time
- [x] Building cards show name, address, rating, review count
- [x] Clicking card navigates to building detail page
- [x] Empty state displays when no results found

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.5]
- [Source: _bmad-output/planning-artifacts/prd.md#FR7-FR9]

### PRD Requirements Mapping

| PRD Requirement | FR | Status |
|-----------------|-----|--------|
| Search input with real-time filtering | FR7 | IMPLEMENTED |
| Building cards with name, address, rating, count | FR8 | IMPLEMENTED |
| Click-through to Building Detail | FR9 | IMPLEMENTED |

## Dev Agent Record

### Agent Model Used
claude-opus-4-5-20251101

### Completion Notes List
- Story verified as already implemented in brownfield codebase
- Additional features exist beyond story scope (filters, sorting)
- Code review identified and fixed 4 pre-existing issues

### Change Log

| Date | Change | Files Modified |
|------|--------|----------------|
| 2026-01-12 | Story verified as already implemented (brownfield) | None - documentation only |
| 2026-01-12 | Code review: removed unused imports, added error state, added aria-label | search.tsx, building-card.tsx |

### Code Review Summary

| # | Severity | Issue | Status |
|---|----------|-------|--------|
| 1 | MEDIUM | Unused `useLocation` import | FIXED |
| 2 | LOW | Unused `Filter` import | FIXED |
| 3 | LOW | No error state for API failures | FIXED |
| 4 | LOW | Missing aria-label on card links | FIXED |

### File List

_Files that implement this story (pre-existing):_

- `client/src/pages/search.tsx` - Search page with filtering and cards
- `client/src/components/building-card.tsx` - Building card component
