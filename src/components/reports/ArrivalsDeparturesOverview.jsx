import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { LogIn, LogOut, Calendar, ArrowRight } from 'lucide-react';

export const ArrivalsDeparturesOverview = ({ data = {} }) => {
  const {
    todayCheckIns = 0,
    todayCheckOuts = 0,
    upcomingArrivals = [],
    upcomingDepartures = []
  } = data;

  return (
    <Card
      title="Arrival & Departure Overview"
      subtitle="Today's check-ins, check-outs, and upcoming guest arrivals"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
        {/* KPI Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem', backgroundColor: 'var(--status-success-bg)', borderRadius: '8px', border: '1px solid var(--status-success-border)' }}>
            <LogIn size={22} style={{ color: 'var(--status-success-text)' }} />
            <div>
              <span style={{ fontSize: '0.725rem', color: 'var(--status-success-text)', textTransform: 'uppercase', fontWeight: 700 }}>Today's Check-ins</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--status-success-text)', lineHeight: 1 }}>{todayCheckIns}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem', backgroundColor: 'var(--status-danger-bg)', borderRadius: '8px', border: '1px solid var(--status-danger-border)' }}>
            <LogOut size={22} style={{ color: 'var(--status-danger-text)' }} />
            <div>
              <span style={{ fontSize: '0.725rem', color: 'var(--status-danger-text)', textTransform: 'uppercase', fontWeight: 700 }}>Today's Check-outs</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--status-danger-text)', lineHeight: 1 }}>{todayCheckOuts}</div>
            </div>
          </div>
        </div>

        {/* Lists Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Upcoming Arrivals */}
          <div style={{ backgroundColor: 'var(--bg-main)', borderRadius: '8px', padding: '0.875rem', border: '1px solid var(--border-color)' }}>
            <h5 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Upcoming Arrivals
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {upcomingArrivals.length > 0 ? (
                upcomingArrivals.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', paddingBottom: '0.4rem', borderBottom: '1px dashed var(--border-subtle)' }}>
                    <div>
                      <strong style={{ color: 'var(--text-primary)', display: 'block' }}>{item.guestName}</strong>
                      <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Room {item.roomNumber} • {item.checkIn}</span>
                    </div>
                    <Badge status={item.status} size="sm">{item.status}</Badge>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '0.5rem 0' }}>
                  No upcoming arrivals scheduled
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Departures */}
          <div style={{ backgroundColor: 'var(--bg-main)', borderRadius: '8px', padding: '0.875rem', border: '1px solid var(--border-color)' }}>
            <h5 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Upcoming Departures
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {upcomingDepartures.length > 0 ? (
                upcomingDepartures.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', paddingBottom: '0.4rem', borderBottom: '1px dashed var(--border-subtle)' }}>
                    <div>
                      <strong style={{ color: 'var(--text-primary)', display: 'block' }}>{item.guestName}</strong>
                      <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Room {item.roomNumber} • {item.checkOut}</span>
                    </div>
                    <Badge status={item.status} size="sm">{item.status}</Badge>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '0.5rem 0' }}>
                  No upcoming departures scheduled
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
