# Camp Lawton Staff Portal — Blueprint Overhaul Plan

## Purpose

This document defines the overhaul plan for the existing `blackllama_staff` repository.

The goal is to keep the useful work already present in the repo while restructuring the product content, data model, security assumptions, and user experience around the full Camp Lawton Staff Portal PWA blueprint.

The current app should be treated as a strong prototype and concept archive, not as the final production foundation.

The final product should become a real-world, mobile-first, offline-first staff portal for Camp Lawton recruitment, onboarding, handbook access, training, emergency references, staff communication, parent/guardian support, admin review, and seasonal operations.

## Current Repo Status

The current repository is a Vite-based single-page app with a manually managed view system. It includes several useful prototype ideas:

- Camp Lawton visual identity
- Staff dashboard concept
- Handbook/course presentation
- Policy and emergency sections
- Global search concept
- Weather/alert banner concept
- Floating emergency button
- Ambiance/background canvas concept
- Training interaction ideas
- Application wizard prototype
- Staff forum prototype
- Staff directory prototype
- Early Supabase and Netlify function integration

However, the existing app does not yet match the blueprint's intended architecture or safety requirements.

Major gaps:

- The app is Vite, not Next.js App Router.
- The app is JavaScript, not TypeScript.
- Routing is manually handled inside the client.
- Several views are rendered through injected HTML strings.
- Handbook content is flattened rather than normalized.
- Search is manually assembled rather than generated from structured content.
- LocalStorage is still used for important user/application/progress state.
- Forum and directory assumptions need stronger safeguarding.
- RLS policies are incomplete for real youth-serving software.
- The application wizard is much smaller than the full official application flow.
- Offline-first behavior is not yet a true system architecture.
- Parent/guardian accounts are not fully modeled.
- Seasonal rollover is not implemented.
- WYSIWYG content management is only a concept/prototype.
- The current system is not production-ready for real staff/candidate data.

## Guiding Decision

The project should move forward in two tracks:

1. Short-term content and UX overhaul inside the current Vite app.
2. Long-term architecture migration to the blueprint target stack.

This avoids throwing away useful work while also avoiding the trap of endlessly patching a prototype into a role-based youth-serving operational system.

## Product North Star

The app should feel like:

> Camp Lawton in your pocket: practical, rugged, warm, clear, a little stylish, and ready when the signal dies.

It is not just a website. It is not just a prettier PDF. It is not a private social network. It is not an emergency alert system replacement.

It is a field-ready mission-control app for staff, candidates, admins, and approved parent/guardian users.

## Final Target Architecture

The blueprint target stack is:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase PostgreSQL
- Supabase Row-Level Security
- Supabase Storage
- IndexedDB for offline/local-first data
- Cache Storage/service worker for app shell and static assets
- WYSIWYG editor for content management
- Local/offline search index
- Role-based dashboards
- Staff-only moderated forum
- Seasonal rollover system
- Push notifications where approved
- Optional haptics
- Reduced motion and reduced stimulation modes

## Overhaul Principles

### 1. Mobile First

Phone use is the primary use case.

The app should assume weak signal, bright sun, low battery, tired staff, distracted users, teen users, older adult users, one-handed use, and the need for fast answers.

Desktop layouts are enhancements only.

### 2. Offline First

After first sync, critical content must remain available offline.

This includes:

- Handbook
- Policies
- Emergency references
- Safeguarding references
- Songbook
- Onboarding checklist
- Packing list
- Required training marked for offline use
- Current handbook PDF if cached
- Previously loaded announcements
- Camp history timeline
- User preferences
- Offline search index

Cached content must always be clearly labeled. Stale weather, fire, emergency, or announcement data must never be presented as live.

### 3. Safeguarding First

This is youth-serving operational software.

The system must not rely on UI hiding for security. Permissions must be enforced through Supabase RLS and server-side checks.

Non-negotiables:

- No private direct messaging
- No hidden adult/youth one-on-one communication
- No anonymous posting
- No disappearing messages
- No unrestricted profile exposure for minors
- No unnecessary medical data storage
- Application data restricted to authorized reviewers
- Admin actions logged
- Role changes auditable
- Forum moderation logged

