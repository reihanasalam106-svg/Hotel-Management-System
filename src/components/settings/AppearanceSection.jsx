import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Save, Palette } from 'lucide-react';

export const AppearanceSection = ({ appearanceData = {}, onSave }) => {
  const [formData, setFormData] = useState({
    density: 'comfortable',
    theme: 'light',
    sidebarCollapsed: false
  });

  useEffect(() => {
    if (appearanceData && Object.keys(appearanceData).length > 0) {
      setFormData((prev) => ({ ...prev, ...appearanceData }));
    }
  }, [appearanceData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card title="Application Interface & Appearance" subtitle="Customize UI display density, color themes, and navigation layout preferences">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="density">Interface Layout Density</label>
            <select
              id="density"
              name="density"
              className="form-control"
              value={formData.density}
              onChange={handleChange}
            >
              <option value="comfortable">Comfortable (Standard Spacing)</option>
              <option value="compact">Compact (High Information Density)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="theme">Color Theme Preference</label>
            <select
              id="theme"
              name="theme"
              className="form-control"
              value={formData.theme}
              onChange={handleChange}
            >
              <option value="light">Light Navy & Gold Theme (Default)</option>
              <option value="dark">Dark Theme Preference</option>
            </select>
          </div>
        </div>

        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Collapse Desktop Sidebar by Default</strong>
            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Start application with icon-only compact sidebar mode</span>
          </div>
          <input
            type="checkbox"
            name="sidebarCollapsed"
            checked={formData.sidebarCollapsed}
            onChange={handleChange}
            style={{ width: 18, height: 18, accentColor: 'var(--accent-gold)', cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <Button type="submit" variant="primary" icon={Save}>
            Save Appearance Settings
          </Button>
        </div>
      </form>
    </Card>
  );
};
