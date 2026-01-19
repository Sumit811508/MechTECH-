const express = require('express');
const { dbHelpers } = require('../config/database');

const router = express.Router();

// Get all mechanics (with filters)
router.get('/', async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.query;

    let query = 'SELECT id, name, email, phone, latitude, longitude, rating, experience_years, specializations, verified FROM mechanics WHERE verified = 1';
    let params = [];

    // Basic location filtering (if coordinates provided)
    if (latitude && longitude && radius) {
      // Simple distance calculation (you might want to use more sophisticated geo-queries)
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
      const rad = parseFloat(radius) || 50; // km

      // Simplified filtering - in production use proper GIS queries
      query += ' AND (latitude IS NOT NULL AND longitude IS NOT NULL)';
    }

    query += ' ORDER BY rating DESC, experience_years DESC';

    const mechanics = await dbHelpers.all(query, params);

    res.json({
      total: mechanics.length,
      mechanics
    });
  } catch (error) {
    console.error('Get mechanics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get mechanic by ID
router.get('/:mechanicId', async (req, res) => {
  try {
    const { mechanicId } = req.params;

    const mechanic = await dbHelpers.get(
      'SELECT id, name, email, phone, latitude, longitude, rating, experience_years, specializations, verified, created_at FROM mechanics WHERE id = ?',
      [mechanicId]
    );

    if (!mechanic) {
      return res.status(404).json({ error: 'Mechanic not found' });
    }

    // Get service history
    const history = await dbHelpers.all(
      `SELECT sh.id, sh.service_date, sh.cost, sh.rating, sh.review, b.service_type, b.vehicle_type
       FROM service_history sh
       LEFT JOIN bookings b ON sh.booking_id = b.id
       WHERE sh.mechanic_id = ?
       ORDER BY sh.service_date DESC
       LIMIT 10`,
      [mechanicId]
    );

    res.json({
      mechanic,
      recentServices: history
    });
  } catch (error) {
    console.error('Get mechanic error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get mechanic availability
router.get('/:mechanicId/availability', async (req, res) => {
  try {
    const { mechanicId } = req.params;

    const mechanic = await dbHelpers.get(
      'SELECT id, name FROM mechanics WHERE id = ?',
      [mechanicId]
    );

    if (!mechanic) {
      return res.status(404).json({ error: 'Mechanic not found' });
    }

    // Get pending and in-progress bookings
    const bookings = await dbHelpers.all(
      `SELECT id, status, created_at FROM bookings
       WHERE mechanic_id = ? AND (status = 'pending' OR status = 'in-progress')
       ORDER BY created_at ASC`,
      [mechanicId]
    );

    res.json({
      mechanic,
      availableSlots: Math.max(0, 5 - bookings.filter(b => b.status === 'in-progress').length),
      currentBookings: bookings.length
    });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
