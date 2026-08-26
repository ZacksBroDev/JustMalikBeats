const Stripe = require("stripe");
const dotenv = require("dotenv");

const { connectDB, logger } = require("./config/database.js");
const createApp = require("./app.js");

dotenv.config();

// Connect to MongoDB
connectDB();

// Check if we have a valid Stripe secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey || !stripeSecretKey.startsWith("sk_")) {
  logger.warn("⚠️  Invalid or missing STRIPE_SECRET_KEY in .env file");
  logger.warn(
    "   Please add your actual Stripe secret key (starts with sk_test_ or sk_live_)",
  );
  logger.warn("   Payments will not work until this is fixed.");
}

const stripe =
  stripeSecretKey && stripeSecretKey.startsWith("sk_")
    ? new Stripe(stripeSecretKey)
    : null;

const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === "production";

const app = createApp({ stripe, isProduction });

app.listen(PORT, () => {
  logger.info(`Payment server running on port ${PORT}`);
  if (isProduction) {
    logger.warn("⚠️  Running in PRODUCTION mode");
  } else {
    logger.info("🔧 Running in DEVELOPMENT mode");
  }
});
