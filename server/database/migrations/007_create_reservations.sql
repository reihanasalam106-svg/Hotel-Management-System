-- 007_create_reservations.sql
CREATE TABLE IF NOT EXISTS reservations (
    id VARCHAR(50) PRIMARY KEY,
    reservation_code VARCHAR(50) UNIQUE NOT NULL,
    guest_id VARCHAR(50) NOT NULL REFERENCES guests(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    room_id VARCHAR(50) REFERENCES rooms(id) ON UPDATE CASCADE ON DELETE SET NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    number_of_guests INT DEFAULT 1,
    booking_source VARCHAR(100) DEFAULT 'Direct',
    status VARCHAR(50) NOT NULL DEFAULT 'Confirmed',
    special_request TEXT DEFAULT '',
    total_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_reservation_dates CHECK (check_out > check_in)
);
