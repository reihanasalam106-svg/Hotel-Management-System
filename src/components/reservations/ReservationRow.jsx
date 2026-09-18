import React from 'react';
import { Badge } from '../common/Badge';
import { Eye, Edit3, XCircle } from 'lucide-react';
import './ReservationTable.css';

export const ReservationRow = ({
  reservation,
  onView,
  onEdit,
  onCancel
}) => {
  return (
    <tr className="reservation-table-row">
      <td className="cell-id">
        <span className="id-tag">{reservation.id}</span>
      </td>

      <td className="cell-guest">
        <div className="guest-info">
          <span className="guest-name-text">{reservation.guestName}</span>
          <span className="guest-contact">{reservation.phone}</span>
        </div>
      </td>

      <td className="cell-room">
        <span className="room-badge">Room {reservation.roomNumber}</span>
      </td>

      <td className="cell-room-type">
        <span className="room-type-text">{reservation.roomType}</span>
      </td>

      <td className="cell-date">{reservation.checkIn}</td>

      <td className="cell-date">{reservation.checkOut}</td>

      <td className="cell-guests">{reservation.guests}</td>

      <td className="cell-status">
        <Badge status={reservation.status} />
      </td>

      <td className="cell-amount">
        <span className="amount-val">{reservation.amount}</span>
      </td>

      <td className="cell-actions">
        <div className="action-buttons-group">
          <button
            className="row-action-btn view-btn"
            onClick={() => onView(reservation)}
            title="View Details"
            aria-label="View Details"
          >
            <Eye size={16} />
            <span className="action-btn-text">View</span>
          </button>

          <button
            className="row-action-btn edit-btn"
            onClick={() => onEdit(reservation)}
            title="Edit Reservation"
            aria-label="Edit Reservation"
          >
            <Edit3 size={16} />
            <span className="action-btn-text">Edit</span>
          </button>

          {reservation.status !== 'Cancelled' && (
            <button
              className="row-action-btn cancel-btn"
              onClick={() => onCancel(reservation)}
              title="Cancel Reservation"
              aria-label="Cancel Reservation"
            >
              <XCircle size={16} />
              <span className="action-btn-text">Cancel</span>
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};
