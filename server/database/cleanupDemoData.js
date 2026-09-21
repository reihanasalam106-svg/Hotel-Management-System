import { withTransaction, pool } from '../src/config/database.js';

export async function cleanupDemoData() {
  console.log('====================================================');
  console.log(' CLEANING DEMO / TRANSACTIONAL DATA FOR PRODUCTION ');
  console.log('====================================================\n');

  await withTransaction(async (client) => {
    // 1. Delete payments
    const paymentsRes = await client.query('DELETE FROM payments');
    console.log(`✓ Cleaned ${paymentsRes.rowCount} demo payment record(s)`);

    // 2. Delete invoice items
    const itemsRes = await client.query('DELETE FROM invoice_items');
    console.log(`✓ Cleaned ${itemsRes.rowCount} demo invoice item(s)`);

    // 3. Delete invoices
    const invRes = await client.query('DELETE FROM invoices');
    console.log(`✓ Cleaned ${invRes.rowCount} demo invoice(s)`);

    // 4. Delete housekeeping tasks
    const hkRes = await client.query('DELETE FROM housekeeping_tasks');
    console.log(`✓ Cleaned ${hkRes.rowCount} demo housekeeping task(s)`);

    // 5. Delete reservations
    const resRes = await client.query('DELETE FROM reservations');
    console.log(`✓ Cleaned ${resRes.rowCount} demo reservation(s)`);

    // 6. Delete guests
    const guestRes = await client.query('DELETE FROM guests');
    console.log(`✓ Cleaned ${guestRes.rowCount} demo guest record(s)`);

    // 7. Delete sample demo staff roster records
    const staffRes = await client.query('DELETE FROM staff');
    console.log(`✓ Cleaned ${staffRes.rowCount} demo staff record(s)`);

    // 8. Delete demo audit logs
    const auditRes = await client.query('DELETE FROM audit_logs');
    console.log(`✓ Cleaned ${auditRes.rowCount} demo audit log(s)`);

    // 9. Reset all room statuses to 'Vacant' and 'Ready' in master inventory
    const roomsUpdateRes = await client.query(`
      UPDATE rooms
      SET status = 'Vacant', housekeeping_status = 'Ready', updated_at = CURRENT_TIMESTAMP
    `);
    console.log(`✓ Reset ${roomsUpdateRes.rowCount} room(s) to 'Vacant' & 'Ready' in master inventory`);
  });

  // Verify preserved data
  const usersCount = await pool.query('SELECT COUNT(*) as count FROM users');
  const settingsCount = await pool.query('SELECT COUNT(*) as count FROM hotel_settings');
  const roomTypesCount = await pool.query('SELECT COUNT(*) as count FROM room_types');
  const roomsCount = await pool.query('SELECT COUNT(*) as count FROM rooms');

  const reservationsCount = await pool.query('SELECT COUNT(*) as count FROM reservations');
  const guestsCount = await pool.query('SELECT COUNT(*) as count FROM guests');
  const invoicesCount = await pool.query('SELECT COUNT(*) as count FROM invoices');
  const tasksCount = await pool.query('SELECT COUNT(*) as count FROM housekeeping_tasks');

  console.log('\n--- VERIFICATION AUDIT ---');
  console.log(`Users (Preserved):         ${usersCount.rows[0].count}`);
  console.log(`Hotel Settings (Preserved): ${settingsCount.rows[0].count}`);
  console.log(`Room Types (Preserved):     ${roomTypesCount.rows[0].count}`);
  console.log(`Rooms (Preserved):          ${roomsCount.rows[0].count}`);
  console.log('---------------------------');
  console.log(`Reservations (Cleaned):     ${reservationsCount.rows[0].count}`);
  console.log(`Guests (Cleaned):           ${guestsCount.rows[0].count}`);
  console.log(`Invoices (Cleaned):         ${invoicesCount.rows[0].count}`);
  console.log(`Housekeeping Tasks (Clean): ${tasksCount.rows[0].count}`);
  console.log('====================================================\n');
}

cleanupDemoData()
  .then(() => {
    console.log('Cleanup completed successfully.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Cleanup failed:', err);
    process.exit(1);
  });
