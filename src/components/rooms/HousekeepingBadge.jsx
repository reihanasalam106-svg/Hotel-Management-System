import React from 'react';
import { Sparkles, AlertCircle, RefreshCw, Check } from 'lucide-react';
import './HousekeepingBadge.css';

export const HousekeepingBadge = ({ status }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'Ready':
        return { className: 'hk-ready', label: 'Ready', icon: Sparkles };
      case 'Cleaning Required':
        return { className: 'hk-required', label: 'Cleaning Required', icon: AlertCircle };
      case 'Cleaning In Progress':
        return { className: 'hk-progress', label: 'Cleaning In Progress', icon: RefreshCw };
      case 'Cleaned':
        return { className: 'hk-cleaned', label: 'Cleaned', icon: Check };
      default:
        return { className: 'hk-default', label: status || 'Pending', icon: Sparkles };
    }
  };

  const config = getBadgeConfig();
  const IconComp = config.icon;

  return (
    <span className={`housekeeping-badge ${config.className}`}>
      <IconComp size={12} className="hk-badge-icon" />
      <span>{config.label}</span>
    </span>
  );
};
