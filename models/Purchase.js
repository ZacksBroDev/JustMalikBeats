const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  track: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track',
    required: true
  },
  stripePaymentIntentId: {
    type: String,
    required: true,
    unique: true
  },
  stripeChargeId: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'usd'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  downloadToken: {
    type: String,
    unique: true
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  maxDownloads: {
    type: Number,
    default: 3
  },
  downloadExpiry: {
    type: Date
  },
  customerEmail: {
    type: String,
    required: true
  },
  purchasedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate download token before saving
purchaseSchema.pre('save', function(next) {
  if (!this.downloadToken) {
    const crypto = require('crypto');
    this.downloadToken = crypto.randomBytes(32).toString('hex');
  }
  if (!this.downloadExpiry) {
    // Set expiry to 30 days from purchase
    this.downloadExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  next();
});

module.exports = mongoose.model('Purchase', purchaseSchema);
