# GitHub Auto-Push Setup Guide

## Step 1: Create GitHub Personal Access Token

1. Go to GitHub Settings: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: `Toolkit-Generator-Auto-Push`
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
5. Click "Generate token"
6. **COPY THE TOKEN** - you won't see it again!

## Step 2: Add Token to Supabase

1. Go to your Supabase project dashboard
2. Navigate to: **Project Settings** → **Edge Functions** → **Secrets**
3. Add these secrets:
   - Name: `GITHUB_TOKEN`
     Value: `your_github_token_here`
   
   - Name: `GITHUB_USERNAME`
     Value: `SAZZAD-404`
   
   - Name: `GITHUB_REPO`
     Value: `Toolkit-Generator`

## Step 3: Deploy Edge Function

Run this command in your terminal:

```bash
npx supabase functions deploy push-to-github
```

Or if you have Supabase CLI installed:

```bash
supabase functions deploy push-to-github
```

## Step 4: Test

1. Open your admin panel
2. Edit a file in Code Editor
3. Click "Save"
4. Check the "Push to GitHub" checkbox
5. Save the file
6. Check your GitHub repository - the file should be updated!

## Troubleshooting

### Error: "GitHub token not configured"
- Make sure you added the `GITHUB_TOKEN` secret in Supabase

### Error: "404 Not Found"
- Check that `GITHUB_USERNAME` and `GITHUB_REPO` are correct
- Make sure the repository exists and is accessible

### Error: "403 Forbidden"
- Your GitHub token might not have the right permissions
- Regenerate the token with `repo` scope

### Error: "422 Unprocessable Entity"
- The file path might be incorrect
- Check that the file path in database matches the actual file path in repo

## Security Notes

- Never commit your GitHub token to the repository
- Keep the token in Supabase secrets only
- The token has full access to your repositories, so keep it secure
- You can revoke the token anytime from GitHub settings
