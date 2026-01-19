#!/usr/bin/env node

/**
 * API Test Script
 * Quick way to test the backend endpoints
 * Run with: node scripts/test-api.js
 */

const http = require('http');

const API_BASE = 'http://localhost:3000/api';
let authToken = '';

// Helper function for HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (authToken) {
      options.headers['Authorization'] = `Bearer ${authToken}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('\n🧪 MechTECH API Testing Suite\n');
  console.log('━'.repeat(50));

  try {
    // Test 1: Sign Up
    console.log('\n1️⃣  Testing Sign Up...');
    const signupRes = await makeRequest('POST', '/auth/signup', {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'testpass123',
      confirmPassword: 'testpass123',
      phone: '9876543210'
    });
    console.log(`   Status: ${signupRes.status}`);
    if (signupRes.data.token) {
      authToken = signupRes.data.token;
      console.log('   ✅ Sign up successful, token obtained');
    } else {
      console.log('   ❌ Failed:', signupRes.data.message);
    }

    // Test 2: Get Profile
    console.log('\n2️⃣  Testing Get Profile...');
    const profileRes = await makeRequest('GET', '/auth/profile');
    console.log(`   Status: ${profileRes.status}`);
    if (profileRes.status === 200) {
      console.log(`   ✅ Profile retrieved: ${profileRes.data.user.name}`);
    } else {
      console.log('   ❌ Failed:', profileRes.data.message);
    }

    // Test 3: Create Booking
    console.log('\n3️⃣  Testing Create Booking...');
    const bookingRes = await makeRequest('POST', '/booking', {
      name: 'Test User',
      email: 'test@example.com',
      phone: '9876543210',
      vehicleType: 'Car',
      brand: 'Maruti',
      model: 'Swift',
      service_type: 'Breakdown Repair',
      description: 'Test booking'
    });
    console.log(`   Status: ${bookingRes.status}`);
    if (bookingRes.status === 201) {
      console.log(`   ✅ Booking created: ${bookingRes.data.id}`);
    } else {
      console.log('   ❌ Failed:', bookingRes.data.message);
    }

    // Test 4: Submit Contact Message
    console.log('\n4️⃣  Testing Contact Message...');
    const contactRes = await makeRequest('POST', '/contact', {
      fullName: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message to verify the contact form is working properly.'
    });
    console.log(`   Status: ${contactRes.status}`);
    if (contactRes.status === 201) {
      console.log(`   ✅ Message submitted successfully`);
    } else {
      console.log('   ❌ Failed:', contactRes.data.message);
    }

    // Test 5: Get Mechanics
    console.log('\n5️⃣  Testing Get Mechanics...');
    const mechanicsRes = await makeRequest('GET', '/mechanics');
    console.log(`   Status: ${mechanicsRes.status}`);
    if (mechanicsRes.status === 200) {
      console.log(`   ✅ Found ${mechanicsRes.data.total} mechanics`);
    } else {
      console.log('   ❌ Failed:', mechanicsRes.data.message);
    }

    // Test 6: Health Check
    console.log('\n6️⃣  Testing Health Check...');
    const url = new URL('http://localhost:3000/health');
    const healthRes = await makeRequest('GET', '/health');
    console.log(`   Status: ${healthRes.status}`);
    if (healthRes.status === 200) {
      console.log('   ✅ Server is healthy');
    } else {
      console.log('   ❌ Server health check failed');
    }

    console.log('\n' + '━'.repeat(50));
    console.log('\n✅ All tests completed!\n');
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

// Check if server is running
async function checkServer() {
  try {
    const res = await makeRequest('GET', '/health');
    return res.status === 200;
  } catch {
    return false;
  }
}

async function main() {
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.log('❌ Server is not running!');
    console.log('Please start the server with: npm start\n');
    process.exit(1);
  }

  await runTests();
}

main();
