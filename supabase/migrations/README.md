# Database Migrations

This directory contains SQL migration files for the user data isolation feature.

## Applying Migrations

### Option 1: Using Supabase CLI (Recommended)

If you have the Supabase CLI installed:

```bash
supabase db push
```

### Option 2: Manual Application via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `001_user_data_isolation.sql`
4. Paste and execute the SQL

### Option 3: Using the Supabase Client

You can also apply migrations programmatically using the Supabase client with appropriate permissions.

## Migration Files

- `001_user_data_isolation.sql` - Creates `generated_data` and `email_history` tables with RLS policies

## Verification

After applying the migration, verify that:
1. Tables `generated_data` and `email_history` exist
2. RLS is enabled on both tables
3. Policies are created and active
4. Indexes are created for performance

You can verify by running:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('generated_data', 'email_history');

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('generated_data', 'email_history');

-- Check policies
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('generated_data', 'email_history');
```
