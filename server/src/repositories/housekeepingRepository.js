import { query } from '../config/database.js';

function mapTaskRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    taskCode: row.task_code,
    roomId: row.room_id,
    roomNumber: row.room_number || row.room_id,
    taskType: row.task_type,
    priority: row.priority,
    assignedStaffId: row.assigned_staff_id,
    assignedStaffName: row.staff_name || null,
    status: row.status,
    dueTime: row.due_time,
    notes: row.notes || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export const housekeepingRepository = {
  async findAll(filters = {}) {
    let sql = `
      SELECT ht.*, r.room_number, s.name as staff_name
      FROM housekeeping_tasks ht
      JOIN rooms r ON ht.room_id = r.id
      LEFT JOIN staff s ON ht.assigned_staff_id = s.id
      WHERE 1=1
    `;
    const params = [];
    let idx = 1;

    if (filters.status) {
      sql += ` AND ht.status ILIKE $${idx++}`;
      params.push(filters.status);
    }
    if (filters.priority) {
      sql += ` AND ht.priority ILIKE $${idx++}`;
      params.push(filters.priority);
    }
    if (filters.assignedStaffId) {
      sql += ` AND ht.assigned_staff_id = $${idx++}`;
      params.push(filters.assignedStaffId);
    }
    if (filters.roomId || filters.roomNumber) {
      const rm = filters.roomId || filters.roomNumber;
      sql += ` AND (ht.room_id = $${idx} OR r.room_number = $${idx})`;
      params.push(rm);
      idx++;
    }

    sql += ` ORDER BY ht.created_at DESC`;

    const { rows } = await query(sql, params);
    return rows.map(mapTaskRow);
  },

  async findById(id) {
    const sql = `
      SELECT ht.*, r.room_number, s.name as staff_name
      FROM housekeeping_tasks ht
      JOIN rooms r ON ht.room_id = r.id
      LEFT JOIN staff s ON ht.assigned_staff_id = s.id
      WHERE ht.id = $1 OR ht.task_code = $1
    `;
    const { rows } = await query(sql, [String(id)]);
    return mapTaskRow(rows[0]);
  },

  async create(data, client = null) {
    const countRes = await (client ? client.query('SELECT COUNT(*) as cnt FROM housekeeping_tasks') : query('SELECT COUNT(*) as cnt FROM housekeeping_tasks'));
    const nextNum = parseInt(countRes.rows[0]?.cnt || '0', 10) + 1001;
    const newId = data.id || `HK-${nextNum}`;
    const taskCode = data.taskCode || data.task_code || newId;

    let roomId = data.roomId || data.room_id || data.roomNumber;
    // Resolve room_id if roomNumber was passed
    const roomCheck = await (client ? client.query('SELECT id FROM rooms WHERE id = $1 OR room_number = $1', [String(roomId)]) : query('SELECT id FROM rooms WHERE id = $1 OR room_number = $1', [String(roomId)]));
    if (roomCheck.rowCount > 0) {
      roomId = roomCheck.rows[0].id;
    }

    const sql = `
      INSERT INTO housekeeping_tasks (
        id, task_code, room_id, assigned_staff_id, task_type, priority, status, due_time, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const params = [
      newId,
      taskCode,
      roomId,
      data.assignedStaffId || data.assigned_staff_id || null,
      data.taskType || data.task_type || 'Room Cleaning',
      data.priority || 'Medium',
      data.status || 'Cleaning Required',
      data.dueTime || data.due_time || '12:00 PM',
      data.notes || ''
    ];

    const executor = client ? client.query.bind(client) : query;
    const { rows } = await executor(sql, params);
    return this.findById(rows[0].id);
  },

  async update(id, updateData, client = null) {
    const fields = [];
    const params = [];
    let idx = 1;

    if (updateData.taskType !== undefined || updateData.task_type !== undefined) {
      fields.push(`task_type = $${idx++}`);
      params.push(updateData.taskType || updateData.task_type);
    }
    if (updateData.priority !== undefined) {
      fields.push(`priority = $${idx++}`);
      params.push(updateData.priority);
    }
    if (updateData.status !== undefined) {
      fields.push(`status = $${idx++}`);
      params.push(updateData.status);
    }
    if (updateData.assignedStaffId !== undefined || updateData.assigned_staff_id !== undefined) {
      fields.push(`assigned_staff_id = $${idx++}`);
      params.push(updateData.assignedStaffId || updateData.assigned_staff_id || null);
    }
    if (updateData.dueTime !== undefined || updateData.due_time !== undefined) {
      fields.push(`due_time = $${idx++}`);
      params.push(updateData.dueTime || updateData.due_time);
    }
    if (updateData.notes !== undefined) {
      fields.push(`notes = $${idx++}`);
      params.push(updateData.notes);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(String(id));

    const sql = `
      UPDATE housekeeping_tasks
      SET ${fields.join(', ')}
      WHERE id = $${idx} OR task_code = $${idx}
      RETURNING *;
    `;

    const executor = client ? client.query.bind(client) : query;
    await executor(sql, params);
    return this.findById(id);
  },

  async updateStatus(id, status, client = null) {
    const sql = `
      UPDATE housekeeping_tasks
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 OR task_code = $2
      RETURNING *;
    `;
    const executor = client ? client.query.bind(client) : query;
    const { rows } = await executor(sql, [status, String(id)]);
    if (rows.length === 0) return null;
    return this.findById(id);
  },

  async assignStaff(id, assignedStaffId, client = null) {
    const sql = `
      UPDATE housekeeping_tasks
      SET assigned_staff_id = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 OR task_code = $2
      RETURNING *;
    `;
    const executor = client ? client.query.bind(client) : query;
    const { rows } = await executor(sql, [assignedStaffId, String(id)]);
    if (rows.length === 0) return null;
    return this.findById(id);
  },

  async delete(id) {
    const sql = 'DELETE FROM housekeeping_tasks WHERE id = $1 OR task_code = $1 RETURNING id;';
    const { rowCount } = await query(sql, [String(id)]);
    return rowCount > 0;
  },

  async count() {
    const { rows } = await query('SELECT COUNT(*) as cnt FROM housekeeping_tasks');
    return parseInt(rows[0]?.cnt || '0', 10);
  }
};
