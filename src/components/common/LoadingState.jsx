import React from 'react';
import './LoadingState.css';

export const LoadingState = ({ label = 'Loading hotel data...' }) => {
  return (
    <div className="loading-state-container">
      <div className="loading-spinner"></div>
      <span className="loading-label">{label}</span>
    </div>
  );
};
