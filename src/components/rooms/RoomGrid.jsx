import React from 'react';
import { RoomCard } from './RoomCard';
import { EmptyState } from '../common/EmptyState';
import './RoomGrid.css';

export const RoomGrid = ({
  rooms,
  onViewRoom,
  onEditRoom,
  onChangeStatus,
  onClearFilters
}) => {
  if (rooms.length === 0) {
    return (
      <div className="room-grid-empty">
        <EmptyState
          title="No rooms found"
          description="Try changing your search keywords, room type, or floor filters to find matching rooms."
        />
        <div className="empty-clear-action">
          <button className="empty-clear-btn" onClick={onClearFilters}>
            Clear All Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="room-inventory-grid">
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          onView={onViewRoom}
          onEdit={onEditRoom}
          onChangeStatus={onChangeStatus}
        />
      ))}
    </div>
  );
};
