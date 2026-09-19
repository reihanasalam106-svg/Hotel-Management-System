import React from 'react';
import { Card } from '../common/Card';
import { Sparkles, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export const HousekeepingAnalyticsSection = ({ data = {} }) => {
  const {
    ready = 12,
    cleaned = 4,
    cleaningRequired = 2,
    cleaningInProgress = 1,
    maintenance = 1,
    totalTasks = 10,
    completedTasks = 6,
    pendingTasks = 4
  } = data;

  return (
    <Card
      title="Housekeeping Performance & Readiness"
      subtitle="Room sanitization, housekeeping staff task completion, and maintenance readiness"
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '0.5rem' }}>
        {/* Room Readiness Status */}
        <div>
          <h5 style={{ fontSize: '0.775rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Room Readiness Breakdown
          </h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--status-success-text)', fontWeight: 600 }}>Rooms Ready</span>
              <strong>{ready}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: '#0369a1', fontWeight: 600 }}>Cleaned</span>
              <strong>{cleaned}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: '#a16207', fontWeight: 600 }}>Cleaning In Progress</span>
              <strong>{cleaningInProgress}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: '#be123c', fontWeight: 600 }}>Cleaning Required</span>
              <strong>{cleaningRequired}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Under Maintenance</span>
              <strong>{maintenance}</strong>
            </div>
          </div>
        </div>

        {/* Task Completion KPI */}
        <div style={{ backgroundColor: 'var(--bg-main)', borderRadius: '8px', padding: '1rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifySpace: 'between' }}>
          <h5 style={{ fontSize: '0.775rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Task Completion Summary
          </h5>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center', margin: 'auto 0' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total Tasks</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalTasks}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--status-success-text)' }}>Completed</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--status-success-text)' }}>{completedTasks}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#a16207' }}>Pending</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#a16207' }}>{pendingTasks}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
