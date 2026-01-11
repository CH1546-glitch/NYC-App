---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
project_name: "NYC Apartment Review Platform"
date: "2026-01-10"
field_type: "brownfield"
---

# NYC Apartment Review Platform - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for NYC Apartment Review Platform, decomposing the requirements from the PRD and Architecture into implementable stories for a brownfield project with an existing React/Express codebase.

## Requirements Inventory

### Functional Requirements

**Home Page (FR1-FR6):**
- FR1: Full-screen NYC background hero section
- FR2: Centered hero search bar with building name/address autocomplete
- FR3: Mission statement display: "Honest, anonymous reviews from real NYC renters."
- FR4: Fixed navigation bar with links to Search, Login/Signup, Add Building
- FR5: "How It Works" 3-step visual guide (Search → Read Reviews → Contribute)
- FR6: Responsive design for mobile and desktop

**Search Page (FR7-FR11):**
- FR7: Search input with real-time filtering by building name
- FR8: Building cards displaying: name, address, overall rating (stars), review count
- FR9: Click-through to Building Detail page
- FR10: Pagination or infinite scroll for large result sets
- FR11: Empty state messaging when no results found

**Building Detail Page (FR12-FR19):**
- FR12: Display building name, street address, landlord name (if available)
- FR13: Overall star rating and total review count display
- FR14: Prominent "Write a Review" CTA button
- FR15: Category rating bars (Noise, Cleanliness, Maintenance, Safety, Pests)
- FR16: Floor insights interactive charts showing floor-level distributions
- FR17: Review cards with star rating, floor number, review text, photos
- FR18: Review sorting options (newest, highest rated, lowest rated)
- FR19: Photo lightbox/gallery for viewing uploaded images

**Write Review Page (FR20-FR28):**
- FR20: Overall rating selector (1-5 stars) — Required
- FR21: Floor number selector (dropdown or input) — Required
- FR22: Category ratings (Noise, Cleanliness, Maintenance, Safety, Pests) — 1-5 scale each
- FR23: Text review field (minimum 50 characters) — Required
- FR24: Photo upload (multiple images, max 5, max 5MB each) — Optional
- FR25: Anonymous posting toggle (default: ON)
- FR26: Form validation with inline error messaging
- FR27: Success modal: "Thank you! Your review is pending approval."
- FR28: Redirect to Building Detail page after modal dismissal

**Add Building Page (FR29-FR38):**
- FR29: Building name field — Required
- FR30: Street address field — Required
- FR31: City pre-filled with "New York" (locked to NYC boroughs)
- FR32: ZIP code validation against NYC ZIP codes — Required
- FR33: Landlord/Management company name — Optional
- FR34: Neighborhood dropdown (NYC neighborhoods) — Optional
- FR35: Building type selection (High-rise, Walk-up, Brownstone, etc.) — Optional
- FR36: Real-time address validation via Google Geocoding API
- FR37: Duplicate detection with warning and link to existing entry
- FR38: Submit creates pending building entry for admin approval

**Authentication (FR39-FR46):**
- FR39: Email input field for login
- FR40: Password input field for login
- FR41: "Forgot Password?" link
- FR42: "Create Account" link to signup page
- FR43: Signup with email, password (strength indicator), confirm password
- FR44: Terms of Service checkbox on signup
- FR45: Password reset modal with email input
- FR46: Password reset email via Postmark API with time-limited token

**User Account Settings (FR47-FR51):**
- FR47: Change email address (with verification email)
- FR48: Change password (requires current password confirmation)
- FR49: View list of user's submitted reviews
- FR50: Delete account option (with confirmation modal)
- FR51: Notification preferences (email opt-in/out)

**Admin: User Management (FR52-FR57):**
- FR52: Paginated list of all user accounts
- FR53: Search users by email address
- FR54: View user details (email, signup date, review count, status)
- FR55: Edit user information
- FR56: Send password reset email via Postmark API
- FR57: Suspend/activate/delete user accounts

**Admin: Dashboard & Moderation (FR58-FR66):**
- FR58: Dashboard metrics (total users, new signups daily/weekly/monthly)
- FR59: Building metrics (total buildings, pending approvals)
- FR60: Review metrics (total reviews, pending approvals)
- FR61: Engagement metrics (reviews per day, active users)
- FR62: Pending reviews list with full content preview
- FR63: Approve/deny reviews (deny optionally notifies user)
- FR64: Bulk moderation actions
- FR65: Pending building submissions list
- FR66: Approve/deny/edit buildings before approval

