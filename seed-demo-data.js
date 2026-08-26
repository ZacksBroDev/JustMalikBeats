require('dotenv').config();
const mongoose = require('mongoose');
const Track = require('./models/Track');

const demoTracks = [
  {
    title: 'Denver Nights',
    artist: 'JustMalikBeats',
    price: 2.99,
    stripeProductId: 'prod_demo_denver_nights',
    stripePriceId: 'price_demo_denver_nights',
    genre: 'Hip-Hop',
    duration: '3:24',
    description: 'A late-night hip-hop instrumental for demo purposes.',
    audioPreviewUrl: '/audio/previews/denver-nights.mp3',
    audioFileUrl: '/audio/previews/denver-nights.mp3',
    coverImageUrl: '/294698_beats_icon.png',
    bpm: 92,
    key: 'C Minor',
    tags: ['hip-hop', 'night', 'demo'],
    isActive: true,
  },
  {
    title: 'Mountain High',
    artist: 'JustMalikBeats',
    price: 3.99,
    stripeProductId: 'prod_demo_mountain_high',
    stripePriceId: 'price_demo_mountain_high',
    genre: 'Trap',
    duration: '2:56',
    description: 'A high-energy trap instrumental for demo purposes.',
    audioPreviewUrl: '/audio/previews/mountain-high.mp3',
    audioFileUrl: '/audio/previews/mountain-high.mp3',
    coverImageUrl: '/294698_beats_icon.png',
    bpm: 140,
    key: 'F Minor',
    tags: ['trap', '808', 'demo'],
    isActive: true,
  },
  {
    title: 'Studio Sessions',
    artist: 'JustMalikBeats',
    price: 4.99,
    stripeProductId: 'prod_demo_studio_sessions',
    stripePriceId: 'price_demo_studio_sessions',
    genre: 'R&B',
    duration: '4:12',
    description: 'A smooth R&B instrumental for demo purposes.',
    audioPreviewUrl: '/audio/previews/studio-sessions.mp3',
    audioFileUrl: '/audio/previews/studio-sessions.mp3',
    coverImageUrl: '/294698_beats_icon.png',
    bpm: 84,
    key: 'A Minor',
    tags: ['rnb', 'smooth', 'demo'],
    isActive: true,
  },
];

const seedDemoData = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/justmalikbeats';

  await mongoose.connect(mongoURI);
  await Track.deleteMany({ stripeProductId: /^prod_demo_/ });
  await Track.insertMany(demoTracks);

  console.log(`Seeded ${demoTracks.length} demo tracks.`);
};

seedDemoData()
  .catch(error => {
    console.error('Demo seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });