# Site Rendering and UX Optimization Blueprint

## Purpose

This document defines a practical optimization blueprint for the Camp Lawton Staff Portal site experience.

The goal is to improve:

- Rendering performance
- Runtime responsiveness
- Offline reliability
- Mobile usability
- Accessibility
- Search and emergency access
- Trust, safety, and safeguarding fit
- Camp Lawton cultural feel

This is not a generic web-app polish list. The portal should feel like:

> Camp Lawton in your pocket: practical, rugged, warm, clear, a little stylish, and ready when the signal dies.

The app should help a tired staffer, nervous candidate, cautious parent, or busy director find the right answer quickly without making anything less safe.

## Current Diagnosis

The current product direction is strong. The repo already has the right north star: a mobile-first, offline-first Progressive Web Application for staff recruitment, onboarding, handbook access, training, emergency references, staff communication, parent/guardian support, admin review, and seasonal operations.

The main issue is architectural tension.

The app is currently halfway between:

1. A static exported Next.js site
2. A server-backed Supabase operational app
3. An offline-first PWA

Those three models can work together only if their responsibilities are explicit. Right now they are blurring together.

The result is that the app has good pieces, but some of those pieces fight each other:

- `output: 'export'` limits true server-backed behavior.
- Route handlers and live operational feeds are not a good match for a fully static export.
- Large client components carry too much responsibility.
- Important data is still fetched in the browser when it should often be server-rendered.
- Offline behavior exists, but needs a more disciplined cache model.
- LocalStorage is still used in places where IndexedDB or Supabase-backed drafts/progress should be used.
- The UI is visually interesting, but it needs a stricter hierarchy around safety, search, and field use.

The blunt diagnosis:

> This is a good product with a strong soul. The next step is discipline, not more sparkle.

## Optimization Principles

### 1. Field-Ready Beats Fancy

Design for:

- Weak signal
- Low battery
- Bright sun
- One-handed phone use
- Teen staff
- Older adult staff
- Tired users
- Distracted users
- Emergency-adjacent moments

A feature is not done until it works under those conditions.

### 2. Server Render What Does Not Need the Browser

Use Server Components and server-side Supabase reads for content that does not require browser APIs or direct user interaction.

Client Components should be reserved for:

- Theme toggle
- Reduced stimulation toggle
- Command palette
- Emergency modal interaction
- Local/offline state indicators
- Search input behavior
- Mobile nav interaction
- Form draft behavior
- Rich editor modes
- Admin interactivity

Do not mark large page trees as client-side simply because one widget needs state.

### 3. Offline Must Be Honest

The app may cache data, but it must never imply stale weather, fire, emergency, or announcement data is live.

Every cached operational item should clearly show:

- Last successful sync time
- Whether it is a cached copy
- Whether it may be outdated
- Whether a retry is needed

Bad copy:

> Status Normal

Better copy:

> No priority alerts found when last checked at 2:14 PM.

### 4. Safeguarding Is Architecture, Not Styling

Frontend hiding is not security.

Role-gated navigation is useful, but real permissions must be enforced through:

- Supabase Row-Level Security
- Server-side authorization checks
- Audit logging
- Explicit ownership predicates
- Privacy-safe profile models

No UI improvement should weaken the youth-serving safety model.

### 5. Camp Culture Should Reduce Friction

The app should feel like camp because that makes it warmer and easier to use, not because it adds gimmicks.

Keep:

- Warm camp voice
- Practical humor where appropriate
- Forest, amber, cream, dusk, bark, and safety red palette
- Patch-like badges
- Clipboard/field-guide feel
- Subtle LCARS-inspired rails and status areas
- Campfire and trail-map flavor

Avoid:

- Excessive sci-fi cosplay
- Tiny text
- Flashing effects
- Overdone animation
- Confetti for serious safety topics
- Emergency UI that looks decorative
- Anything that weakens trust

## Architecture Decision

### Recommendation

Move the real staff portal to a server-backed Next.js deployment.

Remove `output: 'export'` for the production staff portal.

Static export can still be used for a public brochure or fallback artifact, but it should not be the final architecture for the authenticated operational app.

### Why

The target product needs:

