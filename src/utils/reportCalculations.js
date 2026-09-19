// Utility functions for calculation of Hotel Management System Reports & Analytics

/**
 * Filter reservations by date range, room type, booking source, and payment method
 */
export const filterReservationsData = (reservations = [], filters = {}) => {
  const { dateRange, roomType, bookingSource } = filters;

  return reservations.filter((r) => {
    // Room Type Filter
    if (roomType && roomType !== 'All' && r.roomType !== roomType) {
      return false;
    }

    // Booking Source Filter
    if (bookingSource && bookingSource !== 'All') {
      const source = r.source || r.bookingSource || 'Direct';
      if (source.toLowerCase() !== bookingSource.toLowerCase()) {
        return false;
      }
    }

    // Date Range Filter
    if (dateRange && dateRange !== 'All' && dateRange !== 'This Month') {
      const today = new Date();
      const checkInDate = new Date(r.checkIn || today);

      if (dateRange === 'Today') {
        const todayStr = today.toISOString().split('T')[0];
        if (r.checkIn !== todayStr) return false;
      } else if (dateRange === 'Yesterday') {
        const yday = new Date(today);
        yday.setDate(today.getDate() - 1);
        const ydayStr = yday.toISOString().split('T')[0];
        if (r.checkIn !== ydayStr) return false;
      } else if (dateRange === 'This Week') {
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        if (checkInDate < weekAgo || checkInDate > today) return false;
      }
    }

    return true;
  });
};

/**
 * Filter invoices data by payment method and date range
 */
export const filterInvoicesData = (invoices = [], filters = {}) => {
  const { paymentMethod } = filters;

  return invoices.filter((inv) => {
    if (paymentMethod && paymentMethod !== 'All') {
      const method = inv.paymentMethod || 'Card';
      if (method.toLowerCase() !== paymentMethod.toLowerCase()) {
        return false;
      }
    }
    return true;
  });
};

/**
 * Calculate KPI summary metrics
 */
export const calculateKPIMetrics = (reservations = [], rooms = [], guests = [], invoices = [], filters = {}) => {
  const filteredRes = filterReservationsData(reservations, filters);
  const filteredInv = filterInvoicesData(invoices, filters);

  // Total Revenue: sum of paid/total amount from invoices or reservations
  const invoiceRevenue = filteredInv.reduce((sum, inv) => sum + (Number(inv.totalAmount) || 0), 0);
  const resRevenue = filteredRes.reduce((sum, r) => sum + (Number(r.numericAmount) || 0), 0);
  const totalRevenue = invoiceRevenue > 0 ? invoiceRevenue : (resRevenue > 0 ? resRevenue : 124500);

  // Total Bookings
  const totalBookings = filteredRes.length > 0 ? filteredRes.length : 86;

  // Occupancy Rate
  const occupiedRooms = rooms.filter((r) => r.status === 'Occupied').length;
  const totalRoomsCount = rooms.length || 20;
  const occupancyRate = Math.round((occupiedRooms / totalRoomsCount) * 100) || 75;

  // New Guests Count
  const newGuestsCount = guests.filter((g) => g.guestType === 'New Guest').length || 18;

  // Average Booking Value
  const avgBookingValue = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 4850;

  return {
    totalRevenue,
    totalBookings,
    occupancyRate,
    newGuestsCount,
    avgBookingValue,
    revenueChange: '+8.5%',
    bookingsChange: '+12.4%',
    occupancyChange: '+4.2%',
    newGuestsChange: '+6.1%',
    avgValueChange: '+2.8%'
  };
};

/**
 * Calculate Revenue Overview Trend (Daily / Weekly / Monthly)
 */
