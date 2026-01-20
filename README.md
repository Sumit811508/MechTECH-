# MECHTech - Vehicle Assistance Platform

A complete full-stack web application for on-road vehicle assistance services. Connect customers with certified mechanics for emergency repairs, towing, and maintenance services.

## 🚗 Features

### Core Functionality
- **Booking System**: Submit service requests with vehicle details
- **Contact Forms**: Send messages to the support team
- **Mechanic Directory**: Browse certified mechanics with ratings and specializations
- **Admin Dashboard**: Manage bookings, messages, and mechanics
- **Real-time Updates**: Live data synchronization across all components

### Technical Features
- **Full-Stack Architecture**: Python Flask backend with SQLite database
- **Responsive Design**: Mobile-first design that works on all devices
- **RESTful API**: Complete API with 19 endpoints for all operations
- **Form Validation**: Client and server-side validation with error handling
- **CORS Enabled**: Cross-origin resource sharing for seamless integration

## 🛠️ Tech Stack

### Backend
- **Python Flask**: REST API server
- **SQLite**: Database for data persistence
- **Flask-CORS**: Cross-origin resource sharing

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Responsive styling with modern design
- **Vanilla JavaScript**: Interactive functionality
- **Font Awesome**: Icons and visual elements

## 📁 Project Structure

```
MechTECH-/
├── server/
│   ├── app.py              # Flask backend server
│   ├── mechtech.db         # SQLite database (auto-generated)
│   └── README.md           # Backend documentation
├── index.html              # Homepage
├── booking.html            # Service booking form
├── contact.html            # Contact form
├── services.html           # Services & mechanics listing
├── admin.html              # Admin dashboard
├── test.html               # System testing page
├── script.js               # Frontend JavaScript
├── style.css               # Global styles
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.7+ installed
- Web browser (Chrome, Firefox, Safari, Edge)

### Installation & Setup

1. **Clone or Download** the project files

2. **Start the Backend Server**
   ```bash
   cd MechTECH-/server
   python app.py
   ```
   The server will start on `http://localhost:5000`

3. **Open the Application**
   - Open `index.html` in your web browser
   - Or navigate to `file:///path/to/MechTECH-/index.html`

### Alternative: Run from Browser
Since this is a static frontend with a backend API, you can:
1. Start the backend server as above
2. Open any `.html` file directly in your browser
3. The frontend will connect to the running backend

## 📋 Usage Guide

### For Customers

1. **Browse Services**: Visit `services.html` to see available services and mechanics
2. **Book a Service**: Use `booking.html` to submit a service request
3. **Contact Support**: Use `contact.html` to send messages to the team
4. **View Mechanics**: Check `services.html` for mechanic profiles and ratings

### For Administrators

1. **Access Admin Panel**: Open `admin.html` in your browser
2. **Manage Bookings**: View and update booking statuses
3. **Handle Messages**: Read and manage customer inquiries
4. **Monitor Mechanics**: View mechanic information and availability

### Testing

1. **System Test**: Open `test.html` to verify all components are working
2. **API Testing**: Use the test page to submit sample bookings and contacts
3. **Manual Testing**: Navigate through all pages and test forms

## 🔌 API Endpoints

### Health & Info
- `GET /health` - Health check
- `GET /` - API information

### Bookings
- `POST /api/booking` - Create new booking
- `GET /api/booking` - List all bookings
- `GET /api/booking/:id` - Get specific booking
- `PUT /api/booking/:id` - Update booking status
- `DELETE /api/booking/:id` - Cancel booking

### Contact
- `POST /api/contact` - Submit contact message
- `GET /api/contact` - List all messages
- `GET /api/contact/:id` - Get specific message

### Mechanics
- `GET /api/mechanics` - List all mechanics
- `GET /api/mechanics/:id` - Get mechanic details

## 🎨 Pages Overview

### Public Pages
- **index.html**: Landing page with hero section and navigation
- **services.html**: Service offerings and mechanic directory
- **booking.html**: Service request form with vehicle details
- **contact.html**: Contact form for customer inquiries
- **about.html**: Company information and services

### Admin Pages
- **admin.html**: Complete admin dashboard with data management
- **dashboard.html**: Alternative dashboard view

### Utility Pages
- **test.html**: System verification and testing
- **login.html**: Authentication (UI only, not functional)

## 🗄️ Database Schema

### Tables
- **users**: User accounts (prepared for future auth)
- **bookings**: Service booking requests
- **contact_messages**: Customer inquiries
- **mechanics**: Mechanic profiles and information

### Sample Data
The application includes 4 pre-seeded mechanics with ratings and specializations.

## 🔧 Configuration

### Backend Configuration
The Flask app runs on port 5000 by default. To change:
```python
# In server/app.py
if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)  # Change port here
```

### CORS Settings
CORS is configured to allow localhost origins. For production:
```python
CORS(app, origins=['https://yourdomain.com'])
```

## 🧪 Testing

### Automated Testing
- Open `test.html` for comprehensive system testing
- Tests backend connectivity, database, and API endpoints
- Provides real-time status indicators

### Manual Testing Checklist
- [ ] Backend server starts without errors
- [ ] Database tables are created automatically
- [ ] Sample mechanics data is loaded
- [ ] All HTML pages load correctly
- [ ] Forms submit successfully
- [ ] Admin dashboard displays data
- [ ] Mobile responsiveness works
- [ ] No console errors in browser

## 🚨 Troubleshooting

### Backend Won't Start
- Ensure Python 3.7+ is installed
- Check for port 5000 conflicts
- Verify no other Flask apps are running

### Forms Not Submitting
- Confirm backend server is running
- Check browser console for JavaScript errors
- Verify CORS settings allow the request

### Database Issues
- Delete `mechtech.db` and restart server (it will recreate)
- Check file permissions in the server directory

### Frontend Not Loading
- Ensure all files are in the same directory
- Check file paths in HTML includes
- Try different browsers

## 🔒 Security Notes

- This is a demonstration application
- No authentication is implemented
- CORS is permissive for development
- Database contains sample data only
- Not suitable for production without modifications

## 📈 Future Enhancements

### Planned Features
- User authentication and accounts
- Real-time notifications
- GPS location services
- Payment integration
- Mechanic availability scheduling
- Review and rating system
- Mobile app companion

### Technical Improvements
- JWT authentication
- Rate limiting enhancements
- Database migrations
- API documentation (Swagger)
- Unit and integration tests
- Docker containerization

## 📞 Support

This is a demonstration project. For questions or issues:
1. Check the troubleshooting section above
2. Review the test page for system status
3. Check browser console for errors
4. Verify backend server logs

## 📄 License

This project is for educational and demonstration purposes.

---

**Built with ❤️ for vehicle assistance services**
