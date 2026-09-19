import React from 'react';
import { Users, UserCheck, UserPlus, RotateCcw } from 'lucide-react';
import './GuestSummaryCards.css';

export const GuestSummaryCards = ({ guests = [] }) => {
  const totalGuests = guests.length;
  const inHouseGuests = guests.filter((g) => g.status === 'In House').length;
  const newGuests = guests.filter((g) => g.guestType === 'New Guest').length;
  const returningGuests = guests.filter((g) => g.guestType === 'Returning Guest').length;

  const cardsData = [
    {
      id: 'total-guests',
      title: 'Total Guests',
      value: totalGuests,
      subtitle: `${guests.filter(g => g.status !== 'Inactive').length} Active in System`,
      icon: Users,
      color: '#0369a1',
      bgColor: '#e0f2fe'
    },
    {
      id: 'in-house-guests',
      title: 'In-House Guests',
      value: inHouseGuests,
      subtitle: 'Currently Checked In',
      icon: UserCheck,
      color: '#15803d',
      bgColor: '#dcfce7'
    },
    {
      id: 'new-guests',
      title: 'New Guests',
      value: newGuests,
      subtitle: 'First-time Bookings',
      icon: UserPlus,
      color: '#c5a059',
      bgColor: 'rgba(197, 160, 89, 0.15)'
    },
    {
      id: 'returning-guests',
      title: 'Returning Guests',
      value: returningGuests,
      subtitle: 'Repeat Loyalty Guests',
      icon: RotateCcw,
      color: '#6b21a8',
      bgColor: '#f3e8ff'
    }
  ];

  return (
    <div className="guest-summary-grid">
      {cardsData.map((card) => {
        const IconComponent = card.icon;
        return (
          <div className="guest-summary-card" key={card.id}>
            <div className="guest-summary-info">
              <span className="guest-summary-title">{card.title}</span>
              <div className="guest-summary-value">{card.value}</div>
              <span className="guest-summary-subtitle">{card.subtitle}</span>
            </div>
            <div
              className="guest-summary-icon-box"
              style={{ backgroundColor: card.bgColor, color: card.color }}
            >
              <IconComponent size={24} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
