# Admin Setup Guide

## Creating Your First Admin User

### Method 1: Supabase Dashboard (Recommended)

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)

2. Navigate to **Authentication** → **Users**

3. Click **"Add user"** → **"Create new user"**

4. Fill in the details:
   - **Email**: Your preferred admin email
   - **Password**: Create a strong password (min 8 characters)
   - **Auto Confirm User**: ✅ Check this box

5. Click **"Create user"**

6. Your admin user is now ready!

### Method 2: Using SQL (Advanced)

Run this SQL in the Supabase SQL Editor:

```sql
-- Insert admin user (replace with your email and password)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@example.com',
  crypt('YourSecurePassword123!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

## Logging In

1. Navigate to your app at `/admin`
   - Local: `http://localhost:3000/admin`
   - Production: `https://your-domain.vercel.app/admin`

2. Enter your admin credentials

3. You're in! 🎉

## Support

For technical issues:
- Check the main README.md
- Review DEPLOYMENT.md
- Contact development team

---

**Admin Dashboard**: `/admin`
**Public Catalog**: `/`

---
**Security Note**: Never share your Supabase project URL or Anon keys in public repositories. Use environment variables.