**Admin: Duplicate Building Merge (FR67-FR72):**
- FR67: System flags potential duplicates based on address normalization
- FR68: Similarity scoring using geocoded coordinates (Google Geocoding API)
- FR69: Queue of potential duplicate pairs for admin review
- FR70: Side-by-side comparison of two building entries
- FR71: Merge action transfers all reviews from duplicate to master
- FR72: Audit log of all merge operations

### NonFunctional Requirements

**Performance:**
- NFR1: Page load time < 3 seconds
- NFR2: Search results returned < 500ms

**Scalability:**
- NFR3: Architecture supports 100,000+ buildings
- NFR4: Architecture supports 1M+ reviews

**Availability:**
- NFR5: 99.5% uptime target

**Accessibility:**
- NFR6: WCAG 2.1 AA compliance

**Compatibility:**
- NFR7: Full functionality on iOS and Android browsers
- NFR8: Browser support for Chrome, Firefox, Safari, Edge (latest 2 versions)

**Security:**
- NFR9: Password hashing using bcrypt or Argon2
- NFR10: Secure httpOnly cookies for session management
- NFR11: HTTPS enforcement across all endpoints
- NFR12: Rate limiting on authentication and submission endpoints
- NFR13: Input sanitization to prevent XSS and SQL injection
- NFR14: API key storage in environment variables

### Additional Requirements

**From Architecture - Brownfield Constraints:**
- Existing React 18.3.1 + Vite 7.3.0 + Tailwind CSS 3.4.17 frontend must be maintained
- Existing Express 4.21.2 + Drizzle ORM 0.39.3 + PostgreSQL backend must be maintained
- shadcn/ui component library patterns must be followed
- React Query 5.60.5 for server state management (no Redux)
- Wouter 3.3.5 for client-side routing
- Zod 3.24.2 for validation (shared schemas in `shared/schema.ts`)

**From Architecture - Current Implementation Status:**
- Replit OAuth currently implemented (PRD specifies email/password - requires addition)
- Home page with hero search: IMPLEMENTED
- Search page with building cards: IMPLEMENTED
- Building detail with ratings: IMPLEMENTED
- Write review form: IMPLEMENTED
- Add building form: IMPLEMENTED (missing Google Geocoding)
- Admin dashboard: PARTIALLY IMPLEMENTED

**From Architecture - Gaps Requiring Implementation:**
- Email/password authentication (add alongside existing Replit OAuth)
- Password reset flow via Postmark API
- Google Geocoding API integration for address validation
- Duplicate building detection system
- Photo upload storage solution (schema exists, storage undefined)
- User account settings page
- Admin user management (suspend/delete)
- Duplicate Queue table and merge functionality
- Email notifications via Postmark

**From Architecture - Integration Requirements:**
- Google Geocoding API for address validation and duplicate detection
- Postmark API for transactional emails (password reset, notifications)
- Photo storage solution (recommend Replit Object Storage or Cloudinary)

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1-FR6 | Epic 1 | Home Page (hero, search, navigation, how it works) |
| FR7-FR11 | Epic 1 | Search Page (filtering, cards, pagination) |
| FR12-FR19 | Epic 1 | Building Detail (ratings, floor insights, reviews) |
| FR20-FR28 | Epic 3 | Write Review (ratings, photos, anonymous, submission) |
| FR29-FR38 | Epic 4 | Add Building (form, geocoding, duplicate detection) |
| FR39-FR46 | Epic 2 | Authentication (login, signup, password reset) |
| FR47-FR51 | Epic 2 | User Account Settings (profile, reviews, delete) |
| FR52-FR57 | Epic 6 | Admin User Management (list, search, suspend, delete) |
| FR58-FR66 | Epic 5 | Admin Dashboard & Moderation (metrics, approve/deny) |
| FR67-FR72 | Epic 7 | Duplicate Building Merge (detection, merge, audit) |

**Coverage Summary:** All 72 FRs mapped to 7 epics.

## Epic List

### Epic 1: Core Building Discovery Experience
**Goal:** Users can search for NYC apartment buildings and view detailed information including ratings, reviews, and floor-level insights.

**FRs Covered:** FR1-FR19 (Home Page, Search Page, Building Detail Page)

**Implementation Status:** Mostly implemented in existing codebase - may need refinements

---

### Epic 2: User Authentication & Account Management
**Goal:** Users can create accounts with email/password, login securely, reset forgotten passwords, and manage their profile settings.

**FRs Covered:** FR39-FR51 (Login, Signup, Password Reset, Account Settings)

**Implementation Status:** Partial - Replit OAuth exists, email/password auth and account settings page need implementation

---

### Epic 3: Review Contribution System
**Goal:** Authenticated users can write detailed reviews with overall and category ratings, upload photos, and choose anonymous posting.