### 4. Content as Operational Data

The handbook should not remain a flat text blob.

The new content model should distinguish:

- Handbook articles
- Policy references
- Safeguarding references
- Emergency cards
- Checklists
- Training modules
- Songbook items
- Leadership contacts
- Camp address/contact info
- Seasonal settings
- File attachments
- Audio tracks
- Version history

### 5. Keep the Camp Lawton Flavor

The app should be serious enough for real use but still feel like camp.

Keep:

- Warm camp voice
- Rustic command-center style
- Subtle LCARS-inspired structure
- Forest/amber palette
- Practical humor where appropriate
- Plain language
- Training that is engaging but not addictive

Avoid:

- Excessive sci-fi gimmicks
- Tiny text
- Flashing effects
- Overdone animation
- Confetti for serious safety topics
- Anything that weakens trust

## Salvage Plan

### Salvage as Concepts

| Existing Concept | New Direction |
|---|---|
| Camp Lawton branding | Tailwind design tokens and reusable layout primitives |
| Forest/amber palette | Blueprint rustic LCARS palette |
| Floating emergency button | `<EmergencyQuickAction />` |
| Weather banner | `<OperationalHUD />` and `<AlertStatusPanel />` |
| Global search | Offline local search index |
| Handbook course | Structured content pages and training modules |
| Glossary/tooltips | Touch-friendly glossary system |
| Ambiance canvas | `<EmberBackground />` with accessibility controls |
| Theme mode | User preferences and reduced stimulation mode |
| Application wizard | Full 19-section application flow |
| Training games | Structured training module records |
| Staff forum | Staff-only moderated forum with no DMs |
| Staff directory | Privacy-gated staff profiles |

### Salvage as Reference Content

The following files/content should be reviewed and mined for useful copy, structure, and ideas:

- Existing handbook data
- Existing policies content
- Existing training content
- Existing songbook/campfire content
- Existing onboarding checklists
- Existing application markdown
- Existing dashboard language
- Existing glossary terms
- Existing emergency/search concepts
- Existing visual styling

### Rewrite Fully

The following should not be preserved as final implementation patterns:

- Vite SPA architecture
- Manual client-side view routing
- Injected raw HTML rendering
- Inline-heavy styling
- LocalStorage as canonical user/progress/application state
- UI-only role hiding
- Flat handbook model
- Manual static search index
- Publicly selectable forum tables
- Simplistic application status model
- Prototype admin permissions
- Prototype staff directory privacy rules
- Any security assumption that does not survive direct database access

## Phase 1 — Repo Documentation and Alignment

Goal: create a clear bridge between the existing repo and the blueprint.

Create:

- `docs/BLUEPRINT_OVERHAUL_PLAN.md`
- `docs/LEGACY_SALVAGE_REPORT.md`
- `docs/TARGET_ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/SECURITY_AND_SAFEGUARDING.md`
- `docs/MVP_BUILD_ORDER.md`

Acceptance criteria:

- The repo clearly explains that the existing app is a prototype.
- The blueprint becomes the source of truth.
- Salvageable features are named.
- Unsafe/incompatible patterns are named.
- Future contributors know what to preserve and what to replace.

## Phase 2 — Content Overhaul in Current Vite App

Goal: make the existing prototype content match the blueprint more closely without yet rebuilding the app.

### 2.1 Restructure Handbook Seed Content

Replace the flat handbook model with a more structured seed format, even if still stored locally for now.

Suggested temporary structure:

```js
export const contentSeed = {
  seasons: [],
  contentCategories: [],
  contentItems: [],
  emergencyReferences: [],
  checklistTemplates: [],
  checklistItems: [],
  trainingModules: [],
  songbookItems: [],
  leadershipContacts: [],
  campContactInfo: [],
  glossaryTerms: []
};
```

This local structure should mirror the future Supabase model.

### 2.2 Update Content Areas

Revise app content around these blueprint sections:

