# 🏕️ Camp Lawton Staff Portal — Backend Setup Guide

This guide walks you through connecting the app to a real cloud database (Supabase) and deploying the backend API (Netlify Functions).

---

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in / create a free account.
2. Click **"New Project"**.
3. Choose a name (e.g. `camp-lawton-staff`) and set a strong database password. **Save this password somewhere safe.**
4. Choose a region close to your location.
5. Wait ~2 minutes for the project to spin up.

---

## Step 2: Run the Database Migration

1. In your Supabase project dashboard, click **"SQL Editor"** in the left sidebar.
2. Click **"New Query"**.
3. Open the file `supabase/migrations/001_setup.sql` from this project.
4. Copy the entire file content and paste it into the SQL Editor.
5. Click **"Run"** (▶).
6. You should see "Success. No rows returned."

This creates:
- `profiles` table (user roles, status, usernames)
- `applications` table (staff applications)
- Row-Level Security (RLS) policies
- Auto-create-profile trigger on new user signup

---

## Step 3: Get Your API Keys

1. In your Supabase project, go to **Settings → API** in the left sidebar.
2. Copy the following three values:

| Key | Where to find it |
|-----|-----------------|
| **Project URL** | Under "Project URL" — looks like `https://xxxx.supabase.co` |
| **anon key** | Under "Project API keys" → `anon public` |
| **service_role key** | Under "Project API keys" → `service_role` (**keep this secret!**) |

---

## Step 4: Set Environment Variables

### For Local Development (Netlify Dev)
1. Copy `.env.example` to `.env`:
   ```
   cp .env.example .env
   ```
2. Fill in your three values in `.env`.
3. Install the Netlify CLI: `npm install -g netlify-cli`
4. Run locally with: `netlify dev`
   - This starts both the Vite dev server AND the Netlify Functions.
   - The app will be at `http://localhost:8888`

### For Production (Netlify Dashboard)
1. Go to your site on [app.netlify.com](https://app.netlify.com).
2. Navigate to **Site Configuration → Environment Variables**.
3. Add these three variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Redeploy your site (or push a new commit).

---

## Step 5: Create Your First Admin Account

1. Open the app and register a new account with any username/password.
2. Go to your Supabase dashboard → **Table Editor → profiles**.
3. Find your new user row.
4. Click the **role** field and change it to `Admin`.
5. Click **Save**.
6. Log out and log back in — you will now see the Admin Panel in the sidebar.

> **Tip:** After you have your first Admin account, you can promote future admins directly from the Admin panel inside the app without needing the Supabase dashboard.

---

## Architecture Overview

```
Browser (Vite SPA)
    │
    ├── src/services/auth.js        ← AuthService (calls Netlify Functions)
    ├── src/services/apiClient.js   ← Centralized fetch helper
    │
    ▼
Netlify Functions (Node.js serverless)
    ├── auth-register.js            ← POST /api/auth-register
    ├── auth-login.js               ← POST /api/auth-login
    ├── auth-me.js                  ← GET  /api/auth-me
    ├── admin-users.js              ← GET/PATCH/DELETE /api/admin-users
    ├── admin-applications.js       ← GET/POST/PATCH /api/admin-applications
    └── _supabase.js                ← Shared Supabase admin client
    │
    ▼
Supabase (Hosted PostgreSQL)
    ├── auth.users                  ← Built-in auth table
    ├── public.profiles             ← Username, role, status
    └── public.applications         ← Staff applications
```

---

## Troubleshooting

**"Failed to load users. Is Supabase configured?"**
→ Your `SUPABASE_URL`, `SUPABASE_ANON_KEY`, or `SUPABASE_SERVICE_ROLE_KEY` environment variable is missing or wrong.

**Login returns "Invalid username or password" for a new account**
→ Make sure you ran the SQL migration, which creates the auto-profile trigger. Without it, the profile row isn't created on signup.

**Can't see the Admin panel**
→ Your account's role must be `Admin`, `Camp Director`, or `Program Director`. Promote yourself via the Supabase Table Editor (see Step 5).
