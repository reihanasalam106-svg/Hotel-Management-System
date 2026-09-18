import React from 'react';
import { Badge } from '../common/Badge';
import { HousekeepingBadge } from './HousekeepingBadge';
import { Eye, Edit3, Settings, User } from 'lucide-react';
import './RoomCard.css';

export const RoomCard = ({
  room,
  onView,
  onEdit,
  onChangeStatus
}) => {
  return (
    <div className={`room-card-box status-${room.status.toLowerCase().replace(/\s+/g, '-')}`}>
      {/* Header Row: Room Number & Status Badge */}
      <div className="card-header-row">
        <div className="room-number-wrapper">
          <span className="room-title-label">Room</span>
          <span className="room-title-number">{room.number}</span>
        </div>
        <Badge status={room.status} />
      </div>

      {/* Body Info */}
      <div className="card-body-details">
        <div className="room-type-tag">{room.type}</div>
        <div className="room-floor-text">{room.floor}</div>

        <div className="room-price-tag">
          <span className="price-num">₹{room.ratePerNight.toLocaleString('en-IN')}</span>
          <span className="price-unit">/ night</span>
        </div>

        {/* Current Guest info if occupied */}
        {room.status === 'Occupied' && room.currentGuest && (
          <div className="current-guest-box">
            <User size={13} className="guest-box-icon" />
            <span className="guest-box-name">{room.currentGuest}</span>
          </div>
        )}

        {/* Housekeeping Badge */}
        <div className="housekeeping-wrapper">
          <span className="hk-label">Housekeeping:</span>
          <HousekeepingBadge status={room.housekeepingStatus} />
        </div>
      </div>

      {/* Footer Actions Row */}
      <div className="card-actions-bar">
        <button
          className="card-action-btn view-btn"
          onClick={() => onView(room)}
          title="View Room Specs"
        >
          <Eye size={15} />
          <span>View</span>
        </button>

        <button
          className="card-action-btn edit-btn"
          onClick={() => onEdit(room)}
          title="Edit Room Details"
        >
          <Edit3 size={15} />
          <span>Edit</span>
        </button>

        {/* Quick Status Dropdown */}
        <div className="status-dropdown-wrapper">
          <select
            className="quick-status-select"
            value={room.status}
            onChange={(e) => onChangeStatus(room.id, e.target.value)}
            title="Quick Change Room Status"
          >
            <option value="Vacant">Vacant</option>
            <option value="Occupied">Occupied</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Out of Service">Out of Service</option>
          </select>
        </div>
      </div>
    </div>
  );
};
