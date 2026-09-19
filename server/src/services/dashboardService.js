import { roomRepository } from '../repositories/roomRepository.js';
import { reservationRepository } from '../repositories/reservationRepository.js';
import { billingRepository } from '../repositories/billingRepository.js';

export const dashboardService = {
  async getSummary() {
    const rooms = await roomRepository.findAll();
    const reservations = await reservationRepository.findAll();
    const invoices = await billingRepository.findAll();

    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;
    const vacantRooms = rooms.filter(r => r.status === 'Vacant').length;
    const maintenanceRooms = rooms.filter(r => r.status === 'Maintenance').length;
    const outOfServiceRooms = rooms.filter(r => r.status === 'Out of Service').length;

    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    const todayStr = new Date().toISOString().split('T')[0];
    const checkInsToday = reservations.filter(r => r.checkIn === todayStr || r.status === 'Checked In').length;
    const checkOutsToday = reservations.filter(r => r.checkOut === todayStr || r.status === 'Checked Out').length;

    const totalRevenue = invoices.reduce((acc, inv) => acc + (Number(inv.paidAmount) || 0), 0);

    const recent = reservations.slice(0, 5);

    return {
      kpi: {
        totalRooms,
        checkInsToday,
        checkOutsToday,
        totalRevenue: `₹${totalRevenue.toLocaleString('en-IN')}`,
        numericRevenue: totalRevenue,
        occupancyRate: `${occupancyRate}%`
      },
      occupancy: {
        percentage: occupancyRate,
        occupied: occupiedRooms,
        vacant: vacantRooms,
        maintenance: maintenanceRooms,
        outOfService: outOfServiceRooms,
        total: totalRooms
      },
      roomStatusBreakdown: [
        { name: 'Occupied', value: occupiedRooms, color: '#15803d' },
        { name: 'Vacant', value: vacantRooms, color: '#0369a1' },
        { name: 'Maintenance', value: maintenanceRooms, color: '#a16207' },
        { name: 'Out of Service', value: outOfServiceRooms, color: '#be123c' }
      ],
      recentReservations: recent
    };
  }
};
