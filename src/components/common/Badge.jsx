import React from 'react';
import './Badge.css';

export const Badge = ({ children, status, variant = 'default', size = 'md' }) => {
  const getStatusClass = (statusStr) => {
    if (!statusStr) return `badge-${variant}`;
    const normalized = String(statusStr).toLowerCase().replace(/\s+/g, '-');
    
    switch (normalized) {
      case 'checked-in':
      case 'occupied':
      case 'completed':
      case 'active':
      case 'paid':
        return 'badge-success';
      case 'confirmed':
      case 'vacant':
      case 'medium':
      case 'regular':
        return 'badge-info';
      case 'pending':
      case 'maintenance':
      case 'urgent':
      case 'partial':
      case 'vip-gold':
        return 'badge-warning';
      case 'cancelled':
      case 'out-of-service':
      case 'inactive':
      case 'high':
        return 'badge-danger';
      case 'checked-out':
        return 'badge-default';
      case 'vip-platinum':
        return 'badge-purple';
      default:
        return 'badge-default';
    }
  };

  return (
    <span className={`badge ${getStatusClass(status)} badge-${size}`}>
      <span className="badge-dot"></span>
      {children || status}
    </span>
  );
};
