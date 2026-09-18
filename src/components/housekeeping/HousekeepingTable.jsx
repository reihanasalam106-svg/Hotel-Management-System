import React, { useState, useEffect, useRef } from 'react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  MoreVertical,
  Eye,
  Edit3,
  UserCheck,
  Trash2,
  Play,
  CheckCircle,
  Sparkles,
  Wrench,
  ArrowUpDown
} from 'lucide-react';
import './Housekeeping.css';

export const HousekeepingTable = ({
  tasks = [],
  rooms = [],
  staff = [],
  sortField,
  sortOrder,
  onSort,
  onViewTask,
  onEditTask,
  onChangeStatus,
  onReassignStaff,
  onDeleteTask
}) => {
  const [activeMenuTaskId, setActiveMenuTaskId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuTaskId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'priority-badge priority-urgent';
      case 'High':
        return 'priority-badge priority-high';
      case 'Medium':
        return 'priority-badge priority-medium';
      default:
        return 'priority-badge priority-low';
    }
  };

  const toggleActionMenu = (taskId, e) => {
    e.stopPropagation();
    setActiveMenuTaskId((prev) => (prev === taskId ? null : taskId));
  };

  return (
    <div className="table-responsive">
      <table className="custom-table">
        <thead>
          <tr>
            <th onClick={() => onSort('id')} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                Task ID <ArrowUpDown size={12} />
              </div>
            </th>
            <th onClick={() => onSort('roomNumber')} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                Room <ArrowUpDown size={12} />
              </div>
            </th>
            <th>Room Type</th>
            <th>Floor</th>
            <th>Current Guest</th>
            <th>Task Type</th>
            <th onClick={() => onSort('priority')} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                Priority <ArrowUpDown size={12} />
              </div>
            </th>
            <th onClick={() => onSort('staff')} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                Assigned Staff <ArrowUpDown size={12} />
              </div>
            </th>
            <th onClick={() => onSort('status')} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                Status <ArrowUpDown size={12} />
              </div>
            </th>
            <th onClick={() => onSort('updatedAt')} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                Last Updated <ArrowUpDown size={12} />
              </div>
            </th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const roomObj = rooms.find((r) => r.number === String(task.roomNumber));
            const staffObj = staff.find((s) => s.id === task.assignedStaffId);
            const staffName = staffObj ? staffObj.name : 'Unassigned';
            const roomType = roomObj ? roomObj.type : 'Deluxe';
            const floor = roomObj ? roomObj.floor : 'Floor 1';
            const currentGuest = roomObj && roomObj.currentGuest ? roomObj.currentGuest : 'No current guest';

            return (
              <tr key={task.id}>
                <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{task.id}</td>
                <td>
                  <strong>Room {task.roomNumber}</strong>
                </td>
                <td>{roomType}</td>
                <td>{floor}</td>
                <td>
                  <span style={{ fontSize: '0.85rem', color: roomObj?.currentGuest ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {currentGuest}
                  </span>
                </td>
                <td>{task.taskType}</td>
                <td>
                  <span className={getPriorityBadgeClass(task.priority)}>{task.priority}</span>
                </td>
                <td style={{ fontWeight: 600 }}>{staffName}</td>
                <td>
                  <Badge status={task.status} />
                </td>
                <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {task.updatedAt || task.createdAt || 'N/A'}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div className="action-dropdown-wrapper" ref={activeMenuTaskId === task.id ? menuRef : null}>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={MoreVertical}
                      onClick={(e) => toggleActionMenu(task.id, e)}
                    />
                    {activeMenuTaskId === task.id && (
                      <div className="action-menu-popup">
                        <button
                          className="action-menu-item"
                          onClick={() => {
                            setActiveMenuTaskId(null);
                            onViewTask(task);
                          }}
                        >
                          <Eye size={14} /> View Details
                        </button>
                        <button
                          className="action-menu-item"
                          onClick={() => {
                            setActiveMenuTaskId(null);
                            onEditTask(task);
                          }}
                        >
                          <Edit3 size={14} /> Edit Task
                        </button>

                        {/* Status workflow items */}
                        {task.status === 'Cleaning Required' && (
                          <button
                            className="action-menu-item"
                            onClick={() => {
                              setActiveMenuTaskId(null);
                              onChangeStatus(task.id, 'Cleaning In Progress');
                            }}
                          >
                            <Play size={14} color="#0369a1" /> Start Cleaning
                          </button>
                        )}
                        {task.status === 'Cleaning In Progress' && (
                          <button
                            className="action-menu-item"
                            onClick={() => {
                              setActiveMenuTaskId(null);
                              onChangeStatus(task.id, 'Cleaned');
                            }}
                          >
                            <CheckCircle size={14} color="#15803d" /> Mark as Cleaned
                          </button>
                        )}
                        {task.status === 'Cleaned' && (
                          <button
                            className="action-menu-item"
                            onClick={() => {
                              setActiveMenuTaskId(null);
                              onChangeStatus(task.id, 'Ready');
                            }}
                          >
                            <Sparkles size={14} color="#c5a059" /> Mark Room Ready
                          </button>
                        )}
                        {task.status !== 'Maintenance' && (
                          <button
                            className="action-menu-item"
                            onClick={() => {
                              setActiveMenuTaskId(null);
                              onChangeStatus(task.id, 'Maintenance');
                            }}
                          >
                            <Wrench size={14} color="#6b21a8" /> Set Maintenance
                          </button>
                        )}

                        <button
                          className="action-menu-item"
                          onClick={() => {
                            setActiveMenuTaskId(null);
                            onReassignStaff(task);
                          }}
                        >
                          <UserCheck size={14} /> Reassign Staff
                        </button>
                        <button
                          className="action-menu-item danger"
                          onClick={() => {
                            setActiveMenuTaskId(null);
                            onDeleteTask(task);
                          }}
                        >
                          <Trash2 size={14} /> Delete Task
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
