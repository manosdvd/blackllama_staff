# Legacy Salvage Report

## Purpose

This report identifies which parts of the current `blackllama_staff` prototype should be salvaged, rewritten, or discarded as the project moves toward the Camp Lawton Staff Portal blueprint.

The current app contains useful product thinking and Camp Lawton flavor, but it should not be treated as the production foundation for real youth-serving operational software.

## Summary Judgment

The existing repo is valuable as a prototype and design reference.

It should not be thrown away.

However, the final app needs a stronger architecture built around:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth and PostgreSQL
- Supabase Row-Level Security
- IndexedDB/offline storage
- Service worker/PWA behavior
- Structured content records
- Role-based dashboards
- Staff-only moderated communication
- Minor privacy protections
- Parent/guardian support
- Seasonal rollover

The safest strategy is to salvage concepts and content while rewriting the architecture and security model.

## Salvage Categories

### 1. Salvage Directly as Product Concepts

These ideas are worth keeping, but should be rebuilt in the final architecture.

| Current Prototype Idea | Keep? | Final Form |
|---|---:|---|
| Camp Lawton branding | Yes | Tailwind theme tokens and shared brand components |
| Forest/amber visual palette | Yes | Rustic LCARS color system |
| Floating emergency button | Yes | `<EmergencyQuickAction />` |
| Weather/alert banner | Yes | `<OperationalHUD />` and alert panels |
| Global search | Yes | Offline local search index |
| Handbook course | Yes | Structured content pages plus training modules |
| Glossary/tooltips | Yes | Touch-friendly glossary/help system |
| Ambiance canvas | Yes | `<EmberBackground />` with accessibility and low-power controls |
| Theme toggle | Yes | User display preferences and reduced stimulation mode |
| Training games | Yes | Structured training module records |
| Application wizard | Yes | Full validated multi-step application flow |
| Onboarding checklist | Yes | Checklist templates and user progress records |
| Staff directory | Yes | Privacy-gated staff profiles |
| Forum | Yes, heavily revised | Staff-only moderated forum with no DMs |

## Existing Areas Worth Mining

### Visual Direction

Useful existing ideas:

- Camp logo usage
- Rustic camp dashboard feel
- Card-based content sections
- Weather/alert presentation
- Emergency-first navigation
- Background ambiance
- Dark-mode/camp-mode mood

Rewrite into:

- Shared Tailwind tokens
- Mobile-first layout primitives
- LCARS-inspired rails, cards, pills, and status badges
- Accessibility-aware visual components

Avoid carrying forward:

- Inline-heavy styles
- Desktop-first shell assumptions
- Decorative effects that reduce readability
- Any visual effect that ignores reduced motion or reduced stimulation settings

## Content Salvage

### Handbook Content

Useful existing ideas:

- Handbook/course framing
- Camp-specific staff culture
- Safety-first search terms
- Camp glossary terms
- Emergency reference content
- Onboarding content
- Songbook and campfire content

Rewrite into:

- `content_items`
- `emergency_references`
- `checklist_templates`
- `checklist_template_items`
- `training_modules`
- `songbook_items`
- `leadership_contacts`
- `camp_contact_info`

Do not preserve as final architecture:

- Flat `rawHandbook` array as the runtime source of truth
- Manually assembled search index
- Exact title matching for handbook navigation
- One giant course as the primary content model

## Training Salvage

Useful existing ideas:

- EDGE-style learning
- Quizzes
- Flip-card style training
- Emergency drills
- Campfire/songbook practice
- Packing assistant concepts
- Scenario-based learning

Rewrite into structured training module types:

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

Avoid:

- Public shaming
- Addictive streak mechanics
- Public leaderboards for sensitive topics
- Confetti or dopamine loops for serious safety training
- Treating emergency or safeguarding content like a joke

## Search and Glossary Salvage

Useful existing ideas:

- Global search box
- Emergency search weighting
- Glossary popups
- Camp-specific definitions

Rewrite into:

- Offline local search index
- Search results grouped by type
- Emergency and safeguarding results weighted highest
- Touch-friendly glossary cards
- No hover-only behavior
- Last-updated and cached/stale indicators

Search result groups should include:

- Emergency
- Safeguarding
- Policy
- Handbook
- Checklist
- Training
- Songbook
- People/contact, if allowed

## Auth, Roles, and Permissions

### Salvage Conceptually

The current app already experiments with accounts, roles, admin views, and Supabase-backed data.

Keep the concept of:

- Candidate users
- Staff users
- Admin users
- Application review
- Staff directory
- Forum access based on user state

### Rewrite Fully

Do not preserve any final implementation where:

- Client-side role checks are the primary security layer
- LocalStorage is the source of truth for permissions
- UI hiding is treated as access control
- Service-role functions bypass too much policy without auditable safeguards
- Staff status and role are collapsed into one simple string

Final implementation must separate:

- Account role
- Seasonal staff status
- Safeguarding classification
- Admin permissions
- Forum permissions
- Profile visibility

