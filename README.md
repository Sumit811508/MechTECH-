# MechTECH Backend API

Complete backend server for the MechTECH on-road vehicle assistance platform.

## Features

- ✅ **User Authentication** - Sign up, login, profile management
- ✅ **Booking Management** - Create, view, update, and cancel service bookings
- ✅ **Contact Messages** - Customer support inquiries
- ✅ **Mechanic Directory** - Browse verified mechanics with ratings and availability
- ✅ **Service History** - Track completed services and reviews
- ✅ **Rate Limiting** - Protection against abuse
- ✅ **Input Validation** - Comprehensive validation on all endpoints
- ✅ **Error Handling** - Structured error responses
- ✅ **CORS Support** - Cross-origin requests enabled

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite** - Database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing
- **helmet** - Security headers
- **morgan** - HTTP logging
- **express-rate-limit** - Rate limiting

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Steps

1. **Navigate to server directory**
```bash
cd server
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Edit `.env` file with your settings:
```env
PORT=3000
NODE_ENV=development
DB_PATH=./database.db
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

4. **Start the server**
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Documentation

### Base URL
```
http://localhost:3000
```

### Response Format
All responses are in JSON format:

**Success Response:**
```json
{
  "message": "Success message",
  "data": { /* response data */ }
}
```

**Error Response:**
```json
{
  "error": "error_type",
  "fields": { /* field-specific errors */ },
  "message": "Detailed error message"
}
```

## Authentication Endpoints

### Sign Up
```
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "phone": "9876543210"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210"
  }
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210"
  }
}
```

### Get Profile
```
GET /api/auth/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "created_at": "2024-01-19T10:30:00Z"
  }
}
```

### Update Profile
```
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe Updated",
  "phone": "9876543210"
}
```

## Booking Endpoints

### Create Booking
```
POST /api/booking
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "vehicleType": "Car",
  "brand": "Maruti",
  "model": "Swift",
  "service_type": "Breakdown Repair",
  "description": "Engine not starting",
  "location": "Downtown area"
}
```

**Response:**
```json
{
  "message": "Booking submitted successfully",
  "id": "BK000001",
  "bookingId": 1,
  "status": "pending"
}
```

### Get User Bookings
```
GET /api/booking
Authorization: Bearer <token>
```

**Response:**
```json
{
  "bookings": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "service_type": "Breakdown Repair",
      "vehicle_type": "Car",
      "status": "pending",
      "created_at": "2024-01-19T10:30:00Z"
    }
  ]
}
```

### Get Specific Booking
```
GET /api/booking/:bookingId
```

### Update Booking Status
```
PUT /api/booking/:bookingId
Content-Type: application/json

{
  "status": "confirmed"
}
```

Valid statuses: `pending`, `confirmed`, `in-progress`, `completed`, `cancelled`

### Cancel Booking
```
DELETE /api/booking/:bookingId
```

## Contact Endpoints

### Submit Contact Message
```
POST /api/contact
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "message": "I have a question about your services"
}
```

**Response:**
```json
{
  "message": "Message received. We will contact you soon.",
  "id": 1
}
```

### Get All Messages
```
GET /api/contact
```

### Get Specific Message
```
GET /api/contact/:messageId
```

### Mark Message as Read
```
PUT /api/contact/:messageId/read
```

### Delete Message
```
DELETE /api/contact/:messageId
```

## Mechanics Endpoints

### List Mechanics
```
GET /api/mechanics
GET /api/mechanics?latitude=28.7041&longitude=77.1025&radius=50
```

**Response:**
```json
{
  "total": 5,
  "mechanics": [
    {
      "id": 1,
      "name": "Rajesh Kumar",
      "email": "rajesh@mechanics.com",
      "phone": "9876543210",
      "rating": 4.8,
      "experience_years": 10,
      "specializations": "Engine Repair, Electrical",
      "verified": 1
    }
  ]
}
```

### Get Mechanic Details
```
GET /api/mechanics/:mechanicId
```

**Response:**
```json
{
  "mechanic": {
    "id": 1,
    "name": "Rajesh Kumar",
    "email": "rajesh@mechanics.com",
    "rating": 4.8,
    "experience_years": 10
  },
  "recentServices": [
    {
      "id": 1,
      "service_type": "Breakdown Repair",
      "vehicle_type": "Car",
      "cost": 500,
      "rating": 5,
      "review": "Excellent service"
    }
  ]
}
```

### Get Mechanic Availability
```
GET /api/mechanics/:mechanicId/availability
```

**Response:**
```json
{
  "mechanic": {
    "id": 1,
    "name": "Rajesh Kumar"
  },
  "availableSlots": 3,
  "currentBookings": 2
}
```

## Error Codes

| Code | Error | Description |
|------|-------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input or validation error |
| 401 | Unauthorized | Authentication required or invalid token |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal server error |

## Database Schema

### Users
- `id` - Primary key
- `email` - User email (unique)
- `password` - Hashed password
- `name` - User full name
- `phone` - Phone number
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Bookings
- `id` - Primary key
- `user_id` - Foreign key to users
- `name` - Customer name
- `email` - Customer email
- `phone` - Customer phone
- `vehicle_type` - Type of vehicle
- `vehicle_brand` - Vehicle brand
- `vehicle_model` - Vehicle model
- `service_type` - Type of service
- `description` - Additional details
- `location` - Service location
- `latitude`, `longitude` - GPS coordinates
- `status` - Booking status
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Contact Messages
- `id` - Primary key
- `fullName` - Sender name
- `email` - Sender email
- `message` - Message content
- `status` - Message status (unread/read)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Mechanics
- `id` - Primary key
- `name` - Mechanic name
- `email` - Mechanic email
- `phone` - Phone number
- `latitude`, `longitude` - Location
- `rating` - Average rating
- `experience_years` - Years of experience
- `specializations` - Service specializations
- `verified` - Verification status

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Building
```bash
npm run build
```

## Deployment

### Production Checklist
- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Set `NODE_ENV=production`
- [ ] Use a production database (PostgreSQL/MySQL recommended)
- [ ] Enable HTTPS
- [ ] Set appropriate CORS origins
- [ ] Configure rate limiting appropriately
- [ ] Set up logging and monitoring
- [ ] Use environment-specific `.env` files

### Deployment Platforms
The backend can be deployed to:
- **Heroku** - `heroku create` and `git push heroku main`
- **Railway** - Connect GitHub repo
- **Render** - Deploy from GitHub
- **AWS** - Use Elastic Beanstalk or EC2
- **DigitalOcean** - App Platform or Droplet
- **Google Cloud** - Cloud Run or App Engine

## Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token-based authentication
- ✅ CORS protection
- ✅ Helmet.js security headers
- ✅ Input validation and sanitization
- ✅ Rate limiting per IP
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection

## Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Database Locked
Delete `database.db` and restart the server to reinitialize.

### JWT Token Expired
Generate a new token by logging in again.

### CORS Errors
Check the CORS configuration in `server.js` and ensure the frontend origin is whitelisted.

## API Testing

### Using cURL
```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"test123","confirmPassword":"test123"}'

# Create booking
curl -X POST http://localhost:3000/api/booking \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","vehicleType":"Car","brand":"Maruti","model":"Swift","service_type":"Breakdown Repair"}'
```

### Using Postman
1. Import the API endpoints listed above
2. Set Authorization header: `Bearer <token>`
3. Test each endpoint

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Create a pull request

## License

MIT License - feel free to use this code

## Support

For issues and questions, please contact: support@mechtech.example

---

**Version:** 1.0.0  
**Last Updated:** January 19, 2026
