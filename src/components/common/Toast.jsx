import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import './Toast.css';

export const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="toast-icon success" />;
      case 'error':
        return <AlertCircle size={20} className="toast-icon error" />;
      default:
        return <Info size={20} className="toast-icon info" />;
    }
  };

  return (
    <div className={`toast-banner toast-${type}`}>
      {getIcon()}
      <span className="toast-message">{message}</span>
      {onClose && (
        <button className="toast-close" onClick={onClose} aria-label="Close message">
          <X size={16} />
        </button>
      )}
    </div>
  );
};
