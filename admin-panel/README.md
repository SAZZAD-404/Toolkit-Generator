# Toolkit Generators - Admin Panel

Professional admin panel for managing Toolkit Generators data using Supabase.

## Features

- 🔐 Secure authentication with Supabase Auth
- 📊 Dashboard overview with statistics
- 👤 User Agents management (CRUD operations)
- 📧 Email Domains management
- 📞 Phone Area Codes management
- 🔍 Search and filter functionality
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS

## Setup Instructions

### 1. Supabase Setup

1. Go to [Supabase](https://supabase.com) and create an account
2. Create a new project
3. Go to SQL Editor and run the `supabase-schema.sql` file from the root directory
4. Go to Settings → API to get your credentials:
   - Project URL
   - Anon/Public Key

### 2. Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 3. Install Dependencies

```bash
cd admin-panel
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

The admin panel will open at `http://localhost:3001`

### 5. Create Admin User

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User" → "Create new user"
3. Enter email and password
4. Use these credentials to login to the admin panel

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder. Deploy to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting

## Deployment

### Netlify

1. Push admin-panel folder to GitHub
2. Connect to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables in Netlify dashboard

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Framework: Vite
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add environment variables

## Security Notes

- Never commit `.env` file
- Keep Supabase credentials secure
- Use Row Level Security (RLS) policies
- Only authenticated users can modify data
- Public users can only read data

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Supabase (Database + Auth)
- Lucide React (Icons)

## Support

For issues or questions, contact the developer.
