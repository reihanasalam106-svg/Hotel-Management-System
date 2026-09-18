import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { UserCheck, CheckCircle2 } from 'lucide-react';
import './Housekeeping.css';

export const StaffWorkloadDrawer = ({ isOpen, onClose, staffMember, tasks = [], rooms = [], onViewTask }) => {
  if (!staffMember) return null;

  const staffTasks = tasks.filter((t) => t.assignedStaffId === staffMember.id);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Staff Task View - ${staffMember.name}`}
      maxWidth="560px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bg-subtle)',
            padding: '0.875rem',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{staffMember.name}</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {staffMember.role} · Status: <strong>{staffMember.status}</strong>
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="task-count-pill">{staffTasks.length} Assigned Tasks</span>
          </div>
        </div>

        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Assigned Cleaning & Maintenance Tasks:
        </div>

        {staffTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-secondary)' }}>
            No active housekeeping tasks assigned to {staffMember.name}.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {staffTasks.map((task) => {
              const roomObj = rooms.find((r) => r.number === String(task.roomNumber));
              return (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-surface)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      Room {task.roomNumber} - {task.taskType}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Priority: {task.priority} | Due: {task.dueTime || 'N/A'} | Floor: {roomObj?.floor || '1'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Badge status={task.status} size="sm" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onClose();
                        onViewTask(task);
                      }}
                    >
                      View
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
