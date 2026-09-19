import React from 'react';
import { Card } from '../common/Card';

export const BookingSourceChart = ({ data = [] }) => {
  const displayData = data.length > 0 ? data : [
    { name: 'Direct Website', bookings: 45, revenue: 65000, percentage: 45, color: '#c5a059' },
    { name: 'OTA (Booking.com)', bookings: 30, revenue: 42000, percentage: 30, color: '#0369a1' },
    { name: 'Walk-in Guests', bookings: 15, revenue: 21000, percentage: 15, color: '#15803d' },
    { name: 'Corporate Travel', bookings: 10, revenue: 16500, percentage: 10, color: '#6b21a8' }
  ];

  return (
    <Card
      title="Revenue by Booking Source"
      subtitle="Channel distribution of booking revenue"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
        {displayData.map((item) => (
          <div key={item.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: item.color }} />
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <strong style={{ color: 'var(--text-primary)' }}>₹{(item.revenue || 0).toLocaleString('en-IN')}</strong>
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
