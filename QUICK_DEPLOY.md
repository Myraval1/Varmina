# ⚡ Quick Deploy Reference

## 🚀 Deploy to Vercel (5 Minutes)

### Option 1: Vercel Dashboard (Easiest)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Production ready"
   git push
   ```

2. **Import in Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Add Environment Variables**
   ```
   VITE_SUPABASE_URL=https://kcqgowdeihvzkbbsyhji.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjcWdvd2RlaWh2emtiYnN5aGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0OTY3MzgsImV4cCI6MjA4NjA3MjczOH0.joYc7gHTk2rfpYKLW9vs_5ds5TZ-3hxHNEX9RBEB3yA
   ```

4. **Deploy** 🎉

### Option 2: Vercel CLI (Fastest)

```bash
# Install CLI
npm i -g vercel

# Deploy
vercel

# Add env vars in dashboard, then:
vercel --prod
```

## 👤 Create Admin User (2 Minutes)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/kcqgowdeihvzkbbsyhji/auth/users)
2. Click **"Add user"**
3. Email: `admin@varmina.com`
4. Password: (strong password)
5. ✅ Auto Confirm User
6. **Create user**

## 📦 Add First Product (3 Minutes)

1. Go to `your-domain.vercel.app/admin`
2. Login with admin credentials
3. Click **"Agregar Producto"**
4. Fill in:
   - Name: "Collar Diamante"
   - Description: "Elegant diamond necklace"
   - Price: 2500000 (CLP)
   - Status: Disponible
   - Images: Upload 1-4 images
5. **Create**

## 🔗 Important Links

| Resource | URL |
|----------|-----|
| **Supabase Dashboard** | https://supabase.com/dashboard/project/kcqgowdeihvzkbbsyhji |
| **Vercel Dashboard** | https://vercel.com/dashboard |
| **Local Dev** | http://localhost:3000 |
| **Admin Panel** | /admin |

## 📋 Environment Variables

Copy these to Vercel:

```env
VITE_SUPABASE_URL=https://kcqgowdeihvzkbbsyhji.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjcWdvd2RlaWh2emtiYnN5aGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0OTY3MzgsImV4cCI6MjA4NjA3MjczOH0.joYc7gHTk2rfpYKLW9vs_5ds5TZ-3hxHNEX9RBEB3yA
```

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Imported in Vercel
- [ ] Environment variables added
- [ ] First deployment successful
- [ ] Admin user created in Supabase
- [ ] Can login to /admin
- [ ] First product added
- [ ] Public catalog shows product
- [ ] Images loading correctly

## 🆘 Quick Troubleshooting

### Build Fails
```bash
npm run build
# Check for errors
```

### Can't Login
- Verify user is confirmed in Supabase
- Check email/password
- Try incognito mode

### Images Not Uploading
- Check file size < 50MB
- Verify storage bucket is public
- Check browser console for errors

## 📞 Support

- **Documentation**: See README.md, DEPLOYMENT.md, ADMIN_GUIDE.md
- **Supabase**: https://supabase.com/docs
- **Vercel**: https://vercel.com/docs

---

**Ready to deploy?** Run `vercel --prod` 🚀
