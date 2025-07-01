import { loadStripe } from "@stripe/stripe-js";

// Replace with your actual Stripe publishable key
// For development, you can use the test key directly here
// In production, you'd get this from environment variables
const stripePublishableKey = "pk_test_51RfXDiCfi4XDTO4EKNXqPMeIOx3Asypd3us8NJnwIcc8NfanUU8wt3XJh3zc8hhFFoskD3mXNLspnV1EDKycW4ej00mcCOYVpU";

let stripePromise;

try {
  stripePromise = loadStripe(stripePublishableKey);
} catch (error) {
  console.error("Failed to load Stripe:", error);
  stripePromise = null;
}

export default stripePromise;
