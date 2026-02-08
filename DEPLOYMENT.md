# Deployment Guide - Varmina Joyas

## Pre-Deployment Checklist

- [x] Supabase project created
- [x] Database schema migrated
- [x] Storage bucket configured
- [x] RLS policies enabled
- [ ] Admin user created in Supabase Auth
- [ ] Environment variables ready
- [ ] Code pushed to GitHub

## Step-by-Step Vercel Deployment

### 1. Prepare Your Repository

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Production-ready Varmina Joyas app"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/varmina-joyas.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variables:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

6. Click "Deploy"

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? varmina-joyas
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add VITE_SUPABASE_URL
# Paste: your_supabase_project_url

vercel env add VITE_SUPABASE_ANON_KEY
# Paste your anon key

# Deploy to production
vercel --prod
```

### 3. Create Admin User

After deployment, create an admin user in Supabase:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** > **Users**
4. Click **"Add user"** > **"Create new user"**
5. Enter:
   - **Email**: your_email@example.com
   - **Password**: Create a strong password
   - **Auto Confirm User**: Yes
6. Click **"Create user"**

### 4. Test Your Deployment

1. Visit your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Check the public catalog loads
3. Navigate to `/admin`
4. Login with your admin credentials
5. Test creating a product with image upload

### 5. Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click **"Settings"** > **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions
5. Wait for SSL certificate provisioning
6. Done! 🎉

## Post-Deployment

### Add Sample Products

Use the admin dashboard to add your first products:

1. Login to `/admin`
2. Click "Agregar Producto"
3. Fill in product details
4. Upload high-quality images
5. Set appropriate status
6. Save

### Monitor Performance

- Check Vercel Analytics for traffic
- Monitor Supabase dashboard for database usage
- Review Storage usage for images

### Backup Strategy

1. **Database**: Supabase automatically backs up your database
2. **Images**: Stored in Supabase Storage with redundancy
3. **Code**: Version controlled in GitHub

## Troubleshooting

### Build Fails

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Environment Variables Not Working

- Ensure variables start with `VITE_`
- Redeploy after adding environment variables
- Check Vercel deployment logs

### Images Not Uploading

- Verify storage bucket is public
- Check RLS policies are correct
- Ensure file size is under 50MB

### Authentication Issues

- Verify Supabase URL and anon key are correct
- Check user is confirmed in Supabase Auth
- Clear browser cache and cookies

## Security Checklist

- [x] RLS policies enabled on products table
- [x] Storage policies configured
- [x] Environment variables in Vercel (not in code)
- [x] HTTPS enabled (automatic with Vercel)
- [ ] Admin user password is strong
- [ ] Regular security updates

## Maintenance

### Update Dependencies

```bash
npm update
npm audit fix
```

### Database Migrations

Use Supabase dashboard or SQL editor for schema changes.

### Monitoring

- Set up Vercel alerts for deployment failures
- Monitor Supabase usage in dashboard
- Review error logs regularly

## Support

For deployment issues:
1. Check Vercel deployment logs
2. Review Supabase logs
3. Consult documentation
4. Contact support if needed

---

**Deployment Status**: Ready for production ✅
**Last Updated**: February 2026
