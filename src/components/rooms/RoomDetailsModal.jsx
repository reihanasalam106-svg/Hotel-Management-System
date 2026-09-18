import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { HousekeepingBadge } from './HousekeepingBadge';
import { DoorOpen, Layers, IndianRupee, User, Info, Sparkles } from 'lucide-react';
import './RoomDetailsModal.css';

export const RoomDetailsModal = ({ isOpen, onClose, room }) => {
  if (!room) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Room Details — Room ${room.number}`}
      maxWidth="580px"
    >
      <div className="room-details-container">
        {/* Header Card */}
        <div className="room-details-header">
          <div className="r-title-box">
            <div className="r-icon-badge">
              <DoorOpen size={24} />
            </div>
            <div className="r-title-info">
              <h3 className="r-number-heading">Room {room.number}</h3>
              <span className="r-type-sub">{room.type} • {room.floor}</span>
            </div>
          </div>
          <Badge status={room.status} size="lg" />
        </div>

        {/* Specs Grid */}
        <div className="r-specs-grid">
          <div className="r-spec-card">
            <span className="r-spec-label">Nightly Rate</span>
            <div className="r-spec-val highlight-gold">
              <IndianRupee size={16} />
              <span>{room.ratePerNight.toLocaleString('en-IN')} / night</span>
            </div>
          </div>

          <div className="r-spec-card">
            <span className="r-spec-label">Housekeeping</span>
            <div className="r-spec-val">
              <HousekeepingBadge status={room.housekeepingStatus} />
            </div>
          </div>

          <div className="r-spec-card">
            <span className="r-spec-label">Location</span>
            <div className="r-spec-val text-bold">
              <Layers size={15} /> {room.floor}
            </div>
          </div>

          <div className="r-spec-card">
            <span className="r-spec-label">Assigned Staff</span>
            <div className="r-spec-val text-bold">
              <Sparkles size={15} /> {room.housekeeper || 'Unassigned'}
            </div>
          </div>
        </div>

        {/* Current Guest info if Occupied */}
        {room.status === 'Occupied' && (
          <div className="occupied-guest-card">
            <div className="occ-card-title">
              <User size={16} /> Current Guest
            </div>
            <p className="occ-guest-name">{room.currentGuest || 'Registered Guest'}</p>
          </div>
        )}

        {/* Description Card */}
        <div className="room-description-card">
          <div className="desc-card-title">
            <Info size={15} /> Room Description
          </div>
          <p className="desc-card-text">
            {room.description || 'Modern hotel room equipped with high-speed internet, air conditioning, smart TV, and premium bedding.'}
          </p>
        </div>

        {/* Actions */}
        <div className="room-details-actions">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
