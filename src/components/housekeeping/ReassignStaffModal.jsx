import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import './Housekeeping.css';

export const ReassignStaffModal = ({ isOpen, onClose, task, staff = [], onReassign }) => {
  const [selectedStaffId, setSelectedStaffId] = useState('');

  useEffect(() => {
    if (task) {
      setSelectedStaffId(task.assignedStaffId || '');
    }
  }, [task, isOpen]);

  if (!task) return null;

  const staffOptions = staff.map((s) => ({
    value: s.id,
    label: `${s.name} (${s.status} - ${s.assignedTasks || 0} tasks)`
  }));

  const handleConfirm = () => {
    if (selectedStaffId && selectedStaffId !== task.assignedStaffId) {
      onReassign(task.id, selectedStaffId);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Reassign Staff - ${task.id}`} maxWidth="440px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Reassign <strong>Room {task.roomNumber} ({task.taskType})</strong> to a different housekeeping staff member:
        </p>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block' }}>
            Select Staff Member
          </label>
          <Select
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            options={staffOptions}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Reassign Staff
          </Button>
        </div>
      </div>
    </Modal>
  );
};
