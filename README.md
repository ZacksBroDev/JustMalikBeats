# JustMalikBeats - Music Producer Website with Stripe Payments

A modern React website for music producer JustMalikBeats featuring a blog system and integrated Stripe payments for music purchases.

## Features

- 🎵 **Music Catalog** - Browse and purchase beats with Stripe integration
- 📝 **Blog System** - Modern blog with admin authentication
- 🔐 **Admin Panel** - Protected routes for content management
- 💳 **Stripe Payments** - Secure payment processing for music purchases
- 🎨 **Modern Design** - Responsive UI with Denver-inspired themes
- 🛒 **Shopping Cart** - Add multiple tracks and checkout together

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Stripe

1. Create a [Stripe account](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Copy `.env.example` to `.env`
4. Add your Stripe keys to `.env`:

```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

5. Update the publishable key in `src/config/stripe.js`:

```javascript
const stripePromise = loadStripe('pk_test_your_stripe_publishable_key_here');
```

### 3. Run the Application

#### Option 1: Run Both Frontend and Backend
```bash
npm run dev:full
```

#### Option 2: Run Separately
Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run dev
```

## Pages & Features

### Music Catalog (`/music`)
- Browse available beats and instrumentals
- Add tracks to shopping cart
- Secure checkout with Stripe
- Preview audio samples

### Blog System (`/blog`)
- View all blog posts
- Read individual posts
- Admin login (password: `malik2025beats`)
- Create new posts (admin only)

### Admin Features
- **Blog Admin**: `/blog/admin` - Manage blog posts
- **New Post**: `/blog/new` - Create new blog posts
- **Protected Routes**: Admin authentication required

## Stripe Integration

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
