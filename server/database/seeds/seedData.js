// Realistic fictional seed data for Hotel Management System
import bcrypt from 'bcryptjs';

// Pre-computed bcrypt hashes (cost factor 10) for demo passwords:
// "Admin@123", "Manager@123", "Reception@123", "Priya@123", "House@123", "Staff@123"
export const seedUsers = [
  {
    name: 'Admin Manager',
    email: 'admin@hotelpro.com',
    password: 'Admin@123',
    role: 'Admin',
    status: 'Active'
  },
  {
    name: 'Operations Manager',
    email: 'manager@hotelpro.com',
    password: 'Manager@123',
    role: 'Manager',
    status: 'Active'
  },
  {
    name: 'Front Desk Receptionist',
    email: 'receptionist@hotelpro.com',
    password: 'Reception@123',
    role: 'Receptionist',
    status: 'Active'
  },
  {
    name: 'Priya Rao',
    email: 'priya.r@hotelpro.com',
    password: 'Priya@123',
    role: 'Receptionist',
    status: 'Active'
  },
  {
    name: 'Sunita Housekeeping',
    email: 'housekeeping@hotelpro.com',
    password: 'House@123',
    role: 'Housekeeping',
    status: 'Active'
  },
  {
    name: 'Support Staff',
    email: 'staff@hotelpro.com',
    password: 'Staff@123',
    role: 'Staff',
    status: 'Active'
  }
];

export const seedHotelSettings = {
  hotel_name: 'HotelPro Grand',
  logo: '',
  website: 'www.hotelprogrand.com',
  phone: '+91 22 4988 2000',
  email: 'contact@hotelprogrand.com',
  street_address: '74 Luxury Palm Avenue, Marine Drive',
  city: 'Mumbai',
  state: 'Maharashtra',
  country: 'India',
  pincode: '400001',
  currency: 'INR',
  tax_enabled: true,
  tax_rate: 18.00,
  invoice_prefix: 'INV-'
};

export const seedRoomTypes = [
  {
    id: 'RT-101',
    name: 'Standard',
    description: 'Comfortable queen room with workstation, high-speed Wi-Fi, and city view.',
    base_price: 3500.00,
    capacity: 2,
    amenities: 'Queen Bed, Wi-Fi, Air Conditioning, Smart TV, Desk',
    status: 'Active'
  },
  {
    id: 'RT-102',
    name: 'Deluxe',
    description: 'Spacious deluxe room with king bed, premium bath, and garden courtyard view.',
    base_price: 5000.00,
    capacity: 2,
    amenities: 'King Bed, Wi-Fi, Minibar, Bathtub, Coffee Maker, Garden View',
    status: 'Active'
  },
  {
    id: 'RT-103',
    name: 'Executive',
    description: 'Executive room with lounge access, workstation, and complimentary breakfast.',
    base_price: 6500.00,
    capacity: 3,
    amenities: 'King Bed, Executive Lounge Access, Breakfast, Wi-Fi, Minibar',
    status: 'Active'
  },
  {
    id: 'RT-104',
    name: 'Suite',
    description: 'Luxury suite featuring separate living area, balcony, and marble bath.',
    base_price: 8500.00,
    capacity: 4,
    amenities: 'King Bed + Sofa Bed, Separate Living Room, Balcony, Jacuzzi, Butler Service',
    status: 'Active'
  },
  {
    id: 'RT-105',
    name: 'Presidential Suite',
    description: 'Top floor penthouse suite with panoramic views, dining hall, and private lounge.',
    base_price: 15000.00,
    capacity: 6,
    amenities: '2 Master Bedrooms, Dining Hall, Kitchenette, Private Lounge, 24/7 Butler',
    status: 'Active'
  }
];