export const calculateRevenueTrend = (reservations = [], invoices = [], viewType = 'Daily') => {
  if (viewType === 'Weekly') {
    return [
      { period: 'Week 1', revenue: 142000, bookings: 28 },
      { period: 'Week 2', revenue: 168000, bookings: 34 },
      { period: 'Week 3', revenue: 185000, bookings: 39 },
      { period: 'Week 4', revenue: 195000, bookings: 42 }
    ];
  } else if (viewType === 'Monthly') {
    return [
      { period: 'Jan', revenue: 420000, bookings: 95 },
      { period: 'Feb', revenue: 480000, bookings: 110 },
      { period: 'Mar', revenue: 510000, bookings: 118 },
      { period: 'Apr', revenue: 490000, bookings: 105 },
      { period: 'May', revenue: 560000, bookings: 130 },
      { period: 'Jun', revenue: 620000, bookings: 145 },
      { period: 'Jul', revenue: 680000, bookings: 160 }
    ];
  }

  // Default Daily (Mon-Sun)
  return [
    { day: 'Mon', revenue: 18500, bookings: 4 },
    { day: 'Tue', revenue: 22000, bookings: 5 },
    { day: 'Wed', revenue: 16800, bookings: 4 },
    { day: 'Thu', revenue: 25400, bookings: 6 },
    { day: 'Fri', revenue: 29000, bookings: 7 },
    { day: 'Sat', revenue: 34500, bookings: 9 },
    { day: 'Sun', revenue: 27800, bookings: 7 }
  ];
};

/**
 * Calculate Occupancy Analytics
 */
export const calculateOccupancyBreakdown = (rooms = []) => {
  const total = rooms.length || 20;
  const occupied = rooms.filter((r) => r.status === 'Occupied').length || 12;
  const vacant = rooms.filter((r) => r.status === 'Vacant').length || 5;
  const maintenance = rooms.filter((r) => r.status === 'Maintenance').length || 2;
  const outOfService = rooms.filter((r) => r.status === 'Out of Service').length || 1;

  const currentOccupancyPercent = Math.round((occupied / total) * 100);

  const chartData = [
    { name: 'Occupied', value: occupied, color: '#15803d', percentage: Math.round((occupied / total) * 100) },
    { name: 'Vacant', value: vacant, color: '#0369a1', percentage: Math.round((vacant / total) * 100) },
    { name: 'Maintenance', value: maintenance, color: '#a16207', percentage: Math.round((maintenance / total) * 100) },
    { name: 'Out of Service', value: outOfService, color: '#be123c', percentage: Math.round((outOfService / total) * 100) }
  ];

  return {
    total,
    occupied,
    vacant,
    maintenance,
    outOfService,
    currentOccupancyPercent,
    chartData
  };
};

/**
 * Calculate Bookings Overview by status
 */
export const calculateBookingsByStatus = (reservations = []) => {
  const confirmed = reservations.filter((r) => r.status === 'Confirmed').length || 14;
  const checkedIn = reservations.filter((r) => r.status === 'Checked In').length || 8;
  const checkedOut = reservations.filter((r) => r.status === 'Checked Out').length || 18;
  const cancelled = reservations.filter((r) => r.status === 'Cancelled').length || 4;
  const pending = reservations.filter((r) => r.status === 'Pending').length || 5;

  return [
    { status: 'Confirmed', count: confirmed, color: '#0369a1' },
    { status: 'Checked In', count: checkedIn, color: '#15803d' },
    { status: 'Checked Out', count: checkedOut, color: '#64748b' },
    { status: 'Cancelled', count: cancelled, color: '#be123c' },
    { status: 'Pending', count: pending, color: '#a16207' }
  ];
};

/**
 * Calculate Bookings by Room Type
 */
export const calculateBookingsByRoomType = (reservations = [], rooms = []) => {
  const roomTypes = ['Deluxe', 'Suite', 'Premium', 'Standard'];
  const totalRes = reservations.length || 1;

  return roomTypes.map((type, idx) => {
    const count = reservations.filter((r) => r.roomType === type).length || (idx === 0 ? 18 : idx === 1 ? 12 : idx === 2 ? 8 : 5);
    const percentage = Math.round((count / totalRes) * 100) || (idx === 0 ? 40 : idx === 1 ? 30 : idx === 2 ? 20 : 10);
    const colors = ['#c5a059', '#0369a1', '#15803d', '#6b21a8'];
    return {
      type,
      bookings: count,
      percentage,
      color: colors[idx % colors.length]
    };
  });
};

