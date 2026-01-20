import sqlite3

# Connect to the database
conn = sqlite3.connect('mechtech.db')
conn.row_factory = sqlite3.Row
c = conn.cursor()

# Query all bookings
c.execute('SELECT * FROM bookings ORDER BY created_at DESC')
bookings = c.fetchall()

print("=== BOOKINGS IN DATABASE ===")
print(f"Total bookings: {len(bookings)}")
print()

if len(bookings) == 0:
    print("No bookings found in the database.")
else:
    for booking in bookings:
        print(f"ID: {booking['id']}")
        print(f"Name: {booking['name']}")
        print(f"Email: {booking['email']}")
        print(f"Phone: {booking['phone']}")
        print(f"Vehicle Type: {booking['vehicle_type']}")
        print(f"Brand: {booking['vehicle_brand']}")
        print(f"Model: {booking['vehicle_model']}")
        print(f"Service Type: {booking['service_type']}")
        print(f"Description: {booking['description']}")
        print(f"Status: {booking['status']}")
        print(f"Created: {booking['created_at']}")
        print("-" * 50)

conn.close()
