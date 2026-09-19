import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { BarChart2, TrendingUp } from 'lucide-react';

export const RevenueOverviewChart = ({ data = [], viewType = 'Daily', onViewTypeChange }) => {
  const [chartType, setChartType] = useState('area'); // 'area' | 'bar'

  const formatCurrency = (val) => `₹${(Number(val) || 0).toLocaleString('en-IN')}`;

  const xKey = viewType === 'Daily' ? 'day' : 'period';

  return (
    <Card
      title="Revenue Overview"
      subtitle="Track revenue growth and booking volume performance over time"
      headerAction={
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Daily / Weekly / Monthly Switcher */}
          <div style={{ display: 'flex', backgroundColor: 'var(--bg-main)', borderRadius: '6px', padding: '2px' }}>
            {['Daily', 'Weekly', 'Monthly'].map((vt) => (
              <button
                key={vt}
                type="button"
                onClick={() => onViewTypeChange && onViewTypeChange(vt)}
                style={{
                  border: 'none',
                  background: viewType === vt ? 'var(--bg-surface)' : 'transparent',
                  color: viewType === vt ? 'var(--accent-gold-dark)' : 'var(--text-secondary)',
                  fontWeight: viewType === vt ? 700 : 500,
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  boxShadow: viewType === vt ? 'var(--shadow-sm)' : 'none'
                }}
              >
                {vt}
              </button>
            ))}
          </div>

          {/* Line/Area vs Bar Switcher */}
          <div style={{ display: 'flex', backgroundColor: 'var(--bg-main)', borderRadius: '6px', padding: '2px' }}>
            <button
              type="button"
              onClick={() => setChartType('area')}
              style={{
                border: 'none',
                background: chartType === 'area' ? 'var(--bg-surface)' : 'transparent',
                color: chartType === 'area' ? 'var(--accent-gold-dark)' : 'var(--text-secondary)',
                fontWeight: chartType === 'area' ? 700 : 500,
                fontSize: '0.75rem',
                padding: '0.25rem 0.6rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Line
            </button>
            <button
              type="button"
              onClick={() => setChartType('bar')}
              style={{
                border: 'none',
                background: chartType === 'bar' ? 'var(--bg-surface)' : 'transparent',
                color: chartType === 'bar' ? 'var(--accent-gold-dark)' : 'var(--text-secondary)',
                fontWeight: chartType === 'bar' ? 700 : 500,
                fontSize: '0.75rem',
                padding: '0.25rem 0.6rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Bar
            </button>
          </div>
        </div>
      }
    >
      <div style={{ width: '100%', height: 320, marginTop: '0.5rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGoldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c5a059" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#c5a059" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey={xKey} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `₹${val >= 1000 ? `${val / 1000}k` : val}`}
              />
              <Tooltip
                formatter={(val) => [formatCurrency(val), 'Revenue']}
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
                fill="url(#revGoldGrad)"
              />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey={xKey} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `₹${val >= 1000 ? `${val / 1000}k` : val}`}
              />
              <Tooltip
                formatter={(val) => [formatCurrency(val), 'Revenue']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
                itemStyle={{ color: '#c5a059' }}
              />
              <Bar dataKey="revenue" fill="#c5a059" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
