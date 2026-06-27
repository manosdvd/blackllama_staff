# Camp Lawton Staff Portal

This repository currently contains the prototype for the Camp Lawton Staff Portal.

The long-term goal is a real-world, mobile-first, offline-first Progressive Web Application for Camp Lawton staff recruitment, onboarding, handbook access, training, emergency references, staff communication, parent/guardian support, admin review, and seasonal operations.

## Current Status

This app is a working prototype, not the final production architecture.

It currently includes useful experiments and early implementations for:

- Camp Lawton visual identity
- Staff dashboard concepts
- Handbook/course content
- Policy and emergency reference sections
- Global search
- Weather/alert banner concepts
- Floating emergency button
- Training interactions
- Application wizard prototype
- Staff forum prototype
- Staff directory prototype
- Early Supabase and Netlify function integration

These pieces should be treated as salvageable concept work.

## Important Safety Notice

Do not use the current app to collect real staff, candidate, parent/guardian, medical, or application data yet.

The current prototype is not yet ready for production use because it still needs:

- A rebuilt mobile-first/offline-first architecture
- Stronger Supabase Row-Level Security policies
- A normalized content and handbook data model
- Safer staff forum permissions
- Minor privacy protections
- Parent/guardian account controls
- Proper application review workflows
- Audit logging
- Offline/stale data indicators
- Council/camp governance decisions before launch

This is especially important because the intended final product is youth-serving operational software.

## Blueprint Direction

The target system should eventually use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase PostgreSQL
- Supabase Row-Level Security
- Supabase Storage
- IndexedDB for offline/local-first data
- Service worker/PWA support
- Offline search
- WYSIWYG content editing
- Role-based dashboards
- Staff-only moderated forum
- Parent/guardian support
- Seasonal rollover tools

The current Vite app should not be patched indefinitely into the final architecture. It should be used as a prototype and reference while the blueprint architecture is planned and built.

## Product North Star

The finished app should feel like:

> Camp Lawton in your pocket: practical, rugged, warm, clear, a little stylish, and ready when the signal dies.

It should help:

- Candidates apply without losing work
- Staff find handbook and policy answers quickly
- Staff access emergency and safeguarding references offline
- Admins review applications and manage onboarding
- Parent/guardian users complete minor-related requirements safely
- Leadership communicate without unsafe private messaging
- Returning staff reapply each season without retyping everything from scratch

## Documentation

Start here:

- [`docs/BLUEPRINT_OVERHAUL_PLAN.md`](docs/BLUEPRINT_OVERHAUL_PLAN.md)
- [`docs/LEGACY_SALVAGE_REPORT.md`](docs/LEGACY_SALVAGE_REPORT.md)

Current transitional scaffold:

- [`src/data/contentSeed.js`](src/data/contentSeed.js)

Recommended next documentation additions:

- `docs/TARGET_ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/SECURITY_AND_SAFEGUARDING.md`
- `docs/MVP_BUILD_ORDER.md`

## Development

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Preview build:

```bash
npm run preview
```

## Backend Setup

See [`SETUP.md`](SETUP.md) for the current prototype Supabase and Netlify setup notes.

That setup is useful for prototype testing, but it should not be considered the final backend model for production use.

## Recommended Next Steps

1. Restructure handbook/content seed data around the blueprint content model.
2. Add honest offline/stale/draft state indicators to the prototype.
3. Add a target architecture document.
4. Add a security and safeguarding document.
5. Begin a Next.js/TypeScript/Tailwind rebuild branch or app directory.
6. Implement the Supabase data model and RLS policies from the blueprint.
7. Validate security, safeguarding, offline behavior, and governance before any real launch.

## Bottom Line

Keep the good instincts from this prototype.

Do not trust the prototype as production infrastructure yet.

The blueprint is the source of truth moving forward.
