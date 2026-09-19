import React from 'react';
import { Card } from '../common/Card';

export const RoomTypeChart = ({ data = [] }) => {
  const displayData = data.length > 0 ? data : [
    { type: 'Deluxe', bookings: 18, percentage: 40, color: '#c5a059' },
    { type: 'Suite', bookings: 12, percentage: 30, color: '#0369a1' },
    { type: 'Premium', bookings: 8, percentage: 20, color: '#15803d' },
    { type: 'Standard', bookings: 5, percentage: 10, color: '#6b21a8' }
  ];

  return (
    <Card
      title="Bookings by Room Type"
      subtitle="Distribution of guest bookings across room categories"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
        {displayData.map((item) => (
          <div key={item.type} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.type}</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <strong style={{ color: 'var(--text-primary)' }}>{item.bookings} bookings</strong>
                <span style={{ color: 'var(--text-muted)' }}>({item.percentage}%)</span>
              </div>
            </div>
            {/* Progress Bar */}
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'var(--bg-main)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${item.percentage}%`,
                height: '100%',
                backgroundColor: item.color,
                borderRadius: '4px',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