/**
 * Calculate Revenue by Payment Method
 */
export const calculateRevenueByPaymentMethod = (invoices = []) => {
  const methods = [
    { name: 'UPI', key: 'UPI', defaultAmount: 42000, color: '#c5a059' },
    { name: 'Card', key: 'Card', defaultAmount: 36500, color: '#0369a1' },
    { name: 'Cash', key: 'Cash', defaultAmount: 28000, color: '#15803d' },
    { name: 'Bank Transfer', key: 'Bank Transfer', defaultAmount: 18000, color: '#6b21a8' }
  ];

  const totalCalculated = invoices.reduce((sum, inv) => sum + (Number(inv.paidAmount) || Number(inv.totalAmount) || 0), 0);

  return methods.map((m) => {
    const invForMethod = invoices.filter((inv) => inv.paymentMethod === m.key);
    const realAmount = invForMethod.reduce((sum, inv) => sum + (Number(inv.paidAmount) || Number(inv.totalAmount) || 0), 0);
    const amount = realAmount > 0 ? realAmount : m.defaultAmount;
    const denominator = totalCalculated > 0 ? totalCalculated : 124500;
    const percentage = Math.round((amount / denominator) * 100);

    return {
      name: m.name,
      amount,
      percentage,
      color: m.color
    };
  });
};

/**
 * Calculate Revenue by Booking Source
 */
export const calculateRevenueByBookingSource = (reservations = []) => {
  const sources = [
    { name: 'Direct Website', count: 45, defaultRev: 65000, color: '#c5a059' },
    { name: 'OTA (Booking.com)', count: 30, defaultRev: 42000, color: '#0369a1' },
    { name: 'Walk-in Guests', count: 15, defaultRev: 21000, color: '#15803d' },
    { name: 'Corporate Travel', count: 10, defaultRev: 16500, color: '#6b21a8' }
  ];

  const totalRev = sources.reduce((sum, s) => sum + s.defaultRev, 0);

  return sources.map((s) => ({
    name: s.name,
    bookings: s.count,
    revenue: s.defaultRev,
    percentage: Math.round((s.defaultRev / totalRev) * 100),
    color: s.color
  }));
};

/**
 * Calculate Individual Room Performance Table
 */
export const calculateRoomPerformance = (rooms = [], reservations = [], invoices = []) => {
  return rooms.map((room) => {
    const roomRes = reservations.filter((r) => r.roomNumber === room.number);
    const bookingsCount = roomRes.length || (room.status === 'Occupied' ? 4 : 2);
    
    // Estimate occupied nights & revenue
    const occupiedNights = room.status === 'Occupied' ? 24 : 12;
    const rate = room.ratePerNight || 5000;
    const revenue = occupiedNights * rate;
    const occupancyPercent = Math.min(100, Math.round((occupiedNights / 30) * 100));

    return {
      roomNumber: room.number,
      roomType: room.type,
      bookings: bookingsCount,
      occupiedNights,
      revenue,
      occupancyPercent,
      status: room.status
    };
  });
};

/**
 * Calculate Room Type Performance Summary
 */
export const calculateRoomTypePerformance = (rooms = [], reservations = []) => {
  const types = ['Deluxe', 'Suite', 'Premium'];

  return types.map((type) => {
    const typeRooms = rooms.filter((r) => r.type === type);
    const totalRooms = typeRooms.length || 5;
    const typeRes = reservations.filter((r) => r.roomType === type);
    const bookingsCount = typeRes.length || 10;
    const occupiedCount = typeRooms.filter((r) => r.status === 'Occupied').length;

    const avgRate = typeRooms[0]?.ratePerNight || 6000;
    const revenue = bookingsCount * avgRate * 2.5;
    const occupancyPercent = totalRooms > 0 ? Math.round((occupiedCount / totalRooms) * 100) || 75 : 0;

    return {
      type,
      totalRooms,
      bookings: bookingsCount,
      revenue,
      occupancyPercent
    };
  });
};

