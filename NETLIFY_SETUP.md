# Netlify Deployment Setup

## ✅ Files Already Configured

- `netlify.toml` - Build configuration and redirects
  - Frontend builds to `dist/public`
  - API requests redirect to Katabump backend: `http://51.75.118.151:20032`

## 🔧 Environment Variables to Set in Netlify

Go to: **Netlify Dashboard → Site Settings → Environment Variables**

Add these variables:

```
NODE_VERSION=20
NPM_CONFIG_PRODUCTION=false
```

That's it! The frontend doesn't need database credentials because it connects to your Katabump backend.

## 📋 Deployment Steps

1. **Push your code** to GitHub/GitLab
   ```bash
   git add .
   git commit -m "Configure Netlify deployment"
   git push
   ```

2. **Connect to Netlify**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository
   - Netlify will auto-detect the `netlify.toml` configuration

3. **Deploy!**
   - Netlify will automatically build and deploy
   - Your frontend will be live at `https://your-site.netlify.app`
   - All `/api/*` requests will go to your Katabump backend

## 🔍 How It Works

```
User Browser
    ↓
Netlify Frontend (Static HTML/JS/CSS)
    ↓ /api/* requests
Katabump Backend (http://51.75.118.151:20032)
    ↓
MongoDB Atlas
```

## ⚠️ Important Notes

1. **Backend URL**: Your backend at `http://51.75.118.151:20032` must be publicly accessible
2. **MongoDB**: Already configured and working on your Katabump server
3. **Environment**: The backend runs on Katabump, frontend on Netlify

## 🔐 Katabump Backend Environment Variables

Make sure these are set on your Katabump server (in `/home/container/.env` or panel environment variables):

```env
MONGODB_URI=mongodb+srv://ahmed12ahmed12222_db_user:XQrHohCTcVjBgEbT@cluster0.oq5zwzt.mongodb.net/?retryWrites=true&w=majority
NODE_ENV=production
PORT=20032
JWT_SECRET=katabump-super-secret-2025-change-this
ADMIN_PASSWORD=admin123
```

## ✅ Current Status

- ✅ MongoDB connected and working
- ✅ Backend running on Katabump (51.75.118.151:20032)
- ✅ Netlify configuration ready
- 🔄 Next: Push to Git and deploy to Netlify
