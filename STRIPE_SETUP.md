# Stripe Payment Setup Guide

## Quick Setup Steps

### 1. Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete the verification process
3. Navigate to your Stripe Dashboard

### 2. Get API Keys
1. In the Stripe Dashboard, go to **Developers** → **API Keys**
2. Copy your **Publishable key** (starts with `pk_test_...`)
3. Copy your **Secret key** (starts with `sk_test_...`)

### 3. Configure Your App

#### Option A: Update Config Files
1. Open `src/config/stripe.js`
2. Replace the placeholder with your publishable key:
```javascript
const stripePromise = loadStripe('pk_test_your_actual_key_here');
```

3. Open `.env` file (create if it doesn't exist)
4. Add your secret key:
```env
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
```

#### Option B: Environment Variables (Recommended for Production)
1. Set environment variables:
```bash
export STRIPE_SECRET_KEY=sk_test_your_secret_key_here
export STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### 4. Test the Integration

#### Using Test Cards
Stripe provides test card numbers:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Authentication Required**: 4000 0025 0000 3155

#### Test Payment Flow
1. Start both servers: `npm run dev:full`
2. Go to `http://localhost:5174/music`
3. Add items to cart
4. Click "Checkout"
5. Use test card: 4242 4242 4242 4242
6. Use any future expiry date and any CVC

### 5. Production Setup

#### Webhook Configuration (Optional)
1. In Stripe Dashboard, go to **Webhooks**
2. Add endpoint: `https://yourdomain.com/api/webhook`
3. Select events: `payment_intent.succeeded`
4. Add webhook secret to your environment variables

#### SSL Certificate
- Ensure your production site uses HTTPS
- Stripe requires SSL for live payments

## Current Features

✅ **Shopping Cart** - Add/remove items
✅ **Secure Checkout** - Stripe Elements integration
✅ **Payment Processing** - Server-side payment intents
✅ **Success Page** - Download links and purchase confirmation
✅ **Test Mode** - Works without Stripe configuration
✅ **Responsive Design** - Mobile-friendly interface

## File Structure

```
src/
├── components/music/
│   ├── MusicCatalog.jsx      # Main catalog with cart
│   ├── CheckoutForm.jsx      # Stripe payment form
│   ├── PaymentSuccess.jsx    # Success page
│   ├── TestCheckout.jsx      # Test mode checkout
│   └── CartNotification.jsx  # Cart notifications
├── config/
│   └── stripe.js             # Stripe configuration
├── context/
│   └── MusicContext.jsx      # Cart and music state
└── pages/music/
    └── Music.jsx             # Music page component
```

## Troubleshooting

### Common Issues:

**"Stripe is not configured"**
- Check that your publishable key is correctly set in `src/config/stripe.js`

**"Payment failed"**
- Ensure backend server is running on port 3001
- Check that secret key is set in `.env` file
- Verify CORS settings if deployed

**"Network error"**
- Make sure both frontend (5174) and backend (3001) servers are running
- Check browser console for detailed error messages

### Test vs Live Mode
- Test keys start with `pk_test_` and `sk_test_`
- Live keys start with `pk_live_` and `sk_live_`
- Never expose secret keys in frontend code

## Need Help?

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe React Integration](https://stripe.com/docs/stripe-js/react)
- Email: support@justmalikbeats.com
