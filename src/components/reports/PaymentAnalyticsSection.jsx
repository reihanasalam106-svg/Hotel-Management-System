import React from 'react';
import { Card } from '../common/Card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const PaymentAnalyticsSection = ({ paymentData = {} }) => {
  const {
    totalCollected = 98430,
    totalPending = 26070,
    partialCount = 2,
    refundedAmount = 0,
    chartData = []
  } = paymentData;

  const pieData = chartData.length > 0 ? chartData : [
    { name: 'Paid Collected', value: totalCollected, color: '#15803d' },
    { name: 'Pending Balance', value: totalPending, color: '#be123c' }
  ];

  return (
    <Card
      title="Payment Settlement Analytics"
      subtitle="Total collected revenues versus outstanding receivables"
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '0.5rem' }}>
        {/* Left Side: Metrics Tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Collected</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#15803d' }}>
              ₹{totalCollected.toLocaleString('en-IN')}
            </div>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending Balance</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#be123c' }}>
              ₹{totalPending.toLocaleString('en-IN')}
            </div>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Partial Payments</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#a16207' }}>
              {partialCount} Invoices
            </div>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Refunded</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
              ₹{refundedAmount.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Right Side: Donut Chart */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip formatter={(val, name) => [`₹${val.toLocaleString('en-IN')}`, name]} />
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={65}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