- Mission Control Dashboard
- Staff Application
- Parent/Guardian Support
- Staff Onboarding
- Handbook
- Policies
- Emergency References
- Safeguarding
- Training Games
- Songbook
- Camp History
- Staff Forum
- Staff Profiles
- Admin Tools
- Seasonal Rollover

### 2.3 Application Wizard Content Upgrade

Expand the application wizard from the current broad 5-step prototype into the blueprint's 19-section flow:

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

For now, the prototype may render these as client-side steps, but the content should be ready to migrate into validated forms later.

### 2.4 Add Paper Fallback Language

Candidate dashboard must include:

- Start online application
- Continue online application
- Download blank PDF application
- Instructions for turning in paper application
- Scout office submission/contact instructions
- Reminder that paper application remains acceptable

### 2.5 Replace Casual Forum Framing

The forum should be framed as operational communication, not a social network.

Default categories:

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

Rules to display prominently:

- No DMs
- No anonymous posts
- No disappearing messages
- No private adult/youth conversations
- Moderation is logged
- Admins may lock, hide, move, or remove posts
- Staff forum access begins only after hired/onboarding status

### 2.6 Staff Profile Privacy Copy

Add clear profile rules.

Adult staff visible fields:

- Preferred display name
- Role title
- Program area
- Short bio
- Optional photo
- Optional pronouns
- Optional years on staff
- Optional favorite camp tradition

Youth staff default visible fields:

- Preferred display name
- Staff role
- Program area

Never display:

- Personal phone
- Personal email unless official/approved
- Home address
- Social media handles
- Relationship status
- Exact birthdate
- Parent/guardian contact info
- Emergency contact info
- Sensitive disclosures

### 2.7 Offline Labels and Stale Data Language

Add visible state labels:

- Available offline
- Saved locally
- Synced
- Syncing
- Needs connection
- Cached copy
- May be outdated
- Last updated
- Could not refresh
- Retry when online

Weather, fire, announcement, and emergency panels must show last successful update time.

Acceptance criteria:

- Existing app reads like the blueprint product.
- The dashboard feels like Mission Control.
- Emergency content is easier to reach.
- Search is more safety-aware.
- Application flow content is substantially fuller.
- Forum/profile language is safer.
- Offline/stale state language is visible.
- The app remains usable while still understood as a prototype.

## Phase 3 — Prototype Hardening

Goal: make the current app a safer, clearer prototype while the full rebuild is planned.

Update or remove:

- Confetti on serious training completion
- Casual chat wording for forum
- Any implication that local draft submission is officially received
- Any implication that cached alert data is live
- Any profile fields that expose minors unnecessarily
- Any admin UI language suggesting UI hiding equals security

Improve local draft behavior:

- Save draft locally with visible save state
- Show saved on this device
- Show not submitted yet
- Disable final submission when offline unless explicitly queued as pending
- Clearly distinguish draft saved from application received

Add reduced stimulation mode:

- Disable ember effects
- Reduce motion
- Reduce toast frequency
- Simplify card density
- Disable nonessential haptics later
- Prefer calm alert panels

Acceptance criteria:

- Prototype is less misleading.
- Serious features feel serious.
- Draft state is honest.
- Offline limitations are clear.
- Users are not encouraged into unsafe assumptions.

## Phase 4 — Target Architecture Branch

Goal: begin the real rebuild without destroying the prototype.

Create a new branch:

```bash
git checkout -b blueprint-nextjs-rebuild
```

Or create a new app directory:

```text
/legacy
  existing Vite prototype

/apps/staff-portal
  new Next.js implementation
```

Recommended path: preserve the current app as `/legacy` or leave it on `main` until the new app reaches feature parity.

### 4.1 Initialize New Stack

Create the new app with:

- Next.js App Router
- TypeScript
- Tailwind CSS
- ESLint
- Prettier
- Supabase client helpers
- Environment variable documentation
- Basic PWA manifest
- App shell layout
- Mobile bottom navigation
- Operational HUD placeholder

### 4.2 Initial App Routes

Suggested route groups:

```text
/app
  /(public)
  /(auth)
  /(candidate)
  /(parent)
  /(staff)
  /(admin)
  /api
```

Suggested top-level areas:

```text
/components
  /ui
  /layout
  /forms
  /lcars
  /content
  /forum
  /profiles
  /training
  /mission-control
  /offline

/lib
  /supabase
  /auth
  /offline
  /validation
  /content
  /safeguarding
  /weather
  /notifications
  /training
  /seasonal-rollover

/hooks
/types
/scripts
/public
  /audio
  /images
  /textures
  /downloads
  /icons
```

### 4.3 Rebuild Salvaged Components

Convert visual concepts into reusable components:

- `<AppShell />`
- `<MobileBottomNav />`
- `<OperationalHUD />`
- `<OfflineStatusBanner />`
- `<EmergencyQuickAction />`
- `<EmergencyReferenceCard />`
- `<MissionControlDashboard />`
- `<ContentCard />`
- `<ContentStatusBadge />`
- `<SearchPanel />`
- `<TrainingModuleCard />`
- `<ChecklistCard />`
- `<ForumThreadCard />`
- `<StaffProfileCard />`
- `<EmberBackground />`

Acceptance criteria:

- New app compiles with TypeScript strict mode.
- Mobile shell exists.
- Supabase client/server helpers are separated.
- No service role key can reach client code.
- App structure matches blueprint direction.
- Legacy concepts are represented as clean React components.

## Phase 5 — Supabase Data Model and RLS

Goal: replace prototype tables with the blueprint data model.

Implement migrations for:

- `profiles`
- `seasons`
- `season_memberships`
- `applications`
- `application_status_events`
- `parent_guardian_links`
- `checklist_templates`
- `checklist_template_items`
- `checklist_progress`
- `content_categories`
- `content_items`
- `content_versions`
- `content_files`
- `leadership_contacts`
- `camp_contact_info`
- `emergency_references`
- `training_modules`
- `training_progress`
- `songbook_items`
- `audio_tracks`
- `forum_categories`
- `forum_threads`
- `forum_posts`
- `forum_moderation_events`
- `staff_profiles`
- `app_settings`
- `notification_settings`
- `notification_log`
- `weather_alert_cache`
- `audit_log`

Required RLS behavior:

Candidates:

- Read/update only own profile
- Create/update only own draft application
- Read own application status
- Cannot view other candidates
- Cannot access staff forum unless hired/onboarding

Parent/Guardian users:

- Read only linked child's relevant data
- Complete parent/guardian actions
- Cannot access staff forum
- Cannot browse staff directory
- Cannot access unrelated minor records

Staff:

- Read published staff content
- Access forum after hired/onboarding status
- Update own checklist/training progress
- View approved staff profiles according to visibility rules
- Cannot view candidate applications by default
- Cannot access admin tools

Youth Staff:

- Access appropriate staff content
- Cannot access adult-only/admin-only areas
- Use stricter profile privacy defaults

Admins:

- Manage applications, content, forums, profiles, checklists, training, settings, and rollover according to granted permissions
- All sensitive actions logged

System Administrators:

- Manage technical configuration and elevated access

Acceptance criteria:

- RLS enabled on every sensitive table.
- Unauthorized direct database reads fail.
- Admin actions are logged.
- Role changes are auditable.
- Forum access is database-enforced.
- Candidate/application records are protected.
- Parent/guardian access is child-specific.

## Phase 6 — Structured Handbook Importer

Goal: convert handbook JSON into normalized records.

The importer should:

1. Read the source JSON.
2. Validate top-level structure.
3. Preserve source path.
4. Convert keys into readable titles.
5. Infer content type from source path.
6. Infer offline priority.
7. Insert/upsert records.
8. Preserve stable slugs.
9. Attach season metadata.
10. Log skipped or ambiguous entries.
11. Produce an import report.
12. Avoid duplicate records when rerun.

Map content into:

- `content_items`
- `emergency_references`
- `checklist_templates`
- `checklist_template_items`
- `training_modules`
- `songbook_items`
- `leadership_contacts`
- `camp_contact_info`

Mark these as critical offline:

