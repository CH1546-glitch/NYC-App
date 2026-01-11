# Component Inventory - Client

Generated: 2026-01-10

## Overview

React component library for the NYC Apartment Review Platform. Combines shadcn/ui primitives with custom domain-specific components.

## Component Categories

| Category | Count | Description |
|----------|-------|-------------|
| UI Primitives | 40+ | shadcn/ui base components |
| Domain Components | 6 | Application-specific components |
| Page Components | 7 | Route-level views |

---

## Domain Components

### Navigation

**File**: `components/navigation.tsx`

**Purpose**: Fixed header with responsive navigation and authentication.

**Props**:
```typescript
interface NavigationProps {
  transparent?: boolean;  // Transparent bg on home page
}
```

**Features**:
- Logo with home link
- Desktop nav links (Search, Add Building)
- Admin link (authenticated users only)
- User dropdown menu with avatar
- Sign In button (unauthenticated)
- Mobile hamburger menu

**Dependencies**: `useAuth`, `useLocation`, Radix DropdownMenu

---

### BuildingCard

**File**: `components/building-card.tsx`

**Purpose**: Building preview card for search results.

**Props**:
```typescript
interface BuildingCardProps {
  building: BuildingWithRatings;
}
```

**Features**:
- Building name and address
- Neighborhood badge
- Star rating display
- Review count
- Hover elevation effect
- Click navigates to detail

---

### StarRating

**File**: `components/star-rating.tsx`

**Purpose**: Display star rating (read-only or interactive).

**Props**:
```typescript
interface StarRatingProps {
  rating: number;           // 0-5
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
}
```

**Features**:
- Filled/empty star icons
- Partial star support
- Size variants
- Optional click handler

---

### RatingBar

**File**: `components/rating-bar.tsx`

**Purpose**: Horizontal progress bar for category ratings.

**Props**:
```typescript
interface RatingBarProps {
  label: string;    // "Noise", "Cleanliness", etc.
  rating: number;   // 0-5
}
```

**Features**:
- Label on left
- Progress bar (rating/5 width)
- Score on right
- Consistent height

---

### ReviewCard

**File**: `components/review-card.tsx`

**Purpose**: Display a single review with details.

**Props**:
```typescript
interface ReviewCardProps {
  review: ReviewWithDetails;
}
```

**Features**:
- User avatar (or anonymous icon)
- Star rating
- Floor number badge
- Review text with expansion
- Photo thumbnails
- Timestamp

---

### FloorInsightsChart

**File**: `components/floor-insights-chart.tsx`

**Purpose**: Recharts visualization of ratings by floor.

**Props**:
```typescript
interface FloorInsightsChartProps {
  reviews: Review[];
}
```

**Features**:
- Bar chart with floor groupings
- Average rating per floor range
- Responsive sizing
- Tooltips

---

## Page Components

### Home (`pages/home.tsx`)

**Route**: `/`

**Sections**:
1. Hero with search form
2. "How It Works" feature cards
3. Privacy protection section
4. Footer

**Key Features**:
- Full-screen hero with NYC skyline
- Autocomplete search
- Popular neighborhood links
- Transparent navigation

---

### SearchPage (`pages/search.tsx`)

**Route**: `/search`

**Features**:
- Search input with debounce
- Filter dropdowns (neighborhood, type)
- Sort options (rating, reviews, newest)
- Building card grid
- Loading skeletons
- Empty state

---

### BuildingDetail (`pages/building-detail.tsx`)

**Route**: `/building/:id`

**Layout**: Two-column (desktop), stacked (mobile)

**Left Column**:
- Building info card
- Reviews list with sort

**Right Column**:
- Category rating bars
- Floor insights chart

---

### WriteReview (`pages/write-review.tsx`)

**Route**: `/building/:id/review`

**Form Fields**:
- Overall rating (stars)
- Floor number
- Category ratings (sliders)
- Review text
- Anonymous toggle
- Photo upload (placeholder)

**Validation**: Zod + React Hook Form

---

### AddBuilding (`pages/add-building.tsx`)

**Route**: `/add-building`

**Form Fields**:
- Building name
- Address
- ZIP code (5-digit validation)
- Neighborhood dropdown
- Building type dropdown
- Landlord name (optional)

---

### Admin (`pages/admin.tsx`)

**Route**: `/admin`

**Tabs**:
1. Overview (stats cards)
2. Pending Buildings (table)
3. Pending Reviews (table)

**Actions**: Approve/Deny with confirmation

---

### NotFound (`pages/not-found.tsx`)

**Route**: `*` (fallback)

**Features**:
- 404 icon
- Message
- Back to home button

---

## shadcn/ui Primitives

Located in `components/ui/`:

### Layout
- Card, CardHeader, CardContent, CardFooter
- Separator
- AspectRatio

### Forms
- Input, Textarea
- Button
- Select, SelectTrigger, SelectContent, SelectItem
- Checkbox, RadioGroup
- Label
- Form (React Hook Form integration)

### Feedback
- Toast, Toaster
- Alert, AlertDialog
- Progress
- Skeleton

### Navigation
- Tabs, TabsList, TabsTrigger, TabsContent
- NavigationMenu
- DropdownMenu
- Menubar

### Overlays
- Dialog, DialogTrigger, DialogContent
- Popover
- Tooltip
- HoverCard
- Sheet (drawer)

### Data Display
- Avatar
- Badge
- Table, TableHeader, TableRow, TableCell
- Accordion

### Interactive
- Slider
- Switch
- Toggle, ToggleGroup
- Collapsible
- ScrollArea
- Command (cmdk)

---

## Design System Integration

### Color Tokens

All components use CSS variable-based colors:
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--muted`, `--muted-foreground`
- `--destructive`
- `--background`, `--foreground`

### Typography

- Font: Inter (via CSS variable)
- Sizes: Tailwind scale
- Weights: 400, 500, 600, 700

### Spacing

- Tailwind spacing primitives
- Consistent padding: p-4, p-6, p-8
- Gap utilities for flex/grid
