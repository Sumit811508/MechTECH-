"""
MechTECH Backend API - Python Flask Implementation
Testing and demonstration server
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import json
import sqlite3
import os
from functools import wraps
import hashlib
import secrets

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]}})

# Add response headers for CORS and OPTIONS handling
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = app.make_default_options_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        return response

# Database setup
DB_PATH = 'mechtech.db'

def get_db():
    """Get database connection"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize database tables"""
    conn = get_db()
    c = conn.cursor()
    
    # Users table
    c.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )''')
    
    # Bookings table
    c.execute('''CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        vehicle_type TEXT NOT NULL,
        vehicle_brand TEXT NOT NULL,
        vehicle_model TEXT NOT NULL,
        service_type TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )''')
    
    # Contact messages table
    c.execute('''CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'unread',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )''')
    
    # Mechanics table
    c.execute('''CREATE TABLE IF NOT EXISTS mechanics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        rating REAL DEFAULT 5.0,
        experience_years INTEGER,
        specializations TEXT,
        verified INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )''')
    
    conn.commit()
    conn.close()
    print("✅ Database initialized")

def seed_data():
    """Seed sample data"""
    conn = get_db()
    c = conn.cursor()
    
    # Check if mechanics already exist
    c.execute('SELECT COUNT(*) FROM mechanics')
    if c.fetchone()[0] == 0:
        mechanics = [
            ('Rajesh Kumar', 'rajesh@mechanics.example', '9876543211', 4.8, 15, 'Engine Repair, Electrical Systems', 1),
            ('Priya Singh', 'priya@mechanics.example', '9876543212', 4.7, 8, 'Tyre Service, Brake Systems', 1),
            ('Amit Patel', 'amit@mechanics.example', '9876543213', 4.9, 12, 'Battery Service, Towing', 1),
            ('Sunita Verma', 'sunita@mechanics.example', '9876543214', 4.6, 10, 'Transmission, Engine', 1),
        ]
        
        for mechanic in mechanics:
            c.execute('''INSERT INTO mechanics 
                        (name, email, phone, rating, experience_years, specializations, verified)
                        VALUES (?, ?, ?, ?, ?, ?, ?)''', mechanic)
        
        conn.commit()
        print("✅ Sample mechanics added")
    
    conn.close()

# ============ HEALTH & INFO ============
@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'OK',
        'message': 'MechTECH Backend is running',
        'timestamp': datetime.now().isoformat()
    }), 200

@app.route('/', methods=['GET'])
def info():
    """API information"""
    return jsonify({
        'name': 'MechTECH Backend API',
        'version': '1.0.0',
        'endpoints': {
            'health': 'GET /health',
            'auth': {
                'signup': 'POST /api/auth/signup',
                'login': 'POST /api/auth/login',
                'profile': 'GET /api/auth/profile',
            },
            'bookings': {
                'create': 'POST /api/booking',
                'list': 'GET /api/booking',
                'get': 'GET /api/booking/:id',
                'update': 'PUT /api/booking/:id',
                'cancel': 'DELETE /api/booking/:id'
            },
            'contact': {
                'submit': 'POST /api/contact',
                'list': 'GET /api/contact',
                'get': 'GET /api/contact/:id',
            },
            'mechanics': {
                'list': 'GET /api/mechanics',
                'get': 'GET /api/mechanics/:id',
            }
        }
    }), 200

# ============ BOOKING ENDPOINTS ============
@app.route('/api/booking', methods=['POST'])
def create_booking():
    """Create a new booking"""
    try:
        data = request.get_json()
        
        # Validation
        required = ['name', 'email', 'vehicleType', 'brand', 'model', 'service_type']
        errors = {}
        
        if not data.get('name'):
            errors['name'] = 'Name is required'
        if not data.get('email'):
            errors['email'] = 'Email is required'
        if not data.get('vehicleType'):
            errors['vehicleType'] = 'Vehicle type is required'
        if not data.get('brand'):
            errors['brand'] = 'Brand is required'
        if not data.get('model'):
            errors['model'] = 'Model is required'
        if not data.get('service_type'):
            errors['service_type'] = 'Service type is required'
        
        if errors:
            return jsonify({'error': 'validation', 'fields': errors}), 400
        
        conn = get_db()
        c = conn.cursor()
        
        c.execute('''INSERT INTO bookings 
                    (name, email, phone, vehicle_type, vehicle_brand, vehicle_model, service_type, description, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                  (data['name'], data['email'], data.get('phone'), data['vehicleType'],
                   data['brand'], data['model'], data['service_type'], data.get('description'), 'pending'))
        
        conn.commit()
        booking_id = c.lastrowid
        ref_id = f"BK{str(booking_id).zfill(6)}"
        conn.close()
        
        return jsonify({
            'message': 'Booking submitted successfully',
            'id': ref_id,
            'bookingId': booking_id,
            'status': 'pending'
        }), 201
    
    except Exception as e:
        return jsonify({'error': 'Internal server error', 'message': str(e)}), 500

