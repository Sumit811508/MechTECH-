const express = require('express');
const { dbHelpers } = require('../config/database');
const validators = require('../utils/validators');

const router = express.Router();

// Submit contact message
router.post('/', async (req, res) => {
  try {
    const { fullName, email, message } = req.body;

    // Validate contact data
    const validation = validators.validateContact({ fullName, email, message });

    if (!validation.isValid) {
      return res.status(400).json({
        error: 'validation',
        fields: validation.errors
      });
    }

    // Insert contact message
    const result = await dbHelpers.run(
      'INSERT INTO contact_messages (fullName, email, message, status) VALUES (?, ?, ?, ?)',
      [fullName, email, message, 'unread']
    );

    res.status(201).json({
      message: 'Message received. We will contact you soon.',
      id: result.id
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all contact messages (admin only - for now just return with id validation)
router.get('/', async (req, res) => {
  try {
    const messages = await dbHelpers.all(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );

    res.json({
      total: messages.length,
      messages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get contact message by ID
router.get('/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await dbHelpers.get(
      'SELECT * FROM contact_messages WHERE id = ?',
      [messageId]
    );

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ message });
  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark message as read
router.put('/:messageId/read', async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await dbHelpers.get(
      'SELECT id FROM contact_messages WHERE id = ?',
      [messageId]
    );

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    await dbHelpers.run(
      'UPDATE contact_messages SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['read', messageId]
    );

    res.json({
      message: 'Message marked as read',
      messageId
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete contact message
router.delete('/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await dbHelpers.get(
      'SELECT id FROM contact_messages WHERE id = ?',
      [messageId]
    );

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    await dbHelpers.run(
      'DELETE FROM contact_messages WHERE id = ?',
      [messageId]
    );

    res.json({
      message: 'Message deleted successfully',
      messageId
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
