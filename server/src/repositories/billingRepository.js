import { query, withTransaction } from '../config/database.js';

function mapInvoiceRow(row, items = [], payments = []) {
  if (!row) return null;
  const nights = row.nights ? parseInt(row.nights, 10) : 1;
  return {
    id: row.id,
    invoiceId: row.invoice_number || row.id,
    reservationId: row.reservation_id || '',
    guestId: row.guest_id || '',
    guestName: row.guest_name || '',
    guestEmail: row.guest_email || '',
    guestPhone: row.guest_phone || '',
    roomId: row.room_id || '',
    roomNumber: row.room_number || '',
    roomType: row.room_type_name || 'Deluxe',
    checkIn: row.check_in ? new Date(row.check_in).toISOString().split('T')[0] : '',
    checkOut: row.check_out ? new Date(row.check_out).toISOString().split('T')[0] : '',
    nights,
    roomRate: Number(row.unit_price || row.room_rate || 0),
    roomCharges: Number(row.room_charges || (row.subtotal - (row.additional_services_total || 0))),
    additionalServices: items.filter(it => it.item_type !== 'Room Charge').map(it => ({
      id: `SVC-${it.id}`,
      name: it.description || it.item_type,
      quantity: it.quantity,
      unitPrice: Number(it.unit_price),
      total: Number(it.amount)
    })),
    subtotal: Number(row.subtotal || 0),
    discountType: 'fixed',
    discountValue: Number(row.discount || 0),
    discount: Number(row.discount || 0),
    taxableAmount: Number(row.taxable_amount || 0),
    taxRate: Number(row.tax_rate || 18),
    taxAmount: Number(row.tax_amount || 0),
    totalAmount: Number(row.total_amount || 0),
    paidAmount: Number(row.paid_amount || 0),
    balanceAmount: Number(row.balance_amount || 0),
    paymentStatus: row.payment_status || 'Pending',
    paymentMethod: payments[0]?.payment_method || 'UPI',
    payments: payments.map(p => ({
      id: p.id,
      date: p.payment_date ? new Date(p.payment_date).toISOString().split('T')[0] : '',
      method: p.payment_method,
      amount: Number(p.amount),
      reference: p.reference || '',
      recordedBy: 'Front Desk',
      status: 'Completed',
      notes: p.notes || ''
    })),
    invoiceStatus: row.invoice_status || 'Issued',
    createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : '',
    dueDate: row.check_out ? new Date(row.check_out).toISOString().split('T')[0] : '',
    notes: row.notes || ''
  };
}