@app.route('/api/booking', methods=['GET'])
def list_bookings():
    """List all bookings"""
    try:
        conn = get_db()
        c = conn.cursor()
        c.execute('SELECT * FROM bookings ORDER BY created_at DESC LIMIT 50')
        bookings = [dict(row) for row in c.fetchall()]
        conn.close()
        
        return jsonify({'bookings': bookings}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/booking/<int:booking_id>', methods=['GET'])
def get_booking(booking_id):
    """Get specific booking"""
    try:
        conn = get_db()
        c = conn.cursor()
        c.execute('SELECT * FROM bookings WHERE id = ?', (booking_id,))
        booking = c.fetchone()
        conn.close()
        
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        return jsonify({'booking': dict(booking)}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/booking/<int:booking_id>', methods=['PUT'])
def update_booking(booking_id):
    """Update booking status"""
    try:
        data = request.get_json()
        status = data.get('status')
        
        valid_statuses = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled']
        if status not in valid_statuses:
            return jsonify({'error': 'Invalid status'}), 400
        
        conn = get_db()
        c = conn.cursor()
        c.execute('UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                  (status, booking_id))
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Booking updated', 'status': status}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/booking/<int:booking_id>', methods=['DELETE'])
def cancel_booking(booking_id):
    """Cancel booking"""
    try:
        conn = get_db()
        c = conn.cursor()
        c.execute('UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                  ('cancelled', booking_id))
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Booking cancelled'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============ CONTACT ENDPOINTS ============
@app.route('/api/contact', methods=['POST'])
def submit_contact():
    """Submit contact message"""
    try:
        data = request.get_json()
        
        errors = {}
        if not data.get('fullName'):
            errors['fullName'] = 'Name is required'
        if not data.get('email'):
            errors['email'] = 'Email is required'
        if not data.get('message') or len(data.get('message', '')) < 10:
            errors['message'] = 'Message must be at least 10 characters'
        
        if errors:
            return jsonify({'error': 'validation', 'fields': errors}), 400
        
        conn = get_db()
        c = conn.cursor()
        c.execute('INSERT INTO contact_messages (fullName, email, message, status) VALUES (?, ?, ?, ?)',
                  (data['fullName'], data['email'], data['message'], 'unread'))
        conn.commit()
        msg_id = c.lastrowid
        conn.close()
        
        return jsonify({
            'message': 'Message received. We will contact you soon.',
            'id': msg_id
        }), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/contact', methods=['GET'])
def list_contacts():
    """List all contact messages"""
    try:
        conn = get_db()
        c = conn.cursor()
        c.execute('SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 50')
        messages = [dict(row) for row in c.fetchall()]
        conn.close()
        
        return jsonify({'messages': messages, 'total': len(messages)}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/contact/<int:message_id>', methods=['GET'])
def get_contact(message_id):
    """Get specific contact message"""
    try:
        conn = get_db()
        c = conn.cursor()
        c.execute('SELECT * FROM contact_messages WHERE id = ?', (message_id,))
        message = c.fetchone()
        conn.close()
        
        if not message:
            return jsonify({'error': 'Message not found'}), 404
        
        return jsonify({'message': dict(message)}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============ MECHANICS ENDPOINTS ============
@app.route('/api/mechanics', methods=['GET'])
def list_mechanics():
    """List all mechanics"""
    try:
        conn = get_db()
        c = conn.cursor()
        c.execute('SELECT * FROM mechanics WHERE verified = 1 ORDER BY rating DESC')
        mechanics = [dict(row) for row in c.fetchall()]
        conn.close()
        
        return jsonify({'mechanics': mechanics, 'total': len(mechanics)}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/mechanics/<int:mechanic_id>', methods=['GET'])
def get_mechanic(mechanic_id):
    """Get mechanic details"""
    try:
        conn = get_db()
        c = conn.cursor()
        c.execute('SELECT * FROM mechanics WHERE id = ?', (mechanic_id,))
        mechanic = c.fetchone()
        conn.close()
        
        if not mechanic:
            return jsonify({'error': 'Mechanic not found'}), 404
        
        return jsonify({'mechanic': dict(mechanic)}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============ ERROR HANDLERS ============
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not Found', 'message': 'Endpoint not found'}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({'error': 'Server Error', 'message': 'Internal server error'}), 500

if __name__ == '__main__':
    # Initialize database
    init_db()
    
    # Seed sample data
    seed_data()
    
    print("""
╔════════════════════════════════════════╗
║    MechTECH Backend Server Started     ║
╚════════════════════════════════════════╝

  Server: http://localhost:5000
  API Docs: http://localhost:5000/
  Health: http://localhost:5000/health
  
  Available Endpoints:
  - POST   /api/booking           (Create booking)
  - GET    /api/booking           (List bookings)
  - GET    /api/booking/:id       (Get booking)
  - PUT    /api/booking/:id       (Update booking)
  - DELETE /api/booking/:id       (Cancel booking)
  
  - POST   /api/contact           (Submit contact)
  - GET    /api/contact           (List contacts)
  - GET    /api/contact/:id       (Get contact)
  
  - GET    /api/mechanics         (List mechanics)
  - GET    /api/mechanics/:id     (Get mechanic)
  
  Press Ctrl+C to stop
    """)
    
    app.run(debug=True, host='localhost', port=5000)
