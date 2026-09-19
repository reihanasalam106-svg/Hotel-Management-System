import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Home, ArrowLeft } from 'lucide-react';
import './NotFound.css';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <div className="not-found-icon-wrapper">
          <Crown size={36} className="not-found-crown" />
        </div>
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-text">
          The page or route you are looking for does not exist or has been moved in the Hotel Management System.
        </p>

        <div className="not-found-actions">
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            Go Back
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
            <Home size={18} />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
