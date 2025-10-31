# GitHub Files Sync Setup

This script will automatically load all files from your GitHub repository into Supabase database, so you can edit them from the admin panel.

## Step 1: Install Dependencies

```bash
npm install @supabase/supabase-js node-fetch
```

## Step 2: Configure the Script

Open `sync-github-files.js` and update these values:

```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // Get from Supabase Dashboard
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Get from Supabase Dashboard
```

### Where to find Supabase credentials:

1. Go to your Supabase project dashboard
2. Click on **Settings** (gear icon)
3. Go to **API** section
4. Copy:
   - **Project URL** → Use as `SUPABASE_URL`
   - **anon public** key → Use as `SUPABASE_KEY`

## Step 3: Run the Sync Script

```bash
node sync-github-files.js
```

This will:
- ✅ Fetch all files from your GitHub repository
- ✅ Filter only code files (.js, .jsx, .ts, .tsx, .css, .html, .json, .md)
- ✅ Skip node_modules, .git, dist, build folders
- ✅ Add new files to database
- ✅ Update existing files
- ✅ Show progress and summary

## Step 4: Verify in Admin Panel

1. Open admin panel: `http://localhost:5173`
2. Login
3. Go to **Code Editor**
4. You should see all your GitHub files in the sidebar!

## Re-sync Files

Run the script again anytime to sync latest changes from GitHub:

```bash
node sync-github-files.js
```

## Customization

### Add more file types:

Edit `ALLOWED_EXTENSIONS` in the script:
```javascript
const ALLOWED_EXTENSIONS = ['.js', '.jsx', '.py', '.java', '.php'];
```

### Exclude more folders:

Edit `EXCLUDED_FOLDERS` in the script:
```javascript
const EXCLUDED_FOLDERS = ['node_modules', '.git', 'dist', 'build', 'temp'];
```

## Troubleshooting

### Error: "GitHub API error"
- Check your GitHub token is valid
- Make sure repository name is correct

### Error: "Supabase error"
- Verify SUPABASE_URL and SUPABASE_KEY are correct
- Check if `code_files` table exists in database

### Files not showing in admin panel
- Run the sync script again
- Check browser console for errors
- Verify files are in database (Supabase Dashboard → Table Editor → code_files)

## Notes

- The script preserves existing files and only updates content
- GitHub token is already configured in the script
- First sync might take a few minutes depending on repository size
- Subsequent syncs are faster (only updates changed files)
