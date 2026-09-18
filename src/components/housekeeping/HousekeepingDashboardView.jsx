import React from 'react';
import { Activity, AlertTriangle, Users, ChevronRight } from 'lucide-react';
import './Housekeeping.css';

export const HousekeepingDashboardView = ({ rooms = [], tasks = [], staff = [], onSelectStaff }) => {
  const total = rooms.length || 1;

  // Cleaning progress counts from rooms
  const readyCount = rooms.filter((r) => r.housekeepingStatus === 'Ready').length;
  const cleanedCount = rooms.filter((r) => r.housekeepingStatus === 'Cleaned').length;
  const inProgressCount = rooms.filter((r) => r.housekeepingStatus === 'Cleaning In Progress').length;
  const reqCount = rooms.filter((r) => r.housekeepingStatus === 'Cleaning Required').length;

  // Priority counts from tasks
  const urgentCount = tasks.filter((t) => t.priority === 'Urgent').length;
  const highCount = tasks.filter((t) => t.priority === 'High').length;
  const mediumCount = tasks.filter((t) => t.priority === 'Medium').length;
  const lowCount = tasks.filter((t) => t.priority === 'Low').length;

  const progressItems = [
    { label: 'Cleaning Required', count: reqCount, color: '#be123c', percent: Math.round((reqCount / total) * 100) },
    { label: 'Cleaning In Progress', count: inProgressCount, color: '#a16207', percent: Math.round((inProgressCount / total) * 100) },
    { label: 'Cleaned (Pending Ready)', count: cleanedCount, color: '#0369a1', percent: Math.round((cleanedCount / total) * 100) },
    { label: 'Ready', count: readyCount, color: '#15803d', percent: Math.round((readyCount / total) * 100) }
  ];

  return (
    <div className="hk-dashboard-section">
      {/* A. Cleaning Progress */}
      <div className="hk-dash-card">
        <div className="hk-dash-title">
          <Activity size={18} style={{ color: '#0369a1' }} />
          Cleaning Progress
        </div>
        <div className="progress-list">
          {progressItems.map((item, idx) => (
            <div className="progress-item" key={idx}>
              <div className="progress-header">
                <span>{item.label}</span>
                <span>{item.count} ({item.percent}%)</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* B. Priority Breakdown */}
      <div className="hk-dash-card">
        <div className="hk-dash-title">
          <AlertTriangle size={18} style={{ color: '#be123c' }} />
          Priority Tasks Breakdown
        </div>
        <div className="priority-badge-grid">
          <div className="priority-count-item">
            <span className="priority-count-label">
              <span className="priority-badge priority-urgent">Urgent</span>
            </span>
            <span className="priority-count-num" style={{ color: '#be123c' }}>{urgentCount}</span>
          </div>
          <div className="priority-count-item">
            <span className="priority-count-label">
              <span className="priority-badge priority-high">High</span>
            </span>
            <span className="priority-count-num" style={{ color: '#b45309' }}>{highCount}</span>
          </div>
          <div className="priority-count-item">
            <span className="priority-count-label">
              <span className="priority-badge priority-medium">Medium</span>
            </span>
            <span className="priority-count-num" style={{ color: '#0369a1' }}>{mediumCount}</span>
          </div>
          <div className="priority-count-item">
            <span className="priority-count-label">
              <span className="priority-badge priority-low">Low</span>
            </span>
            <span className="priority-count-num" style={{ color: '#475569' }}>{lowCount}</span>
          </div>
        </div>
      </div>

      {/* C. Staff Workload */}
      <div className="hk-dash-card">
        <div className="hk-dash-title">
          <Users size={18} style={{ color: '#c5a059' }} />
          Staff Workload Overview
        </div>
        <div className="staff-workload-list">
          {staff.map((s) => {
            const assignedCount = tasks.filter((t) => t.assignedStaffId === s.id).length;
            const statusColor = s.status === 'Available' ? '#15803d' : s.status === 'Busy' ? '#a16207' : '#94a3b8';

            return (
              <div
                className="staff-workload-item"
                key={s.id}
                onClick={() => onSelectStaff && onSelectStaff(s)}
                title="Click to view assigned tasks"
              >
                <div className="staff-info-col">
                  <span className="staff-name">{s.name}</span>
                  <span className="staff-role">
                    <span style={{ color: statusColor, fontWeight: 700 }}>● {s.status}</span>
                  </span>
                </div>
                <div className="staff-meta">
                  <span className="task-count-pill">{assignedCount} tasks</span>
                  <ChevronRight size={16} color="#94a3b8" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
