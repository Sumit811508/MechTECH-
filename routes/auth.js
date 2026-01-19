const express = require('express');
const bcrypt = require('bcryptjs');
const { dbHelpers } = require('../config/database');
const { generateToken, verifyToken } = require('../utils/auth');
const validators = require('../utils/validators');

const router = express.Router();

// Sign Up
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;

    // Validate input
    const validation = validators.validateSignUp({ name, email, password, confirmPassword });
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'validation',
        fields: validation.errors
      });
    }

    // Check if user already exists
    const existingUser = await dbHelpers.get(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser) {
      return res.status(400).json({
        error: 'validation',
        fields: { email: 'Email already registered' }
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await dbHelpers.run(
      'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, phone || null]
    );

    const token = generateToken(result.id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: result.id,
        name,
        email,
        phone: phone || null
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    const validation = validators.validateLogin({ email, password });
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'validation',
        fields: validation.errors
      });
    }

    // Find user
    const user = await dbHelpers.get(
      'SELECT id, name, email, password, phone FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      return res.status(401).json({
        error: 'validation',
        fields: { email: 'Email or password is incorrect' }
      });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        error: 'validation',
        fields: { password: 'Email or password is incorrect' }
      });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile (requires authentication)
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const user = await dbHelpers.get(
      'SELECT id, name, email, phone, created_at FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const { name, phone } = req.body;

    if (name && !validators.isValidName(name)) {
      return res.status(400).json({
        error: 'validation',
        fields: { name: 'Valid name required' }
      });
    }

    if (phone && !validators.isValidPhone(phone)) {
      return res.status(400).json({
        error: 'validation',
        fields: { phone: 'Valid phone number required' }
      });
    }

    const updateFields = [];
    const updateValues = [];

    if (name) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (phone) {
      updateFields.push('phone = ?');
      updateValues.push(phone);
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(decoded.userId);

    if (updateFields.length > 1) {
      await dbHelpers.run(
        `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }

    const user = await dbHelpers.get(
      'SELECT id, name, email, phone FROM users WHERE id = ?',
      [decoded.userId]
    );

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
