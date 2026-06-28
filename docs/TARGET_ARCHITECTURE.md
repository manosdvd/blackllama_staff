# Target Architecture

## Core Stack
- **Framework**: Next.js App Router (React Server Components).
- **Language**: TypeScript for end-to-end type safety.
- **Styling**: Tailwind CSS with Camp Lawton custom rustic theme tokens.
- **Database / Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions).

## Offline-First & Progressive Web App (PWA)
- **Service Worker**: Caches the App Shell and static assets (Tailwind, fonts).
- **IndexedDB**: Used for syncing the Wiki/Handbook and Emergency guidelines for offline access.
- **Offline State**: All stale data (e.g. weather, alerts) MUST be explicitly labeled with "Last synced at [TIME]".

## Data Fetching & State
- **Server Components**: Prefer server-side data fetching using `@supabase/ssr` `createServerClient`.
- **Client Components**: Only use `'use client'` where interactivity is required (e.g. search, global HUD, complex forms).
