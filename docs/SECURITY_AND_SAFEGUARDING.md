# Security & Safeguarding Rules

This application serves youth and staff in an operational capacity. Security is paramount and cannot rely on frontend UI hiding.

## Core Rules
1. **No Private Direct Messaging**: All communication features (e.g., Staff Forum) are public to all authenticated staff and monitored by admins.
2. **No Minor Profile Exposure**: Profiles are access-gated. Phone numbers and medical information are heavily restricted via RLS.
3. **Audit Trails**: All admin actions (application approvals, seasonal rollovers, alert creation) must create an immutable audit log.

## Supabase Row-Level Security (RLS)
- **Strict Adherence**: Every table in the `public` schema must have RLS enabled.
- **Role-Based Access**: RLS policies must strictly verify the user's role by joining against the `profiles` table or using custom JWT claims securely mapped from `app_metadata`.
- **No BOLA/IDOR**: Never use `TO authenticated` alone for UPDATE/DELETE. Always enforce an ownership predicate (e.g., `user_id = auth.uid()`).
