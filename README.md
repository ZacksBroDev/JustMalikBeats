# JustMalikBeats - Professional Music Producer Platform

A production-ready React + Express platform for music producer JustMalikBeats featuring secure authentication, payment processing, and content management.

## ⚡ TL;DR

**🔗 Live Demo:** *(Coming Soon)*

**🎯 Key Features:**
- 🎵 Stripe-powered music marketplace with secure downloads
- 👤 JWT authentication with role-based admin panel
- 📧 Automated email notifications & purchase tracking

**🔒 Security Controls:**
- Bcrypt password hashing + JWT tokens with rate limiting
- Helmet CSP, NoSQL injection protection, input validation
- Stripe webhook signatures with environment-based secrets

**⚡ Quick Start:**
```bash
npm install && npm run dev:full
# Backend: localhost:3001 | Frontend: localhost:5173
```

---

## 🚀 Features

### Core Functionality
- 🎵 **Music Catalog** - Browse and purchase beats with complete Stripe integration
- 👤 **User Accounts** - JWT authentication with bcrypt password hashing
- 💳 **Secure Payments** - Stripe payment processing with webhook verification
- 📥 **Download Management** - Token-based downloads with limits (3 per purchase, 30-day expiry)
- 📧 **Email Notifications** - Automated purchase confirmations with beautiful HTML templates
- 📝 **Blog System** - Content management with admin authentication
- 🔐 **Admin Panel** - Protected routes for content and track management

### Backend Infrastructure
- 🗄️ **MongoDB Database** - Persistent data storage with Mongoose ODM
- 🔑 **JWT Authentication** - Secure token-based auth with role-based access
- 🛡️ **Enterprise Security** - Helmet, rate limiting, input validation, NoSQL injection protection
- 📊 **Winston Logging** - File and console logging with error tracking
- 🌐 **RESTful API** - 15+ endpoints with comprehensive documentation
- ⚡ **Production-Ready** - Environment-based configuration with PM2 support

## 📋 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Stripe account

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit with your values
nano .env
```

**Required environment variables:**
```env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/justmalikbeats
JWT_SECRET=your_random_64_character_secret_here
ADMIN_PASSWORD=your_secure_admin_password
VITE_ADMIN_PASSWORD=your_secure_admin_password
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
VITE_API_URL=http://localhost:3001
```

### 3. Start MongoDB

```bash
# macOS with Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongodb

# Or use MongoDB Atlas (no local install needed)
# Get connection string from https://cloud.mongodb.com
```

### 4. Run the Application

#### Option 1: Run Frontend + Backend Together
```bash
npm run dev:full
```

#### Option 2: Run Separately

```bash
npm run server    # Backend on port 3001
npm run dev       # Frontend on port 5173
```

### 5. Access Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/api/health

## 📚 Documentation

- **[Quick Start Guide](QUICK_START.md)** - Get up and running fast
- **[API Documentation](API_DOCUMENTATION.md)** - Complete API reference
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Production deployment
- **[Implementation Summary](IMPLEMENTATION_SUMMARY.md)** - What was built
- **[Before/After Comparison](BEFORE_AFTER.md)** - Transformation overview

## 🏗️ Architecture

### Frontend (React + Vite)
- Modern React 19 with functional components
- Mobile-responsive design with hamburger menu
- Stripe Elements integration
- Context API for state management

### Backend (Express + MongoDB)
```
Express Server (port 3001)
├── Authentication (JWT + bcrypt)
├── Database (MongoDB + Mongoose)
├── Payments (Stripe + Webhooks)
├── Email (Nodemailer)
├── Security (Helmet, Rate Limiting)
└── Logging (Winston)
```

### Database Schema
- **Users:** Email, password (hashed), role, purchases
- **Tracks:** Title, artist, price, Stripe IDs, metadata (BPM, key, tags)
- **Purchases:** User, track, payment details, download tokens

## 🔐 Security Features

- ✅ JWT authentication with bcrypt password hashing
- ✅ Environment-based configuration (no hardcoded secrets)
- ✅ Helmet security headers with CSP
- ✅ Rate limiting (100 req/15min, 5 req/15min auth)
- ✅ NoSQL injection protection
- ✅ Input validation and sanitization
- ✅ CORS with origin whitelist
- ✅ Production/development mode detection

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-login` - Admin authentication
- `GET /api/auth/me` - Get current user

### Tracks
- `GET /api/tracks` - List all tracks (filterable)
- `GET /api/tracks/:id` - Get single track
- `POST /api/tracks` - Create track (admin)
- `PUT /api/tracks/:id` - Update track (admin)
- `DELETE /api/tracks/:id` - Delete track (admin)