**FRs Covered:** FR20-FR28 (Write Review Page)

**Implementation Status:** Form exists - needs photo storage integration

---

### Epic 4: Building Contribution System
**Goal:** Users can add new NYC buildings to the platform with validated addresses and duplicate detection.

**FRs Covered:** FR29-FR38 (Add Building Page)

**Implementation Status:** Form exists - needs Google Geocoding integration for address validation

---

### Epic 5: Admin Content Moderation
**Goal:** Administrators can efficiently moderate pending reviews and building submissions through a dashboard with metrics and bulk actions.

**FRs Covered:** FR58-FR66 (Admin Dashboard & Moderation)

**Implementation Status:** Partially implemented

---

### Epic 6: Admin User Management
**Goal:** Administrators can view, search, edit, and manage user accounts including suspension and deletion.

**FRs Covered:** FR52-FR57 (Admin User Management)

**Implementation Status:** Needs implementation

---

### Epic 7: Duplicate Building Management
**Goal:** System automatically detects potential duplicate buildings, and administrators can review and merge them with full audit trail.

**FRs Covered:** FR67-FR72 (Duplicate Building Merge)

**Implementation Status:** Not implemented - requires new database table and merge logic

---

## Epic 1: Core Building Discovery Experience

**Goal:** Users can search for NYC apartment buildings and view detailed information including ratings, reviews, and floor-level insights.

**FRs Covered:** FR1-FR19

### Story 1.1: Home Page Hero Section

**As a** prospective NYC renter,
**I want** to see an inviting landing page with a clear value proposition,
**So that** I immediately understand the platform's purpose and feel motivated to explore.

**Acceptance Criteria:**

**Given** a user navigates to the home page
**When** the page loads
**Then** a full-screen NYC-themed background image or video is displayed
**And** the mission statement "Honest, anonymous reviews from real NYC renters." is prominently visible
**And** the layout is responsive and displays correctly on mobile and desktop devices

---

### Story 1.2: Home Page Navigation Bar

**As a** platform user,
**I want** a persistent navigation bar with key actions,
**So that** I can quickly access Search, Login/Signup, and Add Building from any page.

**Acceptance Criteria:**

**Given** a user is on any page of the platform
**When** they view the top of the screen
**Then** a fixed navigation bar is visible
**And** the nav bar contains links to: Search, Login/Signup, Add Building
**And** the nav bar remains fixed when scrolling
**And** navigation links are functional and route to correct pages

---

### Story 1.3: Home Page Search with Autocomplete

**As a** prospective renter,
**I want** to search for buildings directly from the home page with autocomplete suggestions,
**So that** I can quickly find buildings I'm interested in.

**Acceptance Criteria:**

**Given** a user is on the home page
**When** they click on the centered search bar
**Then** the search bar becomes active and ready for input
**And** as they type a building name or address, autocomplete suggestions appear
**And** suggestions display matching building names and addresses from the database
**And** clicking a suggestion navigates to that building's detail page

---

### Story 1.4: How It Works Section

**As a** first-time visitor,
**I want** to see a clear explanation of how the platform works,
**So that** I understand the value and how to participate.

**Acceptance Criteria:**

**Given** a user scrolls down the home page
**When** they reach the "How It Works" section
**Then** a 3-step visual guide is displayed
**And** the steps show: Search → Read Reviews → Contribute
**And** each step has an icon or visual and brief description
**And** the section is responsive on mobile and desktop

---

### Story 1.5: Building Search & Filtering

**As a** prospective renter,
**I want** to search and filter buildings on a dedicated search page,
**So that** I can browse multiple buildings and compare options.

**Acceptance Criteria:**

**Given** a user navigates to the Search page
**When** they enter text in the search input field
**Then** building results filter in real-time by building name
**And** results display as building cards showing: name, address, overall rating (stars), review count
**And** clicking a building card navigates to that building's detail page

---

### Story 1.6: Search Pagination & Empty States

**As a** user searching for buildings,
**I want** paginated results and helpful messaging when no results exist,
**So that** I can navigate large result sets and understand when searches have no matches.

**Acceptance Criteria:**

**Given** a search returns more results than fit on one page
**When** the user views the search results
**Then** pagination controls or infinite scroll is available
**And** the user can navigate through all result pages

**Given** a search returns no matching buildings
**When** the results area renders
**Then** an empty state message is displayed (e.g., "No buildings found matching your search")
**And** the message suggests alternative actions (e.g., "Try a different search term or add a new building")

---

### Story 1.7: Building Detail Layout & Info

**As a** prospective renter viewing a building,
**I want** to see the building's basic information and overall rating prominently,
**So that** I can quickly assess if this building interests me.

