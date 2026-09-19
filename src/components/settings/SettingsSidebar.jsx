import React from 'react';
import { Building, Sliders, Percent, FileText, DoorOpen, Bell, Palette } from 'lucide-react';
import './SettingsSidebar.css';

export const SettingsSidebar = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'hotel-profile', label: 'Hotel Profile', icon: Building },
    { id: 'general', label: 'General Settings', icon: Sliders },
    { id: 'billing-tax', label: 'Billing & Tax', icon: Percent },
    { id: 'invoice', label: 'Invoice Settings', icon: FileText },
    { id: 'room-types', label: 'Room Types', icon: DoorOpen },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

  return (
    <div className="settings-sidebar-nav">
      {tabs.map((t) => {
        const IconComponent = t.icon;
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            type="button"
            className={`settings-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => onTabChange(t.id)}
          >
            <IconComponent size={18} className="nav-item-icon" />
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
};
