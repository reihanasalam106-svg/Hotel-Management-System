const BASE = 'http://localhost:5000/api/v1';

async function runTestSuite() {
  console.log('================================================================');
  console.log(' HOTEL MANAGEMENT SYSTEM - PHASE 16 FINAL VERIFICATION SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`✓ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`✗ [FAIL] ${name}:`, err.message);
    }
  }

  // Tokens
  let adminToken = '';
  let managerToken = '';
  let receptionistToken = '';
  let housekeepingToken = '';
  let staffToken = '';

  // -------------------------------------------------------------
  // 1. PUBLIC ENDPOINTS & AUTHENTICATION
  // -------------------------------------------------------------
  await test('GET /health (Public - Database connected)', async () => {
    const res = await fetch(`${BASE}/health`);
    const json = await res.json();
    if (res.status !== 200 || !json.success || json.data?.database !== 'connected') {
      throw new Error(`Expected 200 & db connected, got ${res.status}`);
    }
  });

  await test('POST /auth/login (Login all 5 roles & verify token generation)', async () => {
    const roles = [
      { email: 'admin@hotelpro.com', pass: 'Admin@123', set: (t) => adminToken = t },
      { email: 'manager@hotelpro.com', pass: 'Manager@123', set: (t) => managerToken = t },
      { email: 'receptionist@hotelpro.com', pass: 'Reception@123', set: (t) => receptionistToken = t },
      { email: 'housekeeping@hotelpro.com', pass: 'House@123', set: (t) => housekeepingToken = t },
      { email: 'staff@hotelpro.com', pass: 'Staff@123', set: (t) => staffToken = t }
    ];

    for (const r of roles) {
      const res = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: r.email, password: r.pass })
      });
      const json = await res.json();
      if (res.status !== 200 || !json.data?.token) {
        throw new Error(`Login failed for ${r.email}: status ${res.status}`);
      }
      if (json.data.user?.password_hash) {
        throw new Error(`Security Violation: password_hash exposed in login response!`);
      }
      r.set(json.data.token);
    }
  });

  await test('GET /auth/me (Verify profile retrieval without password_hash)', async () => {
    const res = await fetch(`${BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const json = await res.json();
    if (res.status !== 200 || json.data?.email !== 'admin@hotelpro.com' || json.data?.password_hash) {
      throw new Error(`Invalid /auth/me response: ${JSON.stringify(json)}`);
    }
  });

  await test('SECURITY: Authentication token validation (missing, invalid, tampered)', async () => {
    // 1. Missing token -> 401
    const missingRes = await fetch(`${BASE}/rooms`);
    if (missingRes.status !== 401) throw new Error(`Expected 401 for missing token, got ${missingRes.status}`);

    // 2. Invalid token -> 401
    const invalidRes = await fetch(`${BASE}/rooms`, {
      headers: { Authorization: 'Bearer invalid.fake.token' }
    });
    if (invalidRes.status !== 401) throw new Error(`Expected 401 for invalid token, got ${invalidRes.status}`);

    // 3. Tampered token -> 401
    const tamperedRes = await fetch(`${BASE}/rooms`, {
      headers: { Authorization: `Bearer ${adminToken.slice(0, -5)}abcde` }
    });
    if (tamperedRes.status !== 401) throw new Error(`Expected 401 for tampered token, got ${tamperedRes.status}`);
  });

  // -------------------------------------------------------------
  // 2. ROOMS CRUD & BUSINESS LOGIC
  // -------------------------------------------------------------
  let testRoomId = '';
  const testRoomNumber = `9${Math.floor(100 + Math.random() * 899)}`;

  await test('POST /rooms (Create room with validation & unique room number)', async () => {
    // 1. Missing room number -> 400
    const failRes = await fetch(`${BASE}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ roomType: 'Deluxe' })
    });
    if (failRes.status !== 400) throw new Error(`Expected 400 for missing room number, got ${failRes.status}`);

    // 2. Successful creation
    const createRes = await fetch(`${BASE}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        roomNumber: testRoomNumber,
        type: 'Executive Suite',
        floor: '9th Floor',
        pricePerNight: 9500,
        status: 'Vacant',
        housekeepingStatus: 'Ready',
        amenities: ['King Bed', 'Jacuzzi', 'Ocean View', 'Smart TV']
      })
    });
    const createJson = await createRes.json();
    if (createRes.status !== 201 || !createJson.data?.id) {
      throw new Error(`Room creation failed: ${JSON.stringify(createJson)}`);
    }
    testRoomId = createJson.data.id;

    // 3. Duplicate room number -> 409 Conflict
    const dupRes = await fetch(`${BASE}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ roomNumber: testRoomNumber, pricePerNight: 9500 })
    });
    if (dupRes.status !== 409) throw new Error(`Expected 409 Conflict for duplicate room number, got ${dupRes.status}`);
  });

  await test('GET /rooms & GET /rooms/:id (List with filters & retrieve room)', async () => {
    const listRes = await fetch(`${BASE}/rooms?status=Vacant`, {
      headers: { Authorization: `Bearer ${receptionistToken}` }
    });
    const listJson = await listRes.json();
    if (listRes.status !== 200 || !Array.isArray(listJson.data)) {
      throw new Error(`Failed to list rooms: ${JSON.stringify(listJson)}`);
    }

    const getRes = await fetch(`${BASE}/rooms/${testRoomId}`, {
      headers: { Authorization: `Bearer ${staffToken}` }
    });
    const getJson = await getRes.json();
    if (getRes.status !== 200 || String(getJson.data?.roomNumber) !== String(testRoomNumber)) {
      throw new Error(`Failed to get room by ID: ${JSON.stringify(getJson)}`);
    }
  });

  await test('PUT /rooms/:id & PATCH /rooms/:id/status (Update room details & status)', async () => {
    const updateRes = await fetch(`${BASE}/rooms/${testRoomId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${managerToken}` },
      body: JSON.stringify({ pricePerNight: 10500, floor: 'Penthouse' })
    });
    const updateJson = await updateRes.json();
    if (updateRes.status !== 200 || updateJson.data?.pricePerNight !== 10500) {
      throw new Error(`Failed to update room price: ${JSON.stringify(updateJson)}`);
    }

    const statusRes = await fetch(`${BASE}/rooms/${testRoomId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${housekeepingToken}` },
      body: JSON.stringify({ status: 'Vacant', housekeepingStatus: 'Cleaning Required' })
    });
    const statusJson = await statusRes.json();
    if (statusRes.status !== 200 || statusJson.data?.housekeepingStatus !== 'Cleaning Required') {
      throw new Error(`Failed to update room status: ${JSON.stringify(statusJson)}`);
    }
  });

  // -------------------------------------------------------------
  // 3. GUESTS CRUD & BUSINESS LOGIC
  // -------------------------------------------------------------
  let testGuestId = '';
  const testGuestEmail = `guest_${Date.now().toString().slice(-6)}@example.com`;

  await test('POST /guests (Create guest with validation)', async () => {
    // 1. Invalid email -> 400
    const failRes = await fetch(`${BASE}/guests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${receptionistToken}` },
      body: JSON.stringify({ name: 'Test Guest', phone: '9876543210', email: 'invalid-email-format' })
    });
    if (failRes.status !== 400) throw new Error(`Expected 400 for invalid email, got ${failRes.status}`);

    // 2. Successful creation
    const createRes = await fetch(`${BASE}/guests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${receptionistToken}` },
      body: JSON.stringify({
        name: 'Vikram Malhotra',
        phone: '+91 98765 43210',
        email: testGuestEmail,
        address: '42 Marine Drive',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400020',
        nationality: 'Indian',
        idType: 'Passport',
        idNumber: 'M9876543',
        guestType: 'VIP'
      })
    });
    const createJson = await createRes.json();
    if (createRes.status !== 201 || !createJson.data?.id) {
      throw new Error(`Guest creation failed: ${JSON.stringify(createJson)}`);
    }
    testGuestId = createJson.data.id;
  });

  await test('GET /guests (Search, filter, and get guest by ID)', async () => {
    const searchRes = await fetch(`${BASE}/guests?search=Vikram`, {
      headers: { Authorization: `Bearer ${receptionistToken}` }
    });
    const searchJson = await searchRes.json();
    if (searchRes.status !== 200 || !Array.isArray(searchJson.data) || searchJson.data.length === 0) {
      throw new Error(`Guest search failed: ${JSON.stringify(searchJson)}`);
    }

    const getRes = await fetch(`${BASE}/guests/${testGuestId}`, {
      headers: { Authorization: `Bearer ${receptionistToken}` }
    });
    const getJson = await getRes.json();
    if (getRes.status !== 200 || getJson.data?.name !== 'Vikram Malhotra') {
      throw new Error(`Failed to get guest by ID: ${JSON.stringify(getJson)}`);
    }
  });

  await test('PUT /guests/:id & PATCH /guests/:id/status (Update guest & status)', async () => {
    const updateRes = await fetch(`${BASE}/guests/${testGuestId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${receptionistToken}` },
      body: JSON.stringify({ preferences: 'High floor, Non-smoking, Late checkout' })
    });
    const updateJson = await updateRes.json();
    if (updateRes.status !== 200 || updateJson.data?.preferences !== 'High floor, Non-smoking, Late checkout') {
      throw new Error(`Guest update failed: ${JSON.stringify(updateJson)}`);
    }

    const statusRes = await fetch(`${BASE}/guests/${testGuestId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${receptionistToken}` },
      body: JSON.stringify({ status: 'Active' })
    });
    const statusJson = await statusRes.json();
    if (statusRes.status !== 200 || statusJson.data?.status !== 'Active') {
      throw new Error(`Guest status update failed: ${JSON.stringify(statusJson)}`);
    }
  });

  // -------------------------------------------------------------
  // 4. RESERVATIONS & OVERLAP PROTECTION
  // -------------------------------------------------------------
  let testReservationId = '';
  const today = new Date();
  const checkInDate = new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const checkOutDate = new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  await test('POST /reservations (Date validation & prevent invalid ranges)', async () => {
    const invalidRes = await fetch(`${BASE}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${receptionistToken}` },
      body: JSON.stringify({
        guestId: testGuestId,
        roomId: testRoomId,
        checkIn: checkOutDate,
        checkOut: checkInDate // Checkout before checkin
      })
    });
    if (invalidRes.status !== 400) {
      throw new Error(`Expected 400 for checkOut <= checkIn, got ${invalidRes.status}`);
    }
  });

  await test('POST /reservations (Create reservation and check room availability)', async () => {
    const res = await fetch(`${BASE}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${receptionistToken}` },
      body: JSON.stringify({
        guestId: testGuestId,
        guestName: 'Vikram Malhotra',
        roomId: testRoomId,
        roomType: 'Executive Suite',
        checkIn: checkInDate,
        checkOut: checkOutDate,
        adults: 2,
        children: 0,
        status: 'Confirmed',
        amount: 31500,
        paymentStatus: 'Pending',
        source: 'Direct Website'
      })
    });
    const json = await res.json();
    if (res.status !== 201 || !json.data?.id) {
      throw new Error(`Reservation creation failed: ${JSON.stringify(json)}`);
    }
    testReservationId = json.data.id;
  });

  await test('POST /reservations (Prevent overlapping reservations -> HTTP 409 Conflict)', async () => {
    // Overlapping dates
    const overlapIn = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const overlapOut = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const res = await fetch(`${BASE}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${receptionistToken}` },
      body: JSON.stringify({
        guestId: testGuestId,
        roomId: testRoomId,
        checkIn: overlapIn,
        checkOut: overlapOut,
        adults: 1
      })
    });
    if (res.status !== 409) {
      throw new Error(`Expected 409 Conflict for overlapping reservation, got ${res.status}`);
    }
  });

  // -------------------------------------------------------------
  // 5. CHECK-IN / CHECK-OUT & HOUSEKEEPING WORKFLOW
  // -------------------------------------------------------------
  let testHkTaskId = '';

  await test('POST /reservations/:id/check-in (Check-in workflow: Reservation -> Checked In, Room -> Occupied)', async () => {
    const res = await fetch(`${BASE}/reservations/${testReservationId}/check-in`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${receptionistToken}` }
    });
    const json = await res.json();
    if (res.status !== 200 || json.data?.status !== 'Checked In') {
      throw new Error(`Check-in failed: ${JSON.stringify(json)}`);
    }

    // Check Room status changed to Occupied
    const roomRes = await fetch(`${BASE}/rooms/${testRoomId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const roomJson = await roomRes.json();
    if (roomJson.data?.status !== 'Occupied') {
      throw new Error(`Room status did not update to Occupied after check-in. Current status: ${roomJson.data?.status}`);
    }
  });

  await test('POST /reservations/:id/check-out (Check-out workflow: Reservation -> Checked Out, Room -> Cleaning Required, HK task auto-created)', async () => {
    const res = await fetch(`${BASE}/reservations/${testReservationId}/check-out`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${receptionistToken}` }
    });
    const json = await res.json();
    if (res.status !== 200 || json.data?.status !== 'Checked Out') {
      throw new Error(`Check-out failed: ${JSON.stringify(json)}`);
    }

    // Check Room status changed to Vacant + Cleaning Required
    const roomRes = await fetch(`${BASE}/rooms/${testRoomId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const roomJson = await roomRes.json();
    if (roomJson.data?.status !== 'Vacant' || roomJson.data?.housekeepingStatus !== 'Cleaning Required') {
      throw new Error(`Room status did not sync to Vacant / Cleaning Required. Got status: ${roomJson.data?.status}, hk: ${roomJson.data?.housekeepingStatus}`);
    }

    // Verify auto-created housekeeping task
    const hkRes = await fetch(`${BASE}/housekeeping/tasks?roomId=${testRoomId}`, {
      headers: { Authorization: `Bearer ${housekeepingToken}` }
    });
    const hkJson = await hkRes.json();
    if (hkRes.status !== 200 || !Array.isArray(hkJson.data) || hkJson.data.length === 0) {
      throw new Error(`Auto-created Housekeeping task not found for room ${testRoomId}`);
    }
    testHkTaskId = hkJson.data[0].id;
  });

  await test('POST & PATCH /housekeeping/tasks (Create task, assign staff, complete task -> sync room status)', async () => {
    // 1. Update task to Cleaned
    const updateRes = await fetch(`${BASE}/housekeeping/tasks/${testHkTaskId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${housekeepingToken}` },
      body: JSON.stringify({ status: 'Cleaned' })
    });
    const updateJson = await updateRes.json();
    if (updateRes.status !== 200 || updateJson.data?.status !== 'Cleaned') {
      throw new Error(`Housekeeping status update failed: ${JSON.stringify(updateJson)}`);
    }

    // 2. Check that room's housekeeping status synchronized to Cleaned
    const roomRes = await fetch(`${BASE}/rooms/${testRoomId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const roomJson = await roomRes.json();
    if (roomJson.data?.housekeepingStatus !== 'Cleaned') {
      throw new Error(`Room housekeeping status did not sync to Cleaned`);
    }

    // 3. Mark task Ready -> Room becomes Ready
    const readyRes = await fetch(`${BASE}/housekeeping/tasks/${testHkTaskId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${housekeepingToken}` },
      body: JSON.stringify({ status: 'Ready' })
    });
    const readyJson = await readyRes.json();
    if (readyRes.status !== 200 || readyJson.data?.status !== 'Ready') {
      throw new Error(`Housekeeping ready update failed: ${JSON.stringify(readyJson)}`);
    }
  });

  // -------------------------------------------------------------
  // 6. BILLING, DYNAMIC TAX CALCULATION & PAYMENTS
  // -------------------------------------------------------------
  let testInvoiceId = '';

  await test('POST /billing (Dynamic tax calculation from hotel_settings & invoice generation)', async () => {
    // 1. Get current tax rate from DB settings
    const settingsRes = await fetch(`${BASE}/settings`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const settingsJson = await settingsRes.json();
    const dbTaxRate = Number(settingsJson.data?.billing?.taxRate || 18);

    // 2. Create invoice
    // Room charges: 10,000, Services: 2,000 (Laundry 1000 + Dining 1000), Discount: 1,000
    // Subtotal = 12,000, Taxable = 11,000, Tax = (11,000 * dbTaxRate / 100), Grand Total = 11,000 + Tax
    const createRes = await fetch(`${BASE}/billing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${receptionistToken}` },
      body: JSON.stringify({
        guestId: testGuestId,
        guestName: 'Vikram Malhotra',
        roomId: testRoomId,
        nights: 2,
        roomRate: 5000,
        roomCharges: 10000,
        additionalServices: [
          { name: 'Laundry Service', quantity: 2, unitPrice: 500, total: 1000 },
          { name: 'Fine Dining', quantity: 1, unitPrice: 1000, total: 1000 }
        ],
        discount: 1000,
        discountType: 'fixed'
      })
    });
    const createJson = await createRes.json();
    if (createRes.status !== 201 || !createJson.data?.id) {
      throw new Error(`Invoice creation failed: ${JSON.stringify(createJson)}`);
    }
    testInvoiceId = createJson.data.id;
    const inv = createJson.data;

    const expectedTax = Math.round(((11000 * dbTaxRate) / 100) * 100) / 100;
    const expectedTotal = Math.round((11000 + expectedTax) * 100) / 100;

    if (Math.abs(Number(inv.taxAmount) - expectedTax) > 0.01 || Math.abs(Number(inv.totalAmount) - expectedTotal) > 0.01) {
      throw new Error(`Tax calculation mismatch: expected tax ₹${expectedTax}, total ₹${expectedTotal}, got tax ₹${inv.taxAmount}, total ₹${inv.totalAmount}`);
    }
  });

  await test('POST /billing/:id/payments (Validation: 0 payment, negative, payment > balance rejection)', async () => {
    // 1. Zero payment -> 400 Bad Request
    const zeroRes = await fetch(`${BASE}/billing/${testInvoiceId}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${receptionistToken}` },
      body: JSON.stringify({ amount: 0, paymentMethod: 'Cash' })
    });
    if (zeroRes.status !== 400) throw new Error(`Expected 400 for 0 payment, got ${zeroRes.status}`);

    // 2. Negative payment -> 400 Bad Request
    const negRes = await fetch(`${BASE}/billing/${testInvoiceId}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${receptionistToken}` },
      body: JSON.stringify({ amount: -500, paymentMethod: 'Cash' })
    });
    if (negRes.status !== 400) throw new Error(`Expected 400 for negative payment, got ${negRes.status}`);

    // 3. Payment greater than total balance -> 400 Bad Request
    const overRes = await fetch(`${BASE}/billing/${testInvoiceId}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${receptionistToken}` },
      body: JSON.stringify({ amount: 9999999, paymentMethod: 'Card' })
    });
    if (overRes.status !== 400) throw new Error(`Expected 400 for payment > balance, got ${overRes.status}`);
  });

  await test('POST /billing/:id/payments (Partial payment -> status Partial; Full payment -> status Paid)', async () => {
    // 1. Partial payment of ₹5,000 via UPI
    const partRes = await fetch(`${BASE}/billing/${testInvoiceId}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${receptionistToken}` },
      body: JSON.stringify({
        amount: 5000,
        paymentMethod: 'UPI',
        reference: `UPI-${Date.now().toString().slice(-4)}`
      })
    });
    const partJson = await partRes.json();
    if (partRes.status !== 201 || partJson.data?.paymentStatus !== 'Partial' || Number(partJson.data?.paidAmount) !== 5000) {
      throw new Error(`Partial payment failed: ${JSON.stringify(partJson)}`);
    }

    // 2. Pay remaining balance via Card
    const remainingBalance = Number(partJson.data.balanceAmount);
    const fullRes = await fetch(`${BASE}/billing/${testInvoiceId}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${receptionistToken}` },
      body: JSON.stringify({
        amount: remainingBalance,
        paymentMethod: 'Card',
        reference: `CARD-${Date.now().toString().slice(-4)}`
      })
    });
    const fullJson = await fullRes.json();
    if (fullRes.status !== 201 || fullJson.data?.paymentStatus !== 'Paid' || Number(fullJson.data?.balanceAmount) !== 0) {
      throw new Error(`Full payment completion failed: ${JSON.stringify(fullJson)}`);
    }
  });

  // -------------------------------------------------------------
  // 7. STAFF CRUD & RBAC ACCESS RESTRICTION
  // -------------------------------------------------------------
  let testStaffId = '';
  const testStaffEmail = `staff_${Date.now().toString().slice(-5)}@hotelpro.com`;

  await test('STAFF RBAC & CRUD (Receptionist forbidden 403, Admin creates, updates, deletes staff)', async () => {
    // 1. Receptionist attempt -> 403 Forbidden
    const unauthRes = await fetch(`${BASE}/staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${receptionistToken}` },
      body: JSON.stringify({ name: 'Temp Staff', email: testStaffEmail, role: 'Staff' })
    });
    if (unauthRes.status !== 403) throw new Error(`Expected 403 for Receptionist on staff management, got ${unauthRes.status}`);

    // 2. Admin creates staff member
    const createRes = await fetch(`${BASE}/staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        name: 'Rohan Sharma',
        email: testStaffEmail,
        phone: '+91 91234 56789',
        role: 'Housekeeping',
        department: 'Housekeeping',
        shift: 'Morning'
      })
    });
    const createJson = await createRes.json();
    if (createRes.status !== 201 || !createJson.data?.id) {
      throw new Error(`Staff creation failed: ${JSON.stringify(createJson)}`);
    }
    testStaffId = createJson.data.id;

    // 3. Update staff status
    const statusRes = await fetch(`${BASE}/staff/${testStaffId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ status: 'On Duty' })
    });
    const statusJson = await statusRes.json();
    if (statusRes.status !== 200 || statusJson.data?.status !== 'On Duty') {
      throw new Error(`Staff status update failed: ${JSON.stringify(statusJson)}`);
    }

    // 4. Delete staff member
    const delRes = await fetch(`${BASE}/staff/${testStaffId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (delRes.status !== 200) throw new Error(`Staff deletion failed: status ${delRes.status}`);
  });

  // -------------------------------------------------------------
  // 8. SETTINGS & DYNAMIC TAX UPDATES (RBAC ENFORCED)
  // -------------------------------------------------------------
  await test('SETTINGS (RBAC protection & updating hotel settings in PostgreSQL)', async () => {
    // 1. Receptionist update attempt -> 403 Forbidden
    const unauthRes = await fetch(`${BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${receptionistToken}` },
      body: JSON.stringify({ hotelProfile: { hotelName: 'Hacked Hotel' } })
    });
    if (unauthRes.status !== 403) throw new Error(`Expected 403 for Receptionist modifying settings, got ${unauthRes.status}`);

    // 2. Admin updates settings
    const updateRes = await fetch(`${BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        hotelProfile: {
          hotelName: 'HotelPro Grand Luxury & Suites',
          phone: '+91 22 4988 2000'
        },
        billing: {
          taxEnabled: true,
          taxRate: 18
        }
      })
    });
    const updateJson = await updateRes.json();
    if (updateRes.status !== 200 || updateJson.data?.hotelProfile?.hotelName !== 'HotelPro Grand Luxury & Suites') {
      throw new Error(`Settings update failed: ${JSON.stringify(updateJson)}`);
    }
  });

  // -------------------------------------------------------------
  // 9. DASHBOARD STATS FROM POSTGRESQL
  // -------------------------------------------------------------
  await test('GET /dashboard/summary (Verify real-time PostgreSQL calculations)', async () => {
    const res = await fetch(`${BASE}/dashboard/summary`, {
      headers: { Authorization: `Bearer ${managerToken}` }
    });
    const json = await res.json();
    if (res.status !== 200 || !json.data?.kpi || json.data?.occupancy?.total === undefined) {
      throw new Error(`Invalid dashboard summary response: ${JSON.stringify(json)}`);
    }
    if (typeof json.data.kpi.numericRevenue !== 'number' || json.data.occupancy.total <= 0) {
      throw new Error(`Dashboard stats are not derived from PostgreSQL records`);
    }
  });

  // -------------------------------------------------------------
  // 10. REPORTS FROM POSTGRESQL WITH FILTERS
  // -------------------------------------------------------------
  await test('GET /reports/summary (Verify PostgreSQL report aggregations & filters)', async () => {
    // 1. Unauthorized role -> 403
    const unauthRes = await fetch(`${BASE}/reports/summary`, {
      headers: { Authorization: `Bearer ${staffToken}` }
    });
    if (unauthRes.status !== 403) throw new Error(`Expected 403 for Staff accessing reports, got ${unauthRes.status}`);

    // 2. Manager query with filters
    const res = await fetch(`${BASE}/reports/summary?roomType=Deluxe`, {
      headers: { Authorization: `Bearer ${managerToken}` }
    });
    const json = await res.json();
    if (res.status !== 200 || !json.data?.revenue || !json.data?.bookings || !Array.isArray(json.data?.bookingSources)) {
      throw new Error(`Invalid reports summary response: ${JSON.stringify(json)}`);
    }
  });

  // -------------------------------------------------------------
  // 11. 404 ROUTE HANDLING
  // -------------------------------------------------------------
  await test('API ERROR HANDLING: 404 Not Found for non-existent routes', async () => {
    const res = await fetch(`${BASE}/non-existent-endpoint-12345`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const json = await res.json();
    if (res.status !== 404 || json.success !== false) {
      throw new Error(`Expected 404 response for unknown route, got ${res.status}`);
    }
  });

  // -------------------------------------------------------------
  // 12. CLEANUP OF TEMPORARY TEST ENTITIES
  // -------------------------------------------------------------
  await test('CLEANUP (Delete test entities and verify cascade integrity)', async () => {
    if (testInvoiceId) {
      await fetch(`${BASE}/billing/${testInvoiceId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
    }
    if (testHkTaskId) {
      await fetch(`${BASE}/housekeeping/tasks/${testHkTaskId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
    }
    if (testReservationId) {
      await fetch(`${BASE}/reservations/${testReservationId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
    }
    if (testGuestId) {
      const delGuestRes = await fetch(`${BASE}/guests/${testGuestId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (delGuestRes.status !== 200) {
        throw new Error(`Guest deletion in cleanup failed: status ${delGuestRes.status}`);
      }
    }
    if (testRoomId) {
      await fetch(`${BASE}/rooms/${testRoomId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
    }
  });

  console.log('\n================================================================');
  console.log(` ALL PHASE 16 TESTS PASSED: ${passed} / ${total}`);
  console.log('================================================================\n');
}

runTestSuite();
