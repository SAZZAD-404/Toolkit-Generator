# Fix Row-Level Security (RLS) Issue

The sync script is failing because of Supabase Row-Level Security policies. Here are two solutions:

## Solution 1: Disable RLS (Quick & Easy)

1. Go to Supabase Dashboard
2. Click on **Table Editor**
3. Select `code_files` table
4. Click on the shield icon (RLS) at the top
5. Click **Disable RLS**
6. Run sync again: `npm run sync-github`

## Solution 2: Add Policy (Recommended for Production)

1. Go to Supabase Dashboard
2. Click on **Authentication** → **Policies**
3. Find `code_files` table
4. Click **New Policy**
5. Choose **Full customization**
6. Policy name: `Allow service role full access`
7. Target roles: `service_role`
8. Policy definition:
   ```sql
   true
   ```
9. Check all operations: SELECT, INSERT, UPDATE, DELETE
10. Click **Save**

## Solution 3: Use Service Role Key (For Script Only)

1. Go to Supabase Dashboard → Settings → API
2. Copy the **service_role** key (NOT the anon key)
3. Create a file `.env` in project root:
   ```
   SUPABASE_SERVICE_KEY=your_service_role_key_here
   ```
4. Update `sync-github-files.js` to use service key
5. Run sync again

## Quick Fix (Temporary)

Run this SQL in Supabase SQL Editor:

```sql
-- Disable RLS for code_files table
ALTER TABLE code_files DISABLE ROW LEVEL SECURITY;

-- Or add a permissive policy
CREATE POLICY "Allow all operations" ON code_files
FOR ALL
USING (true)
WITH CHECK (true);
```

After fixing, run: `npm run sync-github`
