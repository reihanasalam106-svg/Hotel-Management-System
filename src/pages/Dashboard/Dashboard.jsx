import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { KPICard } from '../../components/dashboard/KPICard';
import { RecentReservationsTable } from '../../components/dashboard/RecentReservationsTable';
import { OccupancyCard } from '../../components/dashboard/OccupancyCard';
import { RoomStatusCard } from '../../components/dashboard/RoomStatusCard';
import { RevenueChart } from '../../components/dashboard/RevenueChart';
import { ReservationsChart } from '../../components/dashboard/ReservationsChart';
import { LoadingState } from '../../components/common/LoadingState';
import { useReservations } from '../../context/ReservationContext';
import { revenueTrendData, bookingChannelDistribution } from '../../data/mockData';
import './Dashboard.css';

export const Dashboard = () => {
  const navigate = useNavigate();
  const {
    rooms = [],
    reservations = [],
    invoices = [],
    isLoading
  } = useReservations();

  // Compute live KPI and Status metrics from PostgreSQL data
  const {
    dynamicKpiStats,
    occupancyData,
    roomStatusBreakdown,
    recentList
  } = useMemo(() => {
    const totalRooms = rooms.length;
    const occupied = rooms.filter(r => r.status === 'Occupied').length;
    const vacant = rooms.filter(r => r.status === 'Vacant').length;
    const maintenance = rooms.filter(r => r.status === 'Maintenance').length;
    const outOfService = rooms.filter(r => r.status === 'Out of Service').length;

    const occupancyRate = totalRooms > 0 ? Math.round((occupied / totalRooms) * 100) : 0;
    const totalRevenueNum = invoices.reduce((acc, i) => acc + (Number(i.paidAmount) || 0), 0);
    const todayStr = new Date().toISOString().split('T')[0];

    const todayCheckIns = reservations.filter(
      r => r.checkIn === todayStr || r.status === 'Checked In'
    ).length;

    const kpis = [
      {
        id: 1,
        title: 'Total Revenue',
        value: `₹${totalRevenueNum.toLocaleString('en-IN')}`,
        change: '+14.2% vs last month',
        isPositive: true,
        icon: 'IndianRupee',
        color: '#d4af37',
        bgColor: 'rgba(212, 175, 55, 0.12)'
      },
      {
        id: 2,
        title: 'Occupancy Rate',
        value: `${occupancyRate}%`,
        change: `${occupied}/${totalRooms} Rooms Booked`,
        isPositive: occupancyRate >= 50,
        icon: 'DoorOpen',
        color: '#3b82f6',
        bgColor: 'rgba(59, 130, 246, 0.12)'
      },
      {
        id: 3,
        title: "Active Check-Ins",
        value: String(todayCheckIns),
        change: 'Guests in house',
        isPositive: true,
        icon: 'LogIn',
        color: '#10b981',
        bgColor: 'rgba(16, 185, 129, 0.12)'
      },
      {
        id: 4,
        title: 'Available Rooms',
        value: String(vacant),
        change: `${totalRooms} Total Rooms`,
        isPositive: vacant > 0,
        icon: 'BedDouble',
        color: '#8b5cf6',
        bgColor: 'rgba(139, 92, 246, 0.12)'
      }
    ];

    const occ = {
      rate: occupancyRate,
      occupied,
      vacant,
      maintenance: maintenance + outOfService,
      total: totalRooms
    };

    const breakdown = [
      { name: 'Occupied', value: occupied, color: '#15803d' },
      { name: 'Vacant', value: vacant, color: '#0369a1' },
      { name: 'Maintenance', value: maintenance, color: '#a16207' },
      { name: 'Out of Service', value: outOfService, color: '#be123c' }
    ];

    return {
      dynamicKpiStats: kpis,
      occupancyData: occ,
      roomStatusBreakdown: breakdown,
      recentList: reservations.slice(0, 5)
    };
  }, [rooms, reservations, invoices]);

  if (isLoading && rooms.length === 0) {
    return (
      <div className="dashboard-container">
        <LoadingState label="Loading real-time hotel dashboard metrics..." />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Top 4 KPI Cards Grid */}
      <div className="kpi-grid">
        {dynamicKpiStats.map((kpi) => (
          <KPICard
            key={kpi.id}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            isPositive={kpi.isPositive}
            iconName={kpi.icon}
            color={kpi.color}
            bgColor={kpi.bgColor}
          />
        ))}
      </div>

      {/* Charts & Status Widgets Layout */}
      <div className="dashboard-middle-grid">
        <div className="revenue-chart-col">
          <RevenueChart data={revenueTrendData} />
        </div>
        <div className="occupancy-status-col">
          <OccupancyCard occupancyData={occupancyData} />
          <RoomStatusCard breakdown={roomStatusBreakdown} />
        </div>
      </div>

      {/* Recent Reservations & Booking Channel Distribution Grid */}
      <div className="dashboard-bottom-grid">
        <div className="reservations-table-col">
          <RecentReservationsTable
            reservations={recentList}
            onViewAll={() => navigate('/reservations')}
          />
        </div>
        <div className="booking-distribution-col">
          <ReservationsChart data={bookingChannelDistribution} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