**Acceptance Criteria:**

**Given** a user navigates to a building detail page
**When** the page loads
**Then** the building name is prominently displayed
**And** the street address is visible
**And** the landlord name is shown (if available in the database)
**And** the overall star rating (aggregate) is displayed
**And** the total review count is shown
**And** a prominent "Write a Review" CTA button is visible

---

### Story 1.8: Category Ratings Display

**As a** prospective renter,
**I want** to see breakdown ratings for specific categories,
**So that** I can evaluate the building on criteria that matter most to me.

**Acceptance Criteria:**

**Given** a user is on a building detail page with reviews
**When** they view the category ratings section
**Then** visual rating bars or indicators are displayed for: Noise, Cleanliness, Maintenance, Safety, Pests
**And** each category shows an aggregate score calculated from all approved reviews
**And** the visualization clearly indicates rating scale (1-5)

**Given** a building has no approved reviews
**When** the user views the category ratings section
**Then** a message indicates no ratings are available yet

---

### Story 1.9: Floor Insights Charts

**As a** prospective renter,
**I want** to see floor-level rating distributions,
**So that** I can understand how experiences differ by floor in the building.

**Acceptance Criteria:**

**Given** a user is on a building detail page with multiple reviews across floors
**When** they view the Floor Insights section
**Then** an interactive chart displays floor-level rating distributions
**And** the user can identify which floors have better or worse ratings
**And** the user can filter or highlight specific floors

**Given** a building has insufficient floor data
**When** the Floor Insights section renders
**Then** a message indicates insufficient data for floor insights

---

### Story 1.10: Review List & Sorting

**As a** prospective renter,
**I want** to read individual reviews and sort them by different criteria,
**So that** I can find the most relevant feedback for my decision.

**Acceptance Criteria:**

**Given** a user is on a building detail page with reviews
**When** they view the review list section
**Then** review cards are displayed showing: star rating, floor number, review text, uploaded photos (thumbnails)
**And** sorting options are available: newest, highest rated, lowest rated
**And** selecting a sort option reorders the review list accordingly

**Given** a building has no approved reviews
**When** the review list section renders
**Then** a message encourages the user to write the first review

---

### Story 1.11: Photo Gallery & Lightbox

**As a** prospective renter,
**I want** to view photos uploaded with reviews in a larger format,
**So that** I can see building conditions in detail.

**Acceptance Criteria:**

**Given** a user is viewing a review that contains photos
**When** they click on a photo thumbnail
**Then** a lightbox/modal opens displaying the full-size image
**And** the user can navigate between multiple photos if the review has more than one
**And** the user can close the lightbox to return to the review list

---

## Epic 2: User Authentication & Account Management

**Goal:** Users can create accounts with email/password, login securely, reset forgotten passwords, and manage their profile settings.

**FRs Covered:** FR39-FR51

### Story 2.1: User Registration with Email

**As a** new user,
**I want** to create an account using my email and password,
**So that** I can access personalized features and contribute reviews.

**Acceptance Criteria:**

**Given** a user navigates to the signup page
**When** they enter a valid email, password, confirm password, and accept Terms of Service
**Then** the account is created successfully
**And** the user is logged in automatically
**And** a welcome confirmation is displayed

**Given** a user tries to register with an existing email
**When** they submit the form
**Then** an error message indicates the email is already registered
**And** a link to login is provided

---

### Story 2.2: Password Strength Validation

**As a** new user creating an account,
**I want** to see password strength feedback as I type,
**So that** I create a secure password.

**Acceptance Criteria:**

**Given** a user is on the signup page
**When** they type in the password field
**Then** a password strength indicator displays (weak/medium/strong)
**And** the indicator updates in real-time as they type
**And** minimum requirements are shown (e.g., 8+ characters, uppercase, number)

---

### Story 2.3: User Login with Email/Password

**As a** registered user,
**I want** to log in with my email and password,
**So that** I can access my account and contribute reviews.

**Acceptance Criteria:**

**Given** a user navigates to the login page
**When** they enter valid email and password credentials
**Then** they are authenticated and redirected to the home page
**And** the navigation shows their logged-in state

**Given** a user enters invalid credentials
**When** they submit the login form
**Then** an error message is displayed
**And** the user remains on the login page

**Given** a user is not registered
**When** they view the login page
**Then** a "Create Account" link is visible to navigate to signup

---

### Story 2.4: Forgot Password Request

**As a** user who forgot their password,
**I want** to request a password reset via email,
**So that** I can regain access to my account.

**Acceptance Criteria:**

**Given** a user is on the login page
**When** they click "Forgot Password?"
**Then** a modal or page opens with an email input field

