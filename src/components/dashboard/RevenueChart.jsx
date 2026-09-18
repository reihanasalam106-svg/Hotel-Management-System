import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card } from '../common/Card';

export const RevenueChart = ({ data }) => {
  const formatCurrency = (value) => `₹${value.toLocaleString('en-IN')}`;

  return (
    <Card
      title="Revenue Overview"
      subtitle="Weekly revenue trajectory and booking growth"
    >
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGoldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c5a059" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#c5a059" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `₹${val / 1000}k`}
            />
            <Tooltip
              formatter={(value) => [formatCurrency(value), 'Revenue']}
              contentStyle={{
                backgroundColor: '#0f172a',
                color: '#ffffff',
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
              itemStyle={{ color: '#c5a059' }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#c5a059"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#revenueGoldGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
