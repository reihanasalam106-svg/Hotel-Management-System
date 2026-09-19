import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { User, Briefcase, Phone, Mail, MapPin, Calendar, CheckSquare, Clock, FileText } from 'lucide-react';
import '../guests/GuestDetailsModal.css';

export const StaffDetailsModal = ({
  isOpen,
  onClose,
  staffMember,
  housekeepingTasks = [],
  onChangeStatus,
  onDeactivate
}) => {
  if (!staffMember) return null;

  // Find housekeeping tasks assigned to this staff member
  const assignedTasksList = housekeepingTasks.filter(
    (t) =>
      (t.staffId && t.staffId === staffMember.id) ||
      (t.staff && t.staff.toLowerCase().includes(staffMember.name.split(' ')[0].toLowerCase()))
  );

  const getInitials = (nameStr) => {
    if (!nameStr) return 'ST';
    const parts = nameStr.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return nameStr.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(staffMember.name);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Staff Profile & Roster Details" size="xl">
      <div className="guest-details-container">
        {/* Header Profile Card */}
        <div className="guest-profile-header-card">
          <div className="guest-header-main">
            <div className="guest-avatar-lg">{initials}</div>
            <div className="guest-header-info">
              <div className="guest-title-row">
                <h2 className="guest-header-name">{staffMember.name}</h2>
                <Badge status={staffMember.status}>{staffMember.status}</Badge>
              </div>
              <div className="guest-subtitle-meta">
                <span className="guest-id-pill">{staffMember.id}</span>
                <span className="meta-dot">•</span>
                <span style={{ color: 'var(--accent-gold-light)', fontWeight: 600 }}>{staffMember.role}</span>
                <span className="meta-dot">•</span>
                <span>{staffMember.department}</span>
              </div>
            </div>
          </div>

          <div className="guest-header-quick-stats">
            <div className="qstat-item">
              <span className="qstat-label">Shift</span>
              <strong className="qstat-val">{staffMember.shift || 'General'}</strong>
            </div>
            <div className="qstat-item">
              <span className="qstat-label">Assigned Tasks</span>
              <strong className="qstat-val">{assignedTasksList.length} Tasks</strong>
            </div>
            <div className="qstat-item">
              <span className="qstat-label">Joined</span>
              <strong className="qstat-val">{staffMember.joinedDate || '—'}</strong>
            </div>
          </div>
        </div>

        {/* Tab / Sections Layout Grid */}
        <div className="tab-content-grid">
          {/* Left Column: Personal & Emergency Info */}
          <div className="tab-col">
            <div className="details-card">
              <h3 className="details-card-title">
                <User size={16} /> Personal Information
              </h3>
              <div className="info-list">
                <div className="info-row">
                  <span className="info-label">Full Name</span>
                  <span className="info-value">{staffMember.name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{staffMember.phone || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email</span>
                  <span className="info-value">{staffMember.email || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Address</span>
                  <span className="info-value">{staffMember.address || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="details-card">
              <h3 className="details-card-title">
                <Phone size={16} /> Emergency Contact & Notes
              </h3>
              <div className="info-list">
                <div className="info-row">
                  <span className="info-label">Emergency Contact</span>
                  <span className="info-value">{staffMember.emergencyContact || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Notes</span>
                  <span className="info-value">{staffMember.notes || 'No operational notes recorded.'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Employment & Assigned Tasks */}
          <div className="tab-col">
            <div className="details-card">
              <h3 className="details-card-title">
                <Briefcase size={16} /> Employment & Roster Details
              </h3>
              <div className="info-list">
                <div className="info-row">
                  <span className="info-label">Staff ID</span>
                  <span className="info-value code-font">{staffMember.id}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Role / Position</span>
                  <span className="info-value">{staffMember.role}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Department</span>
                  <span className="info-value">{staffMember.department}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Working Shift</span>
                  <span className="info-value">{staffMember.shift || 'General'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Joined Date</span>
                  <span className="info-value">{staffMember.joinedDate || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="details-card">
              <h3 className="details-card-title">
                <CheckSquare size={16} /> Assigned Operational Tasks ({assignedTasksList.length})
              </h3>
              {assignedTasksList.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {assignedTasksList.map((t) => (
                    <div
                      key={t.id}
                      style={{
                        padding: '0.6rem 0.75rem',
                        backgroundColor: 'var(--bg-main)',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.825rem'
                      }}
                    >
                      <div>
                        <strong style={{ display: 'block', color: 'var(--text-primary)' }}>
                          {t.task || t.title}
                        </strong>
                        <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                          Room {t.room} • Priority: {t.priority}
                        </span>
                      </div>
                      <Badge status={t.status} size="sm">{t.status}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  No housekeeping or maintenance tasks currently assigned to this staff member.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="guest-details-footer">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {staffMember.status !== 'Inactive' && (
            <Button
              variant="outline"
              onClick={() => {
                onDeactivate(staffMember.id);
                onClose();
              }}
              style={{ color: 'var(--status-danger-text)', borderColor: 'var(--status-danger-border)' }}
            >
              Deactivate Staff
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
