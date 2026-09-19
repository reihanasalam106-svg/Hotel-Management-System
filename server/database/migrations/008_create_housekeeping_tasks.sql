-- 008_create_housekeeping_tasks.sql
CREATE TABLE IF NOT EXISTS housekeeping_tasks (
    id VARCHAR(50) PRIMARY KEY,
    task_code VARCHAR(50) UNIQUE NOT NULL,
    room_id VARCHAR(50) NOT NULL REFERENCES rooms(id) ON UPDATE CASCADE ON DELETE CASCADE,
    assigned_staff_id VARCHAR(50) REFERENCES staff(id) ON UPDATE CASCADE ON DELETE SET NULL,
    task_type VARCHAR(100) NOT NULL DEFAULT 'Room Cleaning',
    priority VARCHAR(50) NOT NULL DEFAULT 'Medium',
    status VARCHAR(50) NOT NULL DEFAULT 'Cleaning Required',
    due_time VARCHAR(50) DEFAULT '12:00 PM',
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
