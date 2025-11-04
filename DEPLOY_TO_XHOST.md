# Deploy Backend to X-Host Server

## Quick Start

This guide will help you deploy your Bimora Gaming Blog backend to your X-Host Node.js server.

## Prerequisites

1. MongoDB Atlas account with a database created
2. X-Host Node.js server access
3. SFTP client (FileZilla, Cyberduck, or VS Code SFTP extension)

## Step 1: Configure Environment Variables

Create a `.env` file in your project root with these settings:

```env
# Server Configuration
PORT=25539
NODE_ENV=production

# MongoDB Configuration (get this from MongoDB Atlas)
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/bimora_gaming?retryWrites=true&w=majority

# JWT Secret (generate with: openssl rand -hex 32)
JWT_SECRET=your_generated_secret_key_here

# Admin password for super admin account
ADMIN_PASSWORD=your_secure_admin_password

# Auto-seed database on startup
AUTO_SEED=false
```

**Important Notes:**
- Replace `your_username`, `your_password`, and cluster URL with your actual MongoDB Atlas credentials
- Generate a secure JWT_SECRET using: `openssl rand -hex 32`
- Use a strong ADMIN_PASSWORD
- PORT should match the X-Host server port (25539 from your server info)

## Step 2: Build the Project

On your local machine or in Replit Shell:

```bash
# Install dependencies
npm install

# Build the production version
npm run build
```

This creates a `dist/` folder with your production-ready backend.

## Step 3: Prepare Files for Upload

You need to upload these files/folders to X-Host:

```
📁 dist/               # Built backend (from npm run build)
📁 node_modules/       # Dependencies
📁 attached_assets/    # Images and static files
📄 .env                # Your environment variables (create from step 1)
📄 package.json        # Dependencies list
📄 package-lock.json   # Locked dependencies
```

## Step 4: Upload via SFTP

### Using FileZilla or Cyberduck:

1. **Connect to server:**
   - Host: `node.x-host.cloud`
   - Port: `2022`
   - Protocol: `SFTP`
   - Username: `mkef.09a29a8d`
   - Password: [Your X-Host panel password]

2. **Upload files:**
   - Navigate to your app directory on the server
   - Upload all files from Step 3
   - Make sure `.env` file is uploaded (it's hidden, enable "Show hidden files")

### Using Command Line (Linux/Mac):

```bash
# Upload files using scp
scp -P 2022 -r dist/ mkef.09a29a8d@node.x-host.cloud:~/
scp -P 2022 -r node_modules/ mkef.09a29a8d@node.x-host.cloud:~/
scp -P 2022 -r attached_assets/ mkef.09a29a8d@node.x-host.cloud:~/
scp -P 2022 package.json mkef.09a29a8d@node.x-host.cloud:~/
scp -P 2022 .env mkef.09a29a8d@node.x-host.cloud:~/
```

## Step 5: Start the Server on X-Host

1. SSH into your X-Host server:
   ```bash
   ssh -p 2022 mkef.09a29a8d@node.x-host.cloud
   ```

2. Navigate to your app directory:
   ```bash
   cd ~/
   ```

3. Install dependencies (if not uploaded):
   ```bash
   npm install --production
   ```

4. Start the server:
   ```bash
   npm start
   ```

   Or use PM2 for auto-restart:
   ```bash
   pm2 start dist/index.js --name bimora-backend
   pm2 save
   pm2 startup
   ```

## Step 6: Configure Frontend to Use X-Host Backend

In your Netlify deployment, you'll need to configure the frontend to point to your X-Host backend:

1. Set environment variable in Netlify:
   ```
   VITE_API_URL=https://server.x-host.cloud/server/09a29a8d
   ```

2. Update `client/src/lib/queryClient.ts` to use this URL for API calls.

## Verification

After deployment:

1. Test the backend endpoint:
   ```bash
   curl https://server.x-host.cloud/server/09a29a8d/api/posts
   ```

2. Check if admin login works:
   ```bash
   curl -X POST https://server.x-host.cloud/server/09a29a8d/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"password":"your_admin_password"}'
   ```

## Troubleshooting

### Server not starting:
- Check logs: `pm2 logs bimora-backend`
- Verify `.env` file exists and has correct values
- Ensure MongoDB URI is correct

### Cannot connect to MongoDB:
- Check if MongoDB Atlas allows connections from X-Host IP
- Add X-Host server IP to MongoDB Atlas IP whitelist
- Or allow all IPs: `0.0.0.0/0` (less secure)

### Port already in use:
- Check if another app is using port 25539
- Change PORT in `.env` file to an available port

## Maintenance

### Update the app:
```bash
# Rebuild locally
npm run build

# Upload new dist/ folder via SFTP
# Restart the server
pm2 restart bimora-backend
```

### View logs:
```bash
pm2 logs bimora-backend
```

### Stop server:
```bash
pm2 stop bimora-backend
```

## Security Checklist

- ✅ Strong JWT_SECRET generated
- ✅ Strong ADMIN_PASSWORD set
- ✅ MongoDB IP whitelist configured
- ✅ NODE_ENV set to production
- ✅ .env file not publicly accessible
- ✅ HTTPS enabled (X-Host should provide this)

## Support

If you encounter issues:
1. Check X-Host server logs
2. Verify MongoDB connection
3. Test endpoints with curl
4. Check PM2 process status: `pm2 status`

---

**Server Details:**
- URL: https://server.x-host.cloud/server/09a29a8d
- SFTP: node.x-host.cloud:2022
- Username: mkef.09a29a8d
- Server ID: 09a29a8d-4109-4a55-8e57-5786ab91aa92
- Port: 25539
