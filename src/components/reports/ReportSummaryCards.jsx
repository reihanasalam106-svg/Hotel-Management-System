import React from 'react';
import { IndianRupee, Calendar, DoorOpen, UserPlus, Calculator, TrendingUp, TrendingDown } from 'lucide-react';
import './ReportSummaryCards.css';

export const ReportSummaryCards = ({ metrics = {} }) => {
  const {
    totalRevenue = 124500,
    totalBookings = 86,
    occupancyRate = 75,
    newGuestsCount = 18,
    avgBookingValue = 4850,
    revenueChange = '+8.5%',
    bookingsChange = '+12.4%',
    occupancyChange = '+4.2%',
    newGuestsChange = '+6.1%',
    avgValueChange = '+2.8%'
  } = metrics;

  const cards = [
    {
      id: 'revenue',
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      change: revenueChange,
      isPositive: !revenueChange.startsWith('-'),
      icon: IndianRupee,
      color: '#c5a059',
      bgColor: 'rgba(197, 160, 89, 0.15)'
    },
    {
      id: 'bookings',
      title: 'Total Bookings',
      value: totalBookings,
      change: bookingsChange,
      isPositive: !bookingsChange.startsWith('-'),
      icon: Calendar,
      color: '#0369a1',
      bgColor: '#e0f2fe'
    },
    {
      id: 'occupancy',
      title: 'Occupancy Rate',
      value: `${occupancyRate}%`,
      change: occupancyChange,
      isPositive: !occupancyChange.startsWith('-'),
      icon: DoorOpen,
      color: '#15803d',
      bgColor: '#dcfce7'
    },
    {
      id: 'new-guests',
      title: 'New Guests',
      value: newGuestsCount,
      change: newGuestsChange,
      isPositive: !newGuestsChange.startsWith('-'),
      icon: UserPlus,
      color: '#6b21a8',
      bgColor: '#f3e8ff'
    },
    {
      id: 'avg-value',
      title: 'Average Booking Value',
      value: `₹${avgBookingValue.toLocaleString('en-IN')}`,
      change: avgValueChange,
      isPositive: !avgValueChange.startsWith('-'),
      icon: Calculator,
      color: '#a16207',
      bgColor: '#fef9c3'
    }
  ];

  return (
    <div className="report-summary-grid">
      {cards.map((card) => {
        const IconComponent = card.icon;
        const TrendIcon = card.isPositive ? TrendingUp : TrendingDown;

        return (
          <div className="report-summary-card" key={card.id}>
            <div className="report-card-top">
              <span className="report-card-title">{card.title}</span>
              <div
                className="report-card-icon"
                style={{ backgroundColor: card.bgColor, color: card.color }}
              >
                <IconComponent size={20} />
              </div>
            </div>

            <div className="report-card-value">{card.value}</div>

            <div className="report-card-footer">
              <span
                className={`trend-badge ${card.isPositive ? 'trend-positive' : 'trend-negative'}`}
              >
                <TrendIcon size={13} />
                {card.change}
              </span>
              <span className="trend-period">vs prev. period</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