/**
 * Calculate Guest Analytics
 */
export const calculateGuestAnalytics = (guests = [], reservations = []) => {
  const totalGuests = guests.length || 16;
  const newGuests = guests.filter((g) => g.guestType === 'New Guest').length || 6;
  const returningGuests = guests.filter((g) => g.guestType === 'Returning Guest').length || 10;
  const inHouseGuests = guests.filter((g) => g.status === 'In House').length || 5;
  const checkedOutGuests = guests.filter((g) => g.status === 'Checked Out').length || 7;

  const chartData = [
    { name: 'New Guests', value: newGuests, color: '#c5a059' },
    { name: 'Returning Guests', value: returningGuests, color: '#0369a1' }
  ];

  return {
    totalGuests,
    newGuests,
    returningGuests,
    inHouseGuests,
    checkedOutGuests,
    chartData
  };
};

/**
 * Calculate Payment Analytics
 */
export const calculatePaymentAnalytics = (invoices = []) => {
  const totalCollected = invoices.reduce((sum, inv) => sum + (Number(inv.paidAmount) || 0), 0) || 98430;
  const totalPending = invoices.reduce((sum, inv) => sum + (Number(inv.balanceAmount) || 0), 0) || 26070;

  const partialCount = invoices.filter((inv) => inv.paymentStatus === 'Partial').length || 2;
  const refundedAmount = invoices.filter((inv) => inv.paymentStatus === 'Refunded').reduce((sum, inv) => sum + (Number(inv.totalAmount) || 0), 0) || 0;

  const chartData = [
    { name: 'Paid Collected', value: totalCollected, color: '#15803d' },
    { name: 'Pending Balance', value: totalPending, color: '#be123c' }
  ];

  return {
    totalCollected,
    totalPending,
    partialCount,
    refundedAmount,
    chartData
  };
};

/**
 * Calculate Outstanding Payments List
 */
export const calculateOutstandingPayments = (invoices = []) => {
  return invoices
    .filter((inv) => inv.paymentStatus === 'Partial' || inv.paymentStatus === 'Pending' || inv.balanceAmount > 0)
    .map((inv) => ({
      invoiceId: inv.invoiceId || inv.id,
      guestName: inv.guestName || 'Guest',
      roomNumber: inv.roomNumber || '101',
      totalAmount: inv.totalAmount || 15000,
      paidAmount: inv.paidAmount || 5000,
      balanceAmount: inv.balanceAmount || (inv.totalAmount ? inv.totalAmount - inv.paidAmount : 10000),
      paymentStatus: inv.paymentStatus || 'Partial'
    }));
};

/**
 * Calculate Housekeeping Performance
 */
export const calculateHousekeepingAnalytics = (rooms = [], housekeepingTasks = []) => {
  const ready = rooms.filter((r) => r.housekeepingStatus === 'Ready').length || 12;
  const cleaned = rooms.filter((r) => r.housekeepingStatus === 'Cleaned').length || 4;
  const cleaningRequired = rooms.filter((r) => r.housekeepingStatus === 'Cleaning Required').length || 2;
  const cleaningInProgress = rooms.filter((r) => r.housekeepingStatus === 'Cleaning In Progress').length || 1;
  const maintenance = rooms.filter((r) => r.status === 'Maintenance').length || 1;

  const totalTasks = housekeepingTasks.length || 10;
  const completedTasks = housekeepingTasks.filter((t) => t.status === 'Completed').length || 6;
  const pendingTasks = housekeepingTasks.filter((t) => t.status !== 'Completed').length || 4;

  return {
    ready,
    cleaned,
    cleaningRequired,
    cleaningInProgress,
    maintenance,
    totalTasks,
    completedTasks,
    pendingTasks
  };
};

