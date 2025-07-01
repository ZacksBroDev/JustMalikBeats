import express from "express";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// Check if we have a valid Stripe secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey || !stripeSecretKey.startsWith('sk_')) {
  console.warn('⚠️  Invalid or missing STRIPE_SECRET_KEY in .env file');
  console.warn('   Please add your actual Stripe secret key (starts with sk_test_ or sk_live_)');
  console.warn('   Payments will not work until this is fixed.');
}

const stripe = stripeSecretKey && stripeSecretKey.startsWith('sk_') 
  ? new Stripe(stripeSecretKey)
  : null;

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    stripe: stripe ? 'configured' : 'not configured',
    message: stripe ? 'Ready for payments' : 'Stripe secret key needed'
  });
});

// Create payment intent
app.post("/api/create-payment-intent", async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ 
        error: "Stripe not configured. Please check your environment variables." 
      });
    }

    const { items, amount } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        items: JSON.stringify(items),
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).send({ error: error.message });
  }
});

// Handle successful payments
app.post("/api/payment-success", async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    // Retrieve the payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      // Here you would typically:
      // 1. Save the purchase to your database
      // 2. Send download links to the customer
      // 3. Update inventory

      console.log("Payment successful:", paymentIntent.id);
      res.send({ success: true });
    } else {
      res.status(400).send({ error: "Payment not successful" });
    }
  } catch (error) {
    console.error("Error handling payment success:", error);
    res.status(500).send({ error: error.message });
  }
});

// Get downloadable content (protected route)
app.get("/api/downloads/:trackId", async (req, res) => {
  try {
    const { trackId } = req.params;

    // Here you would verify that the user has purchased this track
    // For now, we'll just return a mock download link

    res.send({
      downloadUrl: `https://example.com/downloads/track-${trackId}.mp3`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });
  } catch (error) {
    console.error("Error getting download:", error);
    res.status(500).send({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Payment server running on port ${PORT}`);
});
