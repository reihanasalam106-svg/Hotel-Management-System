import React from 'react';
import { Badge } from '../common/Badge';
import { User, ShieldAlert } from 'lucide-react';
import './Housekeeping.css';

export const RoomHousekeepingCard = ({ room, tasks = [], staff = [], onClick }) => {
  const currentGuestStr = room.currentGuest || 'No current guest';
  const roomTask = tasks.find((t) => t.roomNumber === String(room.number));
  const staffObj = roomTask ? staff.find((s) => s.id === roomTask.assignedStaffId) : null;
  const staffName = staffObj ? staffObj.name : room.housekeeper || 'Unassigned';

  return (
    <div className="room-hk-card" onClick={() => onClick && onClick(room, roomTask)}>
      <div className="room-card-header">
        <div>
          <div className="room-card-number">Room {room.number}</div>
          <div className="room-card-subtitle">
            {room.type} · {room.floor}
          </div>
        </div>
        {roomTask?.priority && roomTask.priority === 'Urgent' && (
          <span className="priority-badge priority-urgent">
            <ShieldAlert size={12} /> Urgent
          </span>
        )}
      </div>

      <div className="room-card-guest">
        <User size={14} color="#64748b" />
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Current Guest</span>
          <strong style={{ color: room.currentGuest ? 'var(--text-primary)' : 'var(--text-muted)' }}>
            {currentGuestStr}
          </strong>
        </div>
      </div>

      <div className="room-card-badges">
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>
            Room Status
          </span>
          <Badge status={room.status} size="sm" />
        </div>
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>
            Housekeeping
          </span>
          <Badge status={room.housekeepingStatus} size="sm" />
        </div>
      </div>

      <div className="room-card-footer">
        <span>Staff: <strong>{staffName}</strong></span>
        {roomTask && <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold-dark)', fontWeight: 600 }}>{roomTask.taskType}</span>}
      </div>
    </div>
  );
};
