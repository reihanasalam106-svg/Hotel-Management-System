import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Save, Sliders } from 'lucide-react';

export const GeneralSettingsSection = ({ generalData = {}, onSave }) => {
  const [formData, setFormData] = useState({
    currency: 'INR',
    timeZone: 'Asia/Kolkata',
    dateFormat: 'YYYY-MM-DD',
    checkInTime: '14:00',
    checkOutTime: '11:00',
    defaultGuests: 2,
    language: 'English'
  });

  useEffect(() => {
    if (generalData && Object.keys(generalData).length > 0) {
      setFormData((prev) => ({ ...prev, ...generalData }));
    }
  }, [generalData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card title="General Operational Parameters" subtitle="Configure system currency, time zones, default check-in rules, and localization">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="currency">Base Currency</label>
            <select
              id="currency"
              name="currency"
              className="form-control"
              value={formData.currency}
              onChange={handleChange}
            >
              <option value="INR">INR (₹) — Indian Rupee</option>
              <option value="USD">USD ($) — US Dollar</option>
              <option value="EUR">EUR (€) — Euro</option>
              <option value="GBP">GBP (£) — British Pound</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="timeZone">Time Zone</label>
            <select
              id="timeZone"
              name="timeZone"
              className="form-control"
              value={formData.timeZone}
              onChange={handleChange}
            >
              <option value="Asia/Kolkata">(UTC+05:30) India Standard Time (IST)</option>
              <option value="UTC">(UTC+00:00) UTC Time Zone</option>
              <option value="America/New_York">(UTC-05:00) Eastern Time (US)</option>
            </select>
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="checkInTime">Default Check-in Time</label>
            <input
              type="time"
              id="checkInTime"
              name="checkInTime"
              className="form-control"
              value={formData.checkInTime}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="checkOutTime">Default Check-out Time</label>
            <input
              type="time"
              id="checkOutTime"
              name="checkOutTime"
              className="form-control"
              value={formData.checkOutTime}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-grid-3">
          <div className="form-group">
            <label htmlFor="dateFormat">Date Display Format</label>
            <select
              id="dateFormat"
              name="dateFormat"
              className="form-control"
              value={formData.dateFormat}
              onChange={handleChange}
            >
              <option value="YYYY-MM-DD">YYYY-MM-DD (2026-09-18)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (18/09/2026)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (09/18/2026)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="defaultGuests">Default Number of Guests</label>
            <input
              type="number"
              id="defaultGuests"
              name="defaultGuests"
              min="1"
              max="10"
              className="form-control"
              value={formData.defaultGuests}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="language">System Language</label>
            <select
              id="language"
              name="language"
              className="form-control"
              value={formData.language}
              onChange={handleChange}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi (हिंदी)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <Button type="submit" variant="primary" icon={Save}>
            Save General Settings
          </Button>
        </div>
      </form>
    </Card>
  );
};
