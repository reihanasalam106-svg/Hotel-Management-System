import { query } from '../config/database.js';

export const auditLogRepository = {
  async log(action, entityType, entityId, description = '', userId = null, client = null) {
    const sql = `
      INSERT INTO audit_logs (user_id, action, entity_type, entity_id, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const params = [userId, action, entityType, String(entityId), description];
    const executor = client ? client.query.bind(client) : query;
    const { rows } = await executor(sql, params);
    return rows[0];
  },

  async findAll(limit = 50) {
    const { rows } = await query(`
      SELECT al.*, u.name as user_name, u.email as user_email
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT $1;
    `, [limit]);
    return rows;
  }
};
