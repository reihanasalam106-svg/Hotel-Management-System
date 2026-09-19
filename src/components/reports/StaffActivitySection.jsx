import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { UserCheck, Clock } from 'lucide-react';

export const StaffActivitySection = ({ logs = [] }) => {
  const displayLogs = logs.length > 0 ? logs : [
    { id: 'LOG-101', time: '10:20 AM', staff: 'Priya Rao', action: 'Updated Room 204 Status', module: 'Housekeeping', status: 'Completed' },
    { id: 'LOG-102', time: '10:35 AM', staff: 'Kavitha S.', action: 'Recorded Payment for INV-1002', module: 'Billing', status: 'Completed' },
    { id: 'LOG-103', time: '10:50 AM', staff: 'Meena P.', action: 'Updated Reservation RES-1004', module: 'Reservations', status: 'Completed' },
    { id: 'LOG-104', time: '11:15 AM', staff: 'Rajesh K.', action: 'Assigned Housekeeping Task HK-04', module: 'Housekeeping', status: 'Completed' },
    { id: 'LOG-105', time: '11:40 AM', staff: 'Deepika Kapoor', action: 'Created New Reservation RES-1012', module: 'Reservations', status: 'Completed' }
  ];

  return (
    <Card
      title="Staff Activity & System Audit Logs"
      subtitle="Recent operational actions performed by hotel staff across modules"
    >
      <div className="table-responsive" style={{ overflowX: 'auto', marginTop: '0.5rem' }}>
        <table className="guest-table" style={{ width: '100%', fontSize: '0.85rem' }}>
          <thead>
            <tr>
              <th>Time</th>
              <th>Staff Member</th>
              <th>Action Performed</th>
              <th>Module</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {displayLogs.map((log) => (
              <tr key={log.id}>
                <td style={{ whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={13} style={{ color: 'var(--accent-gold)' }} />
                    {log.time}
                  </span>
                </td>
                <td>
                  <strong>{log.staff}</strong>
                </td>
                <td>{log.action}</td>
                <td>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    backgroundColor: 'var(--bg-main)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)'
                  }}>
                    {log.module}
                  </span>
                </td>
                <td>
                  <Badge status={log.status}>{log.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
