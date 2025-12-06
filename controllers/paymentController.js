const Purchase = require('../models/Purchase');
const Track = require('../models/Track');
const { logger } = require('../config/database');
const { sendPurchaseConfirmation } = require('../services/emailService');
const crypto = require('crypto');

// Create payment intent and prepare purchase
exports.createPaymentIntent = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ error: "Stripe not configured" });
    }

    const { trackId, email } = req.body;
    const userId = req.user?.id; // Optional if user is logged in

    // Get track details
    const track = await Track.findById(trackId);
    if (!track || !track.isActive) {
      return res.status(404).json({ error: 'Track not found or unavailable' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(track.price * 100), // Convert to cents
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        trackId: track._id.toString(),
        trackTitle: track.title,
        userId: userId || 'guest',
        customerEmail: email
      },
      receipt_email: email
    });

    logger.info(`Payment intent created: ${paymentIntent.id} for track: ${track.title}`);

    res.send({
      clientSecret: paymentIntent.client_secret,
      trackId: track._id,
      amount: track.price
    });

  } catch (error) {
    logger.error("Error creating payment intent:", error);
    res.status(500).send({ 
      error: isProduction ? "Payment processing failed" : error.message 
    });
  }
};

// Webhook handler for Stripe events
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    logger.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handleSuccessfulPayment(paymentIntent);
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      logger.error(`Payment failed: ${failedPayment.id}`);
      break;

    default:
      logger.info(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};

// Handle successful payment
async function handleSuccessfulPayment(paymentIntent) {
  try {
    const { trackId, userId, customerEmail } = paymentIntent.metadata;

    // Get track details
    const track = await Track.findById(trackId);
    if (!track) {
      logger.error(`Track not found: ${trackId}`);
      return;
    }

    // Create purchase record
    const purchase = new Purchase({
      user: userId !== 'guest' ? userId : null,
      track: trackId,
      stripePaymentIntentId: paymentIntent.id,
      stripeChargeId: paymentIntent.latest_charge,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      status: 'completed',
      customerEmail: customerEmail,
      downloadToken: crypto.randomBytes(32).toString('hex'),
      downloadExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      maxDownloads: 3
    });

    await purchase.save();

    logger.info(`Purchase completed: ${purchase._id} for payment: ${paymentIntent.id}`);

    // Send confirmation email
    try {
      await sendPurchaseConfirmation(purchase, track, customerEmail);
    } catch (emailError) {
      logger.error('Failed to send confirmation email:', emailError);
      // Don't fail the purchase if email fails
    }

  } catch (error) {
    logger.error('Error handling successful payment:', error);
  }
}

// Verify purchase and get download link
exports.getDownloadLink = async (req, res) => {
  try {
    const { token } = req.params;

    const purchase = await Purchase.findOne({ downloadToken: token })
      .populate('track');

    if (!purchase) {
      return res.status(404).json({ error: 'Invalid download token' });
    }

    // Check if expired
    if (purchase.downloadExpiry < new Date()) {
      return res.status(403).json({ error: 'Download link has expired' });
    }

    // Check download count
    if (purchase.downloadCount >= purchase.maxDownloads) {
      return res.status(403).json({ error: 'Maximum downloads reached' });
    }

    // Increment download count
    purchase.downloadCount += 1;
    await purchase.save();

    logger.info(`Download initiated: ${purchase._id}, count: ${purchase.downloadCount}`);

    // Generate secure download URL (signed URL or temporary token)
    const downloadUrl = purchase.track.audioFileUrl;

    res.json({
      downloadUrl,
      track: {
        title: purchase.track.title,
        artist: purchase.track.artist
      },
      downloadsRemaining: purchase.maxDownloads - purchase.downloadCount,
      expiresAt: purchase.downloadExpiry
    });

  } catch (error) {
    logger.error('Error getting download:', error);
    res.status(500).json({ 
      error: isProduction ? "Download unavailable" : error.message 
    });
  }
};

// Get user's purchases
exports.getUserPurchases = async (req, res) => {
  try {
    const userId = req.user.id;

    const purchases = await Purchase.find({ user: userId })
      .populate('track')
      .sort({ purchasedAt: -1 });

    res.json({ purchases });

  } catch (error) {
    logger.error('Error getting purchases:', error);
    res.status(500).json({ error: 'Failed to get purchases' });
  }
};
