const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { logger } = require('../config/database');

// Validation rules
exports.registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
];

exports.loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists(),
];

// Register new user
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, password, name } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      name,
      role: 'user'
    });
    
    await user.save();
    
    // Generate token
    const token = generateToken(user._id, user.role);
    
    logger.info(`New user registered: ${email}`);
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
    
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Generate token
    const token = generateToken(user._id, user.role);
    
    logger.info(`User logged in: ${email}`);
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
    
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Admin login (separate endpoint with password)
exports.adminLogin = async (req, res) => {
  try {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword || password !== adminPassword) {
      return res.status(401).json({ error: 'Invalid admin password' });
    }
    
    // Find or create admin user
    let admin = await User.findOne({ role: 'admin' });
    
    if (!admin) {
      // Create default admin
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      admin = new User({
        email: 'admin@justmalikbeats.com',
        password: hashedPassword,
        name: 'Admin',
        role: 'admin'
      });
      await admin.save();
    }
    
    const token = generateToken(admin._id, admin.role);
    
    logger.info('Admin logged in');
    
    res.json({
      message: 'Admin login successful',
      token,
      user: {
        id: admin._id,
        role: admin.role
      }
    });
    
  } catch (error) {
    logger.error('Admin login error:', error);
    res.status(500).json({ error: 'Admin login failed' });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

// Logout (client-side token removal mainly)
exports.logout = (req, res) => {
  res.json({ message: 'Logout successful' });
};
