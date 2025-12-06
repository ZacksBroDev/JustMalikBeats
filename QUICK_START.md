# Quick Start Guide

## Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your values
nano .env
```

**Minimum required for development:**
```env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/justmalikbeats
JWT_SECRET=your_random_32_character_string_here
ADMIN_PASSWORD=your_admin_password
VITE_ADMIN_PASSWORD=your_admin_password
STRIPE_SECRET_KEY=sk_test_your_test_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key
VITE_API_URL=http://localhost:3001
```

### 3. Start MongoDB (if running locally)
```bash
# macOS with Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongodb

# Or use MongoDB Atlas (cloud) - no local install needed
```

### 4. Run Application
```bash
# Start backend + frontend together
npm run dev:full

# Or separately:
npm run server    # Backend on port 3001
npm run dev       # Frontend on port 5173
```

### 5. Access Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/api/health

---

## Testing the API

### 1. Health Check
```bash
curl http://localhost:3001/api/health
```

Should return:
```json
{
  "status": "ok",
  "stripe": "configured",
  "database": "connected",
  "environment": "development"
}
```

### 2. Register User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

Save the `token` from response!

### 4. Admin Login
```bash
curl -X POST http://localhost:3001/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{
    "password": "malik2025beats"
  }'
```

### 5. Get Current User (with token)
```bash
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Create Track (admin only)
```bash
curl -X POST http://localhost:3001/api/tracks \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Dark Nights",
    "artist": "JustMalik",
    "genre": "hip-hop",
    "price": 29.99,
    "audioFileUrl": "https://example.com/audio.mp3",
    "audioPreviewUrl": "https://example.com/preview.mp3",
    "coverImageUrl": "https://example.com/cover.jpg",
    "stripeProductId": "prod_test123",
    "stripePriceId": "price_test123",
    "metadata": {
      "bpm": 140,
      "key": "C Minor",
      "tags": ["dark", "trap", "808"]
    }
  }'
```

### 7. Get All Tracks
```bash
curl http://localhost:3001/api/tracks
```

---

## Common Commands

### Development
```bash
# Run everything
npm run dev:full

# Backend only
npm run server

# Frontend only
npm run dev

# Production mode
npm run server:prod
```

### Database
```bash
# Connect to MongoDB (local)
mongosh justmalikbeats

# View users
db.users.find()

# View tracks
db.tracks.find()

# View purchases
db.purchases.find()
```

### Logs
```bash
# View all logs
tail -f logs/combined.log

# View errors only
tail -f logs/error.log

# With PM2 (production)
pm2 logs justmalik-api
```

### Production Readiness
```bash
# Check if ready for production
bash check-production-ready.sh

# Clean .env from git history
bash remove-env-from-git.sh
```

---

## Troubleshooting

### "MongoDB connection failed"
```bash
# Check if MongoDB is running
brew services list | grep mongodb   # macOS
sudo systemctl status mongodb       # Linux

# Start MongoDB
brew services start mongodb-community   # macOS
sudo systemctl start mongodb            # Linux

# Or use MongoDB Atlas connection string in .env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/justmalikbeats
```

### "Stripe not configured"
```bash
# Add Stripe keys to .env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Get test keys from: https://dashboard.stripe.com/test/apikeys
```

### "Too many login attempts"
Rate limiting is active. Wait 15 minutes or restart server:
```bash
# Kill process
kill $(lsof -t -i:3001)

# Restart
npm run server
```

### Port 3001 already in use
```bash
# Find and kill process
kill $(lsof -t -i:3001)

# Or change PORT in .env
PORT=3002
```

### Email not sending
Emails are optional. Check:
```bash
# Verify SMTP settings in .env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# For Gmail, create app password:
# https://myaccount.google.com/apppasswords
```

---

## Project Structure

```
JustMalikBeats/
├── server.js                 # Main Express server
├── package.json             # Dependencies and scripts
├── .env                     # Environment variables (git-ignored)
├── .env.example            # Environment template
│
├── config/
│   └── database.js         # MongoDB connection + logger
│
├── models/
│   ├── User.js             # User schema
│   ├── Track.js            # Track schema
│   └── Purchase.js         # Purchase schema
│
├── controllers/
│   ├── authController.js   # Auth endpoints
│   ├── trackController.js  # Track CRUD
│   └── paymentController.js # Payment + downloads
│
├── middleware/
│   └── auth.js             # JWT authentication
│
├── routes/
│   ├── authRoutes.js       # /api/auth/*
│   ├── trackRoutes.js      # /api/tracks/*
│   └── paymentRoutes.js    # /api/payments/*
│
├── services/
│   └── emailService.js     # Email notifications
│
├── logs/
│   ├── combined.log        # All logs
│   └── error.log          # Errors only
│
├── src/                    # React frontend
│   ├── components/
│   ├── pages/
│   └── ...
│
└── docs/
    ├── DEPLOYMENT_GUIDE.md
    ├── API_DOCUMENTATION.md
    ├── IMPLEMENTATION_SUMMARY.md
    └── BEFORE_AFTER.md
```

---

## Environment Variables Reference

### Required (Development)
- `MONGODB_URI` - Database connection
- `JWT_SECRET` - Token signing key
- `ADMIN_PASSWORD` - Admin authentication
- `VITE_ADMIN_PASSWORD` - Frontend admin auth
- `STRIPE_SECRET_KEY` - Stripe backend key
- `STRIPE_PUBLISHABLE_KEY` - Stripe frontend key

### Required (Production)
All development vars PLUS:
- `NODE_ENV=production`
- `STRIPE_WEBHOOK_SECRET` - Webhook verification
- `ALLOWED_ORIGINS` - CORS whitelist
- `SMTP_*` - Email configuration

### Optional
- `PORT` (default: 3001)
- `LOG_LEVEL` (default: info)
- `VITE_API_URL` (default: http://localhost:3001)

---

## Documentation Reference

- **Full API Reference:** API_DOCUMENTATION.md
- **Deployment Guide:** DEPLOYMENT_GUIDE.md
- **Implementation Summary:** IMPLEMENTATION_SUMMARY.md
- **Before/After Comparison:** BEFORE_AFTER.md
- **Production Checklist:** PRODUCTION_CHECKLIST.md
- **Security Fixes:** SECURITY_FIXES.md

---

## Support & Next Steps

### Ready to Deploy?
1. Read: PRODUCTION_CHECKLIST.md
2. Run: `bash check-production-ready.sh`
3. Follow: DEPLOYMENT_GUIDE.md

### Need Help?
- Check logs: `tail -f logs/error.log`
- Test health: `curl http://localhost:3001/api/health`
- Review: IMPLEMENTATION_SUMMARY.md

### Production Deployment
See DEPLOYMENT_GUIDE.md for:
- VPS deployment (PM2 + Nginx)
- PaaS deployment (Heroku, Railway, Render)
- MongoDB Atlas setup
- Stripe webhook configuration
- SSL/HTTPS setup
