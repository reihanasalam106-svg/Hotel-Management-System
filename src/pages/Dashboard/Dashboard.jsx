import React from 'react';
import { useNavigate } from 'react-router-dom';
import { KPICard } from '../../components/dashboard/KPICard';
import { RecentReservationsTable } from '../../components/dashboard/RecentReservationsTable';
import { OccupancyCard } from '../../components/dashboard/OccupancyCard';
import { RoomStatusCard } from '../../components/dashboard/RoomStatusCard';
import { RevenueChart } from '../../components/dashboard/RevenueChart';
import { ReservationsChart } from '../../components/dashboard/ReservationsChart';
import {
  kpiStats,
  occupancyData,
  recentReservations,
  revenueTrendData,
  bookingChannelDistribution,
  roomStatusBreakdown
} from '../../data/mockData';
import './Dashboard.css';

export const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      {/* Top 4 KPI Cards Grid */}
      <div className="kpi-grid">
        {kpiStats.map((kpi) => (
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
            reservations={recentReservations}
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
