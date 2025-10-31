# Deploy Admin Panel to Netlify

## Method 1: Netlify Dashboard (Easiest)

### Step 1: Build Admin Panel Locally
```bash
cd admin-panel
npm install
npm run build
```

This creates a `dist` folder with production files.

### Step 2: Deploy to Netlify

1. Go to: https://app.netlify.com/
2. Click **"Add new site"** → **"Deploy manually"**
3. Drag & drop the `admin-panel/dist` folder
4. Wait for deployment (1-2 minutes)
5. You'll get a URL like: `https://random-name-123.netlify.app`

### Step 3: Add Environment Variables

1. Go to your site → **Site settings** → **Environment variables**
2. Add these variables:
   - `VITE_SUPABASE_URL` = `https://ajapwfzkhjukfokwxpks.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqYXB3ZnpraGp1a2Zva3d4cGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MzE1OTYsImV4cCI6MjA3NzUwNzU5Nn0.BAuilK_6KaFb2Pk9JkUDOHx7Co5c_sgQ2KfgPn_uQEg`
   - `VITE_GITHUB_TOKEN` = `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`

3. Click **"Redeploy"** to apply changes

---

## Method 2: Connect GitHub (Auto-Deploy)

### Step 1: Push Admin Panel to GitHub

Already done! ✅

### Step 2: Connect to Netlify

1. Go to: https://app.netlify.com/
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub**
4. Select repository: `SAZZAD-404/Toolkit-Generator`
5. Configure build settings:
   - **Base directory**: `admin-panel`
   - **Build command**: `npm run build`
   - **Publish directory**: `admin-panel/dist`

### Step 3: Add Environment Variables

Same as Method 1, Step 3

### Step 4: Deploy

Click **"Deploy site"** - Netlify will automatically build and deploy!

---

## Method 3: Netlify CLI (Advanced)

### Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Login
```bash
netlify login
```

### Deploy
```bash
cd admin-panel
npm run build
netlify deploy --prod
```

Follow prompts:
- Create new site? **Yes**
- Publish directory? **dist**

---

## Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `admin.yourdomain.com`)
4. Follow DNS setup instructions

---

## Security Tips

### 1. Password Protect (Recommended)

Add to `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/.netlify/functions/auth"
  status = 200
  force = true
  conditions = {Role = ["admin"]}
```

### 2. Restrict Access by IP

In Netlify dashboard:
- Go to **Site settings** → **Access control**
- Enable **"Visitor access control"**
- Add password protection

### 3. Use Environment Variables

Never commit `.env` file! Always use Netlify environment variables.

---

## Troubleshooting

### Build fails?
- Check Node version (use 18+)
- Run `npm install` in admin-panel folder
- Check build logs in Netlify dashboard

### Environment variables not working?
- Make sure variable names start with `VITE_`
- Redeploy after adding variables
- Check browser console for errors

### 404 errors?
- Make sure `netlify.toml` has redirects
- Check publish directory is `dist`

---

## Quick Deploy Commands

```bash
# Build locally
cd admin-panel
npm run build

# Deploy to Netlify (manual)
# Drag admin-panel/dist folder to Netlify dashboard

# Or use CLI
netlify deploy --prod --dir=dist
```

---

## Your Admin Panel URLs

After deployment:
- **Main Site**: https://toolkit-generator.netlify.app (or your custom domain)
- **Admin Panel**: https://admin-toolkit-generator.netlify.app (separate deployment)

You can deploy admin panel as a separate site for better security!

---

**Recommended**: Use Method 2 (GitHub Auto-Deploy) for automatic updates when you push code!