export const billingRepository = {
  async findAll(filters = {}, client = null) {
    let sql = `
      SELECT inv.*,
        g.name as guest_name, g.email as guest_email, g.phone as guest_phone,
        r.room_number, rt.name as room_type_name,
        res.check_in, res.check_out
      FROM invoices inv
      JOIN guests g ON inv.guest_id = g.id
      LEFT JOIN rooms r ON inv.room_id = r.id
      LEFT JOIN room_types rt ON r.room_type_id = rt.id
      LEFT JOIN reservations res ON inv.reservation_id = res.id
      WHERE 1=1
    `;
    const params = [];
    let idx = 1;

    if (filters.paymentStatus) {
      sql += ` AND inv.payment_status ILIKE $${idx++}`;
      params.push(filters.paymentStatus);
    }
    if (filters.invoiceStatus) {
      sql += ` AND inv.invoice_status ILIKE $${idx++}`;
      params.push(filters.invoiceStatus);
    }
    if (filters.guestId) {
      sql += ` AND inv.guest_id = $${idx++}`;
      params.push(filters.guestId);
    }
    if (filters.reservationId) {
      sql += ` AND inv.reservation_id = $${idx++}`;
      params.push(filters.reservationId);
    }
    if (filters.search) {
      sql += ` AND (inv.id ILIKE $${idx} OR inv.invoice_number ILIKE $${idx} OR g.name ILIKE $${idx} OR r.room_number ILIKE $${idx})`;
      params.push(`%${filters.search}%`);
      idx++;
    }

    sql += ` ORDER BY inv.created_at DESC`;

    const executor = client ? client.query.bind(client) : query;
    const { rows } = await executor(sql, params);

    const results = [];
    for (const row of rows) {
      const { rows: items } = await executor('SELECT * FROM invoice_items WHERE invoice_id = $1', [row.id]);
      const { rows: payments } = await executor('SELECT * FROM payments WHERE invoice_id = $1 ORDER BY payment_date ASC', [row.id]);
      results.push(mapInvoiceRow(row, items, payments));
    }

    return results;
  },

  async findById(id, client = null) {
    const sql = `
      SELECT inv.*,
        g.name as guest_name, g.email as guest_email, g.phone as guest_phone,
        r.room_number, rt.name as room_type_name,
        res.check_in, res.check_out
      FROM invoices inv
      JOIN guests g ON inv.guest_id = g.id
      LEFT JOIN rooms r ON inv.room_id = r.id
      LEFT JOIN room_types rt ON r.room_type_id = rt.id
      LEFT JOIN reservations res ON inv.reservation_id = res.id
      WHERE inv.id = $1 OR inv.invoice_number = $1
    `;
    const executor = client ? client.query.bind(client) : query;
    const { rows } = await executor(sql, [String(id)]);
    if (rows.length === 0) return null;

    const row = rows[0];
    const { rows: items } = await executor('SELECT * FROM invoice_items WHERE invoice_id = $1', [row.id]);
    const { rows: payments } = await executor('SELECT * FROM payments WHERE invoice_id = $1 ORDER BY payment_date ASC', [row.id]);

    return mapInvoiceRow(row, items, payments);
  },

  async create(data, client = null) {
    const execute = async (dbClient) => {
      const countRes = await dbClient.query('SELECT COUNT(*) as cnt FROM invoices');
      const nextNum = parseInt(countRes.rows[0]?.cnt || '0', 10) + 1001;
      const newId = data.id || `BILL-${nextNum}`;
      const invoiceNumber = data.invoiceId || data.invoice_number || `INV-${nextNum}`;

      let roomId = data.roomId || data.room_id || null;
      if (roomId) {
        const roomCheck = await dbClient.query('SELECT id FROM rooms WHERE id = $1 OR room_number = $1', [String(roomId)]);
        if (roomCheck.rowCount > 0) {
          roomId = roomCheck.rows[0].id;
        }
      }

      const sql = `
        INSERT INTO invoices (
          id, invoice_number, reservation_id, guest_id, room_id,
          subtotal, discount, taxable_amount, tax_rate, tax_amount,
          total_amount, paid_amount, balance_amount, payment_status, invoice_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *;
      `;
      const params = [
        newId,
        invoiceNumber,
        data.reservationId || data.reservation_id || null,
        data.guestId || data.guest_id,
        roomId,
        Number(data.subtotal || 0),
        Number(data.discount || 0),
        Number(data.taxableAmount || data.taxable_amount || 0),
        Number(data.taxRate || data.tax_rate || 18),
        Number(data.taxAmount || data.tax_amount || 0),
        Number(data.totalAmount || data.total_amount || 0),
        Number(data.paidAmount || data.paid_amount || 0),
        Number(data.balanceAmount || data.balance_amount || 0),
        data.paymentStatus || 'Pending',
        data.invoiceStatus || 'Issued'
      ];

      await dbClient.query(sql, params);

      // Insert Room Charge item
      if (data.roomCharges || data.roomRate) {
        await dbClient.query(`
          INSERT INTO invoice_items (invoice_id, item_type, description, quantity, unit_price, amount)
          VALUES ($1, 'Room Charge', $2, $3, $4, $5);
        `, [newId, `Room Charge (${data.nights || 1} nights)`, data.nights || 1, data.roomRate || 0, data.roomCharges || (data.roomRate * (data.nights || 1))]);
      }

      // Insert additional service items
      if (Array.isArray(data.additionalServices)) {
        for (const svc of data.additionalServices) {
          const qty = Number(svc.quantity || 1);
          const unitPrice = Number(svc.unitPrice || svc.price || 0);
          const amt = Number(svc.total || (qty * unitPrice));
          await dbClient.query(`
            INSERT INTO invoice_items (invoice_id, item_type, description, quantity, unit_price, amount)
            VALUES ($1, $2, $3, $4, $5, $6);
          `, [newId, svc.itemType || svc.name || 'Additional Service', svc.name || 'Service', qty, unitPrice, amt]);
        }
      }

      // Insert Initial Payments if any
      if (Array.isArray(data.payments)) {
        for (const p of data.payments) {
          const payId = p.id || `PAY-${Date.now().toString().slice(-4)}`;
          await dbClient.query(`
            INSERT INTO payments (id, invoice_id, amount, payment_method, reference, notes)
            VALUES ($1, $2, $3, $4, $5, $6);
          `, [payId, newId, p.amount, p.method || p.paymentMethod || 'UPI', p.reference || '', p.notes || '']);
        }
      }

      return newId;
    };

    const createdId = client ? await execute(client) : await withTransaction(execute);
    return this.findById(createdId, client);
  },

  async update(id, updateData, client = null) {
    const fields = [];
    const params = [];
    let idx = 1;

    if (updateData.subtotal !== undefined) {
      fields.push(`subtotal = $${idx++}`);
      params.push(Number(updateData.subtotal));
    }
    if (updateData.discount !== undefined) {
      fields.push(`discount = $${idx++}`);
      params.push(Number(updateData.discount));
    }
    if (updateData.taxableAmount !== undefined) {
      fields.push(`taxable_amount = $${idx++}`);
      params.push(Number(updateData.taxableAmount));
    }
    if (updateData.taxRate !== undefined) {
      fields.push(`tax_rate = $${idx++}`);
      params.push(Number(updateData.taxRate));
    }
    if (updateData.taxAmount !== undefined) {
      fields.push(`tax_amount = $${idx++}`);
      params.push(Number(updateData.taxAmount));
    }
    if (updateData.totalAmount !== undefined) {
      fields.push(`total_amount = $${idx++}`);
      params.push(Number(updateData.totalAmount));
    }
    if (updateData.paidAmount !== undefined) {
      fields.push(`paid_amount = $${idx++}`);
      params.push(Number(updateData.paidAmount));
    }
    if (updateData.balanceAmount !== undefined) {
      fields.push(`balance_amount = $${idx++}`);
      params.push(Number(updateData.balanceAmount));
    }
    if (updateData.paymentStatus !== undefined) {
      fields.push(`payment_status = $${idx++}`);
      params.push(updateData.paymentStatus);
    }
    if (updateData.invoiceStatus !== undefined) {
      fields.push(`invoice_status = $${idx++}`);
      params.push(updateData.invoiceStatus);
    }

    if (fields.length === 0) return this.findById(id, client);

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(String(id));

    const sql = `
      UPDATE invoices
      SET ${fields.join(', ')}
      WHERE id = $${idx} OR invoice_number = $${idx}
      RETURNING *;
    `;

    const executor = client ? client.query.bind(client) : query;
    await executor(sql, params);
    return this.findById(id, client);
  },

  async addPayment(id, paymentData, client = null) {
    const execute = async (dbClient) => {
      const { rows: invRows } = await dbClient.query('SELECT * FROM invoices WHERE id = $1 OR invoice_number = $1', [String(id)]);
      if (invRows.length === 0) return null;
      const inv = invRows[0];

      const countRes = await dbClient.query('SELECT COUNT(*) as cnt FROM payments');
      const nextNum = parseInt(countRes.rows[0]?.cnt || '0', 10) + 101;
      const payId = paymentData.id || `PAY-${nextNum}-${Date.now().toString().slice(-3)}`;

      const amount = Number(paymentData.amount || 0);
      const method = paymentData.method || paymentData.paymentMethod || 'UPI';
      const reference = paymentData.reference || `REF-${Date.now().toString().slice(-6)}`;
      const notes = paymentData.notes || '';

      await dbClient.query(`
        INSERT INTO payments (id, invoice_id, amount, payment_method, reference, notes)
        VALUES ($1, $2, $3, $4, $5, $6);
      `, [payId, inv.id, amount, method, reference, notes]);

      const { rows: paySum } = await dbClient.query('SELECT SUM(amount) as total_paid FROM payments WHERE invoice_id = $1', [inv.id]);
      const paidAmount = Number(paySum[0]?.total_paid || 0);
      const balanceAmount = Math.max(0, Number(inv.total_amount) - paidAmount);

      let paymentStatus = 'Pending';
      if (balanceAmount === 0 && paidAmount > 0) {
        paymentStatus = 'Paid';
      } else if (paidAmount > 0) {
        paymentStatus = 'Partial';
      }

      await dbClient.query(`
        UPDATE invoices
        SET paid_amount = $1, balance_amount = $2, payment_status = $3, updated_at = CURRENT_TIMESTAMP
        WHERE id = $4;
      `, [paidAmount, balanceAmount, paymentStatus, inv.id]);

      return inv.id;
    };

    const invoiceId = client ? await execute(client) : await withTransaction(execute);
    return this.findById(invoiceId, client);
  },

  async updateStatus(id, invoiceStatus) {
    const sql = `
      UPDATE invoices
      SET invoice_status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 OR invoice_number = $2
      RETURNING *;
    `;
    const { rows } = await query(sql, [invoiceStatus, String(id)]);
    if (rows.length === 0) return null;
    return this.findById(id);
  },

  async cancelInvoice(id, client = null) {
    const sql = `
      UPDATE invoices
      SET invoice_status = 'Cancelled', payment_status = 'Refunded', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 OR invoice_number = $1
      RETURNING *;
    `;
    const executor = client ? client.query.bind(client) : query;
    const { rows } = await executor(sql, [String(id)]);
    if (rows.length === 0) return null;
    return this.findById(id, client);
  },

  async delete(id, client = null) {
    const executor = client ? client.query.bind(client) : query;
    await executor('DELETE FROM payments WHERE invoice_id = $1', [String(id)]);
    await executor('DELETE FROM invoice_items WHERE invoice_id = $1', [String(id)]);
    const { rows } = await executor('DELETE FROM invoices WHERE id = $1 OR invoice_number = $1 RETURNING *', [String(id)]);
    return rows[0] || null;
  },

  async count() {
    const { rows } = await query('SELECT COUNT(*) as cnt FROM invoices');
    return parseInt(rows[0]?.cnt || '0', 10);
  }
};
