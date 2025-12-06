# Production Deployment Guide

## Prerequisites

1. **MongoDB Database**
   - Set up MongoDB Atlas (cloud) or local MongoDB instance
   - Create database named `justmalikbeats`
   - Get connection string (e.g., `mongodb+srv://user:password@cluster.mongodb.net/justmalikbeats`)

2. **Stripe Account**
   - Create account at https://stripe.com
   - Get live API keys (starts with `pk_live_` and `sk_live_`)
   - Set up webhook endpoint for production URL

3. **Email Service** (Optional but recommended)
   - Gmail app password, or
   - SendGrid, Mailgun, or other SMTP service

## Environment Setup

### 1. Create Production .env File

Copy `.env.example` to `.env` and configure:

```bash
# CRITICAL: Set to production
NODE_ENV=production

# MongoDB - Use MongoDB Atlas or hosted instance
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/justmalikbeats

# JWT Secret - Generate with: openssl rand -base64 64
JWT_SECRET=your_very_long_random_secret_minimum_64_characters

# Stripe - LIVE KEYS ONLY
STRIPE_SECRET_KEY=sk_live_your_stripe_live_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_live_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Server
PORT=3001
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Admin - Use strong password
ADMIN_PASSWORD=your_very_secure_admin_password_here
VITE_ADMIN_PASSWORD=your_very_secure_admin_password_here

# API URL
VITE_API_URL=https://api.yourdomain.com

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=JustMalik Beats
```

### 2. Generate Secure Secrets

```bash
# Generate JWT secret
openssl rand -base64 64

# Generate admin password
openssl rand -base64 32
```

## Build Process

### 1. Install Dependencies

```bash
npm install --production
```

### 2. Build Frontend

```bash
npm run build
```

This creates optimized production files in `dist/` folder.

### 3. Verify Build

```bash
npm run preview
```

## Deployment Options

### Option A: VPS/Dedicated Server (Recommended)

1. **Set up server** (Ubuntu/Debian)
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install MongoDB (if self-hosting)
   # Or use MongoDB Atlas for managed hosting
   
   # Install PM2 for process management
   sudo npm install -g pm2
   ```

2. **Deploy application**
   ```bash
   # Clone repository
   git clone your-repo-url
   cd JustMalikBeats
   
   # Install dependencies
   npm install --production
   
   # Build frontend
   npm run build
   
   # Create .env file with production values
   nano .env
   
   # Start with PM2
   pm2 start server.js --name justmalik-api
   pm2 save
   pm2 startup
   ```

3. **Set up Nginx reverse proxy**
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       root /path/to/JustMalikBeats/dist;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

4. **SSL Certificate**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
   ```

### Option B: Platform as a Service (PaaS)

**Heroku:**
```bash
# Create Procfile
echo "web: npm run start" > Procfile

# Deploy
heroku create justmalik-beats
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
# ... set all other env vars
git push heroku main
```

**Railway/Render:**
- Connect GitHub repository
- Set environment variables in dashboard
- Set build command: `npm install && npm run build`
- Set start command: `npm run start`

### Option C: Vercel (Frontend) + Backend Separately

**Frontend (Vercel):**
```bash
# Deploy frontend
vercel --prod
```

**Backend (Railway/Render/Heroku):**
- Deploy server.js separately
- Update VITE_API_URL to backend URL

## Stripe Webhook Setup

1. **Create webhook endpoint** at https://dashboard.stripe.com/webhooks
   - Endpoint URL: `https://api.yourdomain.com/api/payments/webhook`
   - Events to listen: `payment_intent.succeeded`, `payment_intent.payment_failed`

2. **Copy webhook secret** and add to `.env`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

## Database Setup

### MongoDB Atlas (Recommended)

1. Create cluster at https://cloud.mongodb.com
2. Create database user
3. Whitelist IP addresses (or allow all: 0.0.0.0/0)
4. Get connection string
5. Update `MONGODB_URI` in .env

### Self-Hosted MongoDB

```bash
# Install MongoDB
sudo apt-get install -y mongodb

# Start service
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Connection string
MONGODB_URI=mongodb://localhost:27017/justmalikbeats
```

## Security Checklist

- [ ] `.env` file NOT committed to git
- [ ] Strong JWT_SECRET (64+ characters)
- [ ] Strong ADMIN_PASSWORD
- [ ] Live Stripe keys configured
- [ ] Webhook secret configured
- [ ] ALLOWED_ORIGINS set to production domains only
- [ ] NODE_ENV=production
- [ ] HTTPS/SSL configured
- [ ] MongoDB authentication enabled
- [ ] Rate limiting active (helmet, express-rate-limit)

## Monitoring

### PM2 Monitoring

```bash
# View logs
pm2 logs justmalik-api

# Monitor processes
pm2 monit

# View status
pm2 status
```

### Log Files

Application logs are in `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only

## Maintenance

### Update Application

```bash
git pull origin main
npm install --production
npm run build
pm2 restart justmalik-api
```

### Database Backup

```bash
# MongoDB backup
mongodump --uri="your_mongodb_uri" --out=/backup/$(date +%Y%m%d)

# Restore
mongorestore --uri="your_mongodb_uri" /backup/20231201
```

### Check Health

```bash
curl https://api.yourdomain.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "stripe": "configured",
  "message": "Ready for payments",
  "database": "connected",
  "environment": "production"
}
```

## Troubleshooting

### Server won't start
- Check `pm2 logs` for errors
- Verify MongoDB connection
- Check port availability: `sudo lsof -i :3001`

### Payments failing
- Verify Stripe live keys
- Check webhook secret
- Review Stripe dashboard logs

### Email not sending
- Verify SMTP credentials
- Check spam folder
- Review `logs/error.log`

### Database connection issues
- Verify MongoDB URI
- Check IP whitelist (Atlas)
- Ensure MongoDB service running

## Scaling

### Horizontal Scaling
```bash
# Start multiple instances with PM2
pm2 start server.js -i max --name justmalik-api
```

### Load Balancer
Use Nginx or cloud load balancer to distribute across multiple instances.

## Support

For issues:
1. Check logs: `pm2 logs`
2. Review `logs/error.log`
3. Verify environment variables
4. Test API health endpoint