**Given** a user enters their registered email
**When** they submit the reset request
**Then** a confirmation message is shown: "If this email exists, a reset link has been sent"
**And** no indication is given whether the email exists (security)

---

### Story 2.5: Password Reset via Email

**As a** user who requested a password reset,
**I want** to receive an email with a secure reset link,
**So that** I can set a new password.

**Acceptance Criteria:**

**Given** a password reset was requested
**When** the system processes the request
**Then** an email is sent via Postmark API with a secure reset link
**And** the link contains a time-limited token (24-hour expiry)

**Given** a user clicks a valid reset link
**When** they access the reset page
**Then** they can enter a new password and confirm it
**And** submitting updates their password
**And** they are redirected to login

**Given** a user clicks an expired or invalid reset link
**When** they access the reset page
**Then** an error message indicates the link is invalid or expired
**And** they are prompted to request a new reset

---

### Story 2.6: User Account Settings Page

**As a** logged-in user,
**I want** to access my account settings to update my email or password,
**So that** I can keep my account information current and secure.

**Acceptance Criteria:**

**Given** a logged-in user navigates to account settings
**When** the page loads
**Then** they see options to change email and change password

**Given** a user wants to change their email
**When** they enter a new email address
**Then** a verification email is sent to the new address
**And** the email is updated only after verification

**Given** a user wants to change their password
**When** they enter their current password and new password
**Then** the password is updated if current password is correct
**And** a confirmation message is displayed

---

### Story 2.7: View My Reviews

**As a** logged-in user,
**I want** to see a list of reviews I've submitted,
**So that** I can track my contributions to the platform.

**Acceptance Criteria:**

**Given** a logged-in user navigates to account settings
**When** they view the "My Reviews" section
**Then** a list of their submitted reviews is displayed
**And** each review shows: building name, rating, date, status (pending/approved)
**And** clicking a review navigates to the building detail page

**Given** a user has not submitted any reviews
**When** they view "My Reviews"
**Then** a message encourages them to write their first review

---

### Story 2.8: Delete Account

**As a** user who wants to leave the platform,
**I want** to permanently delete my account,
**So that** my data is removed from the system.

**Acceptance Criteria:**

**Given** a logged-in user is on account settings
**When** they click "Delete Account"
**Then** a confirmation modal appears warning this action is permanent

**Given** the user confirms deletion
**When** they submit the confirmation
**Then** their account and associated data are deleted
**And** they are logged out and redirected to the home page
**And** their reviews remain but are anonymized

---

### Story 2.9: Notification Preferences

**As a** registered user,
**I want** to manage my email notification preferences,
**So that** I control what communications I receive.

**Acceptance Criteria:**

**Given** a logged-in user is on account settings
**When** they view notification preferences
**Then** toggles are available for: review approved notifications, platform updates

**Given** a user changes a notification preference
**When** they save the settings
**Then** the preference is updated
**And** future emails respect the new setting

---

## Epic 3: Review Contribution System

**Goal:** Authenticated users can write detailed reviews with overall and category ratings, upload photos, and choose anonymous posting.

**FRs Covered:** FR20-FR28

### Story 3.1: Write Review Form Access

**As a** logged-in user viewing a building,
**I want** to access the review form from the building detail page,
**So that** I can share my experience with this building.

**Acceptance Criteria:**

**Given** a logged-in user is on a building detail page
**When** they click "Write a Review"
**Then** they are navigated to the review form for that building

**Given** a non-logged-in user clicks "Write a Review"
**When** they attempt to access the form
**Then** they are redirected to login with a return URL to the review form

---

### Story 3.2: Overall and Category Ratings

**As a** reviewer,
**I want** to provide an overall rating and category-specific ratings,
**So that** my feedback covers multiple aspects of the building.

**Acceptance Criteria:**

**Given** a user is on the write review form
**When** they view the rating section
**Then** an overall rating selector (1-5 stars) is displayed and required
**And** category ratings for Noise, Cleanliness, Maintenance, Safety, Pests are available (1-5 scale each)
**And** category ratings are optional but encouraged

---

### Story 3.3: Floor Number and Review Text

**As a** reviewer,
**I want** to specify my floor and write detailed feedback,
**So that** my review provides context and useful information.

**Acceptance Criteria:**

**Given** a user is on the write review form
**When** they complete the form
**Then** a floor number selector (dropdown or input) is required
**And** a text review field is required with minimum 50 characters
**And** character count feedback is displayed
**And** validation prevents submission if requirements not met

---

### Story 3.4: Photo Upload

**As a** reviewer,
**I want** to upload photos with my review,
**So that** I can visually document building conditions.

**Acceptance Criteria:**

