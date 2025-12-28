# Database Setup Guide

This guide will help you set up the complete database for the Toolkit Generator project with user authentication and duplicate prevention.

## Prerequisites

1. A Supabase account (https://supabase.com)
2. A new Supabase project created

## Step 1: Environment Variables

Update your `.env` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 2: Database Migrations

Run the following SQL migrations in your Supabase SQL Editor (in order):

### Migration 1: User Data Isolation
Copy and paste the contents of `supabase/migrations/001_user_data_isolation.sql`

### Migration 2: Phone Support
Copy and paste the contents of `supabase/migrations/002_add_phone_support.sql`

### Migration 3: User Profiles
Copy and paste the contents of `supabase/migrations/003_user_profiles.sql`

## Step 3: Authentication Settings

In your Supabase dashboard:

1. Go to Authentication > Settings
2. Enable email confirmations (recommended)
3. Set up your site URL: `https://your-netlify-domain.netlify.app`
4. Add redirect URLs for local development: `http://localhost:5173`

## Step 4: Row Level Security (RLS)

The migrations automatically enable RLS policies that ensure:

- Users can only see their own generated data
- Users can only create/update/delete their own records
- Complete data isolation between users
- No duplicate data within a user's account

## Step 5: Testing

1. Start your development server: `npm run dev`
2. Create a test account
3. Generate some data
4. Verify that:
   - Data is saved to the database
   - No duplicates are created
   - User can only see their own data

## Features Enabled

✅ **User Authentication**
- Sign up with email/password
- Email verification
- Secure login/logout
- User profiles

✅ **Data Isolation**
- Each user sees only their own data
- Complete privacy between users
- Secure data access

✅ **Duplicate Prevention**
- Automatic duplicate detection
- Smart generation algorithms
- Database-level constraints

✅ **Real-time Dashboard**
- Live data counts
- Recent activity tracking
- Performance metrics
- Data type statistics

## Database Schema

### Tables Created:

1. **generated_data** - Stores all generated data with user association
2. **email_history** - Specific table for email generation history
3. **user_profiles** - Additional user profile information

### Security Features:

- Row Level Security (RLS) enabled on all tables
- User-specific data access policies
- Automatic user_id injection
- Secure authentication flow

## Deployment to Netlify

1. Push your code to GitHub
2. Connect your GitHub repo to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy!

Your app will now have:
- Complete user authentication
- Secure data storage
- Duplicate prevention
- Professional dashboard
- Real-time updates

## Troubleshooting

**Issue: "User must be authenticated"**
- Check if user is logged in
- Verify Supabase credentials
- Check RLS policies

**Issue: Duplicates still appearing**
- Verify migration 001 was applied
- Check unique constraints
- Review duplicate prevention logic

**Issue: Data not showing**
- Check user_id filtering
- Verify RLS policies
- Check authentication state