- Emergency alarm procedures
- Missing person / Code Blue
- Severe weather
- Lightning
- Fire safety
- Wildlife safety
- Armed intruder
- Fatality protocol
- Safeguarding youth
- Mandatory reporting
- Code of conduct
- Zero-tolerance dismissal rules

Acceptance criteria:

- Handbook imports successfully.
- Leadership directory becomes editable season data.
- Camp address becomes editable contact data.
- Policies become searchable records.
- Emergency sections become quick-reference cards.
- Onboarding sections become checklists.
- Safeguarding/emergency content is marked critical offline.
- Imported content can later be edited through WYSIWYG tools.
- Staff can search imported content offline.

## Phase 7 — Mission Control Dashboards

Goal: dashboards change based on role and staff status.

Candidate dashboard shows:

- Continue application
- Application status
- Download paper application
- Scout office submission instructions
- Contact/help information
- Next steps

Parent/Guardian dashboard shows:

- Linked child application status
- Signature requests
- Required forms
- Deadlines
- Packing list
- Staff week logistics
- Camp contact information

Hired/onboarding staff dashboard shows:

- Paperwork checklist
- Training checklist
- Gear checklist
- Medical form reminders
- Staff week expectations
- Handbook preview
- Forum onboarding areas
- Important dates

Active staff dashboard shows:

- Handbook
- Policies
- Songbook
- Forum
- Staff profiles
- Timeline
- Emergency references
- Camp announcements
- Weather/fire status
- Quick search
- Training modules

Admin dashboard shows:

- Application queue
- Candidate review
- Status updates
- Review notes
- Print packet
- Staff role management
- Forum moderation
- Profile approval
- Content editor
- File manager
- Timeline editor
- Checklist editor
- Training module editor
- Notification settings
- Audit log
- Season rollover
- System health/sync status

Acceptance criteria:

- Dashboard matches authenticated user state.
- Staff have fast access to emergency references.
- Candidates are not shown staff-only tools.
- Parent/guardian users have narrow child-specific access.
- Admins can reach review/moderation/content tools quickly.

## Phase 8 — Offline System and Search

Goal: make the app genuinely useful offline.

After first sync:

- App shell launches offline
- Handbook opens offline
- Emergency references open offline
- Safeguarding references open offline
- Search works offline
- Checklists remain usable
- Required offline training modules remain available
- Cached PDF opens if downloaded
- Offline/stale labels are visible
- Sync state is honest

Offline search should include:

- Handbook articles
- Policies
- Emergency references
- Safeguarding references
- Songbook items
- Training references
- Checklists
- Camp address/contact info
- Leadership contacts, if permitted

Search weighting:

1. Emergency
2. Safeguarding
3. Policy
4. Checklist
5. Handbook
6. Training
7. Songbook
8. People/contact, if permitted

Acceptance criteria:

- Staff can find key policies in airplane mode.
- Emergency results appear first when relevant.
- Results show category and last updated date.
- Cached state is visible.
- Search does not require a server round trip for core content.

## Phase 9 — Application, Parent/Guardian, and Admin Review

Goal: build the full application system safely.

Candidate flow:

- Create account
- Verify email or magic link
- Enter Candidate Dashboard
- Start/resume application
- Save drafts locally and server-side
- Submit only when connected
- Download paper fallback
- See status updates

Parent/Guardian flow:

- Minor enters parent/guardian email
- System sends invite
- Parent/guardian verifies account
- Parent links only to that minor
- Parent completes required actions
- Admin can correct links if needed

Admin review flow:

- View application queue
- Search/filter candidates
- View application
- Add review notes
- Change status
- Print packet
- Export CSV if approved
- Track parent/guardian signature status
- Promote candidate to hired/onboarding staff

Acceptance criteria:

- Candidates cannot lose drafts due to weak signal.
- Offline drafts are never falsely shown as submitted.
- Paper/PDF fallback is easy to find.
- Parent/guardian access is child-specific.
- Admin review is auditable.
- New application is required each season.

## Phase 10 — Forum and Staff Profiles