**Given** a user is on the write review form
**When** they access the photo upload section
**Then** they can select multiple images (up to 5)
**And** each image is limited to 5MB maximum
**And** preview thumbnails are displayed for selected images
**And** users can remove selected images before submission

**Given** a user uploads an invalid file
**When** they attempt to add it
**Then** an error message explains the limitation (file type, size)

---

### Story 3.5: Anonymous Posting Toggle

**As a** reviewer,
**I want** to choose whether my review is anonymous,
**So that** I can protect my identity if desired.

**Acceptance Criteria:**

**Given** a user is on the write review form
**When** they view the submission options
**Then** an anonymous posting toggle is visible
**And** the toggle defaults to ON (anonymous)
**And** hovering/clicking shows explanation of what anonymous means

---

### Story 3.6: Review Form Validation

**As a** reviewer submitting feedback,
**I want** clear validation messages,
**So that** I can correct any issues before submission.

**Acceptance Criteria:**

**Given** a user attempts to submit an incomplete review
**When** they click submit
**Then** inline error messages appear next to invalid fields
**And** the form does not submit until all required fields are valid
**And** errors are cleared when the user corrects the field

---

### Story 3.7: Review Submission and Confirmation

**As a** reviewer,
**I want** confirmation that my review was submitted,
**So that** I know it's pending approval.

**Acceptance Criteria:**

**Given** a user submits a valid review
**When** the submission is processed
**Then** a success modal displays: "Thank you! Your review is pending approval."
**And** the review is saved with status "pending"
**And** dismissing the modal redirects to the building detail page

---

## Epic 4: Building Contribution System

**Goal:** Users can add new NYC buildings to the platform with validated addresses and duplicate detection.

**FRs Covered:** FR29-FR38

### Story 4.1: Add Building Form Access

**As a** logged-in user,
**I want** to access the add building form,
**So that** I can contribute buildings not yet in the database.

**Acceptance Criteria:**

**Given** a logged-in user clicks "Add Building" in navigation
**When** they navigate to the form
**Then** the add building form is displayed

**Given** a non-logged-in user clicks "Add Building"
**When** they attempt to access
**Then** they are redirected to login with return URL

---

### Story 4.2: Building Basic Information Form

**As a** contributor,
**I want** to enter building details,
**So that** the building can be identified and searched.

**Acceptance Criteria:**

**Given** a user is on the add building form
**When** they view the form fields
**Then** Building name field is required
**And** Street address field is required
**And** City is pre-filled with "New York" and locked to NYC boroughs
**And** ZIP code field is required

---

### Story 4.3: NYC ZIP Code Validation

**As a** contributor,
**I want** ZIP code validation for NYC,
**So that** only valid NYC buildings are added.

**Acceptance Criteria:**

**Given** a user enters a ZIP code
**When** the field loses focus or form is submitted
**Then** the ZIP is validated against NYC ZIP code ranges
**And** valid ranges include: 10001-10499 (Manhattan), 10451-10475 (Bronx), 11201-11256 (Brooklyn), 11004-11697 (Queens), 10301-10314 (Staten Island)
**And** invalid ZIP codes show an error message

---

### Story 4.4: Optional Building Details

**As a** contributor,
**I want** to provide additional building information,
**So that** the listing is more complete and useful.

**Acceptance Criteria:**

**Given** a user is on the add building form
**When** they view optional fields
**Then** Landlord/Management company name is available (optional)
**And** Neighborhood dropdown with NYC neighborhoods is available (optional)
**And** Building type selection (High-rise, Walk-up, Brownstone, etc.) is available (optional)

---

### Story 4.5: Address Validation with Google Geocoding

**As a** contributor,
**I want** my address validated and normalized,
**So that** the building location is accurate.

**Acceptance Criteria:**

**Given** a user enters a street address
**When** address validation triggers (on blur or submit)
**Then** the address is validated via Google Geocoding API
**And** valid addresses are normalized to standard format
**And** geocode coordinates are stored for the building
**And** invalid addresses show an error with suggestions

---

### Story 4.6: Duplicate Building Detection

**As a** contributor,
**I want** to be warned if a similar building exists,
**So that** I don't create duplicate entries.

**Acceptance Criteria:**

**Given** a user enters a building address
**When** duplicate detection runs
**Then** the system checks for existing buildings with similar normalized addresses
**And** if a potential duplicate is found, a warning is displayed
**And** the warning includes a link to the existing building entry
**And** the user can choose to proceed anyway or view the existing building

---

### Story 4.7: Building Submission and Pending Status

**As a** contributor,
**I want** to submit a new building for approval,
**So that** it can be added to the platform after review.

**Acceptance Criteria:**

