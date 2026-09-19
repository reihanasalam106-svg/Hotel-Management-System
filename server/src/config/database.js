import pg from 'pg';
import { config } from './index.js';

const { Pool } = pg;

// Initialize PostgreSQL Connection Pool
const poolConfig = config.db.connectionString
  ? {
      connectionString: config.db.connectionString,
      ssl: config.db.ssl || (config.isProd ? { rejectUnauthorized: false } : false),
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    }
  : {
      host: config.db.host,
      port: config.db.port,
      database: config.db.database,
      user: config.db.user,
      password: String(config.db.password),
      ssl: config.db.ssl,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    };

export const pool = new Pool(poolConfig);

// Pool error event listener
pool.on('error', (err) => {
  console.error('[PostgreSQL Pool Error]: Unexpected idle client error:', err.message);
});

/**
 * Execute a parameterized query with pool
 * @param {string} text
 * @param {any[]} [params]
 */
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (config.isDev && duration > 100) {
      console.log(`[PostgreSQL Slow Query] (${duration}ms):`, text.substring(0, 80));
    }
    return res;
  } catch (err) {
    console.error(`[PostgreSQL Query Error]: ${err.message}\nQuery: ${text}`);
    throw err;
  }
};

/**
 * Acquire a client for transaction management
 */
export const getClient = async () => {
  return await pool.connect();
};

/**
 * Execute a callback within an isolated PostgreSQL transaction
 * Automatically commits on success and rolls back on error.
 * @template T
 * @param {(client: import('pg').PoolClient) => Promise<T>} callback
 * @returns {Promise<T>}
 */
export const withTransaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

/**
 * Test database connectivity
 * @returns {Promise<{connected: boolean, message: string, timestamp?: string}>}
 */
export const testConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW() as current_time, current_database() as db_name');
    return {
      connected: true,
      message: 'PostgreSQL database connected successfully',
      database: res.rows[0]?.db_name || config.db.database,
      timestamp: res.rows[0]?.current_time
    };
  } catch (err) {
    return {
      connected: false,
      message: `Database connection failed: ${err.message}`,
      database: config.db.database
    };
  }
};

export default {
  pool,
  query,
  getClient,
  withTransaction,
  testConnection
};
