# Story 1.2: Home Page Navigation Bar

Status: ready-for-dev

## Story

As a **platform user**,
I want **a persistent navigation bar with key actions**,
so that **I can quickly access Search, Login/Signup, and Add Building from any page**.

## Acceptance Criteria

1. **Given** a user is on any page of the platform
   **When** they view the top of the screen
   **Then** a fixed navigation bar is visible

2. **Given** a user views the navigation bar
   **When** they examine the available links
   **Then** the nav bar contains links to: Search, Login/Signup, Add Building

3. **Given** a user scrolls down on any page
   **When** they scroll past the initial viewport
   **Then** the nav bar remains fixed at the top of the screen

4. **Given** a user clicks any navigation link
   **When** the click is registered
   **Then** the navigation links are functional and route to correct pages

## Tasks / Subtasks

- [ ] Task 1: Verify navigation bar structure and positioning (AC: #1, #3)
  - [ ] Confirm `fixed top-0` positioning is applied
  - [ ] Verify `z-50` ensures nav stays above all content
  - [ ] Test scrolling behavior on home page and other pages
  - [ ] Confirm backdrop blur effect on scroll

- [ ] Task 2: Validate navigation links (AC: #2, #4)
  - [ ] Verify "Search" link routes to `/search`
  - [ ] Verify "Add Building" link routes to `/add-building`
  - [ ] Verify Login/Signup button routes to `/api/login` (Replit OAuth)
  - [ ] Confirm authenticated state shows user menu instead of "Sign In"
  - [ ] Test Admin link visibility for authenticated users

- [ ] Task 3: Test responsive behavior
  - [ ] Desktop (>768px): All links visible in horizontal layout
  - [ ] Mobile (<768px): Hamburger menu with expanded mobile navigation
  - [ ] Verify mobile menu opens/closes correctly
  - [ ] Confirm touch targets meet minimum 44x44px accessibility requirement

- [ ] Task 4: Verify transparent mode on home page (AC: #1)
  - [ ] Navigation is transparent over hero on home page
  - [ ] Navigation gets background on other pages
  - [ ] Transition is smooth when navigating between pages

- [ ] Task 5: Accessibility validation
  - [ ] Proper heading hierarchy (logo/brand is not a heading)
  - [ ] All links have accessible names
  - [ ] Keyboard navigation works correctly
  - [ ] Focus indicators are visible

## Dev Notes

### Current Implementation Status

**BROWNFIELD CONTEXT**: The navigation bar is already fully implemented and functional. This story focuses on validation and ensuring PRD compliance.

**Existing Implementation** (`client/src/components/navigation.tsx`):
- Fixed positioning with `fixed top-0 left-0 right-0 z-50`
- Transparent mode on home page with backdrop blur
- Desktop links: Search, Add Building, Admin (auth only)
- Mobile hamburger menu with responsive design
- User avatar dropdown for authenticated users
- Sign In button for unauthenticated users

### Key Files to Review/Modify

| File | Purpose | Lines |
|------|---------|-------|
| `client/src/components/navigation.tsx` | Main navigation component | All (160 lines) |
| `client/src/pages/home.tsx` | Uses Navigation with `transparent` prop | Line 24 |
| `client/src/hooks/use-auth.ts` | Authentication state hook | All |

### Architecture Compliance

**MUST FOLLOW**:
- React 18 functional components with hooks
- Tailwind CSS utility classes (no custom CSS)
- shadcn/ui components for UI elements (`Button`, `DropdownMenu`, `Avatar`)
- Wouter for client-side routing (`Link`, `useLocation`)
- Responsive design using Tailwind breakpoints: `md:`, `lg:`

**DO NOT**:
- Add new navigation items without PRD justification
- Modify shadcn/ui component internals
- Change authentication flow (Replit OAuth is current system)
- Remove existing test IDs (used for testing)

### Library/Framework Requirements

| Library | Version | Usage |
|---------|---------|-------|
| React | 18.3.1 | Component framework |
| Wouter | 3.3.5 | Client-side routing (`Link`, `useLocation`) |
| Tailwind CSS | 3.4.17 | Utility styling |
| lucide-react | 0.453.0 | Icons (Search, Plus, Menu, X, User, LogOut) |
| @radix-ui/react-dropdown-menu | - | Via shadcn/ui for user menu |

### Testing Requirements

**Manual Testing Checklist**:
- [ ] Navigate to each link and verify correct routing
- [ ] Test on mobile viewport with hamburger menu
- [ ] Test login/logout flow affects navigation state
- [ ] Verify scroll behavior on pages with content
- [ ] Test keyboard navigation (Tab through all links)

**Test IDs Available**:
- `nav-search` - Desktop Search link
- `nav-add-building` - Desktop Add Building link
- `nav-admin` - Desktop Admin link (auth only)
- `button-login` - Sign In button
- `button-user-menu` - User avatar menu trigger
- `button-logout` - Logout option
- `button-mobile-menu` - Mobile hamburger button
- `mobile-nav-*` - Mobile menu items

### Project Structure Notes

```
client/src/
├── components/
│   ├── navigation.tsx    # Main navigation component
│   └── ui/
│       ├── button.tsx    # shadcn button
│       ├── dropdown-menu.tsx # shadcn dropdown
│       └── avatar.tsx    # shadcn avatar
├── hooks/
│   └── use-auth.ts       # Authentication hook
└── pages/
    └── home.tsx          # Uses Navigation with transparent prop
```

### Navigation Component API

```typescript
interface NavigationProps {
  transparent?: boolean;  // Enable transparent mode (used on home page)
}
```

**Usage**:
```tsx
// On home page (transparent over hero)
<Navigation transparent />

// On other pages (default with background)
<Navigation />
```

### References

- [Source: _bmad-output/planning-artifacts/prd.md#4.1 Home Page - FR4]
- [Source: _bmad-output/planning-artifacts/architecture.md#5.1 Project Structure]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.2]
- [Source: docs/architecture-client.md]

### PRD Requirements Mapping

| PRD Requirement | FR | Current Status |
|-----------------|-----|----------------|
| Fixed navigation bar at top | FR4 | Implemented (`fixed top-0`) |
| Links to Search | FR4 | Implemented (`/search`) |
| Links to Login/Signup | FR4 | Implemented (`/api/login` Replit OAuth) |
| Links to Add Building | FR4 | Implemented (`/add-building`) |

### Previous Story Intelligence

**From Story 1-1 (Home Page Hero Section)**:
- Navigation renders with `transparent` prop over hero
- Uses backdrop blur for readability: `backdrop-blur-sm`
- Tested responsive behavior across viewports
- No TypeScript errors or build issues encountered

**Key Learnings**:
- shadcn/ui Button component works well with Wouter Link
- `useAuth()` hook provides `user`, `isAuthenticated`, `isLoading`
- Mobile menu state managed with `useState`

### Potential Issues to Check

1. **Mobile Menu Accessibility**: Ensure focus trap when mobile menu is open
2. **Transparent Mode Contrast**: On home page, white text over image may need verification
3. **Admin Link Visibility**: Currently shows for any authenticated user - may need role check if PRD specifies admin-only visibility
4. **Login State Persistence**: Verify navigation updates immediately after login/logout

### Gap Analysis

**PRD specifies "Login/Signup"** - Current implementation:
- Shows "Sign In" button linking to `/api/login` (Replit OAuth)
- No separate signup page (OAuth handles both)
- This is acceptable for brownfield since Replit OAuth is the current auth system
- Email/password auth (Epic 2) will add traditional login/signup pages later

**Current vs PRD Navigation Items**:
| PRD Item | Current Implementation | Notes |
|----------|----------------------|-------|
| Search | `/search` with Search icon | Implemented |
| Login/Signup | `/api/login` "Sign In" | OAuth flow (email auth in Epic 2) |
| Add Building | `/add-building` with Plus icon | Implemented |

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### Change Log

| Date | Change | Files Modified |
|------|--------|----------------|

### File List

_Files created or modified during implementation:_