**Given** a user submits a valid building form
**When** the submission is processed
**Then** the building is created with status "pending"
**And** a success modal displays with option: "Write first review?"
**And** clicking "Write first review" navigates to the review form for the new building
**And** dismissing the modal returns to the home or search page

---

## Epic 5: Admin Content Moderation

**Goal:** Administrators can efficiently moderate pending reviews and building submissions through a dashboard with metrics and bulk actions.

**FRs Covered:** FR58-FR66

### Story 5.1: Admin Dashboard Access

**As an** administrator,
**I want** to access a protected admin dashboard,
**So that** I can manage platform content.

**Acceptance Criteria:**

**Given** a user with admin role logs in
**When** they navigate to /admin
**Then** the admin dashboard is displayed

**Given** a non-admin user attempts to access /admin
**When** they navigate to the URL
**Then** they are redirected to home page or shown access denied

---

### Story 5.2: Dashboard Metrics Display

**As an** administrator,
**I want** to see key platform metrics at a glance,
**So that** I can monitor platform health and growth.

**Acceptance Criteria:**

**Given** an admin views the dashboard
**When** the page loads
**Then** total users count is displayed with new signups (daily/weekly/monthly)
**And** total buildings count with pending approvals is displayed
**And** total reviews count with pending approvals is displayed
**And** engagement metrics (reviews per day, active users) are shown

---

### Story 5.3: Pending Reviews List

**As an** administrator,
**I want** to view all pending reviews,
**So that** I can moderate content before publication.

**Acceptance Criteria:**

**Given** an admin navigates to review moderation
**When** the list loads
**Then** all pending reviews are displayed with full content preview
**And** each review shows: building name, rating, floor, text, photos, submission date
**And** the list is paginated for large volumes

---

### Story 5.4: Review Approval and Denial

**As an** administrator,
**I want** to approve or deny pending reviews,
**So that** only quality content is published.

**Acceptance Criteria:**

**Given** an admin views a pending review
**When** they click "Approve"
**Then** the review status changes to approved
**And** the review is published on the building page

**Given** an admin wants to deny a review
**When** they click "Deny"
**Then** an optional reason input is shown
**And** the review is removed from the queue
**And** optionally, the user is notified with the reason

---

### Story 5.5: Bulk Review Moderation

**As an** administrator,
**I want** to approve or deny multiple reviews at once,
**So that** I can moderate efficiently during high volume.

**Acceptance Criteria:**

**Given** an admin is viewing pending reviews
**When** they select multiple reviews via checkboxes
**Then** bulk action buttons appear (Approve Selected, Deny Selected)
**And** clicking a bulk action applies to all selected reviews
**And** a confirmation shows how many reviews were processed

---

### Story 5.6: Pending Buildings List

**As an** administrator,
**I want** to view all pending building submissions,
**So that** I can approve new buildings for the directory.

**Acceptance Criteria:**

**Given** an admin navigates to building moderation
**When** the list loads
**Then** all pending buildings are displayed
**And** each building shows: name, address, ZIP, landlord, neighborhood, submission date
**And** the list is paginated

---

### Story 5.7: Building Approval, Denial, and Edit

**As an** administrator,
**I want** to approve, deny, or edit pending buildings,
**So that** only accurate listings are published.

**Acceptance Criteria:**

**Given** an admin views a pending building
**When** they click "Approve"
**Then** the building status changes to approved
**And** the building appears in the searchable directory

**Given** an admin wants to deny a building
**When** they click "Deny"
**Then** the building is removed from the queue

**Given** an admin needs to correct building details
**When** they click "Edit"
**Then** the building form opens with current values
**And** they can modify and save changes before approving

---

## Epic 6: Admin User Management

**Goal:** Administrators can view, search, edit, and manage user accounts including suspension and deletion.

**FRs Covered:** FR52-FR57

### Story 6.1: User List Display

**As an** administrator,
**I want** to view a list of all platform users,
**So that** I can manage user accounts.

**Acceptance Criteria:**

**Given** an admin navigates to user management
**When** the page loads
**Then** a paginated list of all user accounts is displayed
**And** each row shows: email, signup date, review count, status (active/suspended)

---

### Story 6.2: User Search

**As an** administrator,
**I want** to search for users by email,
**So that** I can quickly find specific accounts.

**Acceptance Criteria:**

**Given** an admin is on the user management page
**When** they enter an email in the search field
**Then** the user list filters to show matching results
**And** partial email matches are supported
**And** clearing search restores the full list

---

### Story 6.3: View and Edit User Details

**As an** administrator,
**I want** to view and edit user information,
**So that** I can assist with account issues.

**Acceptance Criteria:**

