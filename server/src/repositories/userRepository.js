import { query } from '../config/database.js';

function mapUserRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export const userRepository = {
  async findById(id) {
    const { rows } = await query('SELECT id, name, email, role, status, created_at, updated_at FROM users WHERE id = $1', [id]);
    return mapUserRow(rows[0]);
  },

  async findByEmail(email) {
    const { rows } = await query('SELECT * FROM users WHERE email ILIKE $1', [email]);
    return rows[0] || null;
  },

  async create(user) {
    const sql = `
      INSERT INTO users (name, email, password_hash, role, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, role, status, created_at, updated_at;
    `;
    const { rows } = await query(sql, [user.name, user.email, user.passwordHash, user.role || 'Receptionist', user.status || 'Active']);
    return mapUserRow(rows[0]);
  },

  async count() {
    const { rows } = await query('SELECT COUNT(*) as cnt FROM users');
    return parseInt(rows[0]?.cnt || '0', 10);
  }
};
