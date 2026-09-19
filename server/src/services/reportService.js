import { roomRepository } from '../repositories/roomRepository.js';
import { reservationRepository } from '../repositories/reservationRepository.js';
import { guestRepository } from '../repositories/guestRepository.js';
import { billingRepository } from '../repositories/billingRepository.js';
import { housekeepingRepository } from '../repositories/housekeepingRepository.js';

export const reportService = {
  async getSummary(filters = {}) {
    const { startDate, endDate, roomType, bookingSource, paymentMethod } = filters;

    let reservations = await reservationRepository.findAll();
    let invoices = await billingRepository.findAll();
    const rooms = await roomRepository.findAll();
    const guests = await guestRepository.findAll();
    const tasks = await housekeepingRepository.findAll();

    // Filter reservations
    if (startDate) {
      reservations = reservations.filter(r => r.checkIn >= startDate);
    }
    if (endDate) {
      reservations = reservations.filter(r => r.checkOut <= endDate);
    }
    if (roomType) {
      reservations = reservations.filter(r => r.roomType.toLowerCase() === roomType.toLowerCase());
    }
    if (bookingSource) {
      reservations = reservations.filter(r => (r.bookingSource || '').toLowerCase() === bookingSource.toLowerCase());
    }

    // Filter invoices
    if (paymentMethod) {
      invoices = invoices.filter(i => (i.paymentMethod || '').toLowerCase() === paymentMethod.toLowerCase());
    }

    // Revenue calculations
    const totalBilled = invoices.reduce((acc, i) => acc + Number(i.totalAmount || 0), 0);
    const totalCollected = invoices.reduce((acc, i) => acc + Number(i.paidAmount || 0), 0);
    const outstandingBalance = invoices.reduce((acc, i) => acc + Number(i.balanceAmount || 0), 0);

    // Bookings calculations
    const totalBookings = reservations.length;
    const confirmedBookings = reservations.filter(r => r.status === 'Confirmed' || r.status === 'Checked In').length;
    const cancelledBookings = reservations.filter(r => r.status === 'Cancelled').length;

    // Occupancy
    const totalRooms = rooms.length;
    const occupiedCount = rooms.filter(r => r.status === 'Occupied').length;
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedCount / totalRooms) * 100) : 0;

    // Guest statistics
    const totalGuests = guests.length;
    const returningGuests = guests.filter(g => g.guestType === 'Returning Guest').length;
    const newGuests = guests.filter(g => g.guestType === 'New Guest').length;

    // Booking Sources Breakdown
    const sourceCounts = {};
    reservations.forEach(r => {
      const src = r.bookingSource || 'Direct Website';
      sourceCounts[src] = (sourceCounts[src] || 0) + 1;
    });
    const bookingSources = Object.entries(sourceCounts).map(([name, count]) => ({
      name,
      count,
      percentage: totalBookings > 0 ? Math.round((count / totalBookings) * 100) : 0
    }));

    // Payment statistics
    const methodCounts = {};
    invoices.forEach(i => {
      const m = i.paymentMethod || 'Other';
      methodCounts[m] = (methodCounts[m] || 0) + Number(i.paidAmount || 0);
    });
    const paymentStatistics = Object.entries(methodCounts).map(([method, amount]) => ({
      method,
      amount
    }));

    // Housekeeping statistics
    const housekeepingStats = {
      totalTasks: tasks.length,
      readyRooms: tasks.filter(t => t.status === 'Ready').length,
      cleanedRooms: tasks.filter(t => t.status === 'Cleaned').length,
      cleaningRequired: tasks.filter(t => t.status === 'Cleaning Required').length,
      inProgress: tasks.filter(t => t.status === 'Cleaning In Progress').length,
      maintenance: tasks.filter(t => t.status === 'Maintenance').length
    };

    return {
      revenue: {
        totalBilled,
        totalCollected,
        outstandingBalance,
        currency: 'INR'
      },
      bookings: {
        total: totalBookings,
        confirmed: confirmedBookings,
        cancelled: cancelledBookings,
        cancellationRate: totalBookings > 0 ? Math.round((cancelledBookings / totalBookings) * 100) : 0
      },
      occupancy: {
        totalRooms,
        occupiedRooms: occupiedCount,
        occupancyRate: `${occupancyRate}%`
      },
      guestStatistics: {
        total: totalGuests,
        returning: returningGuests,
        new: newGuests
      },
      paymentStatistics,
      bookingSources,
      housekeepingStatistics: housekeepingStats
    };
  }
};
