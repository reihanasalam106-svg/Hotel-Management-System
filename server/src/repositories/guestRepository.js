import { query } from '../config/database.js';

function mapGuestRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    guestCode: row.guest_code,
    name: row.name,
    phone: row.phone,
    email: row.email,
    address: row.address || '',
    city: row.city || '',
    state: row.state || '',
    pincode: row.pincode || '',
    nationality: row.nationality || 'Indian',
    idType: row.id_type || 'Aadhaar',
    idNumber: row.id_number || '',
    dateOfBirth: row.date_of_birth ? new Date(row.date_of_birth).toISOString().split('T')[0] : '',
    guestType: row.guest_type || 'New Guest',
    status: row.status || 'Upcoming',
    currentRoom: row.current_room || null,
    currentReservationId: row.current_reservation_id || null,
    totalBookings: parseInt(row.total_bookings || '0', 10),
    lastStay: row.last_stay ? new Date(row.last_stay).toISOString().split('T')[0] : null,
    preferences: row.preferences || '',
    specialRequests: row.special_requests || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export const guestRepository = {
  async findAll(params = {}) {
    let sql = `
      SELECT g.*,
        (
          SELECT r.room_number FROM reservations res
          JOIN rooms r ON res.room_id = r.id
          WHERE res.guest_id = g.id AND res.status = 'Checked In'
          LIMIT 1
        ) as current_room,
        (
          SELECT res.id FROM reservations res
          WHERE res.guest_id = g.id AND res.status = 'Checked In'
          LIMIT 1
        ) as current_reservation_id,
        (SELECT COUNT(*) FROM reservations res WHERE res.guest_id = g.id) as total_bookings,
        (SELECT MAX(check_in) FROM reservations res WHERE res.guest_id = g.id) as last_stay
      FROM guests g
      WHERE 1=1
    `;
    const queryParams = [];
    let idx = 1;

    if (params.search) {
      sql += ` AND (g.name ILIKE $${idx} OR g.email ILIKE $${idx} OR g.phone ILIKE $${idx} OR g.id ILIKE $${idx} OR g.guest_code ILIKE $${idx})`;
      queryParams.push(`%${params.search}%`);
      idx++;
    }

    if (params.status) {
      sql += ` AND g.status ILIKE $${idx++}`;
      queryParams.push(params.status);
    }

    if (params.guestType) {
      sql += ` AND g.guest_type ILIKE $${idx++}`;
      queryParams.push(params.guestType);
    }

    sql += ` ORDER BY g.created_at DESC`;

    const { rows } = await query(sql, queryParams);
    return rows.map(mapGuestRow);
  },

  async findById(id) {
    const sql = `
      SELECT g.*,
        (
          SELECT r.room_number FROM reservations res
          JOIN rooms r ON res.room_id = r.id
          WHERE res.guest_id = g.id AND res.status = 'Checked In'
          LIMIT 1
        ) as current_room,
        (
          SELECT res.id FROM reservations res
          WHERE res.guest_id = g.id AND res.status = 'Checked In'
          LIMIT 1
        ) as current_reservation_id,
        (SELECT COUNT(*) FROM reservations res WHERE res.guest_id = g.id) as total_bookings,
        (SELECT MAX(check_in) FROM reservations res WHERE res.guest_id = g.id) as last_stay
      FROM guests g
      WHERE g.id = $1 OR g.guest_code = $1
    `;
    const { rows } = await query(sql, [String(id)]);
    return mapGuestRow(rows[0]);
  },

  async findByEmail(email) {
    const sql = `SELECT * FROM guests WHERE email ILIKE $1`;
    const { rows } = await query(sql, [String(email)]);
    return mapGuestRow(rows[0]);
  },

  async create(data) {
    const countRes = await query('SELECT COUNT(*) as cnt FROM guests');
    const nextNum = parseInt(countRes.rows[0]?.cnt || '0', 10) + 1001;
    const newId = data.id || `G-${nextNum}`;
    const guestCode = data.guestCode || data.guest_code || newId;

    const sql = `
      INSERT INTO guests (
        id, guest_code, name, phone, email, address, city, state, pincode, nationality,
        id_type, id_number, date_of_birth, guest_type, status, preferences, special_requests
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *;
    `;
    const params = [
      newId,
      guestCode,
      data.name,
      data.phone,
      data.email,
      data.address || '',
      data.city || '',
      data.state || '',
      data.pincode || '',
      data.nationality || 'Indian',
      data.idType || data.id_type || 'Aadhaar',
      data.idNumber || data.id_number || '',
      data.dateOfBirth || data.date_of_birth || null,
      data.guestType || data.guest_type || 'New Guest',
      data.status || 'Upcoming',
      data.preferences || '',
      data.specialRequests || data.special_requests || ''
    ];

    const { rows } = await query(sql, params);
    return mapGuestRow(rows[0]);
  },

  async update(id, updateData) {
    const fields = [];
    const params = [];
    let idx = 1;

    if (updateData.name !== undefined) {
      fields.push(`name = $${idx++}`);
      params.push(updateData.name);
    }
    if (updateData.phone !== undefined) {
      fields.push(`phone = $${idx++}`);
      params.push(updateData.phone);
    }
    if (updateData.email !== undefined) {
      fields.push(`email = $${idx++}`);
      params.push(updateData.email);
    }
    if (updateData.address !== undefined) {
      fields.push(`address = $${idx++}`);
      params.push(updateData.address);
    }
    if (updateData.city !== undefined) {
      fields.push(`city = $${idx++}`);
      params.push(updateData.city);
    }
    if (updateData.state !== undefined) {
      fields.push(`state = $${idx++}`);
      params.push(updateData.state);
    }
    if (updateData.pincode !== undefined) {
      fields.push(`pincode = $${idx++}`);
      params.push(updateData.pincode);
    }
    if (updateData.status !== undefined) {
      fields.push(`status = $${idx++}`);
      params.push(updateData.status);
    }
    if (updateData.preferences !== undefined) {
      fields.push(`preferences = $${idx++}`);
      params.push(updateData.preferences);
    }
    if (updateData.specialRequests !== undefined || updateData.special_requests !== undefined) {
      fields.push(`special_requests = $${idx++}`);
      params.push(updateData.specialRequests || updateData.special_requests);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(String(id));

    const sql = `
      UPDATE guests
      SET ${fields.join(', ')}
      WHERE id = $${idx} OR guest_code = $${idx}
      RETURNING *;
    `;

    const { rows } = await query(sql, params);
    return mapGuestRow(rows[0]);
  },

  async updateStatus(id, status, client = null) {
    const sql = `
      UPDATE guests
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 OR guest_code = $2
      RETURNING *;
    `;
    const executor = client ? client.query.bind(client) : query;
    const { rows } = await executor(sql, [status, String(id)]);
    return mapGuestRow(rows[0]);
  },

  async delete(id) {
    const sql = `DELETE FROM guests WHERE id = $1 OR guest_code = $1 RETURNING *;`;
    const { rows } = await query(sql, [String(id)]);
    return mapGuestRow(rows[0]);
  },

  async count() {
    const { rows } = await query('SELECT COUNT(*) as cnt FROM guests');
    return parseInt(rows[0]?.cnt || '0', 10);
  }
};
