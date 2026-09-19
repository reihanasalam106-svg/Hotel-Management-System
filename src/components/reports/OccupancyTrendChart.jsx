import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card } from '../common/Card';

export const OccupancyTrendChart = ({ data = [] }) => {
  const displayData = data.length > 0 ? data : [
    { day: 'Mon', rate: 68 },
    { day: 'Tue', rate: 72 },
    { day: 'Wed', rate: 70 },
    { day: 'Thu', rate: 76 },
    { day: 'Fri', rate: 81 },
    { day: 'Sat', rate: 85 },
    { day: 'Sun', rate: 79 }
  ];

  return (
    <Card
      title="Occupancy Rate Trend"
      subtitle="Daily occupancy percentage trajectory across the week"
    >
      <div style={{ width: '100%', height: 260, marginTop: '0.5rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} domain={[0, 100]} />
            <Tooltip
              formatter={(val) => [`${val}% Occupancy`, 'Rate']}
              contentStyle={{
                backgroundColor: '#0f172a',
                color: '#ffffff',
                borderRadius: '8px',
                border: 'none'
              }}
            />
            <Line type="monotone" dataKey="rate" stroke="#15803d" strokeWidth={3} dot={{ r: 4, fill: '#15803d' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
