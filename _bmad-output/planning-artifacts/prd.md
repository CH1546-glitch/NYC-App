Product Requirements Document

__NYC Apartment Review Platform__

*"Honest, anonymous reviews from real NYC renters\."*

__Version__

1\.0

__Date__

December 30, 2025

__Author__

Million Labs

__Status__

Draft

# 1\. Executive Summary

The NYC Apartment Review Platform is a web application designed to empower New York City renters with honest, anonymous insights about residential buildings across the five boroughs\. The platform addresses a critical gap in the rental market where prospective tenants often lack reliable information about building conditions, landlord responsiveness, and neighborhood\-specific concerns before signing a lease\.

__Key Objectives:__

1. Provide a trusted community platform for sharing rental experiences
2. Enable granular building insights including floor\-level data and category\-specific ratings
3. Maintain data quality through moderation and duplicate detection systems
4. Protect reviewer privacy through anonymous posting capabilities

# 2\. Product Overview

## 2\.1 Problem Statement

NYC renters face significant information asymmetry when searching for apartments\. While listing sites provide photos and pricing, they rarely offer insight into actual living conditions, landlord behavior, building management quality, or issues like pest infestations, noise levels, and maintenance responsiveness\. Existing review platforms often lack NYC\-specific focus, floor\-level granularity, or robust anonymity protections that encourage honest feedback\.

## 2\.2 Solution

A dedicated NYC apartment review platform featuring anonymous reviews, multi\-dimensional rating categories \(noise, cleanliness, maintenance, safety, pests\), floor\-level insights via interactive charts, photo uploads, and a community\-driven building database with intelligent duplicate detection and admin moderation workflows\.

## 2\.3 Target Users

__User Type__

__Description__

Apartment Seekers

Prospective renters researching buildings before signing a lease

Current Renters

NYC residents sharing their rental experiences through reviews

Administrators

Platform operators managing content moderation and data quality

# 3\. User Personas

## 3\.1 Apartment Hunter \(Primary\)

__Name: __Sarah, 28

__Role: __Marketing Manager relocating to NYC

__Goals: __Find a safe, well\-maintained apartment in Brooklyn with responsive management

__Pain Points: __Limited time for apartment visits; needs reliable information before committing; worried about hidden issues

## 3\.2 Current Renter \(Contributor\)

__Name: __Marcus, 34

__Role: __Long\-term NYC renter with experiences in multiple buildings

__Goals: __Share honest feedback to help others; warn about problematic landlords

__Pain Points: __Fears retaliation from landlord; wants anonymity protection

## 3\.3 Platform Administrator

__Name: __Admin Team

__Goals: __Maintain platform integrity; prevent spam and fake reviews; manage duplicate buildings

__Pain Points: __High volume of submissions requiring efficient moderation tools

# 4\. Functional Requirements

## 4\.1 Home Page

__Description: __Landing page serving as the primary entry point with search functionality and platform introduction\.

__Requirements:__

- Full\-screen NYC background image or video \(hero section\)
- Centered hero search bar with building name/address autocomplete
- Mission statement display: "Honest, anonymous reviews from real NYC renters\."
- Fixed navigation bar at top with links to Search, Login/Signup, Add Building
- "How It Works" section with 3\-step visual guide \(Search → Read Reviews → Contribute\)
- Responsive design for mobile and desktop

## 4\.2 Apartment Search Page

__Description: __Searchable directory of apartment buildings displayed in a card\-based layout\.

__Requirements:__

- Search input field with real\-time filtering by building name
- Building cards displaying: building name, address, overall rating \(stars\), review count
- Click\-through to Building Detail page
- Pagination or infinite scroll for large result sets
- Empty state messaging when no results found

## 4\.3 Building Detail Page

__Description: __Comprehensive view of a building's ratings, reviews, and floor\-level insights\.

__Layout Requirements:__

- __Left Panel: __Building name, street address, landlord name \(if available\)
- __Right Panel: __Overall star rating, total review count, prominent "Write a Review" CTA button

__Category Ratings Section:__

- Visual rating bars or indicators for: Noise, Cleanliness, Maintenance, Safety, Pests
- Aggregate scores calculated from all approved reviews

__Floor Insights Section:__

