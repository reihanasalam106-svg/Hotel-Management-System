import { query } from '../config/database.js';

// Helper to format PostgreSQL row to Room domain model
function mapRoomRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    roomNumber: row.room_number,
    roomType: row.room_type_name || row.room_type_id || 'Standard',
    roomTypeId: row.room_type_id,
    floor: row.floor,
    pricePerNight: Number(row.price_per_night || 0),
    status: row.status,
    housekeepingStatus: row.housekeeping_status,
    description: row.description || '',
    currentGuest: row.current_guest_name || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export const roomRepository = {
  async findAll(filters = {}) {
    let sql = `
      SELECT r.*, rt.name as room_type_name,
        (
          SELECT g.name FROM reservations res
          JOIN guests g ON res.guest_id = g.id
          WHERE res.room_id = r.id AND res.status = 'Checked In'
          LIMIT 1
        ) as current_guest_name
      FROM rooms r
      LEFT JOIN room_types rt ON r.room_type_id = rt.id
      WHERE 1=1
    `;
    const params = [];
    let idx = 1;

    if (filters.roomNumber) {
      sql += ` AND r.room_number ILIKE $${idx++}`;
      params.push(`%${filters.roomNumber}%`);
    }
    if (filters.roomType) {
      sql += ` AND (rt.name ILIKE $${idx} OR r.room_type_id ILIKE $${idx})`;
      params.push(filters.roomType);
      idx++;
    }
    if (filters.floor) {
      sql += ` AND r.floor ILIKE $${idx++}`;
      params.push(`%${filters.floor}%`);
    }
    if (filters.status) {
      sql += ` AND r.status ILIKE $${idx++}`;
      params.push(filters.status);
    }
    if (filters.housekeepingStatus) {
      sql += ` AND r.housekeeping_status ILIKE $${idx++}`;
      params.push(filters.housekeepingStatus);
    }

    sql += ` ORDER BY r.room_number ASC`;

    const { rows } = await query(sql, params);
    return rows.map(mapRoomRow);
  },

  async findById(id) {
    const sql = `
      SELECT r.*, rt.name as room_type_name,
        (
          SELECT g.name FROM reservations res
          JOIN guests g ON res.guest_id = g.id
          WHERE res.room_id = r.id AND res.status = 'Checked In'
          LIMIT 1
        ) as current_guest_name
      FROM rooms r
      LEFT JOIN room_types rt ON r.room_type_id = rt.id
      WHERE r.id = $1 OR r.room_number = $1
    `;
    const { rows } = await query(sql, [String(id)]);
    return mapRoomRow(rows[0]);
  },

  async findByRoomNumber(roomNumber) {
    const sql = `
      SELECT r.*, rt.name as room_type_name
      FROM rooms r
      LEFT JOIN room_types rt ON r.room_type_id = rt.id
      WHERE r.room_number = $1
    `;
    const { rows } = await query(sql, [String(roomNumber)]);
    return mapRoomRow(rows[0]);
  },

  async create(roomData) {
    const newId = roomData.id ? String(roomData.id) : String(roomData.roomNumber);
    const roomTypeId = roomData.roomTypeId || roomData.room_type_id || (roomData.roomType === 'Suite' ? 'RT-104' : roomData.roomType === 'Premium' || roomData.roomType === 'Executive' ? 'RT-103' : roomData.roomType === 'Presidential Suite' ? 'RT-105' : 'RT-102');

    const sql = `
      INSERT INTO rooms (id, room_number, room_type_id, floor, price_per_night, status, housekeeping_status, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const params = [
      newId,
      String(roomData.roomNumber),
      roomTypeId,
      roomData.floor || 'Floor 1',
      Number(roomData.pricePerNight || roomData.ratePerNight || 0),
      roomData.status || 'Vacant',
      roomData.housekeepingStatus || 'Ready',
      roomData.description || ''
    ];

    const { rows } = await query(sql, params);
    return mapRoomRow(rows[0]);
  },

  async update(id, updateData) {
    const fields = [];
    const params = [];
    let idx = 1;

    if (updateData.roomNumber !== undefined) {
      fields.push(`room_number = $${idx++}`);
      params.push(String(updateData.roomNumber));
    }
    if (updateData.roomTypeId !== undefined || updateData.roomType !== undefined) {
      const rtId = updateData.roomTypeId || (updateData.roomType === 'Suite' ? 'RT-104' : updateData.roomType === 'Executive' ? 'RT-103' : 'RT-102');
      fields.push(`room_type_id = $${idx++}`);
      params.push(rtId);
    }
    if (updateData.floor !== undefined) {
      fields.push(`floor = $${idx++}`);
      params.push(updateData.floor);
    }
    if (updateData.pricePerNight !== undefined) {
      fields.push(`price_per_night = $${idx++}`);
      params.push(Number(updateData.pricePerNight));
    }
    if (updateData.status !== undefined) {
      fields.push(`status = $${idx++}`);
      params.push(updateData.status);
    }
    if (updateData.housekeepingStatus !== undefined) {
      fields.push(`housekeeping_status = $${idx++}`);
      params.push(updateData.housekeepingStatus);
    }
    if (updateData.description !== undefined) {
      fields.push(`description = $${idx++}`);
      params.push(updateData.description);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(String(id));

    const sql = `
      UPDATE rooms
      SET ${fields.join(', ')}
      WHERE id = $${idx} OR room_number = $${idx}
      RETURNING *;
    `;

    const { rows } = await query(sql, params);
    return mapRoomRow(rows[0]);
  },

  async updateStatus(id, status, housekeepingStatus, client = null) {
    const fields = [];
    const params = [];
    let idx = 1;

    if (status) {
      fields.push(`status = $${idx++}`);
      params.push(status);
    }
    if (housekeepingStatus) {
      fields.push(`housekeeping_status = $${idx++}`);
      params.push(housekeepingStatus);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(String(id));

    const sql = `
      UPDATE rooms
      SET ${fields.join(', ')}
      WHERE id = $${idx} OR room_number = $${idx}
      RETURNING *;
    `;

    const executor = client ? client.query.bind(client) : query;
    const { rows } = await executor(sql, params);
    return mapRoomRow(rows[0]);
  },

  async delete(id) {
    const sql = 'DELETE FROM rooms WHERE id = $1 OR room_number = $1 RETURNING id;';
    const { rowCount } = await query(sql, [String(id)]);
    return rowCount > 0;
  },

  async count() {
    const { rows } = await query('SELECT COUNT(*) as cnt FROM rooms');
    return parseInt(rows[0]?.cnt || '0', 10);
  }
};
