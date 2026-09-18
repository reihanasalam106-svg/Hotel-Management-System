import React from 'react';
import { DoorOpen, CheckCircle, LogIn, Wrench, AlertOctagon } from 'lucide-react';
import './RoomSummaryCards.css';

export const RoomSummaryCards = ({ rooms }) => {
  const totalCount = rooms.length;
  const occupiedCount = rooms.filter((r) => r.status === 'Occupied').length;
  const vacantCount = rooms.filter((r) => r.status === 'Vacant').length;
  const maintenanceCount = rooms.filter((r) => r.status === 'Maintenance').length;
  const outOfServiceCount = rooms.filter((r) => r.status === 'Out of Service').length;

  const cardsData = [
    { label: 'Total Rooms', value: totalCount, icon: DoorOpen, colorClass: 'blue' },
    { label: 'Occupied', value: occupiedCount, icon: LogIn, colorClass: 'green' },
    { label: 'Vacant', value: vacantCount, icon: CheckCircle, colorClass: 'teal' },
    { label: 'Maintenance', value: maintenanceCount, icon: Wrench, colorClass: 'amber' },
    { label: 'Out of Service', value: outOfServiceCount, icon: AlertOctagon, colorClass: 'red' }
  ];

  return (
    <div className="room-summary-cards-grid">
      {cardsData.map((card) => {
        const IconComp = card.icon;
        return (
          <div key={card.label} className="room-summary-card">
            <div className={`summary-icon-box ${card.colorClass}`}>
              <IconComp size={20} />
            </div>
            <div className="summary-info">
              <span className="summary-label">{card.label}</span>
              <span className="summary-value">{card.value}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