- Supabase SSR auth handling
- Secure cookies
- Server-rendered role-aware pages
- Server-side route handlers
- Live operational feed endpoints
- Server-side content reads
- Stronger admin workflows
- Safer application review
- Better image optimization
- Clearer stale data handling

A fully static export pushes too much responsibility into the browser and weakens the architecture around auth, routing, live data, and operational trust.

### Required Changes

1. Remove `output: 'export'` from `apps/staff-portal/next.config.ts` for the production app.
2. Restore TypeScript build enforcement.
3. Stop ignoring build errors before production use.
4. Use Netlify/Vercel/Node deployment mode that supports Next route handlers and server rendering.
5. Keep static export only as a separate public-facing mode if needed.

## Rendering Strategy

### Current Problem

Several large areas are currently client-heavy:

- Root dashboard page
- App shell
- Auth/profile loading
- HUD
- Offline banner
- Command palette
- Emergency modal
- Wiki client
- Search
- Theme/calm mode controls

This adds hydration cost and makes first render slower than necessary.

### Target Shape

Split the app into a server-rendered frame with small client islands.

Suggested structure:

```txt
RootLayout.server
└── AppShellFrame.server
    ├── GlobalHUD.client
    ├── OfflineStatusBanner.client
    ├── DesktopNav.server
    ├── Header.server
    │   ├── CommandPaletteTrigger.client
    │   └── UserMenu.client
    ├── MainContent.server
    ├── EmergencyQuickAction.client
    └── MobileBottomNav.client
```

### Server Components

Use Server Components for:

- Layout shell
- Static navigation structure
- Page headings/subheadings
- Public homepage content
- Staff dashboard shell
- Published handbook article pages
- Policy pages
- Emergency reference page content
- Camp history content
- Songbook display mode
- Admin page framing

### Client Components

Use Client Components for:

- Theme toggle
- Reduced stimulation toggle
- Command palette
- User menu dropdown
- Search input interaction
- Emergency modal open/close
- Offline detection
- Local draft handling
- Form progress widgets
- Wiki graph modal
- Markdown editing
- Admin table interactions

### Dashboard Refactor

The dashboard should become mostly server-rendered.

Only these pieces need client behavior:

- Onboarding checklist toggle/progress
- Local/offline sync status
- Expandable cards
- Role-specific interactive widgets

The primary role, session, and initial content should come from the server.

## App Shell Optimization

### Problem

The current `AppShell` does too many things:

- Fetches user session/profile
- Builds nav links
- Handles user dropdown
- Handles command palette
- Runs global search
- Manages theme
- Manages reduced stimulation mode
- Renders HUD
- Renders offline banner
- Renders emergency alert modal
- Renders emergency button
- Renders mobile nav

This makes the shell a hydration-heavy bottleneck.

### Target

Break the shell into focused parts:

```txt
components/layout/AppShellFrame.tsx        server
components/layout/DesktopNav.tsx           server
components/layout/PageHeader.tsx           server
components/layout/MobileBottomNav.tsx      client
components/auth/UserMenu.tsx               client
components/preferences/ThemeToggle.tsx     client
components/preferences/CalmModeToggle.tsx  client
components/search/CommandPalette.tsx       client, lazy-loaded
components/emergency/EmergencyQuickAction.tsx client
components/ops/GlobalHUD.tsx               client or server+client hybrid
```

### Specific Improvements

- Server-fetch `viewer` once and pass a sanitized object to the layout.
- Do not redirect unauthenticated users from the shell itself unless the route requires auth.
- Keep public pages public.
- Keep nav visibility role-aware, but treat it as convenience only.
- Use middleware/server checks for protected routes.
- Lazy-load the command palette only when opened.
- Lazy-load the emergency detail modal after the emergency button is clicked, while keeping the button itself always available.

## Mobile Navigation

### Current Issue

The current mobile nav shows:

- Home
- Wiki
- Training
- Forum, when staff access is available

This is useful but not field-optimized.

Also, mobile nav currently pushes `dashboard` for Home, while the primary dashboard page appears to live at `/`. The manifest also starts at `/dashboard`. This route mismatch should be cleaned up.

### Target Mobile Nav

Use a bottom nav focused on field needs:

1. Home
2. Search
3. Handbook
4. Emergency
5. More