- Interactive charts showing floor\-level rating distributions
- Ability to filter or highlight specific floors

__Review List Section:__

- Review cards displaying: star rating, floor number, review text, uploaded photos
- Sorting options \(newest, highest rated, lowest rated\)
- Photo lightbox/gallery for viewing uploaded images

## 4\.4 Write a Review Page

__Description: __Multi\-step form for users to submit building reviews with ratings and media\.

__Form Fields:__

- Overall rating \(1\-5 star selector\) — Required
- Floor number selector \(dropdown or input\) — Required
- Category ratings \(Noise, Cleanliness, Maintenance, Safety, Pests\) — 1\-5 scale each
- Text review field \(minimum 50 characters recommended\) — Required
- Photo upload \(multiple images, max 5, max 5MB each\) — Optional
- Anonymous posting toggle \(default: ON\)

__Submission Flow:__

- Form validation with inline error messaging
- Submit button triggers review creation
- Success modal: "Thank you\! Your review is pending approval\."
- Redirect to Building Detail page after modal dismissal

## 4\.5 Add Building Page

__Description: __Form for users to add new buildings to the platform database\.

__Form Fields:__

- Building name — Required
- Street address — Required
- City — Pre\-filled with "New York" \(locked or editable within NYC boroughs\)
- ZIP code — Required \(validated against NYC ZIP codes\)
- Landlord/Management company name — Optional
- Neighborhood — Optional \(dropdown with NYC neighborhoods\)
- Building type — Optional \(High\-rise, Walk\-up, Brownstone, etc\.\)

__Duplicate Detection:__

- Real\-time address validation via Google Geocoding API
- System checks for potential duplicates based on normalized address
- Warning displayed if similar building exists with link to existing entry

__Submission Flow:__

- Submit creates pending building entry for admin approval
- Success modal with option: "Write first review?"
- Link navigates to Write Review page for the new building

## 4\.6 Login & Signup Pages

__Description: __User authentication system with email/password and password recovery\.

__Login Page:__

- Email input field
- Password input field
- Login button
- "Forgot Password?" link
- "Create Account" link to signup page

__Signup Page:__

- Email input field
- Password input field \(with strength indicator\)
- Confirm password field
- Terms of Service checkbox
- Create Account button

__Password Reset Flow:__

- Modal popup triggered by Forgot Password link
- Email input for reset request
- Password reset email sent via Postmark API
- Secure reset link with time\-limited token
- Reset password page with new password fields

## 4\.7 User Account Settings Page

__Description: __User profile management interface for account settings\.

__Requirements:__

- Change email address \(with verification email to new address\)
- Change password \(requires current password confirmation\)
- View list of user's submitted reviews
- Delete account option \(with confirmation modal\)
- Notification preferences \(email opt\-in/out\)

## 4\.8 Admin: User Management

__Description: __Administrative interface for managing platform users\.

__Requirements:__

- Paginated list of all user accounts
- Search users by email address
- View user details \(email, signup date, review count, status\)
- Edit user information
- Send password reset email via Postmark API
- Suspend/activate user accounts
- Delete user accounts

## 4\.9 Admin: Dashboard & Moderation

__Description: __Central administrative hub for platform oversight and content moderation\.

__Dashboard Metrics:__

- Total users, new signups \(daily/weekly/monthly\)
- Total buildings, pending building approvals
- Total reviews, pending review approvals
- Engagement metrics \(reviews per day, active users\)

__Review Moderation:__

- List of pending reviews with full content preview
- Approve review → publishes to building page
- Deny review → removes from queue \(optional: notify user with reason\)
- Bulk actions for efficient moderation

__Building Moderation:__

- List of pending building submissions
- Approve building → adds to searchable directory
- Deny building → removes from queue
- Edit building details before approval

## 4\.10 Admin: Duplicate Building Merge

__Description: __Tool for administrators to identify and merge duplicate building entries\.

__Automatic Detection:__

- System flags potential duplicates based on address normalization
- Similarity scoring using geocoded coordinates \(Google Geocoding API\)
- Queue of potential duplicate pairs for admin review

__Manual Merge Interface:__

