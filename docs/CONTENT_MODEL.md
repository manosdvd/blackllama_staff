# Content Model

## Overview
The staff portal relies on a relational data model in Supabase to maintain dynamic operational data rather than static markdown files.

## Key Schemas

### 1. `profiles`
- `id` (uuid, PK, references `auth.users`)
- `role` (enum: Candidate, Staff, Admin)
- `first_name`, `last_name`, `phone`

### 2. `content_categories`
- `id` (uuid, PK)
- `name` (text, unique)
- `description` (text)

### 3. `content_items` (Wiki/Handbook)
- `id` (uuid, PK)
- `slug` (text, unique)
- `title` (text)
- `category_id` (references `content_categories`)
- `tags`, `aliases` (text array)
- `offline_priority` (int)

### 4. `content_versions`
- `id` (uuid, PK)
- `item_id` (references `content_items`)
- `version_no` (int)
- `content` (text, markdown)
- `created_at` (timestamp)

### 5. `camp_alerts`
- `id` (uuid, PK)
- `title` (text)
- `description` (text)
- `severity` (enum: Info, Warning, Severe)
- `is_active` (boolean)
