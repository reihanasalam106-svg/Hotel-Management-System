import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Card } from '../common/Card';

export const BookingsOverviewChart = ({ data = [] }) => {
  const displayData = data.length > 0 ? data : [
    { status: 'Confirmed', count: 14, color: '#0369a1' },
    { status: 'Checked In', count: 8, color: '#15803d' },
    { status: 'Checked Out', count: 18, color: '#64748b' },
    { status: 'Cancelled', count: 4, color: '#be123c' },
    { status: 'Pending', count: 5, color: '#a16207' }
  ];

  return (
    <Card
      title="Bookings Overview"
      subtitle="Total reservations categorized by booking lifecycle status"
    >
      <div style={{ width: '100%', height: 260, marginTop: '0.5rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={displayData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="status" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(val) => [`${val} Bookings`, 'Total']}
              contentStyle={{
                backgroundColor: '#0f172a',
                color: '#ffffff',
                borderRadius: '8px',
                border: 'none'
              }}
            />
            <Bar dataKey="count" fill="#0369a1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
