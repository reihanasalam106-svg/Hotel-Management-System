-- 002_create_hotel_settings.sql
CREATE TABLE IF NOT EXISTS hotel_settings (
    id SERIAL PRIMARY KEY,
    hotel_name VARCHAR(150) NOT NULL DEFAULT 'HotelPro Grand',
    logo TEXT DEFAULT '',
    website VARCHAR(150) DEFAULT '',
    phone VARCHAR(50) DEFAULT '',
    email VARCHAR(150) DEFAULT '',
    street_address TEXT DEFAULT '',
    city VARCHAR(100) DEFAULT '',
    state VARCHAR(100) DEFAULT '',
    country VARCHAR(100) DEFAULT 'India',
    pincode VARCHAR(20) DEFAULT '',
    currency VARCHAR(10) DEFAULT 'INR',
    tax_enabled BOOLEAN DEFAULT TRUE,
    tax_rate NUMERIC(5,2) DEFAULT 18.00,
    invoice_prefix VARCHAR(20) DEFAULT 'INV-',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
