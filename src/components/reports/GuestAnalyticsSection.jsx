import React from 'react';
import { Card } from '../common/Card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Users, UserPlus, RotateCcw, UserCheck, LogOut } from 'lucide-react';

export const GuestAnalyticsSection = ({ guestData = {} }) => {
  const {
    totalGuests = 16,
    newGuests = 6,
    returningGuests = 10,
    inHouseGuests = 5,
    checkedOutGuests = 7,
    chartData = []
  } = guestData;

  const pieData = chartData.length > 0 ? chartData : [
    { name: 'New Guests', value: newGuests, color: '#c5a059' },
    { name: 'Returning Guests', value: returningGuests, color: '#0369a1' }
  ];

  return (
    <Card
      title="Guest Demographics & Loyalty"
      subtitle="Comprehensive breakdown of guest types and current in-house status"
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '0.5rem' }}>
        {/* Left Side: Stats Tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Guests</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalGuests}</div>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>New Guests</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#c5a059' }}>{newGuests}</div>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Returning</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0369a1' }}>{returningGuests}</div>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>In-House</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803d' }}>{inHouseGuests}</div>
          </div>
        </div>

        {/* Right Side: Donut Chart */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160, position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip formatter={(val, name) => [`${val} Guests`, name]} />
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
