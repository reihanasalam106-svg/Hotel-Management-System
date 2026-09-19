import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const { Client } = pg;

export async function ensureDatabaseExists() {
  const rootClient = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: String(process.env.DB_PASSWORD || ''),
    database: 'postgres'
  });

  try {
    await rootClient.connect();
    console.log('Connected to PostgreSQL root server successfully.');

    const targetDb = process.env.DB_NAME || 'hotel_management';
    const checkDb = await rootClient.query('SELECT 1 FROM pg_database WHERE datname = $1', [targetDb]);

    if (checkDb.rowCount === 0) {
      console.log(`Database '${targetDb}' does not exist. Creating...`);
      await rootClient.query(`CREATE DATABASE "${targetDb}"`);
      console.log(`✓ Database '${targetDb}' created successfully.`);
    } else {
      console.log(`✓ Database '${targetDb}' exists.`);
    }

    await rootClient.end();
    return true;
  } catch (err) {
    console.error('Error ensuring database exists:', err.message);
    try {
      await rootClient.end();
    } catch (_) {}
    throw err;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  ensureDatabaseExists()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
