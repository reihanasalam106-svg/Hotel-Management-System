import { query } from '../config/database.js';

function mapReservationRow(row) {
  if (!row) return null;
  const numAmount = Number(row.total_amount || 0);
  return {
    id: row.id,
    reservationCode: row.reservation_code,
    guestId: row.guest_id,
    guestName: row.guest_name || '',
    email: row.guest_email || '',
    phone: row.guest_phone || '',
    roomId: row.room_id || '',
    roomNumber: row.room_number || '',
    roomType: row.room_type_name || row.room_type || 'Standard',
    checkIn: row.check_in ? new Date(row.check_in).toISOString().split('T')[0] : '',
    checkOut: row.check_out ? new Date(row.check_out).toISOString().split('T')[0] : '',
    guests: parseInt(row.number_of_guests || '1', 10),
    bookingSource: row.booking_source || 'Direct',
    status: row.status || 'Confirmed',
    specialRequest: row.special_request || 'None',
    numericAmount: numAmount,
    amount: `₹${numAmount.toLocaleString('en-IN')}`,
    paymentStatus: row.payment_status || 'Pending',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export const reservationRepository = {
  async findAll(filters = {}, client = null) {
    let sql = `
      SELECT res.*,
        g.name as guest_name, g.email as guest_email, g.phone as guest_phone,
        r.room_number, rt.name as room_type_name,
        inv.payment_status as payment_status
      FROM reservations res
      JOIN guests g ON res.guest_id = g.id
      LEFT JOIN rooms r ON res.room_id = r.id
      LEFT JOIN room_types rt ON r.room_type_id = rt.id
      LEFT JOIN invoices inv ON inv.reservation_id = res.id
      WHERE 1=1
    `;
    const params = [];
    let idx = 1;

    if (filters.guestId) {
      sql += ` AND res.guest_id = $${idx++}`;
      params.push(filters.guestId);
    }
    if (filters.roomId) {
      sql += ` AND (res.room_id = $${idx} OR r.room_number = $${idx})`;
      params.push(filters.roomId);
      idx++;
    }
    if (filters.status) {
      sql += ` AND res.status ILIKE $${idx++}`;
      params.push(filters.status);
    }
    if (filters.roomType) {
      sql += ` AND rt.name ILIKE $${idx++}`;
      params.push(filters.roomType);
    }
    if (filters.checkIn) {
      sql += ` AND res.check_in >= $${idx++}`;
      params.push(filters.checkIn);
    }
    if (filters.checkOut) {
      sql += ` AND res.check_out <= $${idx++}`;
      params.push(filters.checkOut);
    }
    if (filters.bookingSource) {
      sql += ` AND res.booking_source ILIKE $${idx++}`;
      params.push(filters.bookingSource);
    }
    if (filters.search) {
      sql += ` AND (res.id ILIKE $${idx} OR res.reservation_code ILIKE $${idx} OR g.name ILIKE $${idx} OR r.room_number ILIKE $${idx})`;
      params.push(`%${filters.search}%`);
      idx++;
    }

    sql += ` ORDER BY res.check_in DESC, res.created_at DESC`;

    const executor = client ? client.query.bind(client) : query;
    const { rows } = await executor(sql, params);
    return rows.map(mapReservationRow);
  },

  async findById(id, client = null) {
    const sql = `
      SELECT res.*,
        g.name as guest_name, g.email as guest_email, g.phone as guest_phone,
        r.room_number, rt.name as room_type_name,
        inv.payment_status as payment_status
      FROM reservations res
      JOIN guests g ON res.guest_id = g.id
      LEFT JOIN rooms r ON res.room_id = r.id
      LEFT JOIN room_types rt ON r.room_type_id = rt.id
      LEFT JOIN invoices inv ON inv.reservation_id = res.id
      WHERE res.id = $1 OR res.reservation_code = $1
    `;
    const executor = client ? client.query.bind(client) : query;
    const { rows } = await executor(sql, [String(id)]);
    return mapReservationRow(rows[0]);
  },

  /**
   * Checks whether room has any overlapping active reservation (Section 25)
   */
  async checkRoomAvailability(roomId, checkIn, checkOut, excludeReservationId = null, client = null) {
    let sql = `
      SELECT id, reservation_code, check_in, check_out, status
      FROM reservations
      WHERE (room_id = $1 OR room_id IN (SELECT id FROM rooms WHERE room_number = $1))
        AND status NOT IN ('Cancelled', 'Checked Out')
        AND (check_in < $2 AND check_out > $3)
    `;
    const params = [String(roomId), checkOut, checkIn];

    if (excludeReservationId) {
      sql += ` AND id != $4 AND reservation_code != $4`;
      params.push(String(excludeReservationId));
    }

    const executor = client ? client.query.bind(client) : query;
    const { rows } = await executor(sql, params);
    return {
      available: rows.length === 0,
      conflicts: rows
    };
  },

  async create(data, client = null) {
    const executor = client ? client.query.bind(client) : query;
    const countRes = await executor('SELECT COUNT(*) as cnt FROM reservations');
    const nextNum = parseInt(countRes.rows[0]?.cnt || '0', 10) + 1001;
    const newId = data.id || `RES-${nextNum}`;
    const reservationCode = data.reservationCode || data.reservation_code || newId;

    let roomId = data.roomId || data.room_id || null;
    if (roomId) {
      const roomCheck = await executor('SELECT id FROM rooms WHERE id = $1 OR room_number = $1', [String(roomId)]);
      if (roomCheck.rowCount > 0) {
        roomId = roomCheck.rows[0].id;
      }
    }

    const sql = `
      INSERT INTO reservations (
        id, reservation_code, guest_id, room_id, check_in, check_out, number_of_guests, booking_source, status, special_request, total_amount
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `;
    const params = [
      newId,
      reservationCode,
      data.guestId || data.guest_id,
      roomId,
      data.checkIn || data.check_in,
      data.checkOut || data.check_out,
      Number(data.guests || data.number_of_guests || 1),
      data.bookingSource || data.booking_source || 'Direct',
      data.status || 'Confirmed',
      data.specialRequest || data.special_request || '',
      Number(data.numericAmount || data.total_amount || data.amount || 0)
    ];

    const { rows } = await executor(sql, params);
    return this.findById(rows[0].id, client);
  },

  async update(id, updateData, client = null) {
    const fields = [];
    const params = [];
    let idx = 1;

    if (updateData.roomId !== undefined || updateData.room_id !== undefined) {
      fields.push(`room_id = $${idx++}`);
      params.push(updateData.roomId || updateData.room_id);
    }
    if (updateData.checkIn !== undefined || updateData.check_in !== undefined) {
      fields.push(`check_in = $${idx++}`);
      params.push(updateData.checkIn || updateData.check_in);
    }
    if (updateData.checkOut !== undefined || updateData.check_out !== undefined) {
      fields.push(`check_out = $${idx++}`);
      params.push(updateData.checkOut || updateData.check_out);
    }
    if (updateData.guests !== undefined || updateData.number_of_guests !== undefined) {
      fields.push(`number_of_guests = $${idx++}`);
      params.push(Number(updateData.guests || updateData.number_of_guests));
    }
    if (updateData.bookingSource !== undefined || updateData.booking_source !== undefined) {
      fields.push(`booking_source = $${idx++}`);
      params.push(updateData.bookingSource || updateData.booking_source);
    }
    if (updateData.status !== undefined) {
      fields.push(`status = $${idx++}`);
      params.push(updateData.status);
    }
    if (updateData.specialRequest !== undefined || updateData.special_request !== undefined) {
      fields.push(`special_request = $${idx++}`);
      params.push(updateData.specialRequest || updateData.special_request);
    }
    if (updateData.numericAmount !== undefined || updateData.total_amount !== undefined) {
      fields.push(`total_amount = $${idx++}`);
      params.push(Number(updateData.numericAmount || updateData.total_amount));
    }

    if (fields.length === 0) return this.findById(id, client);

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(String(id));

    const sql = `
      UPDATE reservations
      SET ${fields.join(', ')}
      WHERE id = $${idx} OR reservation_code = $${idx}
      RETURNING *;
    `;

    const executor = client ? client.query.bind(client) : query;
    await executor(sql, params);
    return this.findById(id, client);
  },

  async updateStatus(id, status, client = null) {
    const sql = `
      UPDATE reservations
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 OR reservation_code = $2
      RETURNING *;
    `;
    const executor = client ? client.query.bind(client) : query;
    const { rows } = await executor(sql, [status, String(id)]);
    if (rows.length === 0) return null;
    return this.findById(id, client);
  },

  async delete(id) {
    const sql = 'DELETE FROM reservations WHERE id = $1 OR reservation_code = $1 RETURNING id;';
    const { rowCount } = await query(sql, [String(id)]);
    return rowCount > 0;
  },

  async count() {
    const { rows } = await query('SELECT COUNT(*) as cnt FROM reservations');
    return parseInt(rows[0]?.cnt || '0', 10);
  }
};
