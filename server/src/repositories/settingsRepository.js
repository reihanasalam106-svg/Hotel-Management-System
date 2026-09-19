import { query } from '../config/database.js';

export const settingsRepository = {
  async getSettings() {
    const { rows: settingsRows } = await query('SELECT * FROM hotel_settings LIMIT 1');
    const s = settingsRows[0] || {};

    const { rows: roomTypeRows } = await query('SELECT * FROM room_types ORDER BY base_price ASC');

    return {
      hotelProfile: {
        hotelName: s.hotel_name || 'HotelPro Grand',
        logo: s.logo || '',
        logoUrl: s.logo || '',
        address: s.street_address || '74 Luxury Palm Avenue, Marine Drive',
        city: s.city || 'Mumbai',
        state: s.state || 'Maharashtra',
        country: s.country || 'India',
        pincode: s.pincode || '400001',
        phone: s.phone || '+91 22 4988 2000',
        email: s.email || 'contact@hotelprogrand.com',
        website: s.website || 'www.hotelprogrand.com'
      },
      general: {
        currency: s.currency || 'INR',
        timeZone: 'Asia/Kolkata',
        dateFormat: 'YYYY-MM-DD',
        checkInTime: '14:00',
        checkOutTime: '11:00',
        defaultGuests: 2,
        language: 'English'
      },
      billing: {
        taxEnabled: s.tax_enabled !== undefined ? s.tax_enabled : true,
        taxRate: Number(s.tax_rate || 18),
        taxName: 'GST',
        serviceChargeEnabled: true,
        serviceChargeRate: 5,
        invoicePrefix: s.invoice_prefix || 'INV-'
      },
      invoice: {
        invoicePrefix: s.invoice_prefix || 'INV-',
        startingNumber: 1001,
        showLogo: true,
        showGuestAddress: true,
        showPaymentDetails: true,
        showTaxBreakdown: true,
        footerMessage: 'Thank you for staying at HotelPro Grand. Have a safe journey!'
      },
      notifications: {
        newReservation: true,
        reservationCancellation: true,
        guestCheckIn: true,
        guestCheckOut: true,
        paymentReceived: true,
        pendingPayment: true,
        housekeepingTaskAssigned: true,
        maintenanceAlert: true
      },
      appearance: {
        density: 'comfortable',
        theme: 'light',
        sidebarCollapsed: false
      },
      roomTypes: roomTypeRows.map(rt => ({
        id: rt.id,
        name: rt.name,
        description: rt.description || '',
        defaultPrice: Number(rt.base_price || 0),
        basePrice: Number(rt.base_price || 0),
        maxGuests: rt.capacity || 2,
        capacity: rt.capacity || 2,
        amenities: rt.amenities || '',
        status: rt.status || 'Active'
      }))
    };
  },

  async updateSettings(newSettings) {
    const profile = newSettings.hotelProfile || {};
    const billing = newSettings.billing || {};
    const invoice = newSettings.invoice || {};

    const fields = [];
    const params = [];
    let idx = 1;

    if (profile.hotelName !== undefined) {
      fields.push(`hotel_name = $${idx++}`);
      params.push(profile.hotelName);
    }
    if (profile.logo !== undefined || profile.logoUrl !== undefined) {
      fields.push(`logo = $${idx++}`);
      params.push(profile.logo || profile.logoUrl);
    }
    if (profile.website !== undefined) {
      fields.push(`website = $${idx++}`);
      params.push(profile.website);
    }
    if (profile.phone !== undefined) {
      fields.push(`phone = $${idx++}`);
      params.push(profile.phone);
    }
    if (profile.email !== undefined) {
      fields.push(`email = $${idx++}`);
      params.push(profile.email);
    }
    if (profile.address !== undefined) {
      fields.push(`street_address = $${idx++}`);
      params.push(profile.address);
    }
    if (profile.city !== undefined) {
      fields.push(`city = $${idx++}`);
      params.push(profile.city);
    }
    if (profile.state !== undefined) {
      fields.push(`state = $${idx++}`);
      params.push(profile.state);
    }
    if (profile.country !== undefined) {
      fields.push(`country = $${idx++}`);
      params.push(profile.country);
    }
    if (profile.pincode !== undefined) {
      fields.push(`pincode = $${idx++}`);
      params.push(profile.pincode);
    }
    if (billing.taxEnabled !== undefined) {
      fields.push(`tax_enabled = $${idx++}`);
      params.push(billing.taxEnabled);
    }
    if (billing.taxRate !== undefined) {
      fields.push(`tax_rate = $${idx++}`);
      params.push(Number(billing.taxRate));
    }
    if (billing.invoicePrefix !== undefined || invoice.invoicePrefix !== undefined) {
      fields.push(`invoice_prefix = $${idx++}`);
      params.push(billing.invoicePrefix || invoice.invoicePrefix);
    }

    if (fields.length > 0) {
      fields.push(`updated_at = CURRENT_TIMESTAMP`);
      await query(`
        UPDATE hotel_settings
        SET ${fields.join(', ')}
        WHERE id = (SELECT id FROM hotel_settings LIMIT 1);
      `, params);
    }

    // Room types update if provided
    if (Array.isArray(newSettings.roomTypes)) {
      for (const rt of newSettings.roomTypes) {
        if (rt.id) {
          await query(`
            UPDATE room_types
            SET name = COALESCE($1, name),
                description = COALESCE($2, description),
                base_price = COALESCE($3, base_price),
                capacity = COALESCE($4, capacity),
                amenities = COALESCE($5, amenities),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $6;
          `, [rt.name, rt.description, rt.defaultPrice || rt.basePrice, rt.maxGuests || rt.capacity, rt.amenities, rt.id]);
        }
      }
    }

    return this.getSettings();
  },

  async getBillingTaxRate() {
    const { rows } = await query('SELECT tax_enabled, tax_rate FROM hotel_settings LIMIT 1');
    if (rows.length === 0) return 18.0;
    return rows[0].tax_enabled ? Number(rows[0].tax_rate || 0) : 0;
  }
};
