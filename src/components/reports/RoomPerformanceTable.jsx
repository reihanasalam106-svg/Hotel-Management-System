import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ArrowUpDown, ArrowUp, ArrowDown, DoorOpen } from 'lucide-react';

export const RoomPerformanceTable = ({ data = [] }) => {
  const [sortField, setSortField] = useState('revenue');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const renderSortTh = (field, label) => {
    const isActive = sortField === field;
    return (
      <th
        onClick={() => handleSort(field)}
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span>{label}</span>
          {isActive ? (
            sortOrder === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />
          ) : (
            <ArrowUpDown size={13} style={{ opacity: 0.4 }} />
          )}
        </div>
      </th>
    );
  };

  return (
    <Card
      title="Room Performance & Revenue"
      subtitle="Detailed room revenue generation, occupied nights, and occupancy rate"
    >
      <div className="table-responsive" style={{ overflowX: 'auto', marginTop: '0.5rem' }}>
        <table className="guest-table" style={{ width: '100%', fontSize: '0.85rem' }}>
          <thead>
            <tr>
              {renderSortTh('roomNumber', 'Room')}
              {renderSortTh('roomType', 'Room Type')}
              {renderSortTh('bookings', 'Bookings')}
              {renderSortTh('occupiedNights', 'Occupied Nights')}
              {renderSortTh('revenue', 'Revenue')}
              {renderSortTh('occupancyPercent', 'Occupancy Rate')}
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.slice(0, 8).map((r) => (
              <tr key={r.roomNumber}>
                <td>
                  <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <DoorOpen size={14} style={{ color: 'var(--accent-gold)' }} />
                    Room {r.roomNumber}
                  </strong>
                </td>
                <td>{r.roomType}</td>
                <td style={{ fontWeight: 600 }}>{r.bookings}</td>
                <td>{r.occupiedNights} nights</td>
                <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  ₹{(r.revenue || 0).toLocaleString('en-IN')}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '60px',
                      height: '6px',
                      backgroundColor: 'var(--bg-main)',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${r.occupancyPercent}%`,
                        height: '100%',
                        backgroundColor: r.occupancyPercent >= 75 ? '#15803d' : r.occupancyPercent >= 50 ? '#0369a1' : '#a16207'
                      }} />
                    </div>
                    <span>{r.occupancyPercent}%</span>
                  </div>
                </td>
                <td>
                  <Badge status={r.status}>{r.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