**Given** an admin clicks on a user in the list
**When** the detail view opens
**Then** full user details are displayed: email, signup date, review count, status, last login
**And** an "Edit" button allows modifying user information
**And** changes can be saved

---

### Story 6.4: Send Password Reset Email

**As an** administrator,
**I want** to trigger a password reset email for a user,
**So that** I can help users regain access.

**Acceptance Criteria:**

**Given** an admin is viewing user details
**When** they click "Send Password Reset"
**Then** a password reset email is sent via Postmark API
**And** a confirmation message is displayed
**And** the action is logged

---

### Story 6.5: Suspend and Activate User Accounts

**As an** administrator,
**I want** to suspend or reactivate user accounts,
**So that** I can manage problematic users.

**Acceptance Criteria:**

**Given** an admin is viewing an active user
**When** they click "Suspend Account"
**Then** a confirmation dialog appears
**And** confirming changes the user status to suspended
**And** the suspended user cannot log in

**Given** an admin is viewing a suspended user
**When** they click "Activate Account"
**Then** the user status changes to active
**And** the user can log in again

---

### Story 6.6: Delete User Account

**As an** administrator,
**I want** to permanently delete a user account,
**So that** I can remove spam or abusive accounts.

**Acceptance Criteria:**

**Given** an admin is viewing user details
**When** they click "Delete Account"
**Then** a confirmation dialog warns this action is permanent
**And** confirming deletes the user and their data
**And** their reviews are anonymized or removed based on policy
**And** the action is logged

---

## Epic 7: Duplicate Building Management

**Goal:** System automatically detects potential duplicate buildings, and administrators can review and merge them with full audit trail.

**FRs Covered:** FR67-FR72

### Story 7.1: Automatic Duplicate Detection

**As a** system,
**I want** to automatically flag potential duplicate buildings,
**So that** data quality is maintained.

**Acceptance Criteria:**

**Given** a new building is submitted or approved
**When** the system processes the building
**Then** it compares against existing buildings using normalized address
**And** similarity scoring uses geocoded coordinates (Google Geocoding API)
**And** potential duplicates above threshold are flagged
**And** flagged pairs are added to the duplicate queue

---

### Story 7.2: Duplicate Queue Display

**As an** administrator,
**I want** to view a queue of potential duplicate pairs,
**So that** I can review and resolve them.

**Acceptance Criteria:**

**Given** an admin navigates to duplicate management
**When** the page loads
**Then** a list of potential duplicate pairs is displayed
**And** each pair shows: building names, addresses, similarity score
**And** the list is sorted by similarity score (highest first)

---

### Story 7.3: Side-by-Side Comparison

**As an** administrator reviewing duplicates,
**I want** to see buildings side-by-side,
**So that** I can make an informed merge decision.

**Acceptance Criteria:**

**Given** an admin selects a duplicate pair
**When** the comparison view opens
**Then** both buildings are displayed side-by-side
**And** all fields are shown: name, address, landlord, reviews, ratings, review count
**And** differences are visually highlighted

---

### Story 7.4: Select Primary Record for Merge

**As an** administrator,
**I want** to select which building to keep as the primary record,
**So that** the merge preserves the best data.

**Acceptance Criteria:**

**Given** an admin is in the comparison view
**When** they review both buildings
**Then** they can select which building becomes the "master" record
**And** a clear indicator shows which will be kept
**And** they can switch their selection before confirming

---

### Story 7.5: Execute Building Merge

**As an** administrator,
**I want** to merge duplicate buildings,
**So that** all reviews are consolidated under one entry.

**Acceptance Criteria:**

**Given** an admin has selected a primary record
**When** they click "Merge"
**Then** a confirmation modal appears showing the merge action
**And** confirming transfers all reviews from the duplicate to the master
**And** the duplicate record is archived or deleted
**And** the merged building reflects combined review counts and ratings

---

### Story 7.6: Dismiss Duplicate Pair

**As an** administrator,
**I want** to dismiss a false positive duplicate,
**So that** the queue remains actionable.

**Acceptance Criteria:**

**Given** an admin determines buildings are not duplicates
**When** they click "Dismiss" or "Not a Duplicate"
**Then** the pair is removed from the duplicate queue
**And** the pair is marked as dismissed (not re-flagged)

---

### Story 7.7: Merge Audit Log

**As an** administrator,
**I want** a log of all merge operations,
**So that** there's accountability and ability to review past actions.

**Acceptance Criteria:**

**Given** any merge operation is performed
**When** the merge completes
**Then** an audit log entry is created
**And** the log captures: admin user, timestamp, buildings involved, action taken
**And** the audit log is viewable by administrators
**And** logs cannot be modified or deleted
