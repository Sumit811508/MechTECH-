require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const { dbHelpers } = require('./config/database');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/booking');
const contactRoutes = require('./routes/contact');
const mechanicsRoutes = require('./routes/mechanics');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:8080',
    'http://127.0.0.1:3000',
    'file://',
    '*' // In production, be more specific
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'MechTECH Backend is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/mechanics', mechanicsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'MechTECH Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: {
        signup: 'POST /api/auth/signup',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile',
        updateProfile: 'PUT /api/auth/profile'
      },
      bookings: {
        create: 'POST /api/booking',
        list: 'GET /api/booking',
        get: 'GET /api/booking/:bookingId',
        update: 'PUT /api/booking/:bookingId',
        cancel: 'DELETE /api/booking/:bookingId'
      },
      contact: {
        submit: 'POST /api/contact',
        list: 'GET /api/contact',
        get: 'GET /api/contact/:messageId',
        markRead: 'PUT /api/contact/:messageId/read',
        delete: 'DELETE /api/contact/:messageId'
      },
      mechanics: {
        list: 'GET /api/mechanics',
        get: 'GET /api/mechanics/:mechanicId',
        availability: 'GET /api/mechanics/:mechanicId/availability'
      }
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    documentation: '/'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║    MechTECH Backend Server Started     ║
╚════════════════════════════════════════╝

  Server: http://localhost:${PORT}
  Environment: ${process.env.NODE_ENV || 'development'}
  Database: ${process.env.DB_PATH || './database.db'}
  
  Available endpoints:
  - Health Check: http://localhost:${PORT}/health
  - API Root: http://localhost:${PORT}/
  
  Auth:
  - POST   /api/auth/signup
  - POST   /api/auth/login
  - GET    /api/auth/profile
  - PUT    /api/auth/profile
  
  Bookings:
  - POST   /api/booking (create)
  - GET    /api/booking (list user bookings)
  - GET    /api/booking/:id (get booking)
  - PUT    /api/booking/:id (update status)
  - DELETE /api/booking/:id (cancel)
  
  Contact:
  - POST   /api/contact (submit message)
  - GET    /api/contact (list all messages)
  - GET    /api/contact/:id (get message)
  - PUT    /api/contact/:id/read (mark read)
  - DELETE /api/contact/:id (delete)
  
  Mechanics:
  - GET    /api/mechanics (list available)
  - GET    /api/mechanics/:id (get mechanic)
  - GET    /api/mechanics/:id/availability
  
  Press Ctrl+C to stop the server
  `);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await dbHelpers.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await dbHelpers.close();
  process.exit(0);
});

module.exports = app;
