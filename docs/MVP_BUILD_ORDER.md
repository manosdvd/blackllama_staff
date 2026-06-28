# MVP Build Order

## Phase 1: Foundation (Current)
- [x] Scaffold Next.js App Router.
- [x] Implement Supabase SSR Authentication.
- [x] Configure Tailwind CSS & global layout.
- [x] Port Global Alerts & Admin Alerts Manager to real PostgreSQL DB.

## Phase 2: Content & Handbook
- [ ] Finalize `content_items` and `content_versions` migrations.
- [ ] Port Wiki/Handbook UI to fetch directly from Supabase Server Components.
- [ ] Implement local offline sync for handbook using IndexedDB.

## Phase 3: Operations & Applications
- [ ] Build multi-step application wizard for candidates.
- [ ] Implement Admin Dashboard for application review and status changes.
- [ ] Build immutable audit logging for admin actions.

## Phase 4: Safeguarding & Final Review
- [ ] Enforce strict RLS on all remaining tables (profiles, applications).
- [ ] Finalize offline state indicators and service worker caching.
- [ ] Perform full security audit against Blueprint requirements.