The More drawer can include role-aware destinations:

- Training
- Policies
- Onboarding
- Forum
- Directory
- Songbook
- Packing list
- Camp history
- Admin
- Settings

### Emergency Access

Emergency access should be impossible to miss, but not visually gimmicky.

Options:

1. Make Emergency a permanent bottom-nav item.
2. Keep the floating emergency button, but dock it above the bottom nav with enough spacing.
3. Use a red safety tab attached to the nav rail.

Preferred approach:

> Make Emergency a permanent mobile nav item and keep a desktop floating button.

## Mission Control Dashboard

### Goal

The dashboard should feel like a field clipboard, radio net, and camp bulletin board in one place.

It should answer:

- Is anything urgent?
- What do I need to do next?
- Where do I find the thing?
- What changed?
- Am I synced/offline/stale?

### Suggested Dashboard Hierarchy

#### 1. Status Strip

At the top:

- Weather
- Alert state
- Sync state
- Last updated time
- Offline/cached state

Example:

> 72°F · No priority alerts found · Synced 2:14 PM

If stale:

> Cached conditions · Last checked yesterday 8:03 PM · Retry when online

#### 2. Today’s Job

Role-aware card.

Candidate:

- Continue application
- Download paper fallback
- Check required documents
- Parent/guardian step, if applicable

Staff:

- Today’s training/task
- Handbook quick links
- Program area notices
- Packing/prep reminders

Area Director:

- Staff readiness summary
- Area-specific alerts
- Training gaps
- Equipment/prep checklist

Admin:

- Applications needing review
- Alerts needing update
- Audit exceptions
- Seasonal rollover tasks

Parent/Guardian:

- Minor-related requirements
- Review/signature tasks
- Contact and paper fallback info

#### 3. Need It Fast?

A set of large quick-action cards:

- Emergency reference
- Search handbook
- Policies
- Packing list
- Schedule/map
- Contact leadership

#### 4. Your Next Three Tasks

Show only the next three meaningful tasks.

Avoid overwhelming users with a long checklist on first load.

#### 5. Updates

Dated operational updates.

Each item should show:

- Date/time
- Source/author
- Whether it is current or cached
- Whether it requires action

#### 6. Camp Life

Small, optional, non-critical flavor:

- Camp tradition
- Song of the day
- Staff tip
- Nature note
- Historical note
- Dad joke, if harmless

This should never outrank safety or tasks.

## Global HUD

### Current Strengths

The HUD concept is strong:

- Weather
- Priority alerts
- Operational ticker
- Camp-life ticker
- Emergency state visual mode

### Current Risks

- It fetches frequently.
- It has rotating content.
- It depends on client-side localStorage caches.
- Some route handlers may be static under the current export setup.
- It can imply live status without clearly exposing data age.

### Target Behavior

#### Normal State

Collapsed mobile display:

> 72°F · No priority alerts found · Synced 2:14 PM

Expanded display:

- Station/source
- Temperature
- Wind
- Humidity
- Priority items
- Source links
- Last refreshed

#### Offline State

> Offline · Showing cached HUD from 2:14 PM · Weather/alerts may be outdated

#### Failed Refresh

> Could not refresh operational feeds · Last good update 2:14 PM

#### Emergency State

When emergency/critical alert exists:

- Stop rotating ticker content.
- Hide camp-life ticker.
- Show only critical alert, source, time, and instructions.
- Use safety red, not decorative animation.

### Refresh Rules

- Pause polling when tab is hidden.
- Use exponential backoff after failures.
- Do not refresh every minute for low-value camp-life content.
- Keep weather/ops refresh separate from camp-life refresh.
- Do not show `Status Normal` unless data refreshed recently.

## Offline/PWA Blueprint

### Current Problem

The service worker currently caches a small set of assets and then caches all same-origin GET requests with stale-while-revalidate.

That is too broad for this product.

It can accidentally cache:

- API responses
- Authenticated content
- Old operational data
- Stale pages that should show live status

### Target Cache Lanes

#### 1. App Shell Cache

Cache:

- Static shell assets
- JS/CSS chunks
- Icons
- Logo
- Manifest
- Offline fallback page

Strategy:

- Stale-while-revalidate
- Versioned cache names
- Safe to serve stale briefly

