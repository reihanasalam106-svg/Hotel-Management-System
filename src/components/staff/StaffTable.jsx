import React, { useState } from 'react';
import { Eye, Edit, MoreVertical, ShieldAlert, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import './StaffTable.css';

export const StaffTable = ({
  staffList = [],
  onViewStaff,
  onEditStaff,
  onChangeStatus,
  onDeactivateStaff,
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
    if (!nameStr) return 'ST';
    const parts = nameStr.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return nameStr.substring(0, 2).toUpperCase();
  };

  const renderSortTh = (field, label) => {
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
    <div className="staff-table-wrapper" onClick={closeMenu}>
      <div className="table-responsive">
        <table className="staff-table">
          <thead>
            <tr>
              <th>Staff ID</th>
              {renderSortTh('name', 'Staff Name')}
              {renderSortTh('role', 'Role')}
              {renderSortTh('department', 'Department')}
              <th>Phone</th>
              <th>Email</th>
              <th>Shift</th>
              {renderSortTh('status', 'Status')}
              <th>Assigned Tasks</th>
              {renderSortTh('joinedDate', 'Joined Date')}
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((member) => {
              const initials = getInitials(member.name);
              const isMenuOpen = activeMenuId === member.id;

              return (
                <tr key={member.id} className="staff-table-row">
                  {/* Staff ID */}
                  <td className="staff-id-cell">
                    <span className="staff-id-tag">{member.id}</span>
                  </td>

                  {/* Staff Name & Profile */}
                  <td>
                    <div className="staff-profile-cell">
                      <div className="staff-avatar-sm">{initials}</div>
                      <div className="staff-name-details">
                        <strong className="staff-name-text">{member.name}</strong>
                        <span className="staff-sub-email">{member.email}</span>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td>
                    <span className="role-pill">{member.role}</span>
                  </td>

                  {/* Department */}
                  <td>{member.department}</td>

                  {/* Phone */}
                  <td className="text-nowrap">{member.phone || '—'}</td>

                  {/* Email */}
                  <td className="staff-email-cell">{member.email || '—'}</td>

                  {/* Shift */}
                  <td>
                    <span className="shift-tag">{member.shift || 'General'}</span>
                  </td>

                  {/* Status Badge */}
                  <td>
                    <Badge status={member.status}>{member.status}</Badge>
                  </td>

                  {/* Assigned Tasks */}
                  <td className="text-center">
                    <span className="tasks-count-badge">
                      {member.assignedTasks || 0} tasks
                    </span>
                  </td>

                  {/* Joined Date */}
                  <td className="text-nowrap" style={{ fontSize: '0.825rem' }}>
                    {member.joinedDate || '—'}
                  </td>

                  {/* Actions */}
                  <td className="text-right action-cell">
                    <div className="action-buttons-group">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Eye}
                        title="View Staff Profile"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewStaff(member);
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Edit}
                        title="Edit Staff Member"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditStaff(member);
                        }}
                      />

                      {/* Dropdown Action Menu */}
                      <div className="staff-action-menu-container">
                        <button
                          type="button"
                          className="action-menu-trigger"
                          title="More Options"
                          onClick={(e) => toggleActionMenu(member.id, e)}
                        >
                          <MoreVertical size={16} />
                        </button>

                        {isMenuOpen && (
                          <div className="staff-action-dropdown">
                            <div className="dropdown-section-title">Change Status</div>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() => onChangeStatus(member.id, 'On Duty')}
                            >
                              Set as On Duty
                            </button>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() => onChangeStatus(member.id, 'Off Duty')}
                            >
                              Set as Off Duty
                            </button>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() => onChangeStatus(member.id, 'On Leave')}
                            >
                              Set as On Leave
                            </button>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() => onChangeStatus(member.id, 'Active')}
                            >
                              Set as Active
                            </button>
                            <div className="dropdown-divider" />
                            <button
                              type="button"
                              className="dropdown-item text-danger"
                              onClick={() => onDeactivateStaff(member.id)}
                            >
                              Deactivate Staff
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
