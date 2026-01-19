# Frontend Integration Guide

This document explains how to connect the MechTECH frontend to the backend API.

## Backend Setup

The backend API is running on `http://localhost:3000`.

### Starting the Backend

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The server will start on `http://localhost:3000` and you should see:
```
╔════════════════════════════════════════╗
║    MechTECH Backend Server Started     ║
╚════════════════════════════════════════╝

  Server: http://localhost:3000
  Environment: development
```

## API Integration Points

### 1. Authentication

**Sign Up** - `POST /api/auth/signup`
```javascript
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    confirmPassword: 'password123',
    phone: '9876543210'
  })
});
const data = await response.json();
// data.token - JWT token to use for authenticated requests
// localStorage.setItem('authToken', data.token);
```

**Login** - `POST /api/auth/login`
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});
const data = await response.json();
// localStorage.setItem('authToken', data.token);
```

### 2. Bookings

**Create Booking** - `POST /api/booking`
The current `script.js` already handles this! The booking form submits to:
```javascript
fetch('/api/booking/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
```

**Get User Bookings** - `GET /api/booking`
```javascript
const token = localStorage.getItem('authToken');
const response = await fetch('/api/booking', {
  method: 'GET',
  headers: { 'Authorization': `Bearer ${token}` }
});
const data = await response.json();
// data.bookings - array of user's bookings
```

### 3. Contact Messages

**Submit Contact** - `POST /api/contact`
The current `script.js` already handles this! The contact form submits to:
```javascript
fetch('/api/contact/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
```

## Frontend Configuration

### Update API Base URL (if needed)

If running on a different port or domain, update all fetch URLs:

**In `script.js`:**
```javascript
// Change from:
fetch('/api/booking/', ...)

// To:
fetch('http://localhost:3000/api/booking/', ...)
```

Or set a global variable:
```javascript
const API_BASE = 'http://localhost:3000';

// Then use:
fetch(`${API_BASE}/api/booking/`, ...)
```

## Testing the Integration

### Method 1: Using Browser Console

1. Open DevTools (F12)
2. Go to Console tab
3. Test booking submission:

```javascript
const bookingData = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '9876543210',
  vehicleType: 'Car',
  brand: 'Maruti',
  model: 'Swift',
  service_type: 'Breakdown Repair'
};

fetch('/api/booking/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(bookingData)
})
.then(r => r.json())
.then(d => console.log(d));
```

### Method 2: Using the Test Script

Run the API test script:
```bash
cd server
npm test
```

## Database Setup

### Seed Sample Data

To populate the database with sample mechanics and test data:

```bash
cd server
npm run seed
```

This will add:
- Sample users (john@mechtech.example, jane@mechtech.example)
- 4 verified mechanics with ratings
- Sample bookings
- Sample contact messages

Sample credentials:
- Email: john@mechtech.example
- Password: password123

## Monitoring API Calls

1. Open DevTools (F12)
2. Go to Network tab
3. Make requests from the frontend
4. Watch the requests appear in the Network tab
5. Click on each request to see:
   - Request headers and body
   - Response status and body

## Troubleshooting

### CORS Error
If you see: `Access to XMLHttpRequest blocked by CORS policy`

The backend CORS is already configured for development. If using a different frontend URL, update `server.js`:

```javascript
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5000', 'your-frontend-url'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

### "Cannot POST /api/booking/" Error

Make sure:
1. Backend server is running (`npm start`)
2. You're using the correct port (default: 3000)
3. The URL path is correct

### Database Locked Error

Delete `server/database.db` and restart the server:
```bash
cd server
rm database.db  # On Windows: del database.db
npm start
```

## API Response Handling

### Success Response (201)
```json
{
  "message": "Booking submitted successfully",
  "id": "BK000001",
  "bookingId": 1,
  "status": "pending"
}
```

### Error Response (400)
```json
{
  "error": "validation",
  "fields": {
    "name": "Valid name required",
    "email": "Valid email required"
  }
}
```

The frontend `script.js` already handles:
- Displaying toast messages for success/error
- Showing field-specific errors
- Loading states on buttons
- Form reset after success

## Production Deployment

### Frontend
Build and deploy to:
- Netlify (connect GitHub repo)
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

### Backend
Deploy to:
- Heroku
- Railway
- Render
- AWS (Elastic Beanstalk, EC2, or Lambda)
- Google Cloud Run
- DigitalOcean

For production:
1. Change JWT_SECRET in `.env`
2. Update API URLs in frontend
3. Set up HTTPS
4. Configure CORS for production domains
5. Set up database backups

## Additional Resources

- Backend API Documentation: `server/README.md`
- Express.js Docs: https://expressjs.com
- SQLite Documentation: https://www.sqlite.org/docs.html
- JWT Tutorial: https://jwt.io/introduction

---

**Questions?** Check the backend logs or the API documentation!
