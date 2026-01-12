# Story 1.12: Privacy Section Restyle

Status: done

## Story

As a **first-time visitor**,
I want **to see a clean, minimal privacy trust section**,
So that **I understand the platform's commitment to privacy without visual clutter**.

## Acceptance Criteria

1. **Given** a user scrolls to the "Privacy Protected" section
   **When** they view the section
   **Then** the "Your Data" subtitle is removed

2. **Given** the privacy features list is displayed
   **When** the user views the three feature items
   **Then** the numbers (01, 02, 03) are removed from each item

3. **Given** the section is rendered
   **When** viewed on different devices
   **Then** the section remains responsive and properly styled

## Tasks / Subtasks

- [x] Task 1: Remove "Your Data" subtitle (AC: #1)
  - [x] Remove the `<p>` element containing "Your Data" text

- [x] Task 2: Remove numbers from feature items (AC: #2)
  - [x] Remove "01" from first item
  - [x] Remove "02" from second item
  - [x] Remove "03" from third item

- [x] Task 3: Verify responsive behavior (AC: #3)
  - [x] Grid layout preserved (md:grid-cols-2)
  - [x] Border and spacing maintained

## Dev Notes

### Current Implementation Status

**BROWNFIELD CONTEXT**: The "Privacy Protected" section exists in `client/src/pages/home.tsx` (lines 98-131). This section is NOT covered by PRD requirements but exists in the codebase.

**Current Implementation** (`client/src/pages/home.tsx` lines 98-131):
- Left column: "Privacy Protected" heading, description, shield icon with "Anonymous by default"
- Right column: 3 feature items (No personal info shared, Moderated content, Community driven)

### Key Files to Modify

| File | Purpose | Action |
|------|---------|--------|
| `client/src/pages/home.tsx` | Home page | Remove subtitle and numbers from Privacy section |

### Architecture Compliance

**MUST FOLLOW**:
- React 18 functional components
- Tailwind CSS utility classes
- Editorial design: serif fonts, muted colors, clean lines

### References

- Similar changes made in Story 1.4 (How It Works section)

## Dev Agent Record

### Agent Model Used
claude-opus-4-5-20251101

### Change Log

| Date | Change | Files Modified |
|------|--------|----------------|
| 2026-01-12 | Removed "Your Data" subtitle, numbers (01/02/03), and comma from heading | client/src/pages/home.tsx |

### File List

_Files created or modified during implementation:_

- `client/src/pages/home.tsx` - Removed subtitle, numbers, and comma from Privacy section

