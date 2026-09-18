import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Play, CheckCircle, Sparkles, Wrench, Edit3, Trash2 } from 'lucide-react';
import './Housekeeping.css';

export const TaskDetailsModal = ({
  isOpen,
  onClose,
  task,
  rooms = [],
  staff = [],
  onChangeStatus,
  onEditTask,
  onDeleteTask
}) => {
  if (!task) return null;

  const roomObj = rooms.find((r) => r.number === String(task.roomNumber));
  const staffObj = staff.find((s) => s.id === task.assignedStaffId);
  const staffName = staffObj ? staffObj.name : 'Unassigned';
  const roomType = roomObj ? roomObj.type : 'Standard';
  const floor = roomObj ? roomObj.floor : 'Floor 1';
  const currentGuest = roomObj && roomObj.currentGuest ? roomObj.currentGuest : 'No current guest';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Task Details - ${task.id}`} maxWidth="560px">
      <div className="detail-grid">
        <div className="detail-item">
          <span className="detail-label">Task ID</span>
          <span className="detail-value">{task.id}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Room Number</span>
          <span className="detail-value">Room {task.roomNumber}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Room Type & Floor</span>
          <span className="detail-value">{roomType} · {floor}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Current Guest</span>
          <span className="detail-value">{currentGuest}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Task Type</span>
          <span className="detail-value">{task.taskType}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Priority</span>
          <span className="detail-value">{task.priority}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Assigned Staff</span>
          <span className="detail-value">{staffName}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Housekeeping Status</span>
          <span className="detail-value">
            <Badge status={task.status} />
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Due Time</span>
          <span className="detail-value">{task.dueTime || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Last Updated</span>
          <span className="detail-value">{task.updatedAt || task.createdAt || 'N/A'}</span>
        </div>
      </div>

      <span className="detail-label" style={{ marginBottom: '0.35rem', display: 'block' }}>Notes & Instructions</span>
      <div className="detail-notes-box">
        {task.notes || 'No specific notes provided for this task.'}
      </div>

      <div className="detail-actions">
        {task.status === 'Cleaning Required' && (
          <Button
            variant="primary"
            icon={Play}
            onClick={() => {
              onChangeStatus(task.id, 'Cleaning In Progress');
              onClose();
            }}
          >
            Start Cleaning
          </Button>
        )}
        {task.status === 'Cleaning In Progress' && (
          <Button
            variant="primary"
            icon={CheckCircle}
            onClick={() => {
              onChangeStatus(task.id, 'Cleaned');
              onClose();
            }}
          >
            Mark as Cleaned
          </Button>
        )}
        {task.status === 'Cleaned' && (
          <Button
            variant="primary"
            icon={Sparkles}
            onClick={() => {
              onChangeStatus(task.id, 'Ready');
              onClose();
            }}
          >
            Mark Room Ready
          </Button>
        )}
        {task.status !== 'Maintenance' && (
          <Button
            variant="outline"
            icon={Wrench}
            onClick={() => {
              onChangeStatus(task.id, 'Maintenance');
              onClose();
            }}
          >
            Maintenance
          </Button>
        )}
        <Button
          variant="secondary"
          icon={Edit3}
          onClick={() => {
            onClose();
            onEditTask(task);
          }}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          icon={Trash2}
          onClick={() => {
            onClose();
            onDeleteTask(task);
          }}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
};
