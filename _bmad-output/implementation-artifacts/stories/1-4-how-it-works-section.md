# Story 1.4: How It Works Section

Status: done

## Story

As a **first-time visitor**,
I want **to see a clear explanation of how the platform works**,
so that **I understand the value and how to participate**.

## Acceptance Criteria

1. **Given** a user scrolls down the home page
   **When** they reach the "How It Works" section
   **Then** a 3-step visual guide is displayed

2. **Given** the 3-step guide is displayed
   **When** the user views the steps
   **Then** the steps show: Search → Read Reviews → Contribute

3. **Given** each step is displayed
   **When** the user views a step
   **Then** each step has an icon or visual and brief description

4. **Given** the section is rendered
   **When** viewed on different devices
   **Then** the section is responsive on mobile and desktop

## Tasks / Subtasks

- [x] Task 1: Add icons to each step (AC: #3)
  - [x] Import appropriate icons from `lucide-react` (Search, Star, PenLine)
  - [x] Add icon above each step number with consistent sizing (h-10 w-10)
  - [x] Style icons to match editorial design (muted color, strokeWidth={1})

- [x] Task 2: Review step naming alignment (AC: #2)
  - [x] Verify current "Discover" step aligns with "Read Reviews" intent
  - [x] Update step title from "Discover" to "Read Reviews" for clarity

- [x] Task 3: Verify responsive behavior (AC: #1, #4)
  - [x] Test 3-column grid on desktop
  - [x] Test stacked layout on mobile
  - [x] Ensure icons scale appropriately

- [x] Task 4: Remove "The Process" subtitle (User Request 2026-01-12)
  - [x] Remove `<p>` element with "The Process" text from section header

- [x] Task 5: Remove step numbers (User Request 2026-01-12)
  - [x] Remove "01", "02", "03" number elements below icons

## Dev Notes

### Current Implementation Status

**BROWNFIELD CONTEXT**: The "How It Works" section exists in `client/src/pages/home.tsx` (lines 64-96).

**Current Implementation** (`client/src/pages/home.tsx` lines 64-96):
```jsx
<section className="py-24 bg-background">
  <!-- 3-step grid with Search, Read Reviews, Contribute -->
  <!-- Each step has: icon (Search/Star/PenLine), title, description -->
  <!-- Clean minimal design without numbers or subtitle -->
</section>
```

### Key Files to Modify

| File | Purpose | Action |
|------|---------|--------|
| `client/src/pages/home.tsx` | Home page | Add icons to How It Works section |

### Architecture Compliance

**MUST FOLLOW**:
- React 18 functional components with hooks
- Tailwind CSS utility classes (no custom CSS)
- lucide-react for icons (already used in project)
- Editorial design: serif fonts, muted colors, clean lines

**DO NOT**:
- Create separate CSS files
- Use different icon library (stick to lucide-react)
- Add shadows or rounded corners (editorial = sharp, flat)

### Library/Framework Requirements

| Library | Version | Usage |
|---------|---------|-------|
| React | 18.3.1 | Component framework |
| Tailwind CSS | 3.4.17 | Styling |
| lucide-react | 0.453.0 | Icons (Search, BookOpen, PenLine or similar) |

### Suggested Icon Choices

From lucide-react:
- Step 1 (Search): `Search` or `Building2`
- Step 2 (Read Reviews/Discover): `BookOpen` or `Eye` or `Star`
- Step 3 (Contribute): `PenLine` or `MessageSquare` or `Edit3`

### Testing Requirements

**Manual Testing Checklist**:
- [x] Icons display correctly on desktop
- [x] Icons display correctly on mobile
- [x] Icons have appropriate color (muted-foreground)
- [x] Icons are sized consistently (h-10 w-10)
- [x] Section maintains editorial aesthetic

### Previous Story Intelligence

**From Story 1-3 (Home Page Search with Autocomplete)**:
- lucide-react icons work well (Loader2 used for loading state)
- Editorial design patterns: `rounded-none`, `font-serif`, `font-light`
- Icon sizing typically h-4/h-5 for inline, larger for decorative
- Color scheme: `text-muted-foreground` for secondary elements

**Key Learnings**:
- Keep changes minimal and focused
- Match existing design patterns exactly
- Test responsive behavior on both breakpoints

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.4]
- [Source: _bmad-output/planning-artifacts/prd.md#FR5]

### PRD Requirements Mapping

| PRD Requirement | FR | Current Status |
|-----------------|-----|----------------|
| "How It Works" 3-step visual guide | FR5 | Partially implemented (missing icons) |

## Dev Agent Record

### Agent Model Used
claude-opus-4-5-20251101

### Debug Log References
N/A

### Completion Notes List
- All acceptance criteria met
- Added aria-hidden="true" to decorative icons for accessibility
- Code review found 1 low-severity issue (fixed)

### Code Review Summary
| # | Severity | Issue | Status |
|---|----------|-------|--------|
| 1 | LOW | Icons missing aria-hidden="true" | FIXED |

### Change Log

| Date | Change | Files Modified |
|------|--------|----------------|
| 2026-01-11 | Added icons to How It Works steps, renamed "Discover" to "Read Reviews" | client/src/pages/home.tsx |
| 2026-01-12 | Removed "The Process" subtitle, removed step numbers (01/02/03) per user request | client/src/pages/home.tsx |

### File List

_Files created or modified during implementation:_

- `client/src/pages/home.tsx` - Added Search, Star, PenLine icons; renamed step 2 title
