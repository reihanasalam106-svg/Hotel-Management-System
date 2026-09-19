import React from 'react';
import { Card } from '../common/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const RevenueComparisonCard = ({ data = {} }) => {
  const {
    currentRevenue = 124500,
    previousRevenue = 114700,
    currentBookings = 86,
    previousBookings = 77,
    currentAvgValue = 4850,
    previousAvgValue = 4720
  } = data;

  const revDiff = currentRevenue - previousRevenue;
  const revPercent = Math.round((revDiff / previousRevenue) * 100);

  const bookDiff = currentBookings - previousBookings;
  const bookPercent = Math.round((bookDiff / previousBookings) * 100);

  const avgDiff = currentAvgValue - previousAvgValue;
  const avgPercent = Math.round((avgDiff / previousAvgValue) * 100);

  return (
    <Card
      title="Revenue & Growth Comparison"
      subtitle="Performance comparisons between current and previous operating periods"
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '0.5rem' }}>
        {/* Revenue Comparison */}
        <div style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Period Revenue</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.25rem 0' }}>
            ₹{currentRevenue.toLocaleString('en-IN')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.775rem' }}>
            <span style={{ color: revPercent >= 0 ? 'var(--status-success-text)' : 'var(--status-danger-text)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.15rem' }}>
              {revPercent >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {revPercent >= 0 ? `+${revPercent}%` : `${revPercent}%`}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>vs prev (₹{previousRevenue.toLocaleString('en-IN')})</span>
          </div>
        </div>

        {/* Bookings Comparison */}
        <div style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Total Bookings</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.25rem 0' }}>
            {currentBookings} Bookings
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.775rem' }}>
            <span style={{ color: bookPercent >= 0 ? 'var(--status-success-text)' : 'var(--status-danger-text)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.15rem' }}>
              {bookPercent >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {bookPercent >= 0 ? `+${bookPercent}%` : `${bookPercent}%`}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>vs prev ({previousBookings})</span>
          </div>
        </div>

        {/* Avg Booking Value Comparison */}
        <div style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Average Booking Value</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.25rem 0' }}>
            ₹{currentAvgValue.toLocaleString('en-IN')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.775rem' }}>
            <span style={{ color: avgPercent >= 0 ? 'var(--status-success-text)' : 'var(--status-danger-text)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.15rem' }}>
              {avgPercent >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {avgPercent >= 0 ? `+${avgPercent}%` : `${avgPercent}%`}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>vs prev (₹{previousAvgValue.toLocaleString('en-IN')})</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