#### 2. Critical Reference Cache

Cache in IndexedDB:

- Emergency references
- Safeguarding references
- Critical policies
- Core handbook articles
- Packing list
- Required training references
- Camp contact info

Each record should include:

- `id`
- `slug`
- `title`
- `content`
- `contentVersion`
- `offlinePriority`
- `visibilityRoles`
- `lastSyncedAt`
- `expiresAt`

Strategy:

- Explicit sync
- Version-aware replacement
- Role-aware filtering
- Visible stale labels

#### 3. Operational Live Data Cache

For:

- Weather
- Alerts
- Road/fire context
- Announcements
- Camp-life feeds

Strategy:

- Network-first
- Short timeout
- Fallback to cached data
- Always show last successful update
- Never present stale data as live

#### 4. Private User Data

Do not broadly service-worker cache.

Use explicit storage for:

- Application draft
- Checklist progress
- Training progress
- User preferences

Private data should have:

- Clear ownership
- Sync status
- Conflict behavior
- Delete/reset behavior
- Server-backed authoritative state when submitted

#### 5. Submission Queue

Only claim local queueing after it exists and is tested.

Until then, offline copy should say:

> Offline — cached handbook and emergency references may be available. New submissions need connection.

## Search Optimization

### Current Problem

Search currently uses a weighted static seeded JSON index in one area, while the wiki fetches articles from Supabase and IndexedDB in another area.

That can cause search and content to disagree.

### Target Search Model

One content source should generate both:

- Rendered content
- Offline search index

Search result groups:

1. Emergency
2. Safeguarding
3. Policy
4. Checklist
5. Training
6. Handbook
7. Songbook
8. People/contact, where allowed

### Search Ranking Rules

Boost:

- Emergency references
- Safeguarding content
- Exact title matches
- Alias matches
- Tags
- Recently updated operational items
- User role-relevant content

De-emphasize:

- Long body-only matches
- Deprecated pages
- Draft pages
- Admin-only content for non-admin users

### Camp Synonyms

Add synonym/alias support for camp language:

- `smellables` → bear safety, food storage
- `thunder` → lightning protocol
- `health lodge` → medical
- `medic` → health officer, health lodge
- `flags` → assembly, morning flags, evening flags
- `PD` → Program Director
- `SPL` → Senior Patrol Leader
- `YPT` → Youth Protection Training
- `two deep` → safeguarding, adult supervision
- `fire` → evacuation, wildfire, smoke
- `radio` → communication procedure
- `lost scout` → missing person protocol

### Command Palette

The command palette should be lazy-loaded.

Opening it should not load graph, editor, admin tools, or large markdown renderers.

## Wiki and Handbook Optimization

### Current Problem

The wiki is client-heavy. It fetches articles after load, stores them in IndexedDB, filters client-side, renders markdown dynamically, and includes editing/modal/graph behavior in the same client component.

### Target Model

Use routes:

```txt
/wiki
/wiki/[slug]
/wiki/[slug]/edit
```

Published article view should be server-rendered.

Client features should layer on top:

- Search/filter sidebar
- Offline cache status
- Table of contents active section
- Edit button, only for authorized users
- Wiki graph, lazy-loaded
- Create/edit modal, lazy-loaded

### Article Page Requirements

Each article should show:

- Title
- Category
- Tags
- Offline priority badge, if relevant
- Last updated
- Cached/offline state
- Source/version
- Related topics
- On-this-page navigation

### Editing Requirements

Article creation/editing should require:

- Admin/content role
- Server authorization or strict RLS
- Version history
- Audit trail
- Draft/published distinction
- Validation
- Rollback

Do not rely on the presence or absence of an Edit button as security.

## Emergency UX

### Emergency Button

Emergency access should be:

- Always reachable
- Thumb-friendly
- Clearly labeled
- Not hidden behind search
- Not visually confused with decorative red styling

### Emergency Modal/Page

Emergency content should support:

- Offline use
- Large readable text
- No animation dependency
- Direct call/contact links where appropriate
- Clear steps
- Last synced time
- Print/export fallback if possible

### Emergency Reference Card Structure

Use consistent sections:

1. Immediate action
2. Who to notify
3. Where to go
4. What not to do
5. Documentation/reporting after the event
6. Last reviewed / last synced

Example button copy:

- `Open Emergency Card`
- `Fire / Evacuation`
- `Lightning`
- `Lost Scout`
- `Medical`
- `Safeguarding Report`

Avoid joke language in emergency surfaces.

## Visual Design System

### Current Strengths

The current tokens are promising:

- Forest
- Gold
- Dusk
- Ember
- Cream
- Bark
- Safety red
- Light wilderness theme
- Dark wilderness theme
- Reduced stimulation mode

### Visual Direction

Use a practical camp command-center look:

- Cream/canvas cards for normal content
- Forest rails for structure
- Amber for warm guidance and next actions
- Safety red only for actual emergency/safety states
- Bark/wood neutrals for secondary surfaces
- Dusk/navy for night mode

### Camp Texture Ideas

Use sparingly:

- Topographic contour lines
- Patch-like badges
- Clipboard cards
- Radio callout blocks
- Trail-map separators
- Campfire ember accents
- Staff handbook tabs
- Field-guide side notes

### LCARS-Inspired Structure

Keep the idea subtle:

- Rounded rails
- Status bands
- Section pills
- Color-coded operational lanes
- Wide touch-friendly navigation blocks

Avoid making it look like a Star Trek fan app.

## Typography and Readability

### Problems to Watch

- Too much tiny text, especially 10px and 11px labels
- Dense uppercase headings
- Low-contrast secondary text
- Important info hidden in small labels
- Global `!important` contrast overrides indicating the design system is fighting itself

### Targets

- Body text: 16px base on mobile
- Secondary text: no smaller than 13px for operational content
- Labels/badges: 11px minimum, but not for critical information
- Touch targets: at least 44px high/wide where possible
- Use uppercase for labels, not paragraphs
- Use plain-language headings

### Tone

Use direct camp language.

Instead of:

> Active LocalStorage caching is active.

Use:

> Offline — saved handbook pages may still work on this device.

Instead of:

> Operational HUD unavailable.

Use:

> Could not refresh camp status. Showing cached info if available.

## Animation and Reduced Stimulation

### Current Strength

Reduced stimulation mode already removes animation, transitions, shadows, text shadows, blur, and glass effects.

### Needed Improvements

- Respect `prefers-reduced-motion` automatically.
- Stop animation loops entirely in reduced mode rather than continuing to clear canvas every frame.
- Pause canvas and ticker intervals when the tab is hidden.
- Avoid pulsing primary CTA buttons.
- Avoid animation in emergency states unless absolutely necessary.
- Cap particle count and device pixel ratio for low-power devices.

### Ember Background

Keep as atmosphere, but make it cheaper:

- Do not run when reduced stimulation is active.
- Do not run when document is hidden.
- Reduce particles on mobile.
- Avoid expensive shadows on low-power mode.
- Consider a static CSS background fallback.

## Accessibility Checklist

Required:

- Keyboard access for all nav, menus, modals, and search.
- Focus trap inside modals.
- Return focus to opener after modal close.
- Escape closes modals.
- `aria-modal` and correct dialog labeling.
- `aria-current` on active nav links.
- Meaningful button labels beyond icons.
- No hover-only glossary or tooltip behavior.
- Sufficient color contrast in both themes.
- Reduced motion and reduced stimulation support.
- Large touch targets.
- Avoid layout shift when banners appear.

Emergency-specific:

- Emergency references must be readable without color alone.
- Do not rely on motion to communicate urgency.
- Do not hide key steps inside collapsed sections by default.

## Training UX

### Goal

Training should be engaging but not addictive.

It should build confidence, competence, and safe judgment.

### Keep

- Scenario cards
- Quick quizzes
- Branching decisions
- Matching games
- Sequencing games
- Flashcards
- Emergency procedure simulations
- Checklist walkthroughs
- Campfire planning builder
- Wildlife/smellables challenge
- Radio procedure practice
- Safeguarding boundary scenarios

### Avoid

- Public shaming
- Addictive streak mechanics
- Public leaderboards for sensitive topics
- Confetti for serious safety training
- Treating emergency or safeguarding content like a joke

### Camp-Appropriate Ideas

