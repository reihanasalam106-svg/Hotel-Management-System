import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Save, Bell } from 'lucide-react';

export const NotificationsSection = ({ notificationData = {}, onSave }) => {
  const [formData, setFormData] = useState({
    newReservation: true,
    reservationCancellation: true,
    guestCheckIn: true,
    guestCheckOut: true,
    paymentReceived: true,
    pendingPayment: true,
    housekeepingTaskAssigned: true,
    maintenanceAlert: true
  });

  useEffect(() => {
    if (notificationData && Object.keys(notificationData).length > 0) {
      setFormData((prev) => ({ ...prev, ...notificationData }));
    }
  }, [notificationData]);

  const handleToggle = (key) => {
    setFormData((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const options = [
    { key: 'newReservation', label: 'New Reservation Alerts', desc: 'Notify when a new guest reservation is booked' },
    { key: 'reservationCancellation', label: 'Reservation Cancellation Alerts', desc: 'Notify when a reservation is cancelled' },
    { key: 'guestCheckIn', label: 'Guest Check-in Notifications', desc: 'Notify front office upon guest check-in arrival' },
    { key: 'guestCheckOut', label: 'Guest Check-out Notifications', desc: 'Notify housekeeping upon guest check-out departure' },
    { key: 'paymentReceived', label: 'Payment Receipt Alerts', desc: 'Notify finance upon successful payment receipt' },
    { key: 'pendingPayment', label: 'Pending Payment Due Reminders', desc: 'Notify staff regarding balance due overdue invoices' },
    { key: 'housekeepingTaskAssigned', label: 'Housekeeping Task Assignment', desc: 'Notify housekeeping staff when assigned a room cleaning task' },
    { key: 'maintenanceAlert', label: 'Maintenance & Service Alerts', desc: 'Alert maintenance when a room is marked for repair' }
  ];

  return (
    <Card title="System Notification Preferences" subtitle="Configure operational alert toggles for front office, housekeeping, and finance">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {options.map((item) => (
            <div
              key={item.key}
              style={{
                padding: '0.875rem 1.15rem',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.875rem'
              }}
            >
              <div>
                <strong style={{ display: 'block', color: 'var(--text-primary)' }}>{item.label}</strong>
                <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{item.desc}</span>
              </div>
              <input
                type="checkbox"
                checked={formData[item.key] || false}
                onChange={() => handleToggle(item.key)}
                style={{ width: 18, height: 18, accentColor: 'var(--accent-gold)', cursor: 'pointer' }}
              />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <Button type="submit" variant="primary" icon={Save}>
            Save Preferences
          </Button>
        </div>
      </form>
    </Card>
  );
};
