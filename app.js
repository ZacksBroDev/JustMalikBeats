const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const { logger } = require("./config/database.js");
const authRoutes = require("./routes/authRoutes.js");
const trackRoutes = require("./routes/trackRoutes.js");
const paymentRoutes = require("./routes/paymentRoutes.js");

const createApp = ({ stripe = null, isProduction = false } = {}) => {
  global.stripe = stripe;
  global.isProduction = isProduction;

  const app = express();

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
      }),
    );
  } else {
    logger.info("Development CSP disabled");
    app.use((req, res, next) => {
      res.removeHeader("Content-Security-Policy");
      res.removeHeader("Content-Security-Policy-Report-Only");
      res.setHeader(
        "Content-Security-Policy",
        "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; img-src * data: blob:; font-src *; connect-src *; media-src *; object-src *; child-src *; form-action *; frame-ancestors *; base-uri *;",
      );
      next();
    });
  }

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many login attempts, please try again later.",
  });

  app.use("/api/", limiter);
  app.use("/api/auth/login", authLimiter);
  app.use("/api/auth/admin-login", authLimiter);

  app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

  app.use(
    cors({
      origin: isProduction ? process.env.ALLOWED_ORIGINS?.split(",") : "*",
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
    next();
  });

  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      stripe: stripe ? "configured" : "not configured",
      message: stripe ? "Ready for payments" : "Stripe secret key needed",
      database: "connected",
      environment: isProduction ? "production" : "development",
    });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/tracks", trackRoutes);
  app.use("/api/payments", paymentRoutes);

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
        amount,
        currency: "usd",
        automatic_payment_methods: { enabled: true },
        metadata: { items: JSON.stringify(items) },
      });

      res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      logger.error("Error creating payment intent:", error);
      res.status(500).send({
        error: isProduction ? "Payment processing failed" : error.message,
      });
    }
  });

  app.use((_err, req, res, _next) => {
    logger.error("Unhandled error:", _err);
    res.status(_err.status || 500).json({
      error: isProduction ? "An error occurred" : _err.message,
      ...(isProduction ? {} : { stack: _err.stack }),
    });
  });

  return app;
};

module.exports = createApp;
