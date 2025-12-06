const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken, optionalAuth } = require('../middleware/auth');

// Payment routes
router.post('/create-intent', optionalAuth, paymentController.createPaymentIntent);
router.post('/webhook', paymentController.handleWebhook); // Stripe webhook (no auth)
router.get('/download/:token', paymentController.getDownloadLink);

// User purchases (protected)
router.get('/my-purchases', verifyToken, paymentController.getUserPurchases);

module.exports = router;
