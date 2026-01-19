const express = require('express');
const { dbHelpers } = require('../config/database');
const { verifyToken } = require('../utils/auth');
const validators = require('../utils/validators');

const router = express.Router();

// Create a booking
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, vehicleType, brand, model, service_type, description, location } = req.body;

    // Validate booking data
    const validation = validators.validateBooking({
      name,
      email,
      phone,
      vehicleType,
      brand,
      model,
      service_type
    });

    if (!validation.isValid) {
      return res.status(400).json({
        error: 'validation',
        fields: validation.errors
      });
    }

    // Get user ID from token if provided
    let userId = null;
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        userId = decoded.userId;
      }
    }

    // Insert booking
    const result = await dbHelpers.run(
      `INSERT INTO bookings 
       (user_id, name, email, phone, vehicle_type, vehicle_brand, vehicle_model, service_type, description, location, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, name, email, phone || null, vehicleType, brand, model, service_type, description || null, location || null, 'pending']
    );

    // Generate reference ID
    const refId = `BK${String(result.id).padStart(6, '0')}`;

    res.status(201).json({
      message: 'Booking submitted successfully',
      id: refId,
      bookingId: result.id,
      status: 'pending'
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all bookings (admin only - for now allow with token)
router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const bookings = await dbHelpers.all(
      'SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC',
      [decoded.userId]
    );

    res.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get booking by ID
router.get('/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await dbHelpers.get(
      'SELECT * FROM bookings WHERE id = ?',
      [bookingId]
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update booking status
router.put('/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const booking = await dbHelpers.get(
      'SELECT id FROM bookings WHERE id = ?',
      [bookingId]
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await dbHelpers.run(
      'UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, bookingId]
    );

    res.json({
      message: 'Booking updated successfully',
      bookingId,
      status
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel booking
router.delete('/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await dbHelpers.get(
      'SELECT id, status FROM bookings WHERE id = ?',
      [bookingId]
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Cannot cancel this booking' });
    }

    await dbHelpers.run(
      'UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['cancelled', bookingId]
    );

    res.json({
      message: 'Booking cancelled successfully',
      bookingId
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
