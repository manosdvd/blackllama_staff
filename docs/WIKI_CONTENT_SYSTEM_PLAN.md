# Camp Lawton Staff Wiki Content System Plan

## Purpose

This document is the implementation plan for turning the Camp Lawton staff handbook content into a durable, editable staff knowledge base.

The intended result is a **Camp Lawton staff Wikipedia that does not look or feel like Wikipedia**: searchable, structured, friendly, mobile-first, offline-aware, and easy for camp administrators to maintain.

This is a plan for future coding agents and human contributors. Start here before changing the wiki, handbook parser, content seed, or admin editing flow.

## Product Goal

Build a staff knowledge system where users can find answers in three ways:

1. **By category** — broad operational buckets such as onboarding, policies, emergency procedures, campfire, and staff culture.
2. **By section** — nested handbook-style navigation that mirrors how camp staff think about the work.
3. **By search** — fast lookup across titles, headings, body text, tags, aliases, and emergency keywords.

The handbook markdown should provide seed data, not act as the long-term source of truth.

## Current State

The current app already contains useful prototype pieces:

- `staffHandbookCL.md` is the current long-form handbook source.
- `apps/staff-portal/src/scripts/generate-wiki-seed.mjs` reads the handbook and writes `apps/staff-portal/src/data/wiki_seeded.json`.
- `apps/staff-portal/src/app/wiki/page.tsx` renders the seeded wiki articles.
- The current wiki UI supports article selection, category filters, search, editing, revisions, article creation, backlinks, and a connection graph.

The main weakness is persistence and content structure:

- Articles and revisions are stored in browser `localStorage`, so edits are not shared across staff/admin users.
- The seed generator mostly uses broad headings and currently produces large catch-all articles.
- Important lower-level topics can get buried inside long pages.
- The article outline exists, but it should become a real clickable table of contents.
- The wiki needs a backend content model, not just generated JSON plus local browser state.

## Non-Negotiables

- Treat this as youth-serving operational software.
- Do not rely on UI hiding for permissions.
- Do not store canonical wiki/admin content in `localStorage`.
- Do not overwrite admin-edited content during future handbook imports.
- Do not turn every subheading into its own page. Avoid content confetti.
- Do make every important topic reachable by category, section navigation, headings, tags, aliases, and search.
- Do make emergency, safeguarding, and legal references fast to find and available offline.
- Keep the Camp Lawton tone: clear, warm, practical, occasionally funny, never unserious where safety is concerned.

## Information Architecture

Use the uploaded handbook section tree as the initial content map. The major groups should be:

1. **Welcome / General Info**
   - Welcome to Camp Lawton Staff
   - Catalina Council / Camp Lawton Leadership
   - Camp Address

2. **Part 1: Camp Staff Training and Culture**
   - Our Mission & Vision
   - The Core Pillars of Summer Camp
   - The Aims and Methods of Scouting
   - What Makes a Staff?
   - The Chain of Command
   - Staff Expectations
   - Stress Management and Mental Stability
   - Glossary
   - This Is Your Life
   - Customer Service
   - How To Do Your Job
   - Communication: Darmok and Jalad at Tanagra
   - Campfires
   - Performance Fundamentals
   - Leading Songs
   - The Campfire Arc
   - Master of Ceremonies

3. **Part 2: Policies, Procedures, Guidelines, and Laws**
   - Severe Weather Preparedness
   - Safeguarding Youth
   - Policies and Procedures
   - Health and Safety
   - Incident Response Protocols
   - Legal Policies and Information
   - Camp Opening Procedures

4. **Part 3: Campfire Master Class and Songbook**
   - Campfire Master Class
   - How To Write Funny
   - Writing Songs
   - Songbook

5. **Part 4: Onboarding**
   - Onboarding
   - Required Paperwork
   - Packing List
   - Staff Commitment & Code of Conduct

These groups should drive the wiki navigation, but not force every nested heading into a standalone page.

## Page Boundary Rule

Create a standalone page when a topic is likely to be searched for directly, used operationally, or referenced from multiple places.

Good standalone page candidates:

- Phones
- Photography and Social Media
- Drugs, Alcohol, Pornography
- Fraternization
- Severe Weather Preparedness
- Lightning Safety
- Heat & Thermal Stress Mitigation
- Safeguarding Youth
- Mandatory Reporting
- Missing Person / Code Blue
- Bear & Wildlife Safety
- Fire Safety
- Armed Intruder / Active Shooter
- Fatality Protocol
- Packing List
- Required Paperwork
- Code of Conduct
- Camp Address
- Leadership Contacts

Keep topics as subheadings when they are supporting details inside a broader article.

Good subheading candidates:

- Guidelines for Mentoring CITs
- The Aims of Scouting
- The Methods of Scouting
- Meetings
- Sunday Check-in
- Saturday Checkout
- How do you start a song?
- Why do we sing songs?
- Module-level comedy/songwriting lessons, unless the content grows large enough to merit pages

