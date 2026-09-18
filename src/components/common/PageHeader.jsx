import React from 'react';
import './PageHeader.css';

export const PageHeader = ({ title, description, action }) => {
  return (
    <div className="page-header-container">
      <div className="page-header-titles">
        <h1 className="page-header-title">{title}</h1>
        {description && <p className="page-header-desc">{description}</p>}
      </div>
      {action && <div className="page-header-action">{action}</div>}
    </div>
  );
};