Goal: create safe operational communication.

Forum requirements:

- Staff-only access
- Hired/onboarding/active staff only
- Candidates cannot access
- Parent/guardian users cannot access
- No private messages
- No anonymous posting
- No disappearing messages
- Moderation tools before launch
- Admin-only announcements
- Configurable posting rules
- Logged moderation events

Profile requirements:

- Minor profiles restricted by default
- Optional photo/bio approval
- No personal contact info
- No exact birthdates
- No social media handles
- Visibility controlled by role/status/classification

Acceptance criteria:

- Staff-only access works.
- Forum permissions are database-enforced.
- Admins can moderate quickly.
- Minor profiles are protected by default.
- No hidden one-on-one adult/youth communication is possible.

## Phase 11 — Training Modules and Games

Goal: make training engaging without turning safety into a toy.

Supported module types:

- Scenario cards
- Quick quizzes
- Branching decisions
- Matching games
- Sequencing games
- Flashcards
- Animated explainers
- Checklist walkthroughs
- Emergency procedure simulations
- Campfire planning builder
- Wildlife/smellables challenge
- Radio procedure practice
- Safeguarding boundary scenarios
- Program area setup games
- Inspection readiness challenge

Training should be:

- Short
- Practical
- Camp-specific
- Repeatable
- Scenario-based
- Useful for judgment
- Positive but honest

Avoid:

- Addictive streak mechanics
- Public shaming
- Public leaderboards for sensitive topics
- Reward loops that distract from learning
- Making safety topics feel unserious

Acceptance criteria:

- Admins can publish training modules.
- Staff can complete assigned modules.
- Progress syncs when connected.
- Required training can work offline after first sync.
- Reduced motion is respected.

## Phase 12 — Seasonal Rollover

Goal: support returning staff without overwriting history.

Rollover flow:

1. Active Staff
2. Season Closed
3. Staff Access Archived
4. User moved to Returning Candidate
5. Returning Candidate reviews prefilled application
6. Returning Candidate edits changed information
7. Returning Candidate re-acknowledges required sections
8. Returning Candidate submits new season application
9. Admin reviews and promotes user to Hired Staff

Preserve:

- Accounts
- Prior applications
- Completed training history
- Archived forum records
- Admin/System Admin access where appropriate

Reset:

- Seasonal staff status
- Required acknowledgments
- Onboarding checklist
- Seasonal training assignments
- Forum access until rehired/onboarding
- Availability and schedule-specific application sections

Acceptance criteria:

- Prior applications remain preserved.
- Returning staff can start from an editable prefilled draft.
- New application is required every season.
- Admin and IT roles are not accidentally removed.
- Previous forum categories can be archived or locked.

## Phase 13 — Deployment and Validation

Goal: prepare for real use only after safety and governance are ready.

Environments:

- Local development
- Staging
- Production

Launch requirements:

- Separate staging and production Supabase projects or schemas
- Environment variables documented
- Production database protected
- Admin accounts created securely
- RLS tested
- Backups/export process documented
- Error monitoring enabled
- Failed notification logs visible
- Rollback procedure documented
- Migration scripts reproducible

Field testing should validate:

- Bright sunlight
- Weak signal
- No signal
- Older phones
- Low battery
- Teen comprehension
- Older adult usability
- Staff fatigue/stress
- One-handed use

Governance required before real data:

- Official app owner
- Technical administrator
- Who may approve production changes
- Who may access applications
- Who may grant Admin permissions
- Who receives application notifications
- Data retention expectations
- Whether Council legal/HR/risk review is needed
- Whether this is official Council infrastructure, a camp-level pilot, or an internal helper tool

Acceptance criteria:

- Critical flows pass on mobile.
- Offline mode is honest and useful.
- Forum permissions are safe.
- Content editing does not break published pages.
- Leadership can operate the system without developer help.
- Council/camp approval exists before launch with real data.

## Recommended MVP Build Order

### MVP 1 — Foundation

- Next.js app shell
- Supabase Auth
- Profiles
- Roles/status
- Basic RLS
- Mobile layout
- PWA install basics

