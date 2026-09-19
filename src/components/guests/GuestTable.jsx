import React, { useState } from 'react';
import { Eye, Edit, MoreVertical, ArrowUpDown, ArrowUp, ArrowDown, User, DoorOpen } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import './GuestTable.css';

export const GuestTable = ({
  guests = [],
  onViewGuest,
  onEditGuest,
  onChangeStatus,
  sortField,
  sortOrder,
  onSort
}) => {
  const [activeMenuId, setActiveMenuId] = useState(null);

  const toggleActionMenu = (id, e) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const closeMenu = () => setActiveMenuId(null);

  const getInitials = (nameStr) => {
    if (!nameStr) return 'G';
    const parts = nameStr.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return nameStr.substring(0, 2).toUpperCase();
  };

  const renderSortHeader = (field, label) => {
    const isActive = sortField === field;
    return (
      <th
        className="sortable-th"
        onClick={() => onSort && onSort(field)}
        title={`Sort by ${label}`}
      >
        <div className="th-content">
          <span>{label}</span>
          <span className="sort-icon">
            {isActive ? (
              sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
            ) : (
              <ArrowUpDown size={14} className="sort-idle" />
            )}
          </span>
        </div>
      </th>
    );
  };

  return (
    <div className="guest-table-wrapper" onClick={closeMenu}>
      <div className="table-responsive">
        <table className="guest-table">
          <thead>
            <tr>
              <th>Guest ID</th>
              {renderSortHeader('name', 'Guest Name')}
              <th>Phone</th>
              <th>Email</th>
              <th>Current Room</th>
              {renderSortHeader('lastStay', 'Last / Current Stay')}
              {renderSortHeader('totalBookings', 'Bookings')}
              {renderSortHeader('status', 'Status')}
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest) => {
              const initials = getInitials(guest.name);
              const isMenuOpen = activeMenuId === guest.id;

              return (
                <tr key={guest.id} className="guest-table-row">
                  {/* Guest ID */}
                  <td className="guest-id-cell">
                    <span className="guest-id-tag">{guest.id}</span>
                  </td>

                  {/* Guest Name & Avatar */}
                  <td>
                    <div className="guest-profile-cell">
                      <div className="guest-avatar-sm">{initials}</div>
                      <div className="guest-name-details">
                        <strong className="guest-name-text">{guest.name}</strong>
                        <span className="guest-type-chip">
                          {guest.guestType || 'New Guest'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="text-nowrap">{guest.phone || '—'}</td>

                  {/* Email */}
                  <td className="guest-email-cell">{guest.email || '—'}</td>

                  {/* Current Room */}
                  <td>
                    {guest.currentRoom ? (
                      <span className="guest-room-badge">
                        <DoorOpen size={13} />
                        Room {guest.currentRoom}
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>

                  {/* Current/Last Stay */}
                  <td className="text-nowrap" style={{ fontSize: '0.85rem' }}>
                    {guest.lastStay || '—'}
                  </td>

                  {/* Total Bookings */}
                  <td className="text-center">
                    <span className="bookings-count-badge">
                      {guest.totalBookings || 0}
                    </span>
                  </td>

                  {/* Status */}
                  <td>
                    <Badge status={guest.status}>{guest.status}</Badge>
                  </td>

                  {/* Actions */}
                  <td className="text-right action-cell">
                    <div className="action-buttons-group">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Eye}
                        title="View Profile Details"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewGuest(guest);
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Edit}
                        title="Edit Guest"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditGuest(guest);
                        }}
                      />

                      {/* Dropdown Menu for Status & Extra Actions */}
                      <div className="guest-action-menu-container">
                        <button
                          type="button"
                          className="action-menu-trigger"
                          title="More Options"
                          onClick={(e) => toggleActionMenu(guest.id, e)}
                        >
                          <MoreVertical size={16} />
                        </button>

                        {isMenuOpen && (
                          <div className="guest-action-dropdown">
                            <div className="dropdown-section-title">Change Status</div>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() => onChangeStatus(guest.id, 'In House')}
                            >
                              Set as In House
                            </button>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() => onChangeStatus(guest.id, 'Upcoming')}
                            >
                              Set as Upcoming
                            </button>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() => onChangeStatus(guest.id, 'Checked Out')}
                            >
                              Set as Checked Out
                            </button>
                            <div className="dropdown-divider" />
                            <button
                              type="button"
                              className="dropdown-item text-danger"
                              onClick={() => onChangeStatus(guest.id, 'Inactive')}
                            >
                              Mark as Inactive
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
