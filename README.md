# Varmina Joyas - Luxury Jewelry E-Commerce

A modern, production-ready jewelry e-commerce platform built with React, TypeScript, Vite, and Supabase.

## Features

- ✨ **Public Catalog**: Beautiful product showcase with filtering and search
- 🔐 **Admin Dashboard**: Secure admin panel for inventory management
- 📸 **Image Upload**: Real-time image upload to Supabase Storage
- 🌓 **Dark Mode**: Elegant dark/light theme toggle
- 💱 **Currency Toggle**: CLP/USD currency switching
- 🔒 **Row Level Security**: Secure database with RLS policies
- 📱 **Responsive Design**: Mobile-first, fully responsive UI

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ installed
- Supabase account
- Vercel account (for deployment)

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

The database schema needs to be created with:
- `products` table with RLS policies
- `profiles` table for role-based access
- `product-images` storage bucket
- Proper indexes and triggers

### 4. Create Admin User

Go to your Supabase dashboard and create an admin user:
1. Navigate to Authentication > Users
2. Click "Add user"
3. Enter email and password
4. Save

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Deployment to Vercel

### Option 1: Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Option 2: Vercel Dashboard

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

## Project Structure

```
Varmina/
├── components/          # Reusable UI components
│   └── UI.tsx          # Button, Input, Modal, Toast, etc.
├── context/            # React Context providers
│   └── StoreContext.tsx # Global state management
├── lib/                # Core libraries
│   └── supabase.ts     # Supabase client configuration
├── pages/              # Page components
│   ├── AdminDashboard.tsx
│   ├── LoginPage.tsx
│   └── PublicCatalog.tsx
├── services/           # API services
│   ├── authService.ts
│   └── supabaseProductService.ts
├── types/              # TypeScript types
│   ├── database.ts     # Supabase database types
│   └── types.ts        # App types
├── .env.local          # Local environment variables
├── .env.example        # Example environment file
├── vercel.json         # Vercel configuration
└── index.html          # Entry HTML file
```

## Admin Access

- Navigate to `/admin`
- Login with your Supabase user credentials
- Manage products, upload images, update inventory

## Database Schema

### Products Table

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(12, 2) NOT NULL,
  images TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'Disponible',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Storage Bucket

- **Name**: `product-images`
- **Public**: Yes
- **File size limit**: 50MB
- **Allowed MIME types**: image/*

## Security

- Row Level Security (RLS) enabled on all tables
- Public read access for products
- Authenticated-only write access
- Secure image upload with validation
- Session-based authentication

## Performance Optimizations

- Image optimization via Supabase CDN
- Lazy loading for images
- Efficient database queries with indexes
- Minimal bundle size with Vite

## Support

For issues or questions, contact the development team.

## License

© 2026 Varmina Joyas. All rights reserved.
