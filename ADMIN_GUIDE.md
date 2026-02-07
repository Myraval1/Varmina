# Admin Setup Guide

## Creating Your First Admin User

### Method 1: Supabase Dashboard (Recommended)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/kcqgowdeihvzkbbsyhji)

2. Navigate to **Authentication** → **Users**

3. Click **"Add user"** → **"Create new user"**

4. Fill in the details:
   - **Email**: `admin@varmina.com` (or your preferred email)
   - **Password**: Create a strong password (min 8 characters)
   - **Auto Confirm User**: ✅ Check this box
   - **Email Confirm**: ✅ Check this box

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
  'admin@varmina.com',
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

## First Steps After Login

### 1. Add Your First Product

1. Click **"Agregar Producto"** button
2. Fill in product details:
   - **Name**: e.g., "Collar Diamante Eterno"
   - **Description**: Detailed product description
   - **Price**: In CLP (e.g., 2500000 for $2,500,000 CLP)
   - **Status**: Choose from:
     - ✅ **Disponible** (In Stock)
     - 🔨 **Por Encargo** (Made to Order)
     - ❌ **Agotado** (Sold Out)
   - **Images**: Upload 1-4 high-quality images

3. Click **"Crear"**

### 2. Manage Existing Products

- **Edit**: Click the ✏️ icon to update product details
- **Delete**: Click the 🗑️ icon to remove a product
- **View**: All products are displayed in the table

### 3. Image Guidelines

For best results:
- **Format**: JPG, PNG, or WebP
- **Size**: Max 50MB per image
- **Dimensions**: Minimum 800x800px
- **Aspect Ratio**: Square (1:1) recommended
- **Quality**: High resolution for zoom functionality

### 4. Pricing Tips

- Prices are stored in CLP (Chilean Pesos)
- The public catalog automatically converts to USD
- Use whole numbers (no decimals needed for CLP)
- Example: 2500000 = $2,500,000 CLP

## Security Best Practices

### Password Requirements

- Minimum 8 characters
- Include uppercase and lowercase letters
- Include numbers
- Include special characters
- Don't reuse passwords

### Session Management

- Sessions last 1 hour by default
- Auto-refresh keeps you logged in
- Click "Cerrar Sesión" to logout manually
- Sessions are stored securely in browser

### Account Security

- Never share your admin credentials
- Use a password manager
- Enable 2FA in Supabase (optional)
- Regularly update your password

## Troubleshooting

### Can't Login?

1. **Check email/password**: Ensure they're correct
2. **User confirmed?**: Check Supabase dashboard
3. **Clear cache**: Try incognito mode
4. **Reset password**: Use Supabase password reset

### Images Not Uploading?

1. **File size**: Must be under 50MB
2. **File type**: Only images allowed
3. **Connection**: Check internet connection
4. **Storage quota**: Check Supabase storage limits

### Products Not Saving?

1. **Required fields**: Name and price are required
2. **Price validation**: Must be greater than 0
3. **Images**: At least one image required
4. **Network**: Check console for errors

## Advanced Features

### Bulk Operations

Currently, products must be added one at a time. For bulk imports, contact support.

### Image Optimization

Images are automatically optimized by Supabase CDN:
- Automatic format conversion
- Responsive sizing
- Global CDN delivery
- Lazy loading support

### Database Access

For direct database access:
1. Go to Supabase Dashboard
2. Navigate to **Table Editor**
3. Select **products** table
4. View/edit data directly

## Support

For technical issues:
- Check the main README.md
- Review DEPLOYMENT.md
- Contact development team

---

**Admin Dashboard**: `/admin`
**Public Catalog**: `/`
**Supabase Project**: V1 ctlg
