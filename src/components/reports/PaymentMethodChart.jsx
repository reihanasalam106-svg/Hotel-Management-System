import React from 'react';
import { Card } from '../common/Card';

export const PaymentMethodChart = ({ data = [] }) => {
  const displayData = data.length > 0 ? data : [
    { name: 'UPI', amount: 42000, percentage: 34, color: '#c5a059' },
    { name: 'Card', amount: 36500, percentage: 29, color: '#0369a1' },
    { name: 'Cash', amount: 28000, percentage: 22, color: '#15803d' },
    { name: 'Bank Transfer', amount: 18000, percentage: 15, color: '#6b21a8' }
  ];

  return (
    <Card
      title="Revenue by Payment Method"
      subtitle="Financial settlement breakdown by payment channel"
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
                <strong style={{ color: 'var(--text-primary)' }}>₹{(item.amount || 0).toLocaleString('en-IN')}</strong>
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