### MVP 2 — Application System

- Candidate accounts
- Online application wizard
- Draft saving
- Paper PDF fallback
- Admin review
- Print packet
- Application notifications

### MVP 3 — Handbook Offline Core

- Handbook JSON importer
- Structured content tables
- WYSIWYG editing
- Published content pages
- Offline cache
- Offline search
- Current handbook PDF

### MVP 4 — Staff Onboarding

- Staff promotion
- Onboarding dashboard
- Paperwork checklist
- Packing checklist
- Training checklist
- Progress sync

### MVP 5 — Forum and Profiles

- Staff-only forum
- Announcements
- Moderation tools
- Staff profiles
- Minor privacy defaults
- Admin settings

### MVP 6 — Training and Mobile Enhancements

- Training modules
- Games/quizzes
- Audio player
- Push notifications
- Haptics
- Reduced stimulation controls

### MVP 7 — Seasonal Operations

- Season model
- Rollover tool
- Returning staff prefill
- Archived forum/content
- New-season templates

## Immediate Next PR Recommendation

The first implementation PR should not try to rebuild the app.

Recommended first PR:

**Title:** `docs: add blueprint overhaul and legacy salvage plan`

Include:

- `docs/BLUEPRINT_OVERHAUL_PLAN.md`
- `docs/LEGACY_SALVAGE_REPORT.md`
- `docs/MVP_BUILD_ORDER.md`
- Update `README.md` with:
  - prototype status
  - blueprint direction
  - warning that current app is not production-ready for real candidate/staff data
  - link to overhaul docs

This gives the project a clear map before code churn begins.

## Second PR Recommendation

**Title:** `content: restructure handbook seed data around blueprint content model`

Include:

- New structured local content seed
- Generated search records
- Emergency reference seed records
- Checklist seed records
- Training module seed records
- Songbook seed records
- Leadership/contact seed records
- Updated dashboard copy
- Updated forum safety copy
- Updated profile privacy copy

This lets the existing prototype begin behaving like the blueprint while the full Next.js rebuild is planned.

## Third PR Recommendation

**Title:** `prototype: add honest offline and stale data states`

Include:

- Offline status banner
- Cached/stale labels
- Draft save status
- Last updated timestamps
- Weather/fire disclaimer
- Emergency reference disclaimer
- Reduced stimulation toggle placeholder

## Final Definition of Done

The overhaul is complete when:

- Candidates can create accounts and apply online.
- The full official application content is represented digitally.
- Candidates can download or print a paper fallback.
- Parent/guardian accounts can be enabled for minor-related tasks.
- Admins can review, print, and manage applications.
- Hired staff can access onboarding.
- Active staff can use handbook, policies, songbook, training, forum, profiles, and emergency references.
- Handbook content works offline after first sync.
- Offline search works.
- Required emergency and safeguarding content is cached offline.
- Updates and alerts refresh when connected.
- Stale information is clearly labeled.
- Forum is staff-only and moderated.
- Announcements are Admin-only.
- Forum posting permissions are configurable.
- No private direct messaging exists.
- Minor profiles are privacy-restricted by default.
- WYSIWYG content editing supports images and files.
- Training modules support interactive games and animations.
- Push notifications are opt-in and configurable.
- Haptics are subtle, optional, and gracefully degraded.
- Reduced motion and reduced stimulation settings are respected.
- Seasonal rollover preserves accounts and prior applications.
- Returning staff can edit and resubmit prefilled applications.
- RLS protects candidate, staff, parent, and admin data.
- The app is readable, calm, mobile-first, and subtly LCARS-inspired.
- The app has been tested under realistic Camp Lawton conditions.

## Bottom Line

The existing repo should not be thrown away.

It contains useful product instincts, Camp Lawton flavor, and prototype experiments.

But the blueprint requires a real architecture shift.

The right move is:

1. Document the overhaul.
2. Salvage the good ideas.
3. Replace the content model.
4. Harden the prototype.
5. Rebuild the production app on the correct stack.
6. Launch only after security, safeguarding, offline behavior, and governance are ready.