The practical test:

> If a staff member would type the phrase into search while standing in camp, tired, on a phone, and needing a direct answer, strongly consider a standalone page.

## Page Layout Requirements

Each wiki page should have:

- Clear title
- Category badge
- Short summary or “what this page is for” sentence
- Optional emergency/offline badge
- Main article content
- Generated table of contents from headings
- Related articles
- Backlinks, if useful
- Revision metadata for admins
- Tags and aliases for search

### Table of Contents Behavior

Long pages are acceptable only if they are easy to navigate.

The in-page table of contents should:

- Be generated from `##`, `###`, and `####` headings.
- Be sticky on desktop.
- Be collapsible or bottom-sheet style on mobile.
- Jump to headings using stable heading IDs.
- Highlight the current section while scrolling, if practical.
- Remain visible enough that a long page never becomes a scrolling swamp.

This solves the “not confetti, but still accessible” problem.

## Visual Direction

The wiki should not look like a plain Wikipedia clone.

Use the existing Camp Lawton visual identity:

- Field-manual / command-center feel
- Forest, cream, amber, and dark green tones
- Rugged but clean card layouts
- Subtle LCARS-inspired structure only where it helps navigation
- Big touch targets
- Mobile-first spacing
- Strong contrast
- Reduced motion support

Avoid:

- Dense encyclopedia layout
- Tiny body text
- Overly clever animation
- Confetti-style seriousness mismatch
- Excessive graph/network gimmicks as primary navigation

The connection graph can remain as an optional discovery feature, not the main navigation model.

## Backend Content Model

The long-term backend should use normalized Supabase tables or an equivalent shared database model.

Suggested tables:

### `wiki_categories`

- `id`
- `slug`
- `title`
- `description`
- `sort_order`
- `parent_id` nullable, for nested category trees if needed
- `icon` nullable
- `created_at`
- `updated_at`

### `wiki_articles`

- `id`
- `slug`
- `title`
- `summary`
- `category_id`
- `content`
- `content_format` such as `markdown` or future rich-text JSON
- `tags` text array
- `aliases` text array
- `status` draft / published / archived
- `offline_priority` integer
- `sort_order`
- `source_key` nullable, stable key from seed/import mapping
- `seed_source_path` nullable, usually `staffHandbookCL.md`
- `seed_hash` nullable, hash of last imported seed content
- `admin_edited_at` nullable
- `created_by`
- `updated_by`
- `created_at`
- `updated_at`

### `wiki_article_revisions`

- `id`
- `article_id`
- `title`
- `summary`
- `content`
- `content_format`
- `tags`
- `aliases`
- `status`
- `change_note`
- `created_by`
- `created_at`

### `wiki_article_links`

Optional, generated from wiki links and related-article settings.

- `id`
- `source_article_id`
- `target_article_id`
- `link_text`
- `link_type` wiki / related / prerequisite / emergency-reference

### `wiki_import_batches`

Tracks imports from `staffHandbookCL.md` or future source files.

- `id`
- `source_path`
- `source_hash`
- `started_at`
- `completed_at`
- `imported_by`
- `status`
- `notes`

### `wiki_import_candidates`

Used for safe review of future seed imports.

- `id`
- `batch_id`
- `source_key`
- `proposed_slug`
- `proposed_title`
- `proposed_content`
- `proposed_hash`
- `matched_article_id` nullable
- `action` create / update / skip / conflict
- `review_status` pending / accepted / rejected
- `reviewed_by`
- `reviewed_at`

## Import Workflow

The handbook parser should become an importer, not a permanent content authority.

Recommended flow:

1. Parse `staffHandbookCL.md` using the section tree and heading rules.
2. Generate structured article candidates.
3. Assign each candidate a stable `source_key`.
4. Compare candidates against existing database articles.
5. Create missing articles automatically only if safe.
6. Update existing articles only if they have not been admin-edited since the last import.
7. If an article was admin-edited, create an import conflict/candidate instead of overwriting it.
8. Let admins review import diffs.
9. Log the import batch.

Never silently bulldoze admin edits.

## Search Requirements

Search should index:

- Article title
- Summary
- Body content
- Headings
- Tags
- Aliases
- Category title
- Emergency keywords
- Common staff slang or alternate names

Search result cards should show:

- Title
- Category
- Matching heading or snippet
- Emergency/offline badge if relevant
- Tags

Search should work offline after first successful sync for critical published content.

## Admin Editing Requirements

Admins need an intuitive editing system, not just raw JSON.

Minimum admin features:

- Create article
- Edit title, summary, category, content, tags, aliases, offline priority, and status
- Preview article before publishing
- Auto-generate and preview table of contents
- Draft / published / archived status
- Revision history
- Restore previous revision
- Related article picker
- Link picker for wiki links
- Import conflict review
- Clear “last updated” and “updated by” metadata

Avoid making admins edit seed files manually once the backend exists.