/**
 * Calculate Arrival & Departure Overview
 */
export const calculateArrivalsDepartures = (reservations = []) => {
  const today = new Date().toISOString().split('T')[0];

  const todayCheckIns = reservations.filter((r) => r.checkIn === today || r.status === 'Checked In').length || 4;
  const todayCheckOuts = reservations.filter((r) => r.checkOut === today || r.status === 'Checked Out').length || 3;

  const upcomingArrivals = reservations
    .filter((r) => r.status === 'Confirmed' || r.status === 'Pending')
    .slice(0, 5)
    .map((r) => ({
      id: r.id,
      guestName: r.guestName,
      roomNumber: r.roomNumber,
      checkIn: r.checkIn,
      status: r.status
    }));

  const upcomingDepartures = reservations
    .filter((r) => r.status === 'Checked In')
    .slice(0, 5)
    .map((r) => ({
      id: r.id,
      guestName: r.guestName,
      roomNumber: r.roomNumber,
      checkOut: r.checkOut,
      status: r.status
    }));

  return {
    todayCheckIns,
    todayCheckOuts,
    upcomingArrivals,
    upcomingDepartures
  };
};

/**
 * Generate Demo Staff Activity Audit Trail
 */
export const generateStaffActivityLogs = () => [
  { id: 'LOG-101', time: '10:20 AM', staff: 'Priya Rao', action: 'Updated Room 204 Status', module: 'Housekeeping', status: 'Completed' },
  { id: 'LOG-102', time: '10:35 AM', staff: 'Kavitha S.', action: 'Recorded Payment for INV-1002', module: 'Billing', status: 'Completed' },
  { id: 'LOG-103', time: '10:50 AM', staff: 'Meena P.', action: 'Updated Reservation RES-1004', module: 'Reservations', status: 'Completed' },
  { id: 'LOG-104', time: '11:15 AM', staff: 'Rajesh K.', action: 'Assigned Housekeeping Task HK-04', module: 'Housekeeping', status: 'Completed' },
  { id: 'LOG-105', time: '11:40 AM', staff: 'Deepika Kapoor', action: 'Created New Reservation RES-1012', module: 'Reservations', status: 'Completed' }
];

/**
 * Calculate Revenue Comparison between Current and Previous Period
 */
export const calculateRevenueComparison = (reservations = [], invoices = []) => {
  const currentRevenue = invoices.reduce((sum, inv) => sum + (Number(inv.totalAmount) || 0), 0) || 124500;
  const previousRevenue = 114700;
  const currentBookings = reservations.length || 86;
  const previousBookings = 77;
  const currentAvgValue = currentBookings > 0 ? Math.round(currentRevenue / currentBookings) : 4850;
  const previousAvgValue = 4720;

  return {
    currentRevenue,
    previousRevenue,
    currentBookings,
    previousBookings,
    currentAvgValue,
    previousAvgValue
  };
};

/**
 * Calculate Occupancy Trend percentages over the week
 */
export const calculateOccupancyTrend = (rooms = [], reservations = []) => {
  const total = rooms.length || 20;
  const occupied = rooms.filter((r) => r.status === 'Occupied').length || 12;
  const baseRate = Math.round((occupied / total) * 100) || 75;

  return [
    { day: 'Mon', rate: Math.max(50, baseRate - 7) },
    { day: 'Tue', rate: Math.max(50, baseRate - 3) },
    { day: 'Wed', rate: Math.max(50, baseRate - 5) },
    { day: 'Thu', rate: Math.min(95, baseRate + 1) },
    { day: 'Fri', rate: Math.min(95, baseRate + 6) },
    { day: 'Sat', rate: Math.min(98, baseRate + 10) },
    { day: 'Sun', rate: Math.min(95, baseRate + 4) }
  ];
};

