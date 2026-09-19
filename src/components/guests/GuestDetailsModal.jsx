import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  DoorOpen,
  Calendar,
  History,
  FileText,
  Award,
  Clock,
  Sparkles,
  Receipt
} from 'lucide-react';
import './GuestDetailsModal.css';

export const GuestDetailsModal = ({
  isOpen,
  onClose,
  guest,
  reservations = [],
  rooms = [],
  invoices = [],
  onChangeStatus
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!guest) return null;

  // Filter reservations for this guest
  const guestReservations = reservations.filter(
    (r) =>
      (r.guestId && r.guestId === guest.id) ||
      (r.guestName && r.guestName.toLowerCase() === guest.name.toLowerCase())
  );

  // Filter invoices for this guest
  const guestInvoices = invoices.filter(
    (inv) =>
      (inv.guestId && inv.guestId === guest.id) ||
      (inv.guestName && inv.guestName.toLowerCase() === guest.name.toLowerCase()) ||
      (inv.guestEmail && inv.guestEmail.toLowerCase() === guest.email.toLowerCase())
  );

  // Active room object
  const activeRoom = rooms.find((r) => r.number === guest.currentRoom);

  // Active reservation object
  const activeReservation = guestReservations.find(
    (r) => r.id === guest.currentReservationId || r.status === 'Checked In'
  );

  // Statistics calculation
  const totalBookingsCount = guestReservations.length || guest.totalBookings || 0;
  const completedStaysCount = guestReservations.filter(
    (r) => r.status === 'Checked Out' || r.status === 'Completed'
  ).length;
  const upcomingStaysCount = guestReservations.filter(
    (r) => r.status === 'Confirmed' || r.status === 'Pending'
  ).length;

  const totalNights = guestReservations.reduce((sum, r) => {
    if (!r.checkIn || !r.checkOut) return sum;
    const cIn = new Date(r.checkIn);
    const cOut = new Date(r.checkOut);
    const diff = cOut.getTime() - cIn.getTime();
    const nights = Math.max(1, Math.ceil(diff / (1000 * 3600 * 24)));
    return sum + nights;
  }, 0);

  // Get Avatar Initials
  const getInitials = (nameStr) => {
    if (!nameStr) return 'AK';
    const parts = nameStr.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return nameStr.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(guest.name);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Guest Profile & Folio" size="xl">
      <div className="guest-details-container">
        {/* Top Header Card */}
        <div className="guest-profile-header-card">
          <div className="guest-header-main">
            <div className="guest-avatar-lg">{initials}</div>
            <div className="guest-header-info">
              <div className="guest-title-row">
                <h2 className="guest-header-name">{guest.name}</h2>
                <Badge status={guest.status}>{guest.status}</Badge>
              </div>
              <div className="guest-subtitle-meta">
                <span className="guest-id-pill">{guest.id}</span>
                <span className="meta-dot">•</span>
                <span className="guest-type-badge">{guest.guestType || 'New Guest'}</span>
                {guest.currentRoom && (
                  <>
                    <span className="meta-dot">•</span>
                    <span className="active-room-pill">
                      <DoorOpen size={13} /> Room {guest.currentRoom}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="guest-header-quick-stats">
            <div className="qstat-item">
              <span className="qstat-label">Total Bookings</span>
              <strong className="qstat-val">{totalBookingsCount}</strong>
            </div>
            <div className="qstat-item">
              <span className="qstat-label">Total Stay Nights</span>
              <strong className="qstat-val">{totalNights} nights</strong>
            </div>
            <div className="qstat-item">
              <span className="qstat-label">Last Stay</span>
              <strong className="qstat-val">{guest.lastStay || 'N/A'}</strong>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="guest-details-tabs">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <User size={15} /> Overview & Info
          </button>
          <button
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <History size={15} /> Booking History ({guestReservations.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'billing' ? 'active' : ''}`}
            onClick={() => setActiveTab('billing')}
          >
            <Receipt size={15} /> Billing & Invoices ({guestInvoices.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="tab-content-grid">
            {/* Left Column: Personal Info & Address */}
            <div className="tab-col">
              {/* Personal Information */}
              <div className="details-card">
                <h3 className="details-card-title">
                  <User size={16} /> Personal Information
                </h3>
                <div className="info-list">
                  <div className="info-row">
                    <span className="info-label">Full Name</span>
                    <span className="info-value">{guest.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Phone</span>
                    <span className="info-value">{guest.phone || 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Email</span>
                    <span className="info-value">{guest.email || 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Date of Birth</span>
                    <span className="info-value">{guest.dateOfBirth || 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Nationality</span>
                    <span className="info-value">{guest.nationality || 'Indian'}</span>
                  </div>
                </div>
              </div>

              {/* Identification */}
              <div className="details-card">
                <h3 className="details-card-title">
                  <CreditCard size={16} /> Identification
                </h3>
                <div className="info-list">
                  <div className="info-row">
                    <span className="info-label">ID Type</span>
                    <span className="info-value">{guest.idType || 'Aadhaar'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">ID Number</span>
                    <span className="info-value code-font">{guest.idNumber || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="details-card">
                <h3 className="details-card-title">
                  <MapPin size={16} /> Address Details
                </h3>
                <div className="info-list">
                  <div className="info-row">
                    <span className="info-label">Street Address</span>
                    <span className="info-value">{guest.address || 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">City / State</span>
                    <span className="info-value">
                      {guest.city || ''} {guest.state ? `, ${guest.state}` : ''}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Pincode</span>
                    <span className="info-value">{guest.pincode || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Current Stay, Statistics, Preferences */}
            <div className="tab-col">
              {/* Current Stay */}
              <div className="details-card highlight-card">
                <h3 className="details-card-title">
                  <DoorOpen size={16} /> Current Stay
                </h3>
                {guest.status === 'In House' || activeReservation ? (
                  <div className="active-stay-box">
                    <div className="stay-meta-grid">
                      <div className="sm-item">
                        <span className="sm-label">Room Number</span>
                        <strong className="sm-val gold">{guest.currentRoom || activeReservation?.roomNumber || '—'}</strong>
                      </div>
                      <div className="sm-item">
                        <span className="sm-label">Room Type</span>
                        <span className="sm-val">{activeRoom?.type || activeReservation?.roomType || 'Deluxe'}</span>
                      </div>
                      <div className="sm-item">
                        <span className="sm-label">Reservation ID</span>
                        <span className="sm-val code-font">{activeReservation?.id || guest.currentReservationId || 'RES-ACTIVE'}</span>
                      </div>
                      <div className="sm-item">
                        <span className="sm-label">Guests</span>
                        <span className="sm-val">{activeReservation?.guests || 2} Persons</span>
                      </div>
                    </div>

                    <div className="stay-dates-strip">
                      <div>
                        <span className="date-sub">Check-in</span>
                        <strong>{activeReservation?.checkIn || 'Current Stay'}</strong>
                      </div>
                      <div className="arrow-sep">➔</div>
                      <div>
                        <span className="date-sub">Check-out</span>
                        <strong>{activeReservation?.checkOut || 'Active'}</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="empty-stay-box">
                    <Clock size={24} className="text-muted" />
                    <span>No active stay in progress</span>
                  </div>
                )}
              </div>

              {/* Guest Statistics */}
              <div className="details-card">
                <h3 className="details-card-title">
                  <Award size={16} /> Guest Statistics
                </h3>
                <div className="stats-2x2-grid">
                  <div className="stat-tile">
                    <span className="st-num">{totalBookingsCount}</span>
                    <span className="st-lbl">Total Bookings</span>
                  </div>
                  <div className="stat-tile">
                    <span className="st-num">{completedStaysCount}</span>
                    <span className="st-lbl">Completed Stays</span>
                  </div>
                  <div className="stat-tile">
                    <span className="st-num">{upcomingStaysCount}</span>
                    <span className="st-lbl">Upcoming Stays</span>
                  </div>
                  <div className="stat-tile">
                    <span className="st-num">{totalNights}</span>
                    <span className="st-lbl">Stay Nights</span>
                  </div>
                </div>
              </div>

              {/* Guest Preferences */}
              <div className="details-card">
                <h3 className="details-card-title">
                  <Sparkles size={16} /> Preferences & Special Requests
                </h3>
                <div className="pref-box">
                  <strong>Room Preferences:</strong>
                  <p>{guest.preferences || 'No specific preferences recorded.'}</p>
                </div>
                <div className="pref-box" style={{ marginTop: '0.75rem' }}>
                  <strong>Special Requests:</strong>
                  <p>{guest.specialRequests || 'No special requests.'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Booking History */}
        {activeTab === 'history' && (
          <div className="history-tab-content">
            {guestReservations.length > 0 ? (
              <div className="table-responsive">
                <table className="mini-table">
                  <thead>
                    <tr>
                      <th>Reservation ID</th>
                      <th>Room</th>
                      <th>Room Type</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guestReservations.map((res) => (
                      <tr key={res.id}>
                        <td className="code-font font-bold">{res.id}</td>
                        <td>{res.roomNumber ? `Room ${res.roomNumber}` : res.room}</td>
                        <td>{res.roomType}</td>
                        <td>{res.checkIn}</td>
                        <td>{res.checkOut}</td>
                        <td className="font-bold">{res.amount}</td>
                        <td>
                          <Badge status={res.status}>{res.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-tab-box">
                <History size={32} className="text-muted" />
                <h4>No booking history available</h4>
                <p>This guest has no recorded reservations yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Billing History */}
        {activeTab === 'billing' && (
          <div className="billing-tab-content">
            {guestInvoices.length > 0 ? (
              <div className="table-responsive">
                <table className="mini-table">
                  <thead>
                    <tr>
                      <th>Invoice ID</th>
                      <th>Reservation</th>
                      <th>Room</th>
                      <th>Total Amount</th>
                      <th>Paid Amount</th>
                      <th>Payment Status</th>
                      <th>Invoice Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guestInvoices.map((inv) => (
                      <tr key={inv.id}>
                        <td className="code-font font-bold">{inv.invoiceId || inv.id}</td>
                        <td>{inv.reservationId || 'N/A'}</td>
                        <td>{inv.roomNumber ? `Room ${inv.roomNumber}` : 'N/A'}</td>
                        <td className="font-bold">₹{(inv.totalAmount || 0).toLocaleString('en-IN')}</td>
                        <td style={{ color: 'var(--status-success-text)' }}>
                          ₹{(inv.paidAmount || 0).toLocaleString('en-IN')}
                        </td>
                        <td>
                          <Badge status={inv.paymentStatus}>{inv.paymentStatus}</Badge>
                        </td>
                        <td>
                          <Badge status={inv.invoiceStatus}>{inv.invoiceStatus}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-tab-box">
                <Receipt size={32} className="text-muted" />
                <h4>No billing history available</h4>
                <p>No invoices found for this guest.</p>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="guest-details-footer">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {guest.status !== 'Inactive' && (
            <Button
              variant="outline"
              onClick={() => {
                onChangeStatus(guest.id, 'Inactive');
                onClose();
              }}
              style={{ color: 'var(--status-danger-text)', borderColor: 'var(--status-danger-border)' }}
            >
              Mark as Inactive
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
