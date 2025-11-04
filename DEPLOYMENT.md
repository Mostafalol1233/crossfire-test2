# Deployment Guide

This guide will help you deploy the Bimora Gaming Blog application with:
- **Frontend**: Netlify (static files)
- **Backend**: katabump.com (Node.js API)
- **Database**: MongoDB Atlas

## Prerequisites

- MongoDB Atlas account with a cluster setup ✓
- Netlify account
- katabump.com account (or any Node.js hosting service)
- Git repository for your code

## Part 1: MongoDB Atlas Setup ✓

Your MongoDB Atlas is already configured with:
- **Username**: ahmed12ahmed12222_db_user
- **Password**: XQrHohCTcVjBgEbT
- **Connection String**: Already set in MONGODB_URI

## Part 2: Backend Deployment (katabump.com)

### Step 1: Prepare Backend Files

The backend is located in the `server/` directory and includes:
- `server/index.ts` - Main entry point
- `server/routes.ts` - API routes
- `server/mongodb.ts` - MongoDB connection
- `server/mongodb-storage.ts` - Data access layer
- `shared/mongodb-schema.ts` - MongoDB schemas

### Step 2: Build the Backend

```bash
npm run build
```

This will create production-ready files in the `dist/` directory.

### Step 3: Deploy to katabump.com

1. **Upload Files**: Upload the following to your katabump.com server:
   - `dist/` directory (contains compiled backend)
   - `node_modules/` directory (or run `npm install --production` on server)
   - `package.json`
   - `attached_assets/` directory (for static assets)

2. **Set Environment Variables** on katabump.com:
   ```
   MONGODB_URI=mongodb+srv://ahmed12ahmed12222_db_user:XQrHohCTcVjBgEbT@<your-cluster-url>/<database-name>?retryWrites=true&w=majority
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=<your-secure-random-string>
   ADMIN_PASSWORD=<your-admin-password>
   ```

3. **Start the Server**:
   ```bash
   npm start
   ```
   
   Or use a process manager like PM2:
   ```bash
   pm2 start dist/index.js --name biomera-backend
   pm2 save
   pm2 startup
   ```

4. **Note your backend URL**: e.g., `https://your-app.katabump.com`

### Step 4: Configure CORS (if needed)

If your frontend and backend are on different domains, ensure CORS is properly configured in `server/index.ts`.

## Part 3: Frontend Deployment (Netlify)

### Step 1: Update Netlify Configuration

Edit `netlify.toml` and replace the backend URL:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-app.katabump.com/api/:splat"
  status = 200
  force = true
```

Replace `https://your-app.katabump.com` with your actual katabump.com backend URL.

### Step 2: Build Frontend

```bash
npm run build
```

This creates optimized frontend files in `dist/public/`.

### Step 3: Deploy to Netlify

#### Option A: Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist/public
```

#### Option B: Netlify Web Interface

1. Go to [Netlify](https://www.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/public`
5. Click "Deploy site"

#### Option C: Manual Upload

1. Go to Netlify → "Sites"
2. Drag and drop the `dist/public` folder

### Step 4: Environment Variables (if needed on frontend)

If you need any frontend environment variables, add them in Netlify:
- Go to Site settings → Build & deploy → Environment
- Add variables prefixed with `VITE_` (e.g., `VITE_API_URL`)

## Part 4: Verification

### Test Backend API

```bash
# Test health/basic endpoint
curl https://your-app.katabump.com/api/posts

# Should return JSON array of posts
```

### Test Frontend

1. Visit your Netlify URL (e.g., `https://your-site.netlify.app`)
2. Check that:
   - Homepage loads correctly
   - News and events display
   - Admin login works
   - Creating/editing content works

## Part 5: Custom Domain (Optional)

### For Netlify Frontend:
1. Go to Site settings → Domain management
2. Add your custom domain
3. Follow DNS configuration instructions

### For katabump.com Backend:
Follow katabump.com's documentation for adding custom domains.

## Database Initialization

On first deployment, you'll need to create an admin account. You can do this by:

1. **Using MongoDB Compass** or **MongoDB Atlas interface**:
   - Connect to your database
   - Navigate to the `admins` collection
   - Insert a document:
   ```json
   {
     "username": "admin",
     "password": "$2a$10$...", // Use bcrypt to hash your password
     "role": "super_admin",
     "createdAt": new Date()
   }
   ```

2. **Or use the API** (if super_admin password is set):
   ```bash
   curl -X POST https://your-app.katabump.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"password": "your-super-admin-password"}'
   ```

## Troubleshooting

### Backend Issues

1. **Connection refused**: Check that backend server is running
2. **MongoDB connection error**: Verify MONGODB_URI is correct
3. **CORS errors**: Add frontend URL to CORS configuration

### Frontend Issues

1. **API calls failing**: Check backend URL in `netlify.toml`
2. **Assets not loading**: Verify `attached_assets/` is deployed
3. **Blank page**: Check browser console for errors

### Database Issues

1. **Authentication failed**: Verify MongoDB username/password
2. **Network error**: Check MongoDB Atlas network access (IP whitelist)
3. **Timeout**: Ensure database is not paused (free tier)

## Maintenance

### Update Backend
1. Make changes to code
2. Run `npm run build`
3. Upload new `dist/` directory to katabump.com
4. Restart server

### Update Frontend
1. Make changes to code
2. Run `npm run build`
3. Netlify will auto-deploy (if connected to Git) or manually upload

### Database Backups
- Use MongoDB Atlas automated backups (available in paid tiers)
- Or manually export data using `mongodump`

## Environment Variables Summary

### Backend (katabump.com)
- `MONGODB_URI` - MongoDB connection string ✓
- `NODE_ENV=production`
- `PORT=5000`
- `JWT_SECRET` - Random secure string for JWT tokens
- `ADMIN_PASSWORD` - Super admin password

### Frontend (Netlify)
- None required by default
- Add `VITE_*` prefixed variables if needed

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT_SECRET
- [ ] Enable MongoDB Atlas IP whitelist
- [ ] Use HTTPS for both frontend and backend
- [ ] Rotate database credentials periodically
- [ ] Enable MongoDB Atlas security features
- [ ] Monitor API logs for suspicious activity

## Support

If you encounter issues:
1. Check logs on katabump.com
2. Check Netlify deploy logs
3. Check MongoDB Atlas metrics
4. Review browser console for frontend errors

---

**Your deployment is ready!** 🚀

Frontend: https://your-site.netlify.app
Backend: https://your-app.katabump.com
Database: MongoDB Atlas (connected)