- Side\-by\-side comparison of two building entries
- Display all fields: name, address, landlord, reviews, ratings
- Select primary record \(master\) to retain
- Merge action: transfers all reviews from duplicate to master
- Duplicate record is archived or deleted
- Confirmation modal before executing merge
- Audit log of all merge operations

# 5\. Technical Requirements

## 5\.1 Third\-Party Integrations

__Service__

__Purpose__

__Usage__

__Postmark API__

Transactional email delivery

Password resets, welcome emails, notifications

__Google Geocoding API__

Address validation & normalization

Duplicate detection, address standardization

## 5\.2 Data Architecture

__Core Data Entities:__

1. __Users: __id, email, password\_hash, role \(user/admin\), created\_at, status
2. __Buildings: __id, name, address, city, zip, landlord, neighborhood, building\_type, geocode\_lat, geocode\_lng, status \(pending/approved\), created\_at
3. __Reviews: __id, building\_id, user\_id, overall\_rating, floor\_number, noise\_rating, cleanliness\_rating, maintenance\_rating, safety\_rating, pest\_rating, review\_text, is\_anonymous, status \(pending/approved/denied\), created\_at
4. __Review Photos: __id, review\_id, image\_url, created\_at
5. __Duplicate Queue: __id, building\_id\_1, building\_id\_2, similarity\_score, status \(pending/merged/dismissed\), created\_at

## 5\.3 Security Requirements

- Password hashing using bcrypt or Argon2
- JWT\-based session management with secure httpOnly cookies
- HTTPS enforcement across all endpoints
- Rate limiting on authentication and submission endpoints
- Input sanitization to prevent XSS and SQL injection
- API key storage in environment variables \(never in codebase\)

# 6\. Non\-Functional Requirements

1. __Performance: __Page load time < 3 seconds; search results < 500ms
2. __Scalability: __Architecture should support 100,000\+ buildings and 1M\+ reviews
3. __Availability: __99\.5% uptime target
4. __Accessibility: __WCAG 2\.1 AA compliance
5. __Mobile Responsiveness: __Full functionality on iOS and Android browsers
6. __Browser Support: __Chrome, Firefox, Safari, Edge \(latest 2 versions\)

# 7\. Success Metrics

__Metric__

__Target \(6 months\)__

__Measurement__

Registered Users

5,000\+

Database count

Buildings Listed

2,000\+

Approved buildings count

Reviews Submitted

10,000\+

Approved reviews count

Review Approval Rate

> 85%

Approved / Total submitted

Avg\. Reviews per Building

> 3

Reviews / Buildings

# 8\. Out of Scope \(v1\.0\)

The following features are not included in the initial release:

1. Social login \(Google, Facebook, Apple\)
2. Native mobile applications \(iOS/Android\)
3. Integration with rental listing platforms \(StreetEasy, Zillow\)
4. Landlord response/reply functionality
5. Map\-based building search
6. Verified tenant badges
7. Multi\-language support

# 9\. Appendix

## 9\.1 Email Templates \(Postmark\)

- __Welcome Email: __Sent upon successful signup
- __Password Reset: __Contains secure reset link \(24\-hour expiry\)
- __Email Change Verification: __Confirm new email address
- __Review Approved: __Notification when review is published \(optional\)
- __Review Denied: __Notification with reason \(optional\)

## 9\.2 Rating Categories Definitions

__Category__

__Definition__

__Noise__

Sound levels from neighbors, street traffic, building systems

__Cleanliness__

Common area maintenance, hallways, lobby, laundry room

__Maintenance__

Response time and quality of repairs, landlord/super responsiveness

__Safety__

Building security, lighting, entry systems, neighborhood safety

__Pests__

Presence of roaches, mice, bedbugs, or other pests

## 9\.3 NYC ZIP Code Validation

Valid NYC ZIP codes range from 10001 to 10499 \(Manhattan\), 10451 to 10475 \(Bronx\), 11201 to 11256 \(Brooklyn\), 11004 to 11697 \(Queens\), and 10301 to 10314 \(Staten Island\)\. The system should validate submitted ZIP codes against these ranges to ensure only NYC buildings are added to the platform\.

## 9\.4 Document History

__Version__

__Date__

__Author__

__Changes__

1\.0

Dec 30, 2025

Million Labs

Initial draft

