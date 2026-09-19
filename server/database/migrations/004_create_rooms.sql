-- 004_create_rooms.sql
CREATE TABLE IF NOT EXISTS rooms (
    id VARCHAR(50) PRIMARY KEY,
    room_number VARCHAR(20) UNIQUE NOT NULL,
    room_type_id VARCHAR(50) REFERENCES room_types(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    floor VARCHAR(50) NOT NULL DEFAULT 'Floor 1',
    price_per_night NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'Vacant',
    housekeeping_status VARCHAR(50) NOT NULL DEFAULT 'Ready',
    description TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
