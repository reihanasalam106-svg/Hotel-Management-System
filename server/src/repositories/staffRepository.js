import { query } from '../config/database.js';

function mapStaffRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    staffCode: row.staff_code,
    name: row.name,
    email: row.email,
    phone: row.phone || '',
    role: row.role,
    department: row.department,
    shift: row.shift,
    status: row.status,
    assignedTasks: parseInt(row.active_tasks || '0', 10),
    joinedDate: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : '',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export const staffRepository = {
  async findAll(filters = {}) {
    let sql = `
      SELECT s.*,
        (
          SELECT COUNT(*) FROM housekeeping_tasks ht
          WHERE ht.assigned_staff_id = s.id AND ht.status IN ('Cleaning Required', 'Cleaning In Progress')
        ) as active_tasks
      FROM staff s
      WHERE 1=1
    `;
    const params = [];
    let idx = 1;

    if (filters.role) {
      sql += ` AND s.role ILIKE $${idx++}`;
      params.push(filters.role);
    }
    if (filters.department) {
      sql += ` AND s.department ILIKE $${idx++}`;
      params.push(filters.department);
    }
    if (filters.shift) {
      sql += ` AND s.shift ILIKE $${idx++}`;
      params.push(filters.shift);
    }
    if (filters.status) {
      sql += ` AND s.status ILIKE $${idx++}`;
      params.push(filters.status);
    }
    if (filters.search) {
      sql += ` AND (s.name ILIKE $${idx} OR s.email ILIKE $${idx} OR s.phone ILIKE $${idx} OR s.id ILIKE $${idx})`;
      params.push(`%${filters.search}%`);
      idx++;
    }

    sql += ` ORDER BY s.name ASC`;

    const { rows } = await query(sql, params);
    return rows.map(mapStaffRow);
  },

  async findById(id) {
    const sql = `
      SELECT s.*,
        (
          SELECT COUNT(*) FROM housekeeping_tasks ht
          WHERE ht.assigned_staff_id = s.id AND ht.status IN ('Cleaning Required', 'Cleaning In Progress')
        ) as active_tasks
      FROM staff s
      WHERE s.id = $1 OR s.staff_code = $1
    `;
    const { rows } = await query(sql, [String(id)]);
    return mapStaffRow(rows[0]);
  },

  async findByEmail(email) {
    const sql = `SELECT * FROM staff WHERE email ILIKE $1`;
    const { rows } = await query(sql, [String(email)]);
    return mapStaffRow(rows[0]);
  },

  async create(data) {
    const countRes = await query('SELECT COUNT(*) as cnt FROM staff');
    const nextNum = parseInt(countRes.rows[0]?.cnt || '0', 10) + 101;
    const newId = data.id || `STF-${nextNum}`;
    const staffCode = data.staffCode || data.staff_code || newId;

    const sql = `
      INSERT INTO staff (id, staff_code, name, email, phone, role, department, shift, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const params = [
      newId,
      staffCode,
      data.name,
      data.email,
      data.phone || '',
      data.role || 'Staff',
      data.department || 'Operations',
      data.shift || 'General',
      data.status || 'Active'
    ];

    const { rows } = await query(sql, params);
    return mapStaffRow(rows[0]);
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
    if (updateData.role !== undefined) {
      fields.push(`role = $${idx++}`);
      params.push(updateData.role);
    }
    if (updateData.department !== undefined) {
      fields.push(`department = $${idx++}`);
      params.push(updateData.department);
    }
    if (updateData.shift !== undefined) {
      fields.push(`shift = $${idx++}`);
      params.push(updateData.shift);
    }
    if (updateData.status !== undefined) {
      fields.push(`status = $${idx++}`);
      params.push(updateData.status);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(String(id));

    const sql = `
      UPDATE staff
      SET ${fields.join(', ')}
      WHERE id = $${idx} OR staff_code = $${idx}
      RETURNING *;
    `;

    const { rows } = await query(sql, params);
    return mapStaffRow(rows[0]);
  },

  async updateStatus(id, status) {
    const sql = `
      UPDATE staff
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 OR staff_code = $2
      RETURNING *;
    `;
    const { rows } = await query(sql, [status, String(id)]);
    return mapStaffRow(rows[0]);
  },

  async delete(id) {
    const sql = 'DELETE FROM staff WHERE id = $1 OR staff_code = $1 RETURNING id;';
    const { rowCount } = await query(sql, [String(id)]);
    return rowCount > 0;
  },

  async count() {
    const { rows } = await query('SELECT COUNT(*) as cnt FROM staff');
    return parseInt(rows[0]?.cnt || '0', 10);
  }
};
