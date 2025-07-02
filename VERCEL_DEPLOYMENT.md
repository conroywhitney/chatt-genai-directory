# Vercel Environment Variables Setup

When deploying to Vercel, add these environment variables in your Vercel dashboard:

## Required for Production:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## ⚠️ SECURITY NOTE:

- **NEVER** commit the service role key to git or expose it publicly
- Only use the anon key for client-side operations
- Get your actual values from your Supabase project dashboard > Settings > API

## Add via Vercel CLI:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## Or via Vercel Dashboard:

1. Go to your project settings → Environment Variables
2. Add the variables above with your actual values from Supabase
3. Deploy!

## Getting Your Supabase Keys:

1. Go to your Supabase project dashboard
2. Settings → API
3. Copy the Project URL and anon/public key (NOT the service_role key)
