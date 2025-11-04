# KataBump Deployment

Simple deployment for your CrossFire Gaming Blog.

## Quick Start

1. **Configure Environment**

Edit the `.env` file with your settings:

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/?appName=YourApp
JWT_SECRET=your-secret-key-here
ADMIN_PASSWORD=your-admin-password
AUTO_SEED=true
```

2. **Start the Server**

```bash
node index.js
```

That's it! The server will:
- ✅ Connect to MongoDB automatically
- ✅ Auto-seed events and news (if AUTO_SEED=true)
- ✅ Create default admin account
- ✅ Start on the configured port

## Environment Variables

### Required

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | Your MongoDB connection string from MongoDB Atlas |
| `PORT` | Server port (default: 5000) |

### Optional

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_SECRET` | auto-generated | Secret key for authentication |
| `ADMIN_PASSWORD` | admin123 | Default admin password |
| `AUTO_SEED` | false | Auto-populate events/news on first run |
| `NODE_ENV` | production | Environment mode |

## First Time Setup

1. Make sure you have Node.js installed
2. Copy `.env.example` to `.env` if it doesn't exist
3. Edit `.env` with your MongoDB connection string
4. Run: `node index.js`

## Default Admin Login

After first run with `AUTO_SEED=true`:

- **Username**: admin
- **Password**: (value from ADMIN_PASSWORD in .env)

⚠️ **Change the default password after first login!**

## Troubleshooting

**MongoDB Connection Failed**
- Check your MONGODB_URI is correct
- Verify IP whitelist in MongoDB Atlas (allow 0.0.0.0/0 or your server IP)
- Confirm database user credentials

**Server Won't Start**
- Check if port 5000 is already in use
- Verify .env file exists and is readable
- Check MongoDB connection string format

**No Events/News Showing**
- Set `AUTO_SEED=true` in .env
- Restart the server with `node index.js`
- Events and news will be created automatically

## Features

### Auto-Seeding

When `AUTO_SEED=true`, the server automatically creates:
- 5 events (Grave Games, Weekend Party, Sapphire Crates, etc.)
- 6 news items (latest CrossFire updates)
- All with catbox.moe image URLs
- All with Arabic translations
- Default admin account

### Image Hosting

All images use catbox.moe URLs - no need to upload files manually!

### Bilingual Support

All events and news include both English and Arabic content.

## Support

For issues:
1. Check the console output for error messages
2. Verify all environment variables are set
3. Test MongoDB connection separately
4. Ensure server has internet access to reach MongoDB Atlas

## Files

- `index.js` - Main server file (just run this!)
- `.env` - Your configuration (edit this)
- `.env.example` - Configuration template
- `package.json` - Dependencies list
- `attached_assets/` - Static assets folder

---

**That's all you need! Just run `node index.js` and you're ready to go!** 🚀
