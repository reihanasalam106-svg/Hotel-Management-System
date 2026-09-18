import React from 'react';
import { Card } from '../common/Card';
import { CheckCircle2, BedDouble, Wrench, AlertTriangle } from 'lucide-react';
import './RoomStatusCard.css';

export const RoomStatusCard = ({ breakdown }) => {
  const statusItems = [
    { label: 'Occupied', count: 90, color: '#15803d', bg: '#dcfce7', icon: BedDouble },
    { label: 'Vacant', count: 20, color: '#0369a1', bg: '#e0f2fe', icon: CheckCircle2 },
    { label: 'Maintenance', count: 5, color: '#a16207', bg: '#fef9c3', icon: Wrench },
    { label: 'Out of Service', count: 5, color: '#be123c', bg: '#ffe4e6', icon: AlertTriangle }
  ];

  return (
    <Card title="Room Status Overview" subtitle="Real-time status breakdown across 120 rooms">
      <div className="room-status-grid">
        {statusItems.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div key={idx} className="room-status-item">
              <div className="status-item-left">
                <div className="status-icon-box" style={{ backgroundColor: item.bg, color: item.color }}>
                  <IconComponent size={20} />
                </div>
                <span className="status-item-label">{item.label}</span>
              </div>
              <span className="status-item-count">{item.count}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
