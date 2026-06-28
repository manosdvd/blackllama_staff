# Repository Agent Instructions

This repository is a prototype for the Camp Lawton Staff Portal. Treat it as youth-serving operational software, not a casual demo.

## Start Here

Before making structural changes, read:

1. `README.md`
2. `docs/BLUEPRINT_OVERHAUL_PLAN.md`
3. `docs/WIKI_CONTENT_SYSTEM_PLAN.md` for wiki, handbook, content seed, search, or admin-editing work

## Wiki / Handbook Rule

`staffHandbookCL.md` is seed content only. It should help create initial wiki articles, categories, tags, aliases, and section structure. It should not remain the long-term source of truth once shared admin editing exists.

Do not overwrite admin-edited wiki content during future imports. Build import review/conflict handling instead.

## Backend Rule

Do not use browser `localStorage` as canonical storage for staff, admin, wiki, application, forum, training, or operational data. Local storage/cache may be used only for safe preferences, offline cache, or explicitly non-canonical prototype state.

## Safety Rule

Permissions must be enforced by backend policy, not only by UI hiding. For any Supabase work, plan Row-Level Security before treating a feature as production-ready.

No private direct messaging, hidden adult/youth one-on-one communication, anonymous posting, disappearing messages, or unrestricted minor profile exposure.

## Working Style

Keep changes small and reviewable. Prefer documented incremental improvements over broad rewrites. Run the relevant build/lint checks when code changes are made, and state honestly when checks were not run.
