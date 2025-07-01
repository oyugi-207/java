
# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Wait for the project to be set up (usually takes 2-3 minutes)

## 2. Configure Environment Variables

1. Copy `.env.example` to `.env.local`
2. Get your project URL and anon key from your Supabase dashboard:
   - Go to Settings > API
   - Copy the Project URL to `NEXT_PUBLIC_SUPABASE_URL`
   - Copy the anon/public key to `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. Set Up Database Schema

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `lib/database-setup.sql`
4. Run the query to create all tables, policies, and triggers

## 4. Configure Storage (Optional)

If you want to enable avatar uploads:

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `avatars`
3. Make it public by updating the bucket policies:

```sql
-- Allow public access to avatars bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Allow authenticated users to upload avatars
CREATE POLICY "Avatar uploads" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND auth.role() = 'authenticated'
);

-- Allow public access to view avatars
CREATE POLICY "Avatar access" ON storage.objects FOR SELECT USING (
  bucket_id = 'avatars'
);
```

## 5. Configure Authentication

1. Go to Authentication > Settings in your Supabase dashboard
2. Configure your site URL (for local development: `http://localhost:3000`)
3. Configure email templates if needed
4. Enable the auth providers you want to use

## 6. Row Level Security (RLS)

The setup script automatically enables RLS and creates policies to ensure:
- Users can only access data from their own farm
- Proper isolation between different farms
- Secure multi-tenant architecture

## 7. Testing

1. Start your development server: `npm run dev`
2. Try creating a new account
3. Verify that the profile is created automatically
4. Test adding animals, tasks, etc.

## Key Features

- **Multi-tenant**: Each user gets their own farm with isolated data
- **Secure**: Row Level Security ensures data isolation
- **Scalable**: Built on Supabase's PostgreSQL infrastructure
- **Real-time**: Supabase provides real-time subscriptions for live updates
- **Authentication**: Built-in auth with email/password and social providers
- **File Storage**: Integrated file storage for avatars and documents

## Troubleshooting

1. **Environment variables not loaded**: Make sure your `.env.local` file is in the root directory
2. **Database errors**: Check that all tables were created by running the setup SQL
3. **Authentication issues**: Verify your site URL is configured correctly in Supabase
4. **RLS errors**: Make sure you're authenticated and the policies are applied correctly
