import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Calendar, User, Phone, Mail, DoorOpen, CreditCard, Clock, MessageSquare } from 'lucide-react';
import './ReservationDetailsModal.css';

export const ReservationDetailsModal = ({ isOpen, onClose, reservation }) => {
  if (!reservation) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Reservation Details — ${reservation.id}`}
      maxWidth="620px"
    >
      <div className="details-container">
        {/* Top Header Card */}
        <div className="details-header-card">
          <div className="guest-title-wrapper">
            <div className="guest-avatar-lg">
              <User size={24} />
            </div>
            <div className="guest-main-info">
              <h3 className="guest-name">{reservation.guestName}</h3>
              <span className="res-id-badge">{reservation.id}</span>
            </div>
          </div>
          <div className="status-badge-wrapper">
            <Badge status={reservation.status} size="lg" />
          </div>
        </div>

        {/* Details Grid */}
        <div className="details-grid">
          {/* Contact Details */}
          <div className="details-card">
            <h4 className="details-card-title">Contact Info</h4>
            <div className="details-item">
              <Phone size={15} className="details-icon" />
              <span>{reservation.phone || 'N/A'}</span>
            </div>
            <div className="details-item">
              <Mail size={15} className="details-icon" />
              <span>{reservation.email || 'N/A'}</span>
            </div>
          </div>

          {/* Room Allocation */}
          <div className="details-card">
            <h4 className="details-card-title">Room & Type</h4>
            <div className="details-item">
              <DoorOpen size={15} className="details-icon" />
              <span>Room {reservation.roomNumber} ({reservation.roomType})</span>
            </div>
            <div className="details-item">
              <User size={15} className="details-icon" />
              <span>{reservation.guests} Guest(s)</span>
            </div>
          </div>

          {/* Stay Dates */}
          <div className="details-card">
            <h4 className="details-card-title">Stay Schedule</h4>
            <div className="details-item">
              <Calendar size={15} className="details-icon" />
              <span><strong>Check-in:</strong> {reservation.checkIn}</span>
            </div>
            <div className="details-item">
              <Clock size={15} className="details-icon" />
              <span><strong>Check-out:</strong> {reservation.checkOut}</span>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="details-card highlight-gold">
            <h4 className="details-card-title">Payment Info</h4>
            <div className="details-item">
              <CreditCard size={15} className="details-icon" />
              <span><strong>Total Amount:</strong> <strong className="amount-text">{reservation.amount}</strong></span>
            </div>
            <div className="details-item">
              <span><strong>Payment Status:</strong> {reservation.paymentStatus}</span>
            </div>
          </div>
        </div>

        {/* Special Requests */}
        <div className="special-requests-card">
          <div className="special-header">
            <MessageSquare size={16} className="details-icon" />
            <span>Special Requests</span>
          </div>
          <p className="special-text">{reservation.specialRequest || 'No special requests noted.'}</p>
        </div>

        {/* Footer */}
        <div className="details-actions">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
