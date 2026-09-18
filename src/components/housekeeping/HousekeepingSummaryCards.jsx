import React from 'react';
import { DoorOpen, CheckCircle2, AlertCircle, Clock, Wrench } from 'lucide-react';
import './Housekeeping.css';

export const HousekeepingSummaryCards = ({ rooms = [] }) => {
  const totalRooms = rooms.length;
  const readyCount = rooms.filter((r) => r.housekeepingStatus === 'Ready').length;
  const cleaningReqCount = rooms.filter((r) => r.housekeepingStatus === 'Cleaning Required').length;
  const inProgressCount = rooms.filter((r) => r.housekeepingStatus === 'Cleaning In Progress').length;
  const maintenanceCount = rooms.filter((r) => r.housekeepingStatus === 'Maintenance' || r.status === 'Maintenance').length;

  const cards = [
    {
      title: 'Total Rooms',
      value: totalRooms,
      icon: DoorOpen,
      color: '#0369a1',
      bgColor: '#e0f2fe'
    },
    {
      title: 'Ready',
      value: readyCount,
      icon: CheckCircle2,
      color: '#15803d',
      bgColor: '#dcfce7'
    },
    {
      title: 'Cleaning Required',
      value: cleaningReqCount,
      icon: AlertCircle,
      color: '#be123c',
      bgColor: '#ffe4e6'
    },
    {
      title: 'Cleaning In Progress',
      value: inProgressCount,
      icon: Clock,
      color: '#a16207',
      bgColor: '#fef9c3'
    },
    {
      title: 'Maintenance',
      value: maintenanceCount,
      icon: Wrench,
      color: '#6b21a8',
      bgColor: '#f3e8ff'
    }
  ];

  return (
    <div className="hk-summary-grid">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div className="hk-summary-card" key={idx}>
            <div
              className="hk-card-icon"
              style={{ backgroundColor: card.bgColor, color: card.color }}
            >
              <IconComponent size={22} />
            </div>
            <div className="hk-card-content">
              <span className="hk-card-title">{card.title}</span>
              <span className="hk-card-value">{card.value}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
