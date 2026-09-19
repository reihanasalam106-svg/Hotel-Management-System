import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card } from '../common/Card';
import { DoorOpen } from 'lucide-react';

export const OccupancyAnalyticsCard = ({ occupancyData = {} }) => {
  const {
    currentOccupancyPercent = 75,
    occupied = 12,
    vacant = 5,
    maintenance = 2,
    outOfService = 1,
    chartData = []
  } = occupancyData;

  const displayData = chartData.length > 0 ? chartData : [
    { name: 'Occupied', value: occupied, color: '#15803d', percentage: 75 },
    { name: 'Vacant', value: vacant, color: '#0369a1', percentage: 17 },
    { name: 'Maintenance', value: maintenance, color: '#a16207', percentage: 5 },
    { name: 'Out of Service', value: outOfService, color: '#be123c', percentage: 3 }
  ];

  return (
    <Card
      title="Occupancy Rate & Status"
      subtitle="Current room allocation and status distribution"
      headerAction={
        <div style={{
          backgroundColor: 'var(--status-success-bg)',
          color: 'var(--status-success-text)',
          border: '1px solid var(--status-success-border)',
          borderRadius: '20px',
          padding: '0.25rem 0.75rem',
          fontSize: '0.8rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem'
        }}>
          <DoorOpen size={14} />
          {currentOccupancyPercent}% Occupied
        </div>
      }
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.25rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
        {/* Donut Chart */}
        <div style={{ width: 180, height: 180, position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(val, name) => [`${val} rooms`, name]}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.8rem'
                }}
              />
              <Pie
                data={displayData}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={78}
                paddingAngle={3}
                dataKey="value"
              >
                {displayData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', lineHeight: 1 }}>
              {currentOccupancyPercent}%
            </span>
            <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Occupancy
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div style={{ flex: 1, minWidth: 160, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {displayData.map((item) => (
            <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: item.color }} />
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.name}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <strong style={{ color: 'var(--text-primary)' }}>{item.value}</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.775rem' }}>({item.percentage || 0}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
