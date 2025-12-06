const Track = require('../models/Track');
const { logger } = require('../config/database');

// Get all tracks
exports.getAllTracks = async (req, res) => {
  try {
    const { genre, minPrice, maxPrice, sort = '-releaseDate' } = req.query;
    
    let query = { isActive: true };
    
    if (genre) {
      query.genre = genre;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    const tracks = await Track.find(query).sort(sort);
    
    res.json({ tracks });
  } catch (error) {
    logger.error('Error getting tracks:', error);
    res.status(500).json({ error: 'Failed to get tracks' });
  }
};

// Get single track
exports.getTrack = async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);
    
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    
    res.json({ track });
  } catch (error) {
    logger.error('Error getting track:', error);
    res.status(500).json({ error: 'Failed to get track' });
  }
};

// Create new track (admin only)
exports.createTrack = async (req, res) => {
  try {
    const trackData = req.body;
    
    const track = new Track(trackData);
    await track.save();
    
    logger.info(`Track created: ${track.title} by ${req.user.id}`);
    
    res.status(201).json({ 
      message: 'Track created successfully',
      track 
    });
  } catch (error) {
    logger.error('Error creating track:', error);
    res.status(500).json({ error: 'Failed to create track' });
  }
};

// Update track (admin only)
exports.updateTrack = async (req, res) => {
  try {
    const track = await Track.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    
    logger.info(`Track updated: ${track.title} by ${req.user.id}`);
    
    res.json({ 
      message: 'Track updated successfully',
      track 
    });
  } catch (error) {
    logger.error('Error updating track:', error);
    res.status(500).json({ error: 'Failed to update track' });
  }
};

// Delete track (admin only)
exports.deleteTrack = async (req, res) => {
  try {
    const track = await Track.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    
    logger.info(`Track deleted: ${track.title} by ${req.user.id}`);
    
    res.json({ message: 'Track deleted successfully' });
  } catch (error) {
    logger.error('Error deleting track:', error);
    res.status(500).json({ error: 'Failed to delete track' });
  }
};

// Get latest releases
exports.getLatestReleases = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    
    const tracks = await Track.find({ isActive: true })
      .sort({ releaseDate: -1 })
      .limit(limit);
    
    res.json({ tracks });
  } catch (error) {
    logger.error('Error getting latest releases:', error);
    res.status(500).json({ error: 'Failed to get latest releases' });
  }
};
