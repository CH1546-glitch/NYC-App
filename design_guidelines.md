# NYC Apartment Review Platform - Design Guidelines

## Design Approach

**Selected Approach:** Material Design System with Real Estate Platform Influences

**Rationale:** This platform is information-dense and utility-focused, requiring clear data hierarchy, trustworthy presentation, and efficient navigation. Material Design provides robust patterns for forms, cards, and data visualization while maintaining professional credibility essential for a review platform.

**Key References:** Draw layout inspiration from Zillow (real estate clarity), Yelp (review presentation), and Airbnb (trust-building elements).

---

## Core Design Elements

### Typography

**Primary Font:** Inter or Roboto (Google Fonts CDN)
**Secondary Font:** System font stack for performance

**Hierarchy:**
- **Hero Headline:** 48-64px, Bold (font-weight: 700)
- **Page Titles:** 32-40px, Semibold (600)
- **Section Headers:** 24-28px, Semibold (600)
- **Card Titles/Building Names:** 18-20px, Medium (500)
- **Body Text:** 16px, Regular (400), line-height: 1.6
- **Meta/Supporting Text:** 14px, Regular (400)
- **Small Labels:** 12px, Medium (500)

---

### Layout System

**Spacing Primitives:** Tailwind units of **2, 4, 8, 12, 16** (e.g., p-4, m-8, gap-12)

**Container Strategy:**
- Full-width hero: `w-full`
- Content containers: `max-w-7xl mx-auto px-4 md:px-8`
- Reading content: `max-w-4xl`
- Forms: `max-w-2xl`

**Grid Patterns:**
- Building cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`
- Review cards: Single column with `space-y-6`
- Admin dashboards: `grid-cols-1 lg:grid-cols-3 gap-6` for metrics

---

### Component Library

#### Navigation
**Fixed Header:** Transparent overlay on hero, solid on scroll
- Logo left, navigation links center/right
- Search icon, Login/Signup buttons (outlined style)
- Mobile: Hamburger menu, full-screen overlay

#### Hero Section (Home Page)
**Full-screen background:** NYC skyline or apartment building exterior
**Content:** Centered search bar with autocomplete dropdown
**Search Bar:** Large, prominent with shadow, rounded corners (rounded-xl)
**Tagline:** Below search in large, semi-transparent overlay

#### Building Cards
**Structure:** Vertical cards with consistent height
- Building image placeholder at top (4:3 ratio)
- Building name (bold, 18px)
- Address (14px, muted)
- Star rating display (★★★★☆ 4.2) with review count
- Hover: Subtle elevation increase (shadow-lg)

#### Building Detail Page Layout
**Two-column desktop, stacked mobile:**
- **Left Column (60%):** Sticky building info card at top, reviews list below
- **Right Column (40%):** Rating categories (horizontal bars), floor insights chart

**Rating Bars:** Horizontal progress bars with labels (Noise, Cleanliness, etc.)
- Bar height: h-3
- Labels: 14px, scores right-aligned

**Review Cards:**
- Bordered cards with padding-6
- Avatar placeholder (anonymous icon)
- Star rating + floor number
- Review text with "Read more" expansion for long reviews
- Photo thumbnails in grid below text
- Timestamp at bottom (muted, 12px)

#### Forms (Write Review, Add Building)
**Vertical single-column layout:**
- Clear section headers (20px, semibold)
- Form fields with labels above (14px, medium)
- Text inputs: Large hit areas (h-12), rounded-lg borders
- Star rating selectors: Interactive, large click targets
- Category rating sliders: Full-width with visible value display
- Photo upload: Drag-drop zone with preview thumbnails
- Submit button: Full-width on mobile, right-aligned on desktop

#### Modals
**Centered overlay:** max-w-md, rounded-xl, shadow-2xl
- Close button top-right
- Icon at top (success/warning)
- Message text centered
- Action buttons at bottom

#### Admin Dashboard
**Metrics Cards:** 4-column grid (desktop), stacked mobile
- Large number display (32px, bold)
- Label below (14px)
- Icon accent

**Moderation Tables:**
- Responsive table with alternating row backgrounds
- Action buttons (Approve/Deny) right-aligned
- Expandable rows for review preview

---

### Interactive Elements

**Buttons:**
- Primary: Solid background, medium font-weight, px-8 py-3, rounded-lg
- Secondary: Outlined, same padding
- Destructive: Red variant
- All buttons: Subtle shadow, scale transform on hover

**Links:** Underline on hover, transition duration-200

**Dropdowns/Autocomplete:** 
- Dropdown menus with subtle shadow-lg
- Hover states on items
- Max-height with scroll for long lists

---

### Images

**Hero Image:** Full-width, full-viewport NYC skyline or modern apartment building exterior with subtle overlay gradient for text readability

**Building Card Images:** Use placeholder service or stock photos of NYC buildings (exterior shots, 16:9 or 4:3 ratio)

**Review Photos:** User-uploaded images displayed as thumbnail grid, clickable for lightbox view

**Image Treatment:** Subtle rounded corners (rounded-lg), responsive sizing, lazy loading

---

### Accessibility

- Minimum contrast ratio 4.5:1 for body text
- Form inputs with visible focus states (ring-2)
- Alt text for all images
- Keyboard navigation support
- ARIA labels for interactive elements
- Screen reader-friendly review ratings

---

### Responsive Strategy

**Breakpoints:** sm (640px), md (768px), lg (1024px), xl (1280px)

**Mobile-First Adjustments:**
- Stack two-column layouts vertically
- Full-width buttons and forms
- Hamburger navigation
- Reduced padding (p-4 instead of p-8)
- Simplified chart displays