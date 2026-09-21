import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { withTransaction } from '../../src/config/database.js';
import {
  seedUsers,
  seedHotelSettings,
  seedRoomTypes,
  seedRooms,
  seedStaff,
  seedGuests,
  seedReservations,
  seedHousekeepingTasks,
  seedInvoices,
  seedAuditLogs
} from './seedData.js';

export async function runSeeds(options = { includeDemoData: false }) {
  const isDemo = options.includeDemoData || process.argv.includes('--with-demo');
  console.log(`--- Starting PostgreSQL Database Seeding (Mode: ${isDemo ? 'DEMO' : 'PRODUCTION MASTER DATA'}) ---`);

  await withTransaction(async (client) => {
    // 1. Seed Users with secure bcrypt hashing (Required for system login)
    for (const u of seedUsers) {
      const passwordHash = u.password ? await bcrypt.hash(u.password, 10) : u.password_hash;
      await client.query(`
        INSERT INTO users (name, email, password_hash, role, status)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (email) DO UPDATE SET
          name = EXCLUDED.name,
          password_hash = EXCLUDED.password_hash,
          role = EXCLUDED.role,
          status = EXCLUDED.status,
          updated_at = CURRENT_TIMESTAMP;
      `, [u.name, u.email, passwordHash, u.role, u.status]);
    }
    console.log(`✓ Seeded ${seedUsers.length} system user account(s)`);

    // 2. Seed Hotel Settings (Required configuration)
    const s = seedHotelSettings;
    const settingsCheck = await client.query('SELECT id FROM hotel_settings LIMIT 1');
    if (settingsCheck.rowCount === 0) {
      await client.query(`
        INSERT INTO hotel_settings (
          hotel_name, logo, website, phone, email, street_address, city, state, country, pincode, currency, tax_enabled, tax_rate, invoice_prefix
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);
      `, [s.hotel_name, s.logo, s.website, s.phone, s.email, s.street_address, s.city, s.state, s.country, s.pincode, s.currency, s.tax_enabled, s.tax_rate, s.invoice_prefix]);
    }
    console.log(`✓ Seeded hotel system settings & tax configuration`);

    // 3. Seed Room Types (Required master inventory categories)
    for (const rt of seedRoomTypes) {
      await client.query(`
        INSERT INTO room_types (id, name, description, base_price, capacity, amenities, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          base_price = EXCLUDED.base_price,
          capacity = EXCLUDED.capacity,
          amenities = EXCLUDED.amenities;
      `, [rt.id, rt.name, rt.description, rt.base_price, rt.capacity, rt.amenities, rt.status]);
    }
    console.log(`✓ Seeded ${seedRoomTypes.length} room types`);

    // 4. Seed Rooms (Required room inventory - initialized to Vacant & Ready for production)
    for (const r of seedRooms) {
      const roomStatus = isDemo ? r.status : 'Vacant';
      const hkStatus = isDemo ? r.housekeeping_status : 'Ready';

      await client.query(`
        INSERT INTO rooms (id, room_number, room_type_id, floor, price_per_night, status, housekeeping_status, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO UPDATE SET
          room_number = EXCLUDED.room_number,
          room_type_id = EXCLUDED.room_type_id,
          floor = EXCLUDED.floor,
          price_per_night = EXCLUDED.price_per_night,
          description = EXCLUDED.description;
      `, [r.id, r.room_number, r.room_type_id, r.floor, r.price_per_night, roomStatus, hkStatus, r.description]);
    }
    console.log(`✓ Seeded ${seedRooms.length} rooms`);

    // Only seed operational/transactional records if explicit demo flag is enabled
    if (isDemo) {
      // 5. Seed Staff
      for (const st of seedStaff) {
        await client.query(`
          INSERT INTO staff (id, staff_code, name, email, phone, role, department, shift, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (id) DO UPDATE SET
            staff_code = EXCLUDED.staff_code,
            name = EXCLUDED.name,
            email = EXCLUDED.email,
            phone = EXCLUDED.phone,
            role = EXCLUDED.role,
            department = EXCLUDED.department,
            shift = EXCLUDED.shift,
            status = EXCLUDED.status;
        `, [st.id, st.staff_code, st.name, st.email, st.phone, st.role, st.department, st.shift, st.status]);
      }
      console.log(`✓ Seeded ${seedStaff.length} demo staff records`);

      // 6. Seed Guests
      for (const g of seedGuests) {
        await client.query(`
          INSERT INTO guests (
            id, guest_code, name, phone, email, address, city, state, pincode, nationality, id_type, id_number, date_of_birth, guest_type, status, preferences, special_requests
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            phone = EXCLUDED.phone,
            email = EXCLUDED.email,
            address = EXCLUDED.address,
            status = EXCLUDED.status,
            preferences = EXCLUDED.preferences,
            special_requests = EXCLUDED.special_requests;
        `, [
          g.id, g.guest_code, g.name, g.phone, g.email, g.address, g.city, g.state, g.pincode,
          g.nationality, g.id_type, g.id_number, g.date_of_birth, g.guest_type, g.status,
          g.preferences, g.special_requests
        ]);
      }
      console.log(`✓ Seeded ${seedGuests.length} demo guests`);

      // 7. Seed Reservations
      for (const res of seedReservations) {
        await client.query(`
          INSERT INTO reservations (
            id, reservation_code, guest_id, room_id, check_in, check_out, number_of_guests, booking_source, status, special_request, total_amount
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO UPDATE SET
            guest_id = EXCLUDED.guest_id,
            room_id = EXCLUDED.room_id,
            check_in = EXCLUDED.check_in,
            check_out = EXCLUDED.check_out,
            status = EXCLUDED.status,
            total_amount = EXCLUDED.total_amount;
        `, [
          res.id, res.reservation_code, res.guest_id, res.room_id, res.check_in, res.check_out,
          res.number_of_guests, res.booking_source, res.status, res.special_request, res.total_amount
        ]);
      }
      console.log(`✓ Seeded ${seedReservations.length} demo reservations`);

      // 8. Seed Housekeeping Tasks
      for (const t of seedHousekeepingTasks) {
        await client.query(`
          INSERT INTO housekeeping_tasks (
            id, task_code, room_id, assigned_staff_id, task_type, priority, status, due_time, notes
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (id) DO UPDATE SET
            room_id = EXCLUDED.room_id,
            assigned_staff_id = EXCLUDED.assigned_staff_id,
            task_type = EXCLUDED.task_type,
            priority = EXCLUDED.priority,
            status = EXCLUDED.status,
            due_time = EXCLUDED.due_time,
            notes = EXCLUDED.notes;
        `, [t.id, t.task_code, t.room_id, t.assigned_staff_id, t.task_type, t.priority, t.status, t.due_time, t.notes]);
      }
      console.log(`✓ Seeded ${seedHousekeepingTasks.length} demo housekeeping tasks`);

      // 9. Seed Invoices, Items & Payments
      for (const inv of seedInvoices) {
        await client.query(`
          INSERT INTO invoices (
            id, invoice_number, reservation_id, guest_id, room_id, subtotal, discount, taxable_amount, tax_rate, tax_amount, total_amount, paid_amount, balance_amount, payment_status, invoice_status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          ON CONFLICT (id) DO UPDATE SET
            subtotal = EXCLUDED.subtotal,
            discount = EXCLUDED.discount,
            taxable_amount = EXCLUDED.taxable_amount,
            tax_rate = EXCLUDED.tax_rate,
            tax_amount = EXCLUDED.tax_amount,
            total_amount = EXCLUDED.total_amount,
            paid_amount = EXCLUDED.paid_amount,
            balance_amount = EXCLUDED.balance_amount,
            payment_status = EXCLUDED.payment_status,
            invoice_status = EXCLUDED.invoice_status;
        `, [
          inv.id, inv.invoice_number, inv.reservation_id, inv.guest_id, inv.room_id,
          inv.subtotal, inv.discount, inv.taxable_amount, inv.tax_rate, inv.tax_amount,
          inv.total_amount, inv.paid_amount, inv.balance_amount, inv.payment_status, inv.invoice_status
        ]);

        if (inv.items && inv.items.length > 0) {
          await client.query('DELETE FROM invoice_items WHERE invoice_id = $1', [inv.id]);
          for (const item of inv.items) {
            await client.query(`
              INSERT INTO invoice_items (invoice_id, item_type, description, quantity, unit_price, amount)
              VALUES ($1, $2, $3, $4, $5, $6);
            `, [inv.id, item.item_type, item.description, item.quantity, item.unit_price, item.amount]);
          }
        }

        if (inv.payments && inv.payments.length > 0) {
          for (const pay of inv.payments) {
            await client.query(`
              INSERT INTO payments (id, invoice_id, amount, payment_method, reference, notes)
              VALUES ($1, $2, $3, $4, $5, $6)
              ON CONFLICT (id) DO NOTHING;
            `, [pay.id, inv.id, pay.amount, pay.payment_method, pay.reference, pay.notes]);
          }
        }
      }
      console.log(`✓ Seeded ${seedInvoices.length} demo invoices, items, and payments`);

      // 10. Seed Audit Logs
      for (const log of seedAuditLogs) {
        await client.query(`
          INSERT INTO audit_logs (action, entity_type, entity_id, description)
          VALUES ($1, $2, $3, $4);
        `, [log.action, log.entity_type, log.entity_id, log.description]);
      }
      console.log(`✓ Seeded ${seedAuditLogs.length} demo audit logs`);
    } else {
      console.log('✓ Skipped demo transactional data (clean production state maintained)');
    }
  });

  console.log('Database seeding successfully finished.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runSeeds()
    .then(() => {
      console.log('Seed process completed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeding failed:', err.message);
      process.exit(1);
    });
}
