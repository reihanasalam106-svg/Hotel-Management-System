import React from 'react';
import { ReservationRow } from './ReservationRow';
import { EmptyState } from '../common/EmptyState';
import { Badge } from '../common/Badge';
import { ArrowUpDown, Eye, Edit3, XCircle, Calendar, User, DoorOpen, CreditCard } from 'lucide-react';
import './ReservationTable.css';

export const ReservationTable = ({
  reservations,
  onView,
  onEdit,
  onCancel,
  sortField,
  sortOrder,
  onSort
}) => {
  if (reservations.length === 0) {
    return (
      <div className="table-empty-wrapper">
        <EmptyState
          title="No reservations found"
          description="Try changing your search or date filters to find matching guest bookings."
        />
      </div>
    );
  }

  const renderSortIndicator = (field) => {
    if (sortField !== field) return <ArrowUpDown size={13} className="sort-icon inactive" />;
    return <ArrowUpDown size={13} className="sort-icon active" />;
  };

  return (
    <div className="reservation-table-container">
      {/* DESKTOP TABLE VIEW */}
      <div className="desktop-table-responsive">
        <table className="reservation-table">
          <thead>
            <tr>
              <th>Reservation ID</th>
              <th className="sortable-th" onClick={() => onSort('guestName')}>
                <div className="th-content">
                  <span>Guest Name</span>
                  {renderSortIndicator('guestName')}
                </div>
              </th>
              <th>Room</th>
              <th>Room Type</th>
              <th className="sortable-th" onClick={() => onSort('checkIn')}>
                <div className="th-content">
                  <span>Check-in</span>
                  {renderSortIndicator('checkIn')}
                </div>
              </th>
              <th>Check-out</th>
              <th>Guests</th>
              <th>Status</th>
              <th className="sortable-th" onClick={() => onSort('numericAmount')}>
                <div className="th-content">
                  <span>Amount</span>
                  {renderSortIndicator('numericAmount')}
                </div>
              </th>
              <th className="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <ReservationRow
                key={res.id}
                reservation={res}
                onView={onView}
                onEdit={onEdit}
                onCancel={onCancel}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS VIEW (For small screens < 768px) */}
      <div className="mobile-cards-list">
        {reservations.map((res) => (
          <div key={res.id} className="mobile-reservation-card">
            <div className="card-top-row">
              <span className="card-res-id">{res.id}</span>
              <Badge status={res.status} />
            </div>

            <div className="card-body-section">
              <h4 className="card-guest-name">{res.guestName}</h4>
              <p className="card-guest-contact">{res.phone}</p>

              <div className="card-meta-grid">
                <div className="card-meta-item">
                  <DoorOpen size={14} className="meta-icon" />
                  <span>Room {res.roomNumber} ({res.roomType})</span>
                </div>
                <div className="card-meta-item">
                  <Calendar size={14} className="meta-icon" />
                  <span>{res.checkIn} → {res.checkOut}</span>
                </div>
                <div className="card-meta-item">
                  <User size={14} className="meta-icon" />
                  <span>{res.guests} Guest(s)</span>
                </div>
                <div className="card-meta-item">
                  <CreditCard size={14} className="meta-icon" />
                  <strong className="card-amount">{res.amount}</strong>
                </div>
              </div>
            </div>

            <div className="card-actions-row">
              <button className="mobile-action-btn view" onClick={() => onView(res)}>
                <Eye size={15} /> View
              </button>
              <button className="mobile-action-btn edit" onClick={() => onEdit(res)}>
                <Edit3 size={15} /> Edit
              </button>
              {res.status !== 'Cancelled' && (
                <button className="mobile-action-btn cancel" onClick={() => onCancel(res)}>
                  <XCircle size={15} /> Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
