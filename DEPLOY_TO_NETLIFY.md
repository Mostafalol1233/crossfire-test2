# Deploy Frontend to Netlify

## Overview

This guide will help you deploy the Bimora Gaming Blog frontend to Netlify and connect it to your X-Host backend.

## Prerequisites

1. X-Host backend deployed and running (see DEPLOY_TO_XHOST.md)
2. Netlify account
3. GitHub repository with your code

## Step 1: Fix Frontend Build Errors

The errors you're seeing (`Cannot read properties of undefined (reading 'toLowerCase')`) have been fixed in the Category page. Make sure you have the latest code with these fixes:

### Changes Made:
- ✅ Added null safety checks in Category.tsx
- ✅ Filter out invalid events data
- ✅ Safe property access with optional chaining
- ✅ Default values for undefined properties

## Step 2: Configure API URL

### Option A: Environment Variable (Recommended)

1. In Netlify dashboard, go to: **Site settings > Build & deploy > Environment**

2. Add this environment variable:
   ```
   VITE_API_URL=https://server.x-host.cloud/server/09a29a8d
   ```

3. The frontend will automatically use this URL for API calls.

### Option B: Update Config File

Create `client/src/config.ts`:

```typescript
export const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? '' : 'https://server.x-host.cloud/server/09a29a8d');
```

Then update `client/src/lib/queryClient.ts` to use it.

## Step 3: Build Settings for Netlify

### Netlify Configuration

Create or update `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = "dist/public"
  
[build.environment]
  NODE_VERSION = "20"
  
[[redirects]]
  from = "/api/*"
  to = "https://server.x-host.cloud/server/09a29a8d/api/:splat"
  status = 200
  force = true
  
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Build Command

In Netlify:
- **Build command**: `npm run build`
- **Publish directory**: `dist/public`
- **Node version**: 20

## Step 4: Deploy to Netlify

### Method 1: Connect GitHub Repo (Recommended)

1. Push your code to GitHub
2. Go to Netlify dashboard
3. Click **Add new site > Import an existing project**
4. Connect to GitHub
5. Select your repository
6. Configure build settings (Step 3)
7. Click **Deploy site**

### Method 2: Manual Deploy

1. Build locally:
   ```bash
   npm run build
   ```

2. Drag and drop the `dist/public` folder to Netlify

## Step 5: Test the Deployment

1. Visit your Netlify site URL
2. Check that:
   - ✅ Logo appears in header
   - ✅ Events ribbon shows (if you have events)
   - ✅ Category pages load without errors
   - ✅ Admin login connects to backend
   - ✅ Products and reviews load from backend

## Step 6: Configure Custom Domain (Optional)

1. In Netlify: **Domain settings > Add custom domain**
2. Follow Netlify's instructions to configure DNS
3. Enable HTTPS (automatic with Netlify)

## Common Issues & Fixes

### Issue: API calls failing (CORS errors)

**Fix**: Configure CORS on X-Host backend

Add to `server/index.ts`:

```typescript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://your-netlify-site.netlify.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});
```

### Issue: Events not showing / Category page errors

**Fix**: The latest code has these fixes. Redeploy with updated Category.tsx.

### Issue: Images not loading

**Fix**: Images from `attached_assets/` need to be:
1. Uploaded to X-Host backend server
2. Or hosted on a CDN (Cloudinary, Imgix, etc.)
3. Update image URLs in admin panel

### Issue: Build fails on Netlify

**Fixes**:
1. Check Node version (should be 20)
2. Clear cache: **Deploy settings > Clear cache and retry**
3. Check build logs for specific errors
4. Ensure all dependencies are in package.json

## Environment Variables Needed

Add these in Netlify **Site settings > Environment variables**:

```
VITE_API_URL=https://server.x-host.cloud/server/09a29a8d
```

## Performance Optimization

After deployment:

1. **Enable Asset Optimization** in Netlify:
   - Bundle CSS
   - Minify CSS, JS, Images
   - Compress uploads

2. **Add Caching Headers** in `netlify.toml`:

```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## Security Best Practices

- ✅ HTTPS enabled (Netlify provides free SSL)
- ✅ Environment variables for API URL (not hardcoded)
- ✅ CORS properly configured on backend
- ✅ No sensitive data in frontend code
- ✅ Admin routes protected by authentication

## Monitoring

### Netlify Analytics

Enable in: **Analytics tab** to track:
- Page views
- Unique visitors
- Top pages
- Traffic sources

### Error Tracking

Consider adding:
- Sentry for error tracking
- Google Analytics for user behavior

## Update Workflow

When you make changes:

1. Push to GitHub
2. Netlify auto-deploys (if connected to GitHub)
3. Or manually: Build locally → Upload to Netlify

## Final Checklist

Before going live:

- ✅ Backend running on X-Host
- ✅ MongoDB connected and populated
- ✅ Frontend build successful
- ✅ API calls working
- ✅ CORS configured
- ✅ Admin login functional
- ✅ Images loading
- ✅ Events displaying
- ✅ Custom domain configured (if needed)
- ✅ HTTPS enabled
- ✅ Mobile responsive
- ✅ Performance tested

## Support

If you encounter issues:
1. Check Netlify deploy logs
2. Test API endpoints manually
3. Verify environment variables
4. Check browser console for errors
5. Test in incognito mode

---

**Quick Links:**
- Netlify Dashboard: https://app.netlify.com
- Backend API: https://server.x-host.cloud/server/09a29a8d
- Frontend URL: [Your Netlify URL]
