import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { Input } from '../common/Input';
import './Housekeeping.css';

export const HousekeepingTaskForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  rooms = [],
  staff = []
}) => {
  const [formData, setFormData] = useState({
    roomNumber: '',
    taskType: 'Room Cleaning',
    priority: 'Medium',
    assignedStaffId: '',
    dueTime: '12:00 PM',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        roomNumber: initialData.roomNumber || '',
        taskType: initialData.taskType || 'Room Cleaning',
        priority: initialData.priority || 'Medium',
        assignedStaffId: initialData.assignedStaffId || '',
        dueTime: initialData.dueTime || '12:00 PM',
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        roomNumber: rooms.length > 0 ? rooms[0].number : '',
        taskType: 'Room Cleaning',
        priority: 'Medium',
        assignedStaffId: staff.length > 0 ? staff[0].id : '',
        dueTime: '12:00 PM',
        notes: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen, rooms, staff]);

  const selectedRoomObj = rooms.find((r) => r.number === String(formData.roomNumber));

  const roomOptions = rooms.map((r) => ({
    value: r.number,
    label: `Room ${r.number} (${r.type} - ${r.floor})`
  }));

  const taskTypeOptions = [
    { value: 'Room Cleaning', label: 'Room Cleaning' },
    { value: 'Checkout Cleaning', label: 'Checkout Cleaning' },
    { value: 'Deep Cleaning', label: 'Deep Cleaning' },
    { value: 'Linen Change', label: 'Linen Change' },
    { value: 'Bathroom Cleaning', label: 'Bathroom Cleaning' },
    { value: 'Inspection', label: 'Inspection' },
    { value: 'Maintenance Check', label: 'Maintenance Check' }
  ];

  const priorityOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    { value: 'Urgent', label: 'Urgent' }
  ];

  const staffOptions = staff.map((s) => ({
    value: s.id,
    label: `${s.name} (${s.status})`
  }));

  const validate = () => {
    const errs = {};
    if (!formData.roomNumber) errs.roomNumber = 'Room selection is required';
    if (!formData.taskType) errs.taskType = 'Task type is required';
    if (!formData.priority) errs.priority = 'Priority is required';
    if (!formData.assignedStaffId) errs.assignedStaffId = 'Assigned staff is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Housekeeping Task' : 'Create Housekeeping Task'}
      maxWidth="560px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block' }}>
            Room Number <span className="required-star">*</span>
          </label>
          <Select
            value={formData.roomNumber}
            onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
            options={roomOptions}
            placeholder="Select room"
          />
          {errors.roomNumber && <div className="form-field-error">{errors.roomNumber}</div>}
        </div>

        <div className="grid-2">
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block' }}>
              Room Type (Auto)
            </label>
            <Input value={selectedRoomObj ? selectedRoomObj.type : 'N/A'} readOnly disabled />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block' }}>
              Floor (Auto)
            </label>
            <Input value={selectedRoomObj ? selectedRoomObj.floor : 'N/A'} readOnly disabled />
          </div>
        </div>

        <div className="grid-2">
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block' }}>
              Task Type <span className="required-star">*</span>
            </label>
            <Select
              value={formData.taskType}
              onChange={(e) => setFormData({ ...formData, taskType: e.target.value })}
              options={taskTypeOptions}
            />
            {errors.taskType && <div className="form-field-error">{errors.taskType}</div>}
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block' }}>
              Priority <span className="required-star">*</span>
            </label>
            <Select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              options={priorityOptions}
            />
            {errors.priority && <div className="form-field-error">{errors.priority}</div>}
          </div>
        </div>

        <div className="grid-2">
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block' }}>
              Assign Staff <span className="required-star">*</span>
            </label>
            <Select
              value={formData.assignedStaffId}
              onChange={(e) => setFormData({ ...formData, assignedStaffId: e.target.value })}
              options={staffOptions}
              placeholder="Select housekeeping staff"
            />
            {errors.assignedStaffId && <div className="form-field-error">{errors.assignedStaffId}</div>}
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block' }}>
              Due Time
            </label>
            <Input
              type="text"
              value={formData.dueTime}
              onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
              placeholder="e.g. 11:30 AM"
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block' }}>
            Notes / Instructions
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Add specific instructions for housekeeping staff..."
            rows={3}
            style={{
              width: '100%',
              padding: '0.6rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              fontSize: '0.875rem',
              background: 'var(--bg-surface)'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {initialData ? 'Save Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
