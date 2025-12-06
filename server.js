const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Import database and controllers
const { connectDB, logger } = require("./config/database.js");
const authRoutes = require("./routes/authRoutes.js");
const trackRoutes = require("./routes/trackRoutes.js");
const paymentRoutes = require("./routes/paymentRoutes.js");

dotenv.config();

// Connect to MongoDB
connectDB();

// Check if we have a valid Stripe secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey || !stripeSecretKey.startsWith("sk_")) {
  logger.warn("⚠️  Invalid or missing STRIPE_SECRET_KEY in .env file");
  logger.warn(
    "   Please add your actual Stripe secret key (starts with sk_test_ or sk_live_)"
  );
  logger.warn("   Payments will not work until this is fixed.");
}

const stripe =
  stripeSecretKey && stripeSecretKey.startsWith("sk_")
    ? new Stripe(stripeSecretKey)
    : null;

// Make stripe available to controllers
global.stripe = stripe;
global.isProduction = process.env.NODE_ENV === "production";

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === "production";

// Security middleware
if (isProduction) {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "https://api.stripe.com"],
          frameSrc: [
            "'self'",
            "https://js.stripe.com",
            "https://hooks.stripe.com",
          ],
          fontSrc: ["'self'", "data:"],
        },
      },
    })
  );
} else {
  logger.info("🔓 CSP completely disabled for development");
  app.use((req, res, next) => {
    res.removeHeader("Content-Security-Policy");
    res.removeHeader("Content-Security-Policy-Report-Only");
    res.removeHeader("X-Content-Security-Policy");
    res.removeHeader("X-WebKit-CSP");
    res.setHeader(
      "Content-Security-Policy",
      "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; img-src * data: blob:; font-src *; connect-src *; media-src *; object-src *; child-src *; form-action *; frame-ancestors *; base-uri *;"
    );
    next();
  });
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Limit login attempts
  message: "Too many login attempts, please try again later.",
});

// Apply rate limiting
app.use("/api/", limiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/admin-login", authLimiter);

// Webhook route (raw body needed for Stripe signature verification)
app.post(
  "/api/webhooks/stripe",
  express.raw({ type: "application/json" }),
  (req, res, next) => {
    next();
  }
);

// CORS middleware
app.use(
  cors({
    origin: isProduction ? process.env.ALLOWED_ORIGINS?.split(",") : "*",
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });
  next();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    stripe: stripe ? "configured" : "not configured",
    message: stripe ? "Ready for payments" : "Stripe secret key needed",
    database: "connected",
    environment: isProduction ? "production" : "development",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tracks", trackRoutes);
app.use("/api/payments", paymentRoutes);

// Legacy routes for backward compatibility
// Create payment intent (deprecated - use /api/payments/create-intent)
app.post("/api/create-payment-intent", async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({
        error:
          "Stripe not configured. Please check your environment variables.",
      });
    }

    const { items, amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
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
    logger.error("Error creating payment intent:", error);
    res
      .status(500)
      .send({
        error: isProduction ? "Payment processing failed" : error.message,
      });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error("Unhandled error:", err);

  res.status(err.status || 500).json({
    error: isProduction ? "An error occurred" : err.message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
});

app.listen(PORT, () => {
  logger.info(`Payment server running on port ${PORT}`);
  if (isProduction) {
    logger.warn("⚠️  Running in PRODUCTION mode");
  } else {
    logger.info("🔧 Running in DEVELOPMENT mode");
  }
});