export const seedRooms = [
  { id: '101', room_number: '101', room_type_id: 'RT-102', floor: 'Floor 1', price_per_night: 5000.00, status: 'Occupied', housekeeping_status: 'Cleaned', description: 'Spacious Deluxe room with king bed and city view.' },
  { id: '102', room_number: '102', room_type_id: 'RT-102', floor: 'Floor 1', price_per_night: 5000.00, status: 'Vacant', housekeeping_status: 'Ready', description: 'Cozy Deluxe room with modern amenities and high-speed Wi-Fi.' },
  { id: '103', room_number: '103', room_type_id: 'RT-102', floor: 'Floor 1', price_per_night: 5000.00, status: 'Vacant', housekeeping_status: 'Ready', description: 'Standard Deluxe room near reception lounge.' },
  { id: '104', room_number: '104', room_type_id: 'RT-104', floor: 'Floor 1', price_per_night: 8000.00, status: 'Maintenance', housekeeping_status: 'Cleaning Required', description: 'Luxury Suite under plumbing inspection.' },
  { id: '201', room_number: '201', room_type_id: 'RT-104', floor: 'Floor 2', price_per_night: 8000.00, status: 'Occupied', housekeeping_status: 'Ready', description: 'Executive Suite with living area and balcony.' },
  { id: '202', room_number: '202', room_type_id: 'RT-102', floor: 'Floor 2', price_per_night: 6000.00, status: 'Vacant', housekeeping_status: 'Ready', description: 'Deluxe room facing pool courtyard.' },
  { id: '203', room_number: '203', room_type_id: 'RT-104', floor: 'Floor 2', price_per_night: 8000.00, status: 'Occupied', housekeeping_status: 'Cleaned', description: 'Corner Suite with panoramic city view.' },
  { id: '204', room_number: '204', room_type_id: 'RT-104', floor: 'Floor 2', price_per_night: 8000.00, status: 'Out of Service', housekeeping_status: 'Cleaning Required', description: 'Temporarily out of service for electrical upgrade.' },
  { id: '301', room_number: '301', room_type_id: 'RT-103', floor: 'Floor 3', price_per_night: 6000.00, status: 'Vacant', housekeeping_status: 'Ready', description: 'Premium room with plush seating and marble bath.' },
  { id: '302', room_number: '302', room_type_id: 'RT-103', floor: 'Floor 3', price_per_night: 6000.00, status: 'Occupied', housekeeping_status: 'Ready', description: 'Premium room reserved for corporate guests.' },
  { id: '303', room_number: '303', room_type_id: 'RT-103', floor: 'Floor 3', price_per_night: 7500.00, status: 'Maintenance', housekeeping_status: 'Cleaning In Progress', description: 'HVAC filter replacement in progress.' },
  { id: '304', room_number: '304', room_type_id: 'RT-103', floor: 'Floor 3', price_per_night: 6000.00, status: 'Vacant', housekeeping_status: 'Ready', description: 'Premium king room with workstation.' },
  { id: '401', room_number: '401', room_type_id: 'RT-102', floor: 'Floor 4', price_per_night: 4500.00, status: 'Vacant', housekeeping_status: 'Ready', description: 'Quiet Deluxe room on upper level.' },
  { id: '402', room_number: '402', room_type_id: 'RT-102', floor: 'Floor 4', price_per_night: 4500.00, status: 'Vacant', housekeeping_status: 'Ready', description: 'Clean Deluxe room ready for check-in.' },
  { id: '407', room_number: '407', room_type_id: 'RT-102', floor: 'Floor 4', price_per_night: 4000.00, status: 'Occupied', housekeeping_status: 'Cleaned', description: 'Deluxe room booked for 3 nights.' },
  { id: '501', room_number: '501', room_type_id: 'RT-103', floor: 'Floor 5', price_per_night: 7500.00, status: 'Vacant', housekeeping_status: 'Ready', description: 'Top floor penthouse suite view.' },
  { id: '502', room_number: '502', room_type_id: 'RT-103', floor: 'Floor 5', price_per_night: 7500.00, status: 'Occupied', housekeeping_status: 'Ready', description: 'Premium high floor room.' },
  { id: '601', room_number: '601', room_type_id: 'RT-105', floor: 'Floor 6', price_per_night: 12000.00, status: 'Out of Service', housekeeping_status: 'Cleaning Required', description: 'Presidential suite under deep restoration.' }
];

