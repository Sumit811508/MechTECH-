# MechTECH - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js v14 or higher
- npm or yarn

### Step 1: Install Dependencies

```bash
cd server
npm install
```

### Step 2: Start the Backend Server

```bash
npm start
```

You should see:
```
╔════════════════════════════════════════╗
║    MechTECH Backend Server Started     ║
╚════════════════════════════════════════╝

  Server: http://localhost:3000
```

### Step 3: Seed Sample Data (Optional)

In a new terminal:
```bash
cd server
npm run seed
```

This adds test data including:
- Sample users
- 4 verified mechanics
- Sample bookings
- Contact messages

**Test credentials:**
- Email: `john@mechtech.example`
- Password: `password123`

### Step 4: Open Frontend

Open `index.html` in your browser or run a local server:

```bash
# Python
python -m http.server 8000

# Or using Node.js http-server
npx http-server
```

Then visit: `http://localhost:8000`

### Step 5: Test the API

Click on "Book a Service" and submit the booking form. The backend will:
1. Validate the input
2. Save to the database
3. Return a booking ID
4. Show a success message

## 📋 What You Get

### Backend Features (Already Implemented)
✅ User authentication (Sign up & Login)
✅ Booking management system
✅ Contact form submission
✅ Mechanic directory
✅ Service history tracking
✅ Input validation
✅ Rate limiting
✅ Error handling
✅ JWT tokens
✅ SQLite database

### API Endpoints

**Authentication**
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires token)
- `PUT /api/auth/profile` - Update profile (requires token)

**Bookings**
- `POST /api/booking` - Create booking
- `GET /api/booking` - Get user bookings (requires token)
- `GET /api/booking/:id` - Get specific booking
- `PUT /api/booking/:id` - Update booking status
- `DELETE /api/booking/:id` - Cancel booking

**Contact**
- `POST /api/contact` - Submit contact message
- `GET /api/contact` - Get all messages
- `PUT /api/contact/:id/read` - Mark as read
- `DELETE /api/contact/:id` - Delete message

**Mechanics**
- `GET /api/mechanics` - List all mechanics
- `GET /api/mechanics/:id` - Get mechanic details
- `GET /api/mechanics/:id/availability` - Check availability

## 🧪 Testing

### Test Using Browser Console

```javascript
// Test booking
const booking = {
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
  body: JSON.stringify(booking)
})
.then(r => r.json())
.then(d => console.log(d));
```

### Run Automated Tests

```bash
cd server
npm test
```

## 📁 Project Structure

```
MechTECH-/
├── server/                  # Backend (Node.js/Express)
│   ├── config/
│   │   └── database.js     # SQLite setup
│   ├── routes/
│   │   ├── auth.js         # Auth endpoints
│   │   ├── booking.js      # Booking endpoints
│   │   ├── contact.js      # Contact endpoints
│   │   └── mechanics.js    # Mechanics endpoints
│   ├── utils/
│   │   ├── validators.js   # Input validation
│   │   └── auth.js         # JWT helpers
│   ├── scripts/
│   │   ├── seed.js         # Sample data
│   │   └── test-api.js     # API tests
│   ├── server.js           # Main server file
│   ├── package.json        # Dependencies
│   ├── .env                # Environment config
│   └── README.md           # Backend docs
├── index.html              # Frontend (already implemented)
├── script.js               # Frontend JS (already implemented)
├── style.css               # Styling (already implemented)
└── INTEGRATION_GUIDE.md    # Integration instructions
```

## 🔧 Configuration

Edit `server/.env` to customize:

```env
PORT=3000                           # Server port
NODE_ENV=development                # Environment
DB_PATH=./database.db              # Database location
JWT_SECRET=your_secret_key         # Change for production!
JWT_EXPIRE=7d                      # Token expiration
RATE_LIMIT_WINDOW_MS=900000        # Rate limit window
RATE_LIMIT_MAX_REQUESTS=100        # Max requests per window
```

## 📱 Frontend Forms

The frontend already has:

### Booking Form
- Name, Email, Phone
- Vehicle Type, Brand, Model
- Service Type (Breakdown, Battery, Towing, Tyre)
- Auto-submits to `/api/booking/`

### Contact Form
- Name, Email, Message
- Auto-submits to `/api/contact/`

### Login/Signup Modal
- Email, Password (Login)
- Name, Email, Password (Signup)
- Ready to integrate with `/api/auth/`

## 🔐 Security Features

- ✅ Password hashing (bcryptjs)
- ✅ JWT tokens
- ✅ CORS protection
- ✅ Rate limiting
- ✅ Helmet.js headers
- ✅ Input validation
- ✅ SQL injection prevention

## 🐛 Common Issues

### Port 3000 Already in Use

**Windows:**
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -i :3000
kill -9 <PID>
```

### CORS Error

The backend is already configured for CORS in development. If you get errors:
1. Make sure backend is running
2. Check that you're on `http://localhost:3000`
3. Clear browser cache

### Database Issues

Delete the database and restart:
```bash
cd server
rm database.db
npm start
```

## 📚 Documentation

- **Backend API Docs:** `server/README.md`
- **Integration Guide:** `INTEGRATION_GUIDE.md`
- **Frontend:** `index.html` (already complete)

## 🚀 Next Steps

1. ✅ Start backend: `npm start`
2. ✅ Seed data: `npm run seed` (optional)
3. ✅ Test API: `npm test`
4. ✅ Open frontend in browser
5. ✅ Submit a booking to verify everything works

## 💡 Tips

- Use browser DevTools (F12) → Network tab to watch API calls
- Check backend console for logs and errors
- Use test credentials: `john@mechtech.example` / `password123`
- The database resets when you delete `database.db`

## 📞 Support

If something isn't working:
1. Check the console (F12)
2. Check the backend logs
3. Make sure server is running on port 3000
4. Check `INTEGRATION_GUIDE.md` for troubleshooting

---

**You're all set! Your MechTECH backend is ready to use.** 🎉

Start with: `cd server && npm start`