### Payments
- `POST /api/payments/create-intent` - Create payment
- `POST /api/payments/webhook` - Stripe webhook
- `GET /api/payments/download/:token` - Download track
- `GET /api/payments/my-purchases` - User purchase history

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for details.

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3001/api/health
```

### Register User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!","name":"Test User"}'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!"}'
```

## 🚀 Production Deployment

### Before Deploying

1. **Run production readiness check:**
```bash
bash check-production-ready.sh
```

2. **Clean git history:**
```bash
bash remove-env-from-git.sh
```

3. **Set up production environment:**
   - MongoDB Atlas or production database
   - Stripe live API keys (sk_live_ and pk_live_)
   - Strong JWT secret (64+ characters)
   - Secure admin password
   - SMTP email service

### Deployment Options

**VPS (Recommended):**
- PM2 process manager
- Nginx reverse proxy
- SSL with Certbot
- See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

**PaaS (Easy):**
- Heroku
- Railway
- Render
- Vercel (frontend) + Backend separately

## 📦 Tech Stack

### Frontend
- React 19.1.0
- Vite 6.3.5
- React Router 6.30.1
- Stripe React Components
- Context API

### Backend
- Express 5.1.0
- MongoDB + Mongoose 9.0.1
- Stripe 18.2.1
- JWT + bcrypt
- Winston (logging)
- Nodemailer (email)

### Security
- Helmet
- express-rate-limit
- express-mongo-sanitize
- express-validator

## 📁 Project Structure

```
JustMalikBeats/
├── server.js              # Express server
├── config/
│   └── database.js        # MongoDB + logger
├── models/                # Mongoose schemas
│   ├── User.js
│   ├── Track.js
│   └── Purchase.js
├── controllers/           # Route handlers
│   ├── authController.js
│   ├── trackController.js
│   └── paymentController.js
├── middleware/
│   └── auth.js           # JWT middleware
├── routes/               # API routes
│   ├── authRoutes.js
│   ├── trackRoutes.js
│   └── paymentRoutes.js
├── services/
│   └── emailService.js   # Email templates
├── src/                  # React frontend
│   ├── components/
│   ├── pages/
│   └── context/
└── logs/                 # Winston logs
    ├── combined.log
    └── error.log
```

## 🛠️ Development Scripts

```bash
npm run dev          # Frontend dev server
npm run server       # Backend server (dev)
npm run dev:full     # Both frontend + backend
npm run build        # Build frontend
npm run preview      # Preview production build
npm run server:prod  # Backend (production mode)
npm run start        # Production server
```

## 🔍 Monitoring

### Logs
```bash
# View all logs
tail -f logs/combined.log

# View errors only  
tail -f logs/error.log

# With PM2 (production)
pm2 logs justmalik-api
```

### Database
```bash
# Connect to MongoDB
mongosh justmalikbeats

# View collections
db.users.find()
db.tracks.find()
db.purchases.find()
```

## 🤝 Contributing

This is a private project for JustMalikBeats. For issues or questions, contact the development team.

## 📄 License

All rights reserved. This project is proprietary software for JustMalikBeats.

## ⚠️ Important Notes

- **Security:** Never commit `.env` file to git
- **Passwords:** Change default admin password before production
- **Stripe:** Use test keys for development, live keys for production
- **Database:** Back up MongoDB regularly in production
- **Email:** Configure SMTP before enabling email notifications

## 🆘 Troubleshooting

### MongoDB Connection Failed
```bash
# Start MongoDB locally
brew services start mongodb-community   # macOS
sudo systemctl start mongodb            # Linux

# Or use MongoDB Atlas cloud
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/justmalikbeats
```

### Port Already in Use
```bash
# Kill process on port 3001
kill $(lsof -t -i:3001)
```

### Stripe Payments Not Working
- Verify STRIPE_SECRET_KEY in .env
- Check Stripe dashboard for errors
- Ensure webhook secret configured for production

See [QUICK_START.md](QUICK_START.md) for more troubleshooting.

---

**Built with ❤️ for JustMalikBeats**

The payment system includes:

1. **Frontend Components**:

   - `MusicCatalog.jsx` - Music browsing and cart
   - `CheckoutForm.jsx` - Stripe payment form
   - `MusicContext.jsx` - State management

2. **Backend Server** (`server.js`):

   - Payment intent creation
   - Payment confirmation
   - Download link generation

3. **Security Features**:
   - Encrypted payment processing
   - Server-side payment verification
   - Protected download endpoints

## Admin Access

- **Blog Admin Password**: `malik2025beats`
- **Admin Routes**: `/blog/admin`, `/blog/new`

---

Built with ❤️ in Denver, Colorado