export const seedStaff = [
  { id: 'STF-101', staff_code: 'STF-101', name: 'Arun Kumar', email: 'arun.k@hotelpro.com', phone: '+91 98765 00101', role: 'Admin', department: 'Management', shift: 'General', status: 'Active' },
  { id: 'STF-102', staff_code: 'STF-102', name: 'Priya Rao', email: 'priya.r@hotelpro.com', phone: '+91 98765 00102', role: 'Receptionist', department: 'Front Office', shift: 'Morning', status: 'Available' },
  { id: 'STF-103', staff_code: 'STF-103', name: 'Kavitha S', email: 'kavitha.s@hotelpro.com', phone: '+91 98765 00103', role: 'Accountant', department: 'Finance', shift: 'General', status: 'Active' },
  { id: 'STF-104', staff_code: 'STF-104', name: 'Meena P', email: 'meena.p@hotelpro.com', phone: '+91 98765 00104', role: 'Housekeeping', department: 'Housekeeping', shift: 'Morning', status: 'Busy' },
  { id: 'STF-105', staff_code: 'STF-105', name: 'Sunita R', email: 'sunita.r@hotelpro.com', phone: '+91 98765 00105', role: 'Housekeeping', department: 'Housekeeping', shift: 'Morning', status: 'Busy' },
  { id: 'STF-106', staff_code: 'STF-106', name: 'Karan M', email: 'karan.m@hotelpro.com', phone: '+91 98765 00106', role: 'Housekeeping', department: 'Housekeeping', shift: 'Afternoon', status: 'Available' },
  { id: 'STF-107', staff_code: 'STF-107', name: 'Rajesh K', email: 'rajesh.k@hotelpro.com', phone: '+91 98765 00107', role: 'Maintenance', department: 'Maintenance', shift: 'General', status: 'Busy' }
];

