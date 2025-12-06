const express = require('express');
const router = express.Router();
const trackController = require('../controllers/trackController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// Public routes
router.get('/', trackController.getAllTracks);
router.get('/latest', trackController.getLatestReleases);
router.get('/:id', trackController.getTrack);

// Admin only routes
router.post('/', verifyToken, requireAdmin, trackController.createTrack);
router.put('/:id', verifyToken, requireAdmin, trackController.updateTrack);
router.delete('/:id', verifyToken, requireAdmin, trackController.deleteTrack);

module.exports = router;
