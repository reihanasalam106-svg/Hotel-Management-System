import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { UserCheck, Clock } from 'lucide-react';

export const StaffActivitySection = ({ logs = [] }) => {
  const displayLogs = logs || [];

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
            {displayLogs.length > 0 ? (
              displayLogs.map((log) => (
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
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
                  No recent operational activity or audit logs recorded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
