# Story 1.4: How It Works Section

Status: ready-for-dev

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

- [ ] Task 1: Add icons to each step (AC: #3)
  - [ ] Import appropriate icons from `lucide-react` (Search, BookOpen, PenLine)
  - [ ] Add icon above each step number with consistent sizing
  - [ ] Style icons to match editorial design (muted color, appropriate size)

- [ ] Task 2: Review step naming alignment (AC: #2)
  - [ ] Verify current "Discover" step aligns with "Read Reviews" intent
  - [ ] Update step title if needed for clarity

- [ ] Task 3: Verify responsive behavior (AC: #1, #4)
  - [ ] Test 3-column grid on desktop
  - [ ] Test stacked layout on mobile
  - [ ] Ensure icons scale appropriately

## Dev Notes

### Current Implementation Status

**BROWNFIELD CONTEXT**: The "How It Works" section already exists in `client/src/pages/home.tsx` (lines 64-99). The section has the 3-step structure but is missing icons per AC #3.

**Existing Implementation** (`client/src/pages/home.tsx` lines 64-99):
```jsx
<section className="py-24 bg-background">
  <!-- 3-step grid with Search, Discover, Contribute -->
  <!-- Each step has: decorative line, number (01/02/03), title, description -->
  <!-- NO icons currently -->
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
- [ ] Icons display correctly on desktop
- [ ] Icons display correctly on mobile
- [ ] Icons have appropriate color (muted-foreground)
- [ ] Icons are sized consistently (suggest h-8 w-8 or h-10 w-10)
- [ ] Section maintains editorial aesthetic

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

### Debug Log References

### Completion Notes List

### Change Log

| Date | Change | Files Modified |
|------|--------|----------------|

### File List

_Files created or modified during implementation:_
