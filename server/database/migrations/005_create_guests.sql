-- 005_create_guests.sql
CREATE TABLE IF NOT EXISTS guests (
    id VARCHAR(50) PRIMARY KEY,
    guest_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    address TEXT DEFAULT '',
    city VARCHAR(100) DEFAULT '',
    state VARCHAR(100) DEFAULT '',
    pincode VARCHAR(20) DEFAULT '',
    nationality VARCHAR(100) DEFAULT 'Indian',
    id_type VARCHAR(50) DEFAULT 'Aadhaar',
    id_number VARCHAR(100) DEFAULT '',
    date_of_birth DATE,
    guest_type VARCHAR(50) DEFAULT 'New Guest',
    status VARCHAR(50) DEFAULT 'Upcoming',
    preferences TEXT DEFAULT '',
    special_requests TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
