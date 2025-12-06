const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  artist: {
    type: String,
    required: true,
    default: 'JustMalikBeats'
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stripeProductId: {
    type: String,
    required: true
  },
  stripePriceId: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  audioPreviewUrl: {
    type: String
  },
  audioFileUrl: {
    type: String,
    required: true
  },
  coverImageUrl: {
    type: String
  },
  bpm: {
    type: Number
  },
  key: {
    type: String
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  releaseDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

trackSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Track', trackSchema);