export const seedGuests = [
  { id: 'G-1001', guest_code: 'G-1001', name: 'Arun Kumar', phone: '+91 98765 43210', email: 'arun.k@example.com', address: 'Chennai, Tamil Nadu', city: 'Chennai', state: 'Tamil Nadu', pincode: '600001', nationality: 'Indian', id_type: 'Aadhaar', id_number: 'XXXX-XXXX-1001', date_of_birth: '1990-05-12', guest_type: 'Returning Guest', status: 'In House', preferences: 'High floor, non-smoking room', special_requests: 'Late check-in requested' },
  { id: 'G-1002', guest_code: 'G-1002', name: 'Priya Menon', phone: '+91 98123 45678', email: 'priya.m@example.com', address: 'Kochi, Kerala', city: 'Kochi', state: 'Kerala', pincode: '682001', nationality: 'Indian', id_type: 'Passport', id_number: 'Z1234567', date_of_birth: '1993-08-22', guest_type: 'Returning Guest', status: 'In House', preferences: 'Extra pillows', special_requests: 'Balcony room preferred' },
  { id: 'G-1003', guest_code: 'G-1003', name: 'Rohan Verma', phone: '+91 99887 76655', email: 'rohan.v@example.com', address: 'New Delhi, Delhi', city: 'New Delhi', state: 'Delhi', pincode: '110001', nationality: 'Indian', id_type: 'Driving License', id_number: 'DL-042011009', date_of_birth: '1988-11-04', guest_type: 'Returning Guest', status: 'Upcoming', preferences: 'Workstation desk in room', special_requests: 'Airport transfer required' },
  { id: 'G-1004', guest_code: 'G-1004', name: 'Ananya Iyer', phone: '+91 97654 32109', email: 'ananya.i@example.com', address: 'Bengaluru, Karnataka', city: 'Bengaluru', state: 'Karnataka', pincode: '560001', nationality: 'Indian', id_type: 'Aadhaar', id_number: 'XXXX-XXXX-4007', date_of_birth: '1995-02-18', guest_type: 'New Guest', status: 'Upcoming', preferences: 'Quiet room away from elevator', special_requests: 'None' },
  { id: 'G-1005', guest_code: 'G-1005', name: 'Varun Patel', phone: '+91 96543 21098', email: 'varun.p@example.com', address: 'Ahmedabad, Gujarat', city: 'Ahmedabad', state: 'Gujarat', pincode: '380001', nationality: 'Indian', id_type: 'Passport', id_number: 'P9876543', date_of_birth: '1991-09-30', guest_type: 'Returning Guest', status: 'Upcoming', preferences: 'High floor preferred', special_requests: 'Late checkout requested' },
  { id: 'G-1006', guest_code: 'G-1006', name: 'Neha Gupta', phone: '+91 95432 10987', email: 'neha.g@example.com', address: 'Mumbai, Maharashtra', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', nationality: 'Indian', id_type: 'Voter ID', id_number: 'ABC1234567', date_of_birth: '1994-12-15', guest_type: 'Returning Guest', status: 'Checked Out', preferences: 'Sea view preference', special_requests: 'Flight cancellation refund requested' },
  { id: 'G-1007', guest_code: 'G-1007', name: 'Vikram Singh', phone: '+91 94321 09876', email: 'vikram.s@example.com', address: 'Jaipur, Rajasthan', city: 'Jaipur', state: 'Rajasthan', pincode: '302001', nationality: 'Indian', id_type: 'Aadhaar', id_number: 'XXXX-XXXX-2002', date_of_birth: '1985-04-05', guest_type: 'Returning Guest', status: 'In House', preferences: 'Extra rollaway bed', special_requests: 'Family room setup' },
  { id: 'G-1008', guest_code: 'G-1008', name: 'Sunita Reddy', phone: '+91 93210 98765', email: 'sunita.r@example.com', address: 'Hyderabad, Telangana', city: 'Hyderabad', state: 'Telangana', pincode: '500001', nationality: 'Indian', id_type: 'Passport', id_number: 'T4567890', date_of_birth: '1992-07-19', guest_type: 'New Guest', status: 'Upcoming', preferences: 'Honeymoon suite setup', special_requests: 'Flower decoration requested' },
  { id: 'G-1009', guest_code: 'G-1009', name: 'Kabir Mehta', phone: '+91 92109 87654', email: 'kabir.m@example.com', address: 'Pune, Maharashtra', city: 'Pune', state: 'Maharashtra', pincode: '411001', nationality: 'Indian', id_type: 'Driving License', id_number: 'DL-122019888', date_of_birth: '1987-03-25', guest_type: 'Returning Guest', status: 'Upcoming', preferences: 'Vegetarian meal preference', special_requests: 'Quiet zone' },
  { id: 'G-1010', guest_code: 'G-1010', name: 'Divya Joshi', phone: '+91 91098 76543', email: 'divya.j@example.com', address: 'Kolkata, West Bengal', city: 'Kolkata', state: 'West Bengal', pincode: '700001', nationality: 'Indian', id_type: 'Aadhaar', id_number: 'XXXX-XXXX-4002', date_of_birth: '1996-01-10', guest_type: 'Returning Guest', status: 'Checked Out', preferences: 'Ground floor preferred', special_requests: 'Late arrival noted' },
  { id: 'G-1011', guest_code: 'G-1011', name: 'Suresh Nair', phone: '+91 90987 65432', email: 'suresh.n@example.com', address: 'Thiruvananthapuram, Kerala', city: 'Thiruvananthapuram', state: 'Kerala', pincode: '695001', nationality: 'Indian', id_type: 'Driving License', id_number: 'DL-092015555', date_of_birth: '1982-06-14', guest_type: 'Returning Guest', status: 'Inactive', preferences: 'Standard room', special_requests: 'None' },
  { id: 'G-1012', guest_code: 'G-1012', name: 'Meera Kapoor', phone: '+91 90876 54321', email: 'meera.k@example.com', address: 'Chandigarh, Punjab', city: 'Chandigarh', state: 'Punjab', pincode: '160001', nationality: 'Indian', id_type: 'Aadhaar', id_number: 'XXXX-XXXX-9087', date_of_birth: '1997-10-08', guest_type: 'New Guest', status: 'Checked Out', preferences: 'Twin beds', special_requests: 'Early check-in' },
  { id: 'G-1013', guest_code: 'G-1013', name: 'Rajesh Malhotra', phone: '+91 90765 43210', email: 'rajesh.m@example.com', address: 'Lucknow, Uttar Pradesh', city: 'Lucknow', state: 'Uttar Pradesh', pincode: '226001', nationality: 'Indian', id_type: 'Passport', id_number: 'K87654321', date_of_birth: '1979-11-28', guest_type: 'Returning Guest', status: 'Inactive', preferences: 'Morning newspaper delivery', special_requests: 'Executive floor' },
  { id: 'G-1014', guest_code: 'G-1014', name: 'Sneha Kulkarni', phone: '+91 90654 32109', email: 'sneha.k@example.com', address: 'Nagpur, Maharashtra', city: 'Nagpur', state: 'Maharashtra', pincode: '440001', nationality: 'Indian', id_type: 'Aadhaar', id_number: 'XXXX-XXXX-9065', date_of_birth: '1999-04-02', guest_type: 'New Guest', status: 'In House', preferences: 'Non-smoking room', special_requests: 'Early breakfast request' },
  { id: 'G-1015', guest_code: 'G-1015', name: 'Amitabh Sen', phone: '+91 90543 21098', email: 'amitabh.s@example.com', address: 'Kolkata, West Bengal', city: 'Kolkata', state: 'West Bengal', pincode: '700019', nationality: 'Indian', id_type: 'Passport', id_number: 'P7654321', date_of_birth: '1984-08-16', guest_type: 'Returning Guest', status: 'In House', preferences: 'Late checkout, King bed', special_requests: 'Quiet room requested' }
];

export const seedReservations = [
  { id: 'RES-1001', reservation_code: 'RES-1001', guest_id: 'G-1001', room_id: '101', check_in: '2026-07-25', check_out: '2026-07-27', number_of_guests: 2, booking_source: 'Direct', status: 'Checked In', special_request: 'High floor, early check-in requested', total_amount: 12000.00 },
  { id: 'RES-1002', reservation_code: 'RES-1002', guest_id: 'G-1002', room_id: '201', check_in: '2026-07-25', check_out: '2026-07-26', number_of_guests: 2, booking_source: 'OTA', status: 'Checked In', special_request: 'Extra pillows required', total_amount: 8000.00 },
  { id: 'RES-1003', reservation_code: 'RES-1003', guest_id: 'G-1003', room_id: '302', check_in: '2026-07-25', check_out: '2026-07-28', number_of_guests: 2, booking_source: 'Corporate', status: 'Confirmed', special_request: 'Airport transfer booking', total_amount: 15000.00 },
  { id: 'RES-1004', reservation_code: 'RES-1004', guest_id: 'G-1004', room_id: '407', check_in: '2026-07-26', check_out: '2026-07-29', number_of_guests: 2, booking_source: 'Direct', status: 'Pending', special_request: 'Quiet room away from elevator', total_amount: 8000.00 },
  { id: 'RES-1005', reservation_code: 'RES-1005', guest_id: 'G-1005', room_id: '502', check_in: '2026-07-27', check_out: '2026-07-30', number_of_guests: 1, booking_source: 'Walk-in', status: 'Confirmed', special_request: 'Late checkout requested', total_amount: 7500.00 },
  { id: 'RES-1006', reservation_code: 'RES-1006', guest_id: 'G-1006', room_id: '601', check_in: '2026-07-27', check_out: '2026-07-29', number_of_guests: 2, booking_source: 'OTA', status: 'Cancelled', special_request: 'Cancelled due to flight change', total_amount: 0.00 },
  { id: 'RES-1007', reservation_code: 'RES-1007', guest_id: 'G-1007', room_id: '203', check_in: '2026-07-28', check_out: '2026-07-31', number_of_guests: 3, booking_source: 'Direct', status: 'Confirmed', special_request: 'Extra rollaway bed needed', total_amount: 18000.00 },
  { id: 'RES-1008', reservation_code: 'RES-1008', guest_id: 'G-1008', room_id: '104', check_in: '2026-07-29', check_out: '2026-08-01', number_of_guests: 2, booking_source: 'Direct', status: 'Pending', special_request: 'Honeymoon arrangement', total_amount: 24000.00 },
  { id: 'RES-1009', reservation_code: 'RES-1009', guest_id: 'G-1009', room_id: '304', check_in: '2026-07-30', check_out: '2026-08-02', number_of_guests: 1, booking_source: 'Corporate', status: 'Confirmed', special_request: 'Vegetarian meal preference', total_amount: 21000.00 },
  { id: 'RES-1010', reservation_code: 'RES-1010', guest_id: 'G-1010', room_id: '402', check_in: '2026-08-01', check_out: '2026-08-04', number_of_guests: 2, booking_source: 'Walk-in', status: 'Checked Out', special_request: 'None', total_amount: 14000.00 },
  { id: 'RES-1011', reservation_code: 'RES-1011', guest_id: 'G-1014', room_id: '201', check_in: '2026-09-18', check_out: '2026-09-20', number_of_guests: 2, booking_source: 'Direct', status: 'Checked In', special_request: 'Early breakfast', total_amount: 16000.00 }
];

export const seedHousekeepingTasks = [
  { id: 'HK-1001', task_code: 'HK-1001', room_id: '204', assigned_staff_id: 'STF-104', task_type: 'Checkout Cleaning', priority: 'High', status: 'Cleaning Required', due_time: '11:30 AM', notes: 'Guest checked out. Full room deep cleaning required.' },
  { id: 'HK-1002', task_code: 'HK-1002', room_id: '104', assigned_staff_id: 'STF-107', task_type: 'Maintenance Check', priority: 'Urgent', status: 'Maintenance', due_time: '10:00 AM', notes: 'Bathroom plumbing leaks needing urgent inspection.' },
  { id: 'HK-1003', task_code: 'HK-1003', room_id: '303', assigned_staff_id: 'STF-105', task_type: 'Room Cleaning', priority: 'High', status: 'Cleaning In Progress', due_time: '12:00 PM', notes: 'HVAC filter cleaned, finishing carpet sanitization.' },
  { id: 'HK-1004', task_code: 'HK-1004', room_id: '601', assigned_staff_id: 'STF-105', task_type: 'Deep Cleaning', priority: 'Urgent', status: 'Cleaning Required', due_time: '01:00 PM', notes: 'Presidential suite restoration and deep steam cleaning.' },
  { id: 'HK-1005', task_code: 'HK-1005', room_id: '101', assigned_staff_id: 'STF-106', task_type: 'Linen Change', priority: 'Medium', status: 'Cleaned', due_time: '11:00 AM', notes: 'Linen replaced. Ready for final supervisor signoff.' },
  { id: 'HK-1006', task_code: 'HK-1006', room_id: '203', assigned_staff_id: 'STF-104', task_type: 'Bathroom Cleaning', priority: 'Low', status: 'Cleaned', due_time: '02:00 PM', notes: 'Fresh towels placed, toiletries restocked.' },
  { id: 'HK-1007', task_code: 'HK-1007', room_id: '407', assigned_staff_id: 'STF-104', task_type: 'Inspection', priority: 'Medium', status: 'Cleaned', due_time: '02:30 PM', notes: 'Routine quality check passed by house supervisor.' },
  { id: 'HK-1008', task_code: 'HK-1008', room_id: '102', assigned_staff_id: 'STF-106', task_type: 'Room Cleaning', priority: 'Low', status: 'Ready', due_time: '09:00 AM', notes: 'Room cleaned and inspected. Fully ready for check-in.' }
];

export const seedInvoices = [
  {
    id: 'BILL-1001',
    invoice_number: 'INV-1001',
    reservation_id: 'RES-1001',
    guest_id: 'G-1001',
    room_id: '101',
    subtotal: 16400.00,
    discount: 1400.00,
    taxable_amount: 15000.00,
    tax_rate: 18.00,
    tax_amount: 2700.00,
    total_amount: 17700.00,
    paid_amount: 12000.00,
    balance_amount: 5700.00,
    payment_status: 'Partial',
    invoice_status: 'Issued',
    items: [
      { item_type: 'Room Charge', description: 'Deluxe Room (3 nights @ ₹5,000)', quantity: 3, unit_price: 5000.00, amount: 15000.00 },
      { item_type: 'Room Service', description: 'Gourmet Dinner Service', quantity: 2, unit_price: 500.00, amount: 1000.00 },
      { item_type: 'Laundry', description: 'Express Dry Cleaning', quantity: 1, unit_price: 400.00, amount: 400.00 }
    ],
    payments: [
      { id: 'PAY-101', amount: 8000.00, payment_method: 'UPI', reference: 'UPI/987612/01', notes: 'Advance deposit via UPI' },
      { id: 'PAY-102', amount: 4000.00, payment_method: 'Cash', reference: 'CSH/8812/02', notes: 'Cash payment at front counter' }
    ]
  },
  {
    id: 'BILL-1002',
    invoice_number: 'INV-1002',
    reservation_id: 'RES-1002',
    guest_id: 'G-1002',
    room_id: '201',
    subtotal: 18000.00,
    discount: 1800.00,
    taxable_amount: 16200.00,
    tax_rate: 18.00,
    tax_amount: 2916.00,
    total_amount: 19116.00,
    paid_amount: 19116.00,
    balance_amount: 0.00,
    payment_status: 'Paid',
    invoice_status: 'Issued',
    items: [
      { item_type: 'Room Charge', description: 'Executive Suite (2 nights @ ₹8,000)', quantity: 2, unit_price: 8000.00, amount: 16000.00 },
      { item_type: 'F&B', description: 'Lounge Dinner & Drinks', quantity: 1, unit_price: 2000.00, amount: 2000.00 }
    ],
    payments: [
      { id: 'PAY-103', amount: 19116.00, payment_method: 'Card', reference: 'TXN/CC-99410', notes: 'Settled via credit card on check-in' }
    ]
  },
  {
    id: 'BILL-1003',
    invoice_number: 'INV-1003',
    reservation_id: 'RES-1003',
    guest_id: 'G-1003',
    room_id: '302',
    subtotal: 24000.00,
    discount: 0.00,
    taxable_amount: 24000.00,
    tax_rate: 18.00,
    tax_amount: 4320.00,
    total_amount: 28320.00,
    paid_amount: 0.00,
    balance_amount: 28320.00,
    payment_status: 'Pending',
    invoice_status: 'Issued',
    items: [
      { item_type: 'Room Charge', description: 'Premium Room (3 nights @ ₹7,500)', quantity: 3, unit_price: 7500.00, amount: 22500.00 },
      { item_type: 'Airport Transfer', description: 'Chauffeur airport transfer', quantity: 1, unit_price: 1500.00, amount: 1500.00 }
    ],
    payments: []
  },
  {
    id: 'BILL-1004',
    invoice_number: 'INV-1004',
    reservation_id: 'RES-1004',
    guest_id: 'G-1004',
    room_id: '407',
    subtotal: 13000.00,
    discount: 1000.00,
    taxable_amount: 12000.00,
    tax_rate: 18.00,
    tax_amount: 2160.00,
    total_amount: 14160.00,
    paid_amount: 7000.00,
    balance_amount: 7160.00,
    payment_status: 'Partial',
    invoice_status: 'Issued',
    items: [
      { item_type: 'Room Charge', description: 'Deluxe Room (3 nights @ ₹4,000)', quantity: 3, unit_price: 4000.00, amount: 12000.00 },
      { item_type: 'Extra Bed', description: 'Rollaway extra bed for child', quantity: 1, unit_price: 1000.00, amount: 1000.00 }
    ],
    payments: [
      { id: 'PAY-104', amount: 7000.00, payment_method: 'Cash', reference: 'CSH/7721', notes: 'Partial cash deposit' }
    ]
  },
  {
    id: 'BILL-1005',
    invoice_number: 'INV-1005',
    reservation_id: 'RES-1005',
    guest_id: 'G-1005',
    room_id: '502',
    subtotal: 23400.00,
    discount: 1170.00,
    taxable_amount: 22230.00,
    tax_rate: 18.00,
    tax_amount: 4001.00,
    total_amount: 26231.00,
    paid_amount: 26231.00,
    balance_amount: 0.00,
    payment_status: 'Paid',
    invoice_status: 'Issued',
    items: [
      { item_type: 'Room Charge', description: 'Premium High Floor (3 nights @ ₹7,500)', quantity: 3, unit_price: 7500.00, amount: 22500.00 },
      { item_type: 'Mini Bar', description: 'Mini bar beverages and snacks', quantity: 3, unit_price: 300.00, amount: 900.00 }
    ],
    payments: [
      { id: 'PAY-105', amount: 26231.00, payment_method: 'UPI', reference: 'UPI/77621/99', notes: 'Paid via GPay' }
    ]
  },
  {
    id: 'BILL-1006',
    invoice_number: 'INV-1006',
    reservation_id: 'RES-1006',
    guest_id: 'G-1006',
    room_id: '601',
    subtotal: 24000.00,
    discount: 2000.00,
    taxable_amount: 22000.00,
    tax_rate: 18.00,
    tax_amount: 3960.00,
    total_amount: 25960.00,
    paid_amount: 0.00,
    balance_amount: 0.00,
    payment_status: 'Refunded',
    invoice_status: 'Cancelled',
    items: [
      { item_type: 'Room Charge', description: 'Presidential Suite (2 nights @ ₹12,000)', quantity: 2, unit_price: 12000.00, amount: 24000.00 }
    ],
    payments: [
      { id: 'PAY-106', amount: 25960.00, payment_method: 'Bank Transfer', reference: 'REF/99012', notes: 'Full refund on flight cancellation' }
    ]
  },
  {
    id: 'BILL-1007',
    invoice_number: 'INV-1007',
    reservation_id: 'RES-1007',
    guest_id: 'G-1007',
    room_id: '203',
    subtotal: 18850.00,
    discount: 850.00,
    taxable_amount: 18000.00,
    tax_rate: 18.00,
    tax_amount: 3240.00,
    total_amount: 21240.00,
    paid_amount: 10000.00,
    balance_amount: 11240.00,
    payment_status: 'Partial',
    invoice_status: 'Issued',
    items: [
      { item_type: 'Room Charge', description: 'Corner Suite (3 nights @ ₹6,000)', quantity: 3, unit_price: 6000.00, amount: 18000.00 },
      { item_type: 'Room Service', description: 'Breakfast room service buffet', quantity: 1, unit_price: 850.00, amount: 850.00 }
    ],
    payments: [
      { id: 'PAY-107', amount: 10000.00, payment_method: 'Card', reference: 'CARD/5541', notes: 'Partial card payment on arrival' }
    ]
  },
  {
    id: 'BILL-1008',
    invoice_number: 'INV-1008',
    reservation_id: 'RES-1008',
    guest_id: 'G-1008',
    room_id: '104',
    subtotal: 26000.00,
    discount: 1000.00,
    taxable_amount: 25000.00,
    tax_rate: 18.00,
    tax_amount: 4500.00,
    total_amount: 29500.00,
    paid_amount: 0.00,
    balance_amount: 29500.00,
    payment_status: 'Pending',
    invoice_status: 'Draft',
    items: [
      { item_type: 'Room Charge', description: 'Luxury Honeymoon Suite (3 nights @ ₹8,000)', quantity: 3, unit_price: 8000.00, amount: 24000.00 },
      { item_type: 'Other', description: 'Fresh Flower Bed & Room Decoration', quantity: 1, unit_price: 2000.00, amount: 2000.00 }
    ],
    payments: []
  }
];

export const seedAuditLogs = [
  { action: 'SETTINGS_UPDATE', entity_type: 'hotel_settings', entity_id: '1', description: 'Updated general tax rate to 18%' },
  { action: 'RESERVATION_CREATED', entity_type: 'reservations', entity_id: 'RES-1001', description: 'Created reservation for Arun Kumar in Room 101' },
  { action: 'ROOM_CHECKIN', entity_type: 'rooms', entity_id: '101', description: 'Room 101 marked as Occupied for guest check-in' },
  { action: 'PAYMENT_RECEIVED', entity_type: 'payments', entity_id: 'PAY-101', description: 'Recorded ₹8,000 UPI payment for Invoice INV-1001' },
  { action: 'TASK_ASSIGNED', entity_type: 'housekeeping_tasks', entity_id: 'HK-1001', description: 'Assigned checkout cleaning for Room 204 to Meena P' }
];