- `Radio Check` simulator
- `Smellables Sweep` drag-and-sort
- `Thunder Timer` scenario drill
- `Two-Deep Leadership` branching scenario
- `Where Does This Go?` camp map challenge
- `Before Flags` readiness checklist
- `Campfire Builder` with pacing and safety checks
- `Find the Policy` search challenge

Reward language should be calm:

- `Reviewed`
- `Ready for Staff Week`
- `Needs Practice`
- `Ask Your Area Director`
- `Verified by Admin`

## Forum UX

The forum should be operational communication, not a social network.

Recommended framing:

> Staff Forum: camp operations, prep questions, handbook help, and director announcements.

Visible rules:

- No private direct messages
- No anonymous posts
- No disappearing messages
- No private adult/youth conversations
- Moderation is logged
- Admins may lock, hide, move, or remove posts
- Access begins only after hired/onboarding status

Recommended categories:

- Announcements
- Questions for Leadership
- Staff Week Prep
- Onboarding Help
- Gear and Packing
- Program Area Planning
- Handbook Questions
- Songbook and Campfire Ideas
- Training Games and Challenges
- IT Help
- Adult/Admin-only
- Director/Admin-only

UX improvements:

- Pin safety and conduct rules.
- Show category purpose text.
- Show author role safely.
- Add report/flag flow.
- Add locked thread state.
- Avoid reactions that create popularity contests.
- Use acknowledgements for announcements: `Seen`, `Question`, `Needs follow-up`.

## Staff Profiles and Directory

### Adult Staff Visible Fields

- Preferred display name
- Role title
- Program area
- Short bio
- Optional photo
- Optional pronouns
- Optional years on staff
- Optional favorite camp tradition

### Youth Staff Default Visible Fields

- Preferred display name
- Staff role
- Program area

### Never Display

- Personal phone
- Personal email unless official/approved
- Home address
- Social media handles
- Relationship status
- Exact birthdate
- Parent/guardian contact info
- Emergency contact info
- Sensitive disclosures

UX rule:

> Directory usefulness must never outrank minor privacy.

## Application and Onboarding UX

The candidate flow should support both online and paper fallback.

Dashboard should include:

- Start online application
- Continue online application
- Save draft status
- Submit status
- Download blank PDF application
- Instructions for paper submission
- Scout office contact/submission info
- Parent/guardian step for minors
- Required training and document checklist

### Draft States

Use clear labels:

- Not started
- Saved on this device
- Saved to account
- Syncing
- Needs connection
- Ready to submit
- Submitted
- Under review
- Needs correction
- Approved
- Not selected

Do not say submitted unless the server has accepted it.

### Multi-Step Wizard

The application wizard should eventually match the 19-section blueprint:

1. Applicant demographics and legal eligibility
2. Parent/guardian contact for applicants under 18
3. Age eligibility verification
4. Work authorization
5. Scouting America registration
6. Availability
7. Position preferences
8. Programmatic expertise
9. Certifications and logistics
10. Scouting experience
11. Camp staff experience
12. General employment history
13. Education and extracurriculars
14. Professional references
15. Essential functions and environmental acknowledgments
16. Current life-safety certifications
17. Legal disclosures and agreements
18. Signature and verification
19. Parent/guardian signature, if under 18

## Security and Safeguarding UX Rules

Non-negotiables:

- No private direct messaging
- No hidden adult/youth one-on-one communication
- No anonymous posting
- No disappearing messages
- No unrestricted minor profile exposure
- No unnecessary medical data storage
- Application data restricted to authorized reviewers
- Admin actions logged
- Role changes auditable
- Forum moderation logged

Implementation rules:

- Every table in the public schema should have RLS enabled.
- UI hiding is never the security layer.
- UPDATE/DELETE policies must enforce ownership or explicit admin/moderator permission.
- Admin actions should generate immutable audit records.
- Service-role access must never be exposed to client code.
- Role, seasonal staff status, safeguarding classification, admin permission, forum permission, and profile visibility should not be collapsed into one simple string.

## Technical Debt Cleanup

### Immediate Cleanup