## Permissions and Safety

Use role-based permissions enforced at the backend/RLS layer.

Suggested roles:

- Public/unauthenticated: no access unless intentionally allowed for recruitment content
- Staff: read published staff wiki content
- Junior staff: read published content, no editing
- Area director: propose edits or edit limited categories if approved
- Camp admin: full wiki editing and publishing
- System/admin owner: import tools, schema migration, emergency publishing

Safety content, safeguarding content, and emergency procedures should have stricter review expectations before publishing.

## Offline Behavior

Critical content should be available offline after first sync.

Offline priority should favor:

- Emergency procedures
- Severe weather
- Fire safety
- Missing person / Code Blue
- Safeguarding youth
- Mandatory reporting
- Medical incident basics
- Camp address/contact info
- Leadership contacts
- Packing list/onboarding essentials
- Songbook/campfire content where useful

Always show stale/offline indicators for content that could be mistaken for live operational status.

The wiki is a reference system. It is not a replacement for official emergency communications.

## Implementation Phases

### Phase 1: Better Seed Split and Navigation

Goal: make the current seeded wiki more usable without pretending the final backend exists.

Tasks:

- Update the seed generator to use the handbook section tree.
- Add explicit category and section metadata.
- Split only direct-search/common-action topics into standalone articles.
- Preserve broad pages with strong subheadings and generated TOCs.
- Add tags and aliases during seed generation.
- Improve the table of contents behavior in the current wiki page.

Acceptance criteria:

- Staff can browse by category and section.
- Long articles have useful in-page navigation.
- Search can find buried topics by heading/tag/alias.
- No excessive page confetti.

### Phase 2: Wiki UX Polish

Goal: make the wiki feel like a Camp Lawton staff field manual.

Tasks:

- Replace flat category filters with a category/section tree.
- Add sticky desktop TOC and mobile TOC drawer.
- Add summary, tags, related links, and emergency/offline visual treatment.
- Improve search result snippets and matching behavior.
- Keep the connection graph optional.

Acceptance criteria:

- The wiki does not visually scream “wiki.”
- Mobile use is comfortable.
- Emergency/safeguarding pages are visually easy to identify.
- Staff can get to common answers quickly.

### Phase 3: Backend Content Model

Goal: stop using local browser state as the canonical wiki backend.

Tasks:

- Add Supabase tables for categories, articles, revisions, imports, and links.
- Add RLS policies.
- Migrate seeded JSON into database records.
- Keep local storage only for safe preferences/cache, not canonical content.
- Add server-side or protected admin actions for writes.

Acceptance criteria:

- Published wiki content is shared across users/devices.
- Admin edits persist in the backend.
- Revisions are stored centrally.
- Unauthorized users cannot write content by bypassing the UI.

### Phase 4: Admin Content Tools

Goal: let actual camp admins maintain the wiki.

Tasks:

- Build admin editor.
- Add preview mode.
- Add revision restore.
- Add draft/publish/archive.
- Add link picker and related page picker.
- Add import candidate/conflict review.

Acceptance criteria:

- Admins can manage content without editing code.
- Admins can recover from mistakes.
- Future handbook imports do not overwrite edited pages silently.

### Phase 5: Offline Search and Sync

Goal: make the wiki useful at camp when signal is unreliable.

Tasks:

- Build offline content cache for published priority content.
- Build or generate a local search index.
- Add stale/offline indicators.
- Make emergency/safeguarding pages reliably available offline after first sync.

Acceptance criteria:

- Critical references open offline after first sync.
- Search works offline for cached content.
- Stale/live status is never ambiguous.

## Antigravity / Coding Agent Work Order

When an agent picks this up, follow this order:

1. Read `README.md` and `docs/BLUEPRINT_OVERHAUL_PLAN.md`.
2. Read this document.
3. Inspect:
   - `staffHandbookCL.md`
   - `apps/staff-portal/src/scripts/generate-wiki-seed.mjs`
   - `apps/staff-portal/src/data/wiki_seeded.json`
   - `apps/staff-portal/src/app/wiki/page.tsx`
   - `apps/staff-portal/src/components/ui/WikiGraph.tsx`
4. Implement Phase 1 first unless explicitly told otherwise.
5. Keep changes small and reviewable.
6. Do not introduce a backend schema casually without RLS and migration planning.
7. Do not replace the whole wiki UI in one giant rewrite unless a human specifically approves that scope.
8. Preserve user-facing Camp Lawton voice, but keep admin/system code boring and maintainable.

## Definition of Done for the First Real Pass

The first good implementation pass should deliver:

- A cleaner seed split based on the handbook section tree.
- A category/section navigation structure.
- A real clickable in-page TOC.
- Improved search tags/aliases/headings.
- No backend claims that are not actually implemented.
- Clear TODOs for the Supabase-backed content system.

That is enough to make the current prototype much more useful while setting up the correct long-term architecture.
