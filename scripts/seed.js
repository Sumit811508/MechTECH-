#!/usr/bin/env node

/**
 * Script to populate the database with sample data for testing
 * Run with: node scripts/seed.js
 */

const { dbHelpers } = require('../config/database');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  console.log('🌱 Seeding database with sample data...\n');

  try {
    // Sample users
    const users = [
      {
        name: 'John Doe',
        email: 'john@mechtech.example',
        password: 'password123',
        phone: '9876543210'
      },
      {
        name: 'Jane Smith',
        email: 'jane@mechtech.example',
        password: 'password123',
        phone: '8765432109'
      }
    ];

    console.log('📝 Adding sample users...');
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await dbHelpers.run(
        'INSERT OR IGNORE INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
        [user.name, user.email, hashedPassword, user.phone]
      );
      console.log(`  ✓ User: ${user.name} (${user.email})`);
    }

    // Sample mechanics
    const mechanics = [
      {
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@mechanics.example',
        phone: '9876543211',
        latitude: 28.7041,
        longitude: 77.1025,
        experience_years: 15,
        specializations: 'Engine Repair, Electrical Systems',
        verified: 1
      },
      {
        name: 'Priya Singh',
        email: 'priya.singh@mechanics.example',
        phone: '9876543212',
        latitude: 28.7050,
        longitude: 77.1035,
        experience_years: 8,
        specializations: 'Tyre Service, Brake Systems',
        verified: 1
      },
      {
        name: 'Amit Patel',
        email: 'amit.patel@mechanics.example',
        phone: '9876543213',
        latitude: 28.7030,
        longitude: 77.1015,
        experience_years: 12,
        specializations: 'Battery Service, Towing',
        verified: 1
      },
      {
        name: 'Sunita Verma',
        email: 'sunita.verma@mechanics.example',
        phone: '9876543214',
        latitude: 28.7060,
        longitude: 77.1045,
        experience_years: 10,
        specializations: 'Transmission, Engine',
        verified: 1
      }
    ];

    console.log('\n🔧 Adding sample mechanics...');
    for (const mechanic of mechanics) {
      await dbHelpers.run(
        `INSERT OR IGNORE INTO mechanics 
         (name, email, phone, latitude, longitude, experience_years, specializations, verified, rating) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 4.8)`,
        [
          mechanic.name,
          mechanic.email,
          mechanic.phone,
          mechanic.latitude,
          mechanic.longitude,
          mechanic.experience_years,
          mechanic.specializations,
          mechanic.verified
        ]
      );
      console.log(`  ✓ Mechanic: ${mechanic.name} - ${mechanic.specializations}`);
    }

    // Sample bookings
    console.log('\n📋 Adding sample bookings...');
    const bookings = [
      {
        user_id: 1,
        name: 'John Doe',
        email: 'john@mechtech.example',
        phone: '9876543210',
        vehicle_type: 'Car',
        vehicle_brand: 'Maruti',
        vehicle_model: 'Swift',
        service_type: 'Breakdown Repair',
        description: 'Engine not starting',
        location: 'Downtown area',
        status: 'pending'
      },
      {
        user_id: 2,
        name: 'Jane Smith',
        email: 'jane@mechtech.example',
        phone: '8765432109',
        vehicle_type: 'Bike',
        vehicle_brand: 'Hero',
        vehicle_model: 'Splendor',
        service_type: 'Tyre Repair',
        description: 'Flat tyre',
        location: 'Suburb area',
        status: 'confirmed'
      }
    ];

    for (const booking of bookings) {
      await dbHelpers.run(
        `INSERT INTO bookings 
         (user_id, name, email, phone, vehicle_type, vehicle_brand, vehicle_model, service_type, description, location, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          booking.user_id,
          booking.name,
          booking.email,
          booking.phone,
          booking.vehicle_type,
          booking.vehicle_brand,
          booking.vehicle_model,
          booking.service_type,
          booking.description,
          booking.location,
          booking.status
        ]
      );
      console.log(`  ✓ Booking: ${booking.name} - ${booking.service_type}`);
    }

    // Sample contact messages
    console.log('\n💬 Adding sample contact messages...');
    const messages = [
      {
        fullName: 'Alex Johnson',
        email: 'alex@example.com',
        message: 'Great service! Fixed my car quickly and efficiently. Highly recommended.',
        status: 'read'
      },
      {
        fullName: 'Sarah Wilson',
        email: 'sarah@example.com',
        message: 'I have a question about your emergency support availability at night.',
        status: 'unread'
      }
    ];

    for (const message of messages) {
      await dbHelpers.run(
        'INSERT INTO contact_messages (fullName, email, message, status) VALUES (?, ?, ?, ?)',
        [message.fullName, message.email, message.message, message.status]
      );
      console.log(`  ✓ Message: ${message.fullName}`);
    }

    console.log('\n✅ Database seeding completed successfully!\n');
    console.log('Sample Credentials:');
    console.log('  Email: john@mechtech.example');
    console.log('  Password: password123\n');

    await dbHelpers.close();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await dbHelpers.close();
    process.exit(1);
  }
}

seedDatabase();