- Remove or isolate legacy Vite assumptions.
- Fix route mismatch between `/`, `/dashboard`, and manifest `start_url`.
- Restore TypeScript build checks.
- Remove broad service-worker caching.
- Replace browser `alert()` calls with accessible app dialogs/toasts.
- Replace LocalStorage as authoritative state.
- Rename confusing copy like `Active LocalStorage caching is active`.
- Audit every use of `dangerouslySetInnerHTML`.
- Keep `rehype-sanitize` in markdown rendering.

### Code Splitting

Lazy-load:

- Command palette
- Wiki graph
- Markdown editor
- Admin dashboards
- Forum composer
- Application wizard sections after current section
- Training games
- Rich media/songbook tools

### Data Fetching

Use server-side reads for:

- Initial viewer/profile
- Initial dashboard content
- Published wiki articles
- Public camp info
- Role-visible nav state

Use client-side reads for:

- Realtime or frequently updated widgets
- Draft sync
- Offline status
- User-triggered search
- User-triggered editor/admin actions

## Measurement Plan

Track Core Web Vitals:

- LCP target: 2.5s or faster
- INP target: 200ms or faster
- CLS target: 0.1 or lower

Track app-specific metrics:

- Time to first useful dashboard
- Time to open emergency card
- Time to first search result
- Offline article load success rate
- Stale data display correctness
- Application draft recovery success
- Failed sync recovery rate
- Mobile nav task completion

Run tests under:

- Slow 3G
- Offline after first sync
- Offline before first sync
- Low battery/mobile CPU throttling
- Bright/light theme
- Dark theme
- Reduced stimulation mode
- Candidate role
- Staff role
- Youth staff visibility rules
- Admin role
- Parent/guardian role

## Build Order

### Phase 0 — Stop the Bleeding

- Decide server-backed Next deployment.
- Remove production reliance on static export.
- Stop ignoring TypeScript build errors.
- Fix `/dashboard` vs `/` route mismatch.
- Replace broad service worker caching.
- Rewrite offline banner copy.
- Add visible `lastSyncedAt` to HUD, alerts, wiki, and offline references.

### Phase 1 — Rendering Cleanup

- Split `AppShell` into server frame plus client islands.
- Server-fetch profile/session and initial content.
- Convert dashboard to mostly server-rendered.
- Lazy-load command palette, wiki graph, editor, and admin tools.
- Add route-level loading and error states.

### Phase 2 — Offline-First for Real

- Create versioned IndexedDB schema.
- Generate offline search index from structured content.
- Mark critical references with offline priority.
- Build safe local draft model for applications.
- Add stale/live labels everywhere operational data appears.

### Phase 3 — UX and Camp Culture Pass

- Rebuild dashboard as Mission Control.
- Simplify mobile nav.
- Rework emergency access.
- Add camp-life layer without distracting from operations.
- Rewrite microcopy in plain camp language.
- Add field-guide/clipboard visual language.

### Phase 4 — Safeguarding and Governance

- Full RLS audit.
- Admin audit logs.
- Forum moderation model.
- Profile visibility rules.
- Parent/guardian flow.
- Application status history.
- Seasonal rollover tools.

### Phase 5 — Testing and Launch Readiness

- Lighthouse audits.
- Web Vitals reporting.
- Axe accessibility checks.
- Playwright mobile/offline tests.
- Low-bandwidth simulations.
- Role matrix tests.
- Stale weather/alert tests.
- Emergency reference offline tests.
- Security review against blueprint requirements.

## Acceptance Criteria

The optimization pass is successful when:

- The portal renders useful content quickly on mobile.
- The dashboard feels like Camp Lawton Mission Control.
- Emergency references are reachable in one tap from mobile.
- Stale data is never presented as live.
- Offline content is explicit, useful, and versioned.
- Search results match the actual content source.
- Auth and permissions are enforced beyond the UI.
- Youth profile exposure is minimized by default.
- The visual design feels like a rugged camp tool, not a generic glass dashboard.
- Reduced stimulation mode meaningfully reduces motion and visual noise.
- The site remains warm, human, and camp-flavored without becoming gimmicky.

## Final Standard

Every major decision should answer this question:

> Would this help a tired 16-year-old staffer, a stressed Program Director, or a cautious parent get the right answer fast without making anything less safe?

If yes, build it.

If no, cut it or simplify it.