## Application System Salvage

Useful existing ideas:

- Multi-step wizard
- Digital signature concept
- Draft saving concept
- Admin review concept
- Candidate status concept

Rewrite into:

- Full 19-section application flow
- Validated forms
- Local draft plus synced server draft
- Clear draft/submission distinction
- Paper/PDF fallback
- Parent/guardian signature flow for minors
- Application status history
- Admin review notes
- Print packet
- Seasonal application records

Do not preserve:

- One-application-only assumptions across seasons
- LocalStorage submission as authoritative data
- Vague success states when server submission fails
- Missing parent/guardian workflow
- Simplified legal acknowledgment handling

## Forum Salvage

Useful existing ideas:

- Staff discussion space
- Operational Q&A
- Announcements
- Category-based posts

Rewrite into:

- Staff-only forum categories
- Admin-only announcements
- Moderation tools
- Report/flag flow
- Locked/pinned threads
- No DMs
- No anonymous posting
- No disappearing messages
- RLS-enforced access
- Logged moderation events

Do not preserve:

- Public forum read policies
- Casual social-network framing
- Hidden one-on-one communication patterns
- Unlogged moderation
- Unrestricted attachments

## Staff Directory and Profiles Salvage

Useful existing ideas:

- Help staff identify each other
- Program area awareness
- Staff bios/favorite camp details

Rewrite into:

- Privacy-gated `staff_profiles`
- Minor privacy defaults
- Optional profile approval
- Optional photo approval
- Visibility rules based on age/status/classification

Never display:

- Personal phone number
- Personal email unless official/approved
- Home address
- Social media handles
- Relationship status
- Exact birthdate
- Parent/guardian contact information
- Emergency contact information
- Sensitive personal disclosures

## Backend Salvage

Useful existing ideas:

- Supabase direction
- Netlify function direction
- Server-side auth verification concept
- Admin function concept
- Environment variable setup docs

Rewrite into:

- Next.js server actions or route handlers where appropriate
- Supabase client/server helper separation
- RLS-first database design
- Minimal service-role usage
- Audit logging
- Structured migrations
- Staging and production separation

Do not preserve:

- Service-role bypass as the default pattern for ordinary user access
- Incomplete RLS policies
- Public select policies for sensitive forum/profile/application data
- Simplistic profile table as the whole identity model

## Ambiance and Visual Effects Salvage

Useful existing ideas:

- Campfire/ember atmosphere
- Background ambiance
- Theme modes

Rewrite as:

- `<EmberBackground />`
- Respects `prefers-reduced-motion`
- Respects reduced stimulation mode
- Has manual toggle
- Has static fallback
- Has low-power mode
- Never reduces readability
- Never conveys essential information

Avoid:

- Battery-draining animation
- Excessive particles
- Flashing/strobing effects
- Effects required for understanding content

## Files and Patterns to Treat Carefully

The following existing patterns are useful for orientation but should not become final architecture:

- `src/main.js` manual view map and global state
- `src/data/rawHandbook.js` flat content array
- `src/services/auth.js` localStorage-heavy session cache
- `src/services/apiClient.js` Netlify function wrapper pattern
- `supabase/migrations/001_setup.sql` simplified profile/application schema
- `supabase/migrations/002_extended_features.sql` public forum/content policies
- `src/components/application.js` simplified wizard and local draft/submission behavior

## What to Discard or Fully Rewrite

Discard as final patterns:

- Vite SPA architecture
- Manual route/view map
- Desktop-first sidebar shell
- Raw HTML string rendering as primary strategy
- Inline style-heavy component rendering
- LocalStorage-based staff progress as canonical data
- LocalStorage-based application submission as authoritative
- Flat handbook data model
- Manual static search index
- Client-side permission hiding as access control
- Patch-based mobile CSS fixes
- Public forum read access
- Any unsafe staff directory assumptions
- Confetti/dopamine effects for serious training

## Safe Short-Term Prototype Improvements

These changes can be made safely before the full rebuild:

1. Add structured `contentSeed.js` without wiring it into runtime yet.
2. Add blueprint-aligned dashboard copy.
3. Add safer forum/profile explanatory text.
4. Add offline/stale/draft state labels.
5. Add emergency reference disclaimers.
6. Add reduced stimulation setting placeholder.
7. Add docs for target architecture and MVP order.
8. Add comments warning which prototype files are not final patterns.

## Risky Changes to Delay

Delay until the rebuild branch or a stronger local development environment:

- Replacing the routing system
- Migrating to Next.js
- Rewriting all styling to Tailwind
- Replacing auth/session handling
- Replacing database schema in production
- Enforcing full RLS policy set
- Reworking forum storage
- Building offline IndexedDB sync
- Building the full application wizard with validation
- Building parent/guardian account linking
- Building seasonal rollover

## Bottom Line

The current app has good instincts.

The final app needs stronger bones.

Salvage the ideas, content, tone, and prototype interactions. Rewrite the architecture, security model, data model, and offline system.